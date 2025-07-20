#!/usr/bin/env python3
"""
Muzaia - Sistema de Ingestão Automática de Documentos Legais
Processamento inteligente de PDFs, DOCX e TXT para legislação moçambicana
"""

import os
import re
import logging
import hashlib
from datetime import datetime
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path
import chardet

# Document processing imports
try:
    import PyPDF2
    import docx
    from docx import Document
except ImportError:
    PyPDF2 = None
    docx = None

from models.legal_document_hierarchy import (
    LegalDocumentType, LegalArea, DocumentStatus, 
    LegalDocumentMetadata, PRIORITY_DOCUMENTS
)
from services.legal_chunker import LegalChunker, LegalChunk

logger = logging.getLogger(__name__)

class DocumentParser:
    """Parser inteligente para extrair estrutura de documentos legais"""
    
    # Padrões para detectar metadados do documento
    TITLE_PATTERNS = [
        r'(?:LEI|DECRETO|REGULAMENTO|PORTARIA)\s+N[º°]?\s*(\d+/\d+)',
        r'CÓDIGO\s+(?:CIVIL|PENAL|COMERCIAL|DE\s+PROCESSO)',
        r'CONSTITUIÇÃO\s+DA\s+REPÚBLICA',
        r'^(.{1,100}?)(?:\n|$)'  # Primeira linha como título fallback
    ]
    
    PUBLICATION_DATE_PATTERNS = [
        r'(?:Publicado|Aprovado|Promulgado).*?(\d{1,2}\s+de\s+\w+\s+de\s+\d{4})',
        r'(\d{1,2}/\d{1,2}/\d{4})',
        r'(\d{4}-\d{2}-\d{2})'
    ]
    
    LEGAL_AREA_KEYWORDS = {
        LegalArea.CONSTITUCIONAL: ['constituição', 'direitos fundamentais', 'soberania', 'estado'],
        LegalArea.CIVIL: ['código civil', 'propriedade', 'contratos', 'obrigações', 'família'],
        LegalArea.PENAL: ['código penal', 'crime', 'pena', 'delito', 'prisão'],
        LegalArea.COMERCIAL: ['código comercial', 'sociedade', 'empresa', 'comércio', 'mercado'],
        LegalArea.LABORAL: ['trabalho', 'emprego', 'salário', 'sindicato', 'laboral'],
        LegalArea.FISCAL: ['imposto', 'taxa', 'tributário', 'fiscal', 'receita'],
        LegalArea.FUNDIARIO: ['terra', 'terreno', 'propriedade fundiária', 'uso da terra'],
        LegalArea.AMBIENTAL: ['ambiente', 'conservação', 'recursos naturais', 'poluição'],
        LegalArea.PROCESSUAL_CIVIL: ['processo civil', 'procedimento civil', 'ação civil'],
        LegalArea.PROCESSUAL_PENAL: ['processo penal', 'procedimento criminal', 'instrução'],
        LegalArea.ADMINISTRATIVO: ['administração pública', 'serviço público', 'funcionário'],
        LegalArea.SEGURANCA_SOCIAL: ['segurança social', 'pensão', 'reforma', 'subsídio'],
        LegalArea.IMIGRACAO: ['imigração', 'visto', 'estrangeiro', 'fronteira', 'nacionalidade']
    }
    
    DOCUMENT_TYPE_KEYWORDS = {
        LegalDocumentType.CONSTITUICAO: ['constituição'],
        LegalDocumentType.LEI_ORDINARIA: ['lei n', 'código'],
        LegalDocumentType.DECRETO_LEI: ['decreto-lei'],
        LegalDocumentType.DECRETO: ['decreto n'],
        LegalDocumentType.REGULAMENTO: ['regulamento'],
        LegalDocumentType.PORTARIA: ['portaria'],
        LegalDocumentType.DIPLOMA_MINISTERIAL: ['diploma ministerial'],
        LegalDocumentType.INSTRUCAO: ['instrução'],
        LegalDocumentType.CIRCULAR: ['circular'],
        LegalDocumentType.DESPACHO: ['despacho']
    }
    
    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extrair texto de arquivo PDF"""
        if not PyPDF2:
            raise ImportError("PyPDF2 não instalado")
        
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                
                return self._clean_extracted_text(text)
        except Exception as e:
            logger.error(f"Erro ao extrair PDF {file_path}: {e}")
            raise
    
    def extract_text_from_docx(self, file_path: str) -> str:
        """Extrair texto de arquivo DOCX"""
        if not docx:
            raise ImportError("python-docx não instalado")
        
        try:
            doc = Document(file_path)
            text = ""
            
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            
            return self._clean_extracted_text(text)
        except Exception as e:
            logger.error(f"Erro ao extrair DOCX {file_path}: {e}")
            raise
    
    def extract_text_from_txt(self, file_path: str) -> str:
        """Extrair texto de arquivo TXT com detecção de encoding"""
        try:
            # Detectar encoding
            with open(file_path, 'rb') as file:
                raw_data = file.read()
                encoding_info = chardet.detect(raw_data)
                encoding = encoding_info['encoding'] or 'utf-8'
            
            # Ler com encoding detectado
            with open(file_path, 'r', encoding=encoding) as file:
                text = file.read()
            
            return self._clean_extracted_text(text)
        except Exception as e:
            logger.error(f"Erro ao extrair TXT {file_path}: {e}")
            raise
    
    def _clean_extracted_text(self, text: str) -> str:
        """Limpar e normalizar texto extraído"""
        # Remover múltiplas quebras de linha
        text = re.sub(r'\n{3,}', '\n\n', text)
        
        # Remover espaços extras
        text = re.sub(r' {2,}', ' ', text)
        
        # Remover caracteres de controle
        text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', '', text)
        
        return text.strip()
    
    def extract_title(self, text: str) -> str:
        """Extrair título do documento"""
        text_lines = text.split('\n')[:10]  # Primeiras 10 linhas
        
        for pattern in self.TITLE_PATTERNS:
            for line in text_lines:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    title = match.group(0) if len(match.groups()) == 0 else match.group(1)
                    return title.strip()
        
        # Fallback: primeira linha não vazia
        for line in text_lines:
            line = line.strip()
            if len(line) > 10 and len(line) < 200:
                return line
        
        return "Documento Legal"
    
    def detect_document_type(self, text: str, title: str) -> LegalDocumentType:
        """Detectar tipo de documento"""
        text_lower = (text + " " + title).lower()
        
        for doc_type, keywords in self.DOCUMENT_TYPE_KEYWORDS.items():
            for keyword in keywords:
                if keyword in text_lower:
                    return doc_type
        
        return LegalDocumentType.LEI_ORDINARIA  # Default
    
    def detect_legal_area(self, text: str, title: str) -> LegalArea:
        """Detectar área jurídica do documento"""
        text_lower = (text + " " + title).lower()
        area_scores = {}
        
        for area, keywords in self.LEGAL_AREA_KEYWORDS.items():
            score = 0
            for keyword in keywords:
                score += text_lower.count(keyword)
            area_scores[area] = score
        
        # Retornar área com maior score
        if area_scores:
            best_area = max(area_scores, key=area_scores.get)
            if area_scores[best_area] > 0:
                return best_area
        
        return LegalArea.CIVIL  # Default
    
    def extract_publication_date(self, text: str) -> Optional[datetime]:
        """Extrair data de publicação"""
        for pattern in self.PUBLICATION_DATE_PATTERNS:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                date_str = match.group(1)
                try:
                    # Tentar diferentes formatos de data
                    for date_format in ['%d de %B de %Y', '%d/%m/%Y', '%Y-%m-%d']:
                        try:
                            return datetime.strptime(date_str, date_format)
                        except ValueError:
                            continue
                except Exception:
                    continue
        
        return None
    
    def extract_keywords(self, text: str) -> List[str]:
        """Extrair palavras-chave importantes"""
        # Palavras jurídicas importantes
        legal_keywords = [
            'artigo', 'lei', 'direito', 'código', 'processo', 'tribunal',
            'juiz', 'sentença', 'recurso', 'prova', 'competência',
            'propriedade', 'contrato', 'obrigação', 'responsabilidade'
        ]
        
        text_lower = text.lower()
        found_keywords = []
        
        for keyword in legal_keywords:
            if keyword in text_lower:
                found_keywords.append(keyword)
        
        # Extrair palavras frequentes específicas do documento
        words = re.findall(r'\b[a-záêíóúç]{4,}\b', text_lower)
        word_freq = {}
        for word in words:
            word_freq[word] = word_freq.get(word, 0) + 1
        
        # Top 10 palavras mais frequentes
        frequent_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:10]
        found_keywords.extend([word for word, freq in frequent_words if freq > 2])
        
        return list(set(found_keywords))[:20]  # Máximo 20 keywords únicos

class DocumentIngestor:
    """Sistema de ingestão automática de documentos legais"""
    
    def __init__(self, db_connection_func):
        self.get_db_connection = db_connection_func
        self.parser = DocumentParser()
        self.chunker = LegalChunker()
        self.upload_dir = Path("uploads")
        self.upload_dir.mkdir(exist_ok=True)
    
    def process_document(
        self, 
        file_path: str, 
        original_filename: str,
        override_metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Processar documento legal completo"""
        
        try:
            logger.info(f"Iniciando processamento de {original_filename}")
            
            # 1. Extrair texto
            text = self._extract_text_by_extension(file_path)
            if not text or len(text) < 100:
                raise ValueError("Documento muito pequeno ou não foi possível extrair texto")
            
            # 2. Extrair metadados
            metadata = self._extract_document_metadata(text, override_metadata)
            
            # 3. Salvar documento na base de dados
            document_id = self._save_document_to_db(
                title=metadata['title'],
                document_type=metadata['document_type'],
                legal_area=metadata['legal_area'],
                full_text=text,
                metadata=metadata,
                original_filename=original_filename
            )
            
            # 4. Processar chunks
            chunks = self.chunker.chunk_by_structure(
                text, 
                document_id, 
                LegalDocumentType(metadata['document_type'])
            )
            
            # 5. Salvar chunks na base de dados
            chunk_ids = self._save_chunks_to_db(chunks)
            
            # 6. Gerar hash do arquivo para versionamento
            file_hash = self._calculate_file_hash(file_path)
            
            result = {
                'success': True,
                'document_id': document_id,
                'title': metadata['title'],
                'chunks_created': len(chunks),
                'chunk_ids': chunk_ids,
                'metadata': metadata,
                'file_hash': file_hash,
                'processing_time': datetime.now().isoformat()
            }
            
            logger.info(f"✅ Documento {metadata['title']} processado: {len(chunks)} chunks criados")
            
            logger.info(f"Documento processado com sucesso: {len(chunks)} chunks criados")
            return result
            
        except Exception as e:
            logger.error(f"❌ Erro no processamento de {original_filename}: {e}")
            import traceback
            logger.error(f"Stacktrace: {traceback.format_exc()}")
            return {
                'success': False,
                'error': str(e),
                'document_id': None,
                'chunks_created': 0
            }
    
    def _extract_text_by_extension(self, file_path: str) -> str:
        """Extrair texto baseado na extensão do arquivo"""
        file_path = Path(file_path)
        extension = file_path.suffix.lower()
        
        if extension == '.pdf':
            return self.parser.extract_text_from_pdf(str(file_path))
        elif extension == '.docx':
            return self.parser.extract_text_from_docx(str(file_path))
        elif extension in ['.txt', '.md']:
            return self.parser.extract_text_from_txt(str(file_path))
        else:
            raise ValueError(f"Tipo de arquivo não suportado: {extension}")
    
    def _extract_document_metadata(self, text: str, override_metadata: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Extrair metadados do documento"""
        # Extrair metadados automáticos
        title = self.parser.extract_title(text)
        doc_type = self.parser.detect_document_type(text, title)
        legal_area = self.parser.detect_legal_area(text, title)
        pub_date = self.parser.extract_publication_date(text)
        keywords = self.parser.extract_keywords(text)
        
        metadata = {
            'title': title,
            'document_type': doc_type.value,
            'legal_area': legal_area.value,
            'publication_date': pub_date.isoformat() if pub_date else datetime.now().isoformat(),
            'effective_date': pub_date.isoformat() if pub_date else datetime.now().isoformat(),
            'status': DocumentStatus.ACTIVO.value,
            'keywords': keywords,
            'extracted_at': datetime.now().isoformat(),
            'text_length': len(text),
            'language': 'pt'
        }
        
        # Aplicar overrides se fornecidos
        if override_metadata:
            metadata.update(override_metadata)
        
        return metadata
    
    def _save_document_to_db(
        self, 
        title: str, 
        document_type: int,
        legal_area: int,
        full_text: str,
        metadata: Dict[str, Any],
        original_filename: str
    ) -> int:
        """Salvar documento na base de dados"""
        
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO legal_documents (
                            title, content, document_type, legal_area, source, description,
                            full_text, metadata, original_filename, created_at
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING id
                    """, (
                        title,
                        full_text,  # content field
                        document_type,
                        legal_area,
                        'upload_system',
                        f"Documento processado automaticamente: {title}",
                        full_text,
                        json.dumps(metadata, ensure_ascii=False),
                        original_filename,
                        datetime.now()
                    ))
                    
                    document_id = cur.fetchone()[0]
                    conn.commit()
                    return document_id
                    
        except Exception as e:
            logger.error(f"Erro ao salvar documento na BD: {e}")
            raise
    
    def _save_chunks_to_db(self, chunks: List[LegalChunk]) -> List[int]:
        """Salvar chunks na base de dados"""
        chunk_ids = []
        
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cur:
                    for chunk in chunks:
                        chunk_metadata = {
                            'article_number': chunk.article_number,
                            'section_title': chunk.section_title,
                            'subsection': chunk.subsection,
                            'paragraph': chunk.paragraph,
                            'chunk_type': chunk.chunk_type,
                            'legal_concepts': chunk.legal_concepts,
                            'cross_references': chunk.cross_references,
                            'relevance_keywords': chunk.relevance_keywords
                        }
                        
                        cur.execute("""
                            INSERT INTO document_chunks (
                                document_id, chunk_index, chunk_text, content, 
                                metadata, created_at
                            ) VALUES (%s, %s, %s, %s, %s, %s)
                            RETURNING id
                        """, (
                            chunk.document_id,
                            chunk.chunk_index,
                            chunk.text,
                            chunk.text,  # content field
                            json.dumps(chunk_metadata, ensure_ascii=False),
                            datetime.now()
                        ))
                        
                        chunk_id = cur.fetchone()[0]
                        chunk_ids.append(chunk_id)
                    
                    conn.commit()
                    
        except Exception as e:
            logger.error(f"Erro ao salvar chunks na BD: {e}")
            raise
        
        return chunk_ids
    
    def _calculate_file_hash(self, file_path: str) -> str:
        """Calcular hash do arquivo para controlo de versões"""
        hash_sha256 = hashlib.sha256()
        
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_sha256.update(chunk)
        
        return hash_sha256.hexdigest()
    
    def check_document_exists(self, file_hash: str) -> Optional[int]:
        """Verificar se documento já existe baseado no hash"""
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        SELECT id FROM legal_documents 
                        WHERE metadata->>'file_hash' = %s
                    """, (file_hash,))
                    
                    result = cur.fetchone()
                    return result[0] if result else None
                    
        except Exception as e:
            logger.error(f"Erro ao verificar documento existente: {e}")
            return None
    
    def get_processing_statistics(self) -> Dict[str, Any]:
        """Obter estatísticas de processamento"""
        try:
            with self.get_db_connection() as conn:
                with conn.cursor() as cur:
                    # Documentos por tipo
                    cur.execute("""
                        SELECT COALESCE(document_type, 2) as doc_type, COUNT(*) as count
                        FROM legal_documents
                        GROUP BY COALESCE(document_type, 2)
                        ORDER BY count DESC
                    """)
                    docs_by_type = dict(cur.fetchall())
                    
                    # Documentos por área
                    cur.execute("""
                        SELECT COALESCE(legal_area, 2) as legal_area, COUNT(*) as count
                        FROM legal_documents
                        GROUP BY COALESCE(legal_area, 2)
                        ORDER BY count DESC
                    """)
                    docs_by_area = dict(cur.fetchall())
                    
                    # Total de chunks
                    cur.execute("SELECT COUNT(*) FROM document_chunks")
                    total_chunks_result = cur.fetchone()
                    total_chunks = total_chunks_result[0] if total_chunks_result else 0
                    
                    # Total de documentos
                    cur.execute("SELECT COUNT(*) FROM legal_documents")
                    total_docs_result = cur.fetchone()
                    total_docs = total_docs_result[0] if total_docs_result else 0
                    
                    # Documentos recentes
                    cur.execute("""
                        SELECT COUNT(*) FROM legal_documents 
                        WHERE created_at >= NOW() - INTERVAL '7 days'
                    """)
                    recent_docs_result = cur.fetchone()
                    recent_docs = recent_docs_result[0] if recent_docs_result else 0
                    
                    return {
                        'total_documents': total_docs,
                        'total_chunks': total_chunks,
                        'documents_by_type': docs_by_type,
                        'documents_by_area': docs_by_area,
                        'recent_documents_7_days': recent_docs,
                        'average_chunks_per_document': total_chunks / max(total_docs, 1) if total_docs > 0 else 0
                    }
                    
        except Exception as e:
            logger.error(f"Erro ao obter estatísticas: {e}")
            return {
                'total_documents': 0,
                'total_chunks': 0,
                'documents_by_type': {},
                'documents_by_area': {},
                'recent_documents_7_days': 0,
                'average_chunks_per_document': 0
            }

import json