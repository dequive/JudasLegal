"""
Document Ingestor - Sistema de processamento avançado de documentos legais
Integra com a hierarquia legal e chunking inteligente
"""
import os
import re
import json
import hashlib
import chardet
from typing import List, Dict, Any, Optional, Union
from pathlib import Path
from datetime import datetime

# Document processing imports
try:
    import PyPDF2
    import docx
    from docx import Document
    PDF_AVAILABLE = True
    DOCX_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False
    DOCX_AVAILABLE = False

from models.legal_document_hierarchy import (
    LegalDocumentHierarchy, LegalDocumentType, LegalArea, DocumentMetadata
)
from services.legal_chunker import LegalChunker, LegalChunk

class DocumentIngestor:
    """Sistema de ingestão e processamento de documentos legais"""
    
    def __init__(self, db_connection_factory):
        self.db_connection = db_connection_factory
        self.chunker = LegalChunker(max_chunk_size=1000, overlap_size=200)
        self.supported_formats = ['.pdf', '.docx', '.txt']
        
        # Cache para evitar reprocessamento
        self.processed_hashes = set()
        
    def process_document(
        self, 
        file_path: str, 
        original_filename: str,
        override_metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Processa documento legal completo com metadados e chunking"""
        
        try:
            # Validações iniciais
            if not os.path.exists(file_path):
                return {'success': False, 'error': 'Arquivo não encontrado'}
            
            file_extension = Path(file_path).suffix.lower()
            if file_extension not in self.supported_formats:
                return {'success': False, 'error': f'Formato não suportado: {file_extension}'}
            
            # Extrair texto do documento
            extracted_text = self._extract_text(file_path, file_extension)
            if not extracted_text or len(extracted_text.strip()) < 50:
                return {'success': False, 'error': 'Documento vazio ou muito pequeno'}
            
            # Calcular hash para verificar duplicatas
            content_hash = self._calculate_hash(extracted_text)
            if content_hash in self.processed_hashes:
                return {'success': False, 'error': 'Documento já processado'}
            
            # Detectar título do documento
            title = self._extract_title(extracted_text, original_filename)
            
            # Criar metadados do documento
            doc_metadata = LegalDocumentHierarchy.create_document_metadata(
                title=title,
                content=extracted_text,
                override_data=override_metadata
            )
            
            # Processar chunks com chunker legal
            chunks = self.chunker.chunk_legal_document(
                text=extracted_text,
                title=title,
                legal_area=doc_metadata.legal_area,
                document_type=doc_metadata.document_type
            )
            
            # Salvar no banco de dados
            document_id = self._save_to_database(
                doc_metadata, 
                extracted_text, 
                chunks, 
                content_hash,
                original_filename,
                file_path
            )
            
            # Adicionar hash ao cache
            self.processed_hashes.add(content_hash)
            
            return {
                'success': True,
                'document_id': document_id,
                'title': title,
                'chunks_created': len(chunks),
                'metadata': {
                    'document_type': doc_metadata.document_type.value,
                    'legal_area': doc_metadata.legal_area.value,
                    'keywords': doc_metadata.keywords,
                    'description': doc_metadata.description,
                    'authority_weight': doc_metadata.authority_weight,
                    'complexity_distribution': self._analyze_chunk_complexity(chunks)
                },
                'processing_info': {
                    'total_words': len(extracted_text.split()),
                    'chunk_types': list(set(chunk.chunk_type for chunk in chunks)),
                    'avg_chunk_size': sum(len(chunk.content) for chunk in chunks) // len(chunks),
                    'legal_concepts_found': len(set().union(*[chunk.legal_concepts or [] for chunk in chunks])),
                    'citations_found': len(set().union(*[chunk.citations or [] for chunk in chunks]))
                }
            }
            
        except Exception as e:
            return {'success': False, 'error': f'Erro no processamento: {str(e)}'}
    
    def _extract_text(self, file_path: str, file_extension: str) -> str:
        """Extrai texto baseado no tipo de arquivo"""
        
        if file_extension == '.pdf':
            return self._extract_pdf_text(file_path)
        elif file_extension == '.docx':
            return self._extract_docx_text(file_path)
        elif file_extension == '.txt':
            return self._extract_txt_text(file_path)
        else:
            raise ValueError(f"Formato não suportado: {file_extension}")
    
    def _extract_pdf_text(self, file_path: str) -> str:
        """Extrai texto de arquivo PDF"""
        if not PDF_AVAILABLE:
            raise ImportError("PyPDF2 não disponível para processamento de PDF")
        
        text = ""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n\n"
        except Exception as e:
            raise ValueError(f"Erro ao extrair texto do PDF: {str(e)}")
        
        return self._clean_extracted_text(text)
    
    def _extract_docx_text(self, file_path: str) -> str:
        """Extrai texto de arquivo DOCX"""
        if not DOCX_AVAILABLE:
            raise ImportError("python-docx não disponível para processamento de DOCX")
        
        text = ""
        try:
            doc = Document(file_path)
            for paragraph in doc.paragraphs:
                if paragraph.text.strip():
                    text += paragraph.text + "\n\n"
        except Exception as e:
            raise ValueError(f"Erro ao extrair texto do DOCX: {str(e)}")
        
        return self._clean_extracted_text(text)
    
    def _extract_txt_text(self, file_path: str) -> str:
        """Extrai texto de arquivo TXT com detecção de encoding"""
        try:
            # Detectar encoding
            with open(file_path, 'rb') as file:
                raw_data = file.read()
                encoding_info = chardet.detect(raw_data)
                encoding = encoding_info.get('encoding', 'utf-8')
            
            # Ler com encoding detectado
            with open(file_path, 'r', encoding=encoding, errors='ignore') as file:
                text = file.read()
                
        except Exception as e:
            # Fallback para UTF-8 com ignore de erros
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
                    text = file.read()
            except Exception as e2:
                raise ValueError(f"Erro ao ler arquivo TXT: {str(e2)}")
        
        return self._clean_extracted_text(text)
    
    def _clean_extracted_text(self, text: str) -> str:
        """Limpa e normaliza texto extraído"""
        if not text:
            return ""
        
        # Remover caracteres de controle
        text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', text)
        
        # Normalizar espaços em branco
        text = re.sub(r'\s+', ' ', text)
        
        # Normalizar quebras de linha (preservar estrutura)
        text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)
        
        # Remover espaços no início e fim de linhas
        lines = text.split('\n')
        lines = [line.strip() for line in lines]
        text = '\n'.join(lines)
        
        return text.strip()
    
    def _extract_title(self, text: str, filename: str) -> str:
        """Extrai título do documento"""
        
        # Tentar extrair título das primeiras linhas
        lines = text.split('\n')
        potential_titles = []
        
        for i, line in enumerate(lines[:10]):  # Verificar primeiras 10 linhas
            line = line.strip()
            if len(line) > 10 and len(line) < 200:
                # Verificar se parece com um título
                if (line.isupper() or 
                    any(keyword in line.lower() for keyword in ['lei', 'decreto', 'regulamento', 'código']) or
                    re.match(r'^[A-Z][^.!?]*[^.!?]$', line)):
                    potential_titles.append(line)
        
        # Usar o primeiro título encontrado ou o nome do arquivo
        if potential_titles:
            return potential_titles[0]
        else:
            # Usar nome do arquivo como fallback
            return Path(filename).stem.replace('_', ' ').replace('-', ' ').title()
    
    def _calculate_hash(self, content: str) -> str:
        """Calcula hash SHA-256 do conteúdo"""
        return hashlib.sha256(content.encode('utf-8')).hexdigest()
    
    def _analyze_chunk_complexity(self, chunks: List[LegalChunk]) -> Dict[str, int]:
        """Analisa distribuição de complexidade dos chunks"""
        complexity_dist = {1: 0, 2: 0, 3: 0, 4: 0}
        
        for chunk in chunks:
            complexity_dist[chunk.complexity_level] += 1
        
        return {
            'simples': complexity_dist[1],
            'moderado': complexity_dist[2], 
            'complexo': complexity_dist[3],
            'muito_complexo': complexity_dist[4]
        }
    
    def _save_to_database(
        self, 
        doc_metadata: DocumentMetadata, 
        full_text: str,
        chunks: List[LegalChunk],
        content_hash: str,
        original_filename: str,
        file_path: str
    ) -> int:
        """Salva documento e chunks no banco de dados"""
        
        with self.db_connection() as conn:
            with conn.cursor() as cur:
                # Inserir documento principal
                cur.execute("""
                    INSERT INTO legal_documents (
                        title, content, metadata, content_hash, 
                        document_type, legal_area, created_at
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    doc_metadata.title,
                    full_text,
                    json.dumps({
                        'document_type': doc_metadata.document_type.value,
                        'legal_area': doc_metadata.legal_area.value,
                        'keywords': doc_metadata.keywords,
                        'description': doc_metadata.description,
                        'authority_weight': doc_metadata.authority_weight,
                        'status': doc_metadata.status,
                        'source': doc_metadata.source,
                        'original_filename': original_filename,
                        'publication_date': doc_metadata.publication_date.isoformat() if doc_metadata.publication_date else None,
                        'effective_date': doc_metadata.effective_date.isoformat() if doc_metadata.effective_date else None
                    }),
                    content_hash,
                    doc_metadata.document_type.value,
                    doc_metadata.legal_area.value,
                    datetime.now()
                ))
                
                document_id = cur.fetchone()[0]
                
                # Inserir chunks
                for chunk in chunks:
                    chunk_metadata = self.chunker.get_chunk_metadata(chunk)
                    
                    cur.execute("""
                        INSERT INTO document_chunks (
                            document_id, content, chunk_index, metadata, created_at
                        ) VALUES (%s, %s, %s, %s, %s)
                    """, (
                        document_id,
                        chunk.content,
                        chunk.chunk_index,
                        json.dumps(chunk_metadata),
                        datetime.now()
                    ))
                
                # Registrar no log de uploads
                cur.execute("""
                    INSERT INTO uploaded_documents (
                        original_filename, processed_document_id, 
                        chunks_created, status, created_at
                    ) VALUES (%s, %s, %s, %s, %s)
                """, (
                    original_filename,
                    document_id,
                    len(chunks),
                    'completed',
                    datetime.now()
                ))
                
                conn.commit()
                return document_id
    
    def get_processing_stats(self) -> Dict[str, Any]:
        """Retorna estatísticas de processamento"""
        with self.db_connection() as conn:
            with conn.cursor() as cur:
                # Estatísticas gerais
                cur.execute("""
                    SELECT 
                        COUNT(*) as total_documents,
                        COUNT(DISTINCT metadata->>'document_type') as document_types,
                        COUNT(DISTINCT metadata->>'legal_area') as legal_areas,
                        AVG(jsonb_array_length(metadata->'keywords')) as avg_keywords
                    FROM legal_documents
                """)
                general_stats = dict(cur.fetchone())
                
                # Distribuição por tipo
                cur.execute("""
                    SELECT 
                        metadata->>'document_type' as doc_type,
                        COUNT(*) as count
                    FROM legal_documents 
                    GROUP BY metadata->>'document_type'
                    ORDER BY count DESC
                """)
                type_distribution = dict(cur.fetchall())
                
                # Distribuição por área
                cur.execute("""
                    SELECT 
                        metadata->>'legal_area' as legal_area,
                        COUNT(*) as count
                    FROM legal_documents 
                    GROUP BY metadata->>'legal_area'
                    ORDER BY count DESC
                """)
                area_distribution = dict(cur.fetchall())
                
                # Estatísticas de chunks
                cur.execute("""
                    SELECT 
                        COUNT(*) as total_chunks,
                        AVG(length(content)) as avg_chunk_size,
                        COUNT(DISTINCT metadata->>'chunk_type') as chunk_types
                    FROM document_chunks
                """)
                chunk_stats = dict(cur.fetchone())
                
                return {
                    'general': general_stats,
                    'type_distribution': type_distribution,
                    'area_distribution': area_distribution,
                    'chunk_statistics': chunk_stats,
                    'last_updated': datetime.now().isoformat()
                }
    
    def check_document_exists(self, content_hash: str) -> bool:
        """Verifica se documento já foi processado"""
        with self.db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id FROM legal_documents WHERE content_hash = %s",
                    (content_hash,)
                )
                return cur.fetchone() is not None
    
    def reprocess_document(self, document_id: int) -> Dict[str, Any]:
        """Reprocessa documento existente com novos algoritmos"""
        try:
            with self.db_connection() as conn:
                with conn.cursor() as cur:
                    # Buscar documento
                    cur.execute("""
                        SELECT title, content, metadata 
                        FROM legal_documents 
                        WHERE id = %s
                    """, (document_id,))
                    
                    result = cur.fetchone()
                    if not result:
                        return {'success': False, 'error': 'Documento não encontrado'}
                    
                    title, content, metadata = result
                    
                    # Reprocessar com chunker atual
                    doc_type = LegalDocumentType(metadata.get('document_type', 2))
                    legal_area = LegalArea(metadata.get('legal_area', 2))
                    
                    new_chunks = self.chunker.chunk_legal_document(
                        text=content,
                        title=title,
                        legal_area=legal_area,
                        document_type=doc_type
                    )
                    
                    # Remover chunks antigos
                    cur.execute("DELETE FROM document_chunks WHERE document_id = %s", (document_id,))
                    
                    # Inserir novos chunks
                    for chunk in new_chunks:
                        chunk_metadata = self.chunker.get_chunk_metadata(chunk)
                        cur.execute("""
                            INSERT INTO document_chunks (
                                document_id, content, chunk_index, metadata, created_at
                            ) VALUES (%s, %s, %s, %s, %s)
                        """, (
                            document_id,
                            chunk.content,
                            chunk.chunk_index,
                            json.dumps(chunk_metadata),
                            datetime.now()
                        ))
                    
                    conn.commit()
                    
                    return {
                        'success': True,
                        'document_id': document_id,
                        'new_chunks_created': len(new_chunks),
                        'reprocessed_at': datetime.now().isoformat()
                    }
                    
        except Exception as e:
            return {'success': False, 'error': f'Erro no reprocessamento: {str(e)}'}