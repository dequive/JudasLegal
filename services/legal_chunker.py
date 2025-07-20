#!/usr/bin/env python3
"""
Muzaia - Sistema de Chunking Jurídico Inteligente
Processamento especializado para documentos legais moçambicanos
"""

import re
import logging
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from models.legal_document_hierarchy import LegalDocumentType, LegalArea

logger = logging.getLogger(__name__)

@dataclass
class LegalChunk:
    """Chunk de documento legal com metadados estruturados"""
    text: str
    document_id: int
    chunk_index: int
    article_number: Optional[str] = None
    section_title: Optional[str] = None
    subsection: Optional[str] = None
    paragraph: Optional[str] = None
    legal_concepts: List[str] = None
    cross_references: List[str] = None
    chunk_type: str = "general"  # article, section, paragraph, definition
    relevance_keywords: List[str] = None
    
    def __post_init__(self):
        if self.legal_concepts is None:
            self.legal_concepts = []
        if self.cross_references is None:
            self.cross_references = []
        if self.relevance_keywords is None:
            self.relevance_keywords = []

class LegalChunker:
    """Sistema de chunking especializado para documentos legais"""
    
    # Padrões para estrutura legal moçambicana
    ARTICLE_PATTERNS = [
        r'Artigo\s+(\d+)[º°]?\s*[-–—]?\s*(.+?)(?=Artigo\s+\d+|$)',
        r'Art\.?\s*(\d+)[º°]?\s*[-–—]?\s*(.+?)(?=Art\.?\s*\d+|$)',
        r'(\d+)\s*[-–—]\s*(.+?)(?=\d+\s*[-–—]|$)'
    ]
    
    SECTION_PATTERNS = [
        r'CAPÍTULO\s+([IVX\d]+)\s*[-–—]?\s*(.+?)(?=CAPÍTULO|ARTIGO|$)',
        r'SECÇÃO\s+([IVX\d]+)\s*[-–—]?\s*(.+?)(?=SECÇÃO|ARTIGO|$)',
        r'TÍTULO\s+([IVX\d]+)\s*[-–—]?\s*(.+?)(?=TÍTULO|CAPÍTULO|$)'
    ]
    
    PARAGRAPH_PATTERNS = [
        r'(\d+)\.\s*(.+?)(?=\d+\.|$)',
        r'([a-z])\)\s*(.+?)(?=[a-z]\)|$)',
        r'([ivx]+)\)\s*(.+?)(?=[ivx]+\)|$)'
    ]
    
    # Conceitos jurídicos moçambicanos para extração
    LEGAL_CONCEPTS = {
        'constitucional': ['direitos fundamentais', 'soberania', 'separação de poderes', 'estado de direito'],
        'civil': ['personalidade jurídica', 'capacidade', 'propriedade', 'obrigações', 'contratos'],
        'penal': ['crime', 'pena', 'culpabilidade', 'dolo', 'negligência', 'legítima defesa'],
        'comercial': ['sociedade comercial', 'registo comercial', 'actos de comércio', 'falência'],
        'laboral': ['contrato de trabalho', 'salário mínimo', 'despedimento', 'segurança no trabalho'],
        'processual': ['competência', 'jurisdição', 'recurso', 'prova', 'sentença', 'execução'],
        'administrativo': ['acto administrativo', 'poder discricionário', 'interesse público'],
        'fiscal': ['imposto', 'taxa', 'contribuição', 'isenção', 'obrigação tributária']
    }
    
    def __init__(self):
        self.legal_terms = self._compile_legal_terms()
    
    def _compile_legal_terms(self) -> List[str]:
        """Compilar lista de termos jurídicos"""
        terms = []
        for area_terms in self.LEGAL_CONCEPTS.values():
            terms.extend(area_terms)
        return terms
    
    def chunk_by_structure(self, document_text: str, document_id: int, doc_type: LegalDocumentType) -> List[LegalChunk]:
        """Dividir documento por estrutura legal"""
        chunks = []
        
        # Detectar tipo de estrutura baseado no tipo de documento
        if doc_type in [LegalDocumentType.CONSTITUICAO, LegalDocumentType.LEI_ORDINARIA]:
            chunks = self._chunk_by_articles(document_text, document_id)
        elif doc_type in [LegalDocumentType.DECRETO, LegalDocumentType.REGULAMENTO]:
            chunks = self._chunk_by_sections_and_articles(document_text, document_id)
        else:
            chunks = self._chunk_by_paragraphs(document_text, document_id)
        
        # Enriquecer chunks com metadados
        for chunk in chunks:
            self._enrich_chunk_metadata(chunk)
        
        return chunks
    
    def _chunk_by_articles(self, text: str, document_id: int) -> List[LegalChunk]:
        """Dividir texto por artigos"""
        chunks = []
        chunk_index = 0
        
        for pattern in self.ARTICLE_PATTERNS:
            matches = re.finditer(pattern, text, re.MULTILINE | re.DOTALL | re.IGNORECASE)
            for match in matches:
                article_num = match.group(1)
                article_text = match.group(2).strip()
                
                if len(article_text) > 50:  # Filtrar matches muito pequenos
                    chunk = LegalChunk(
                        text=f"Artigo {article_num} - {article_text}",
                        document_id=document_id,
                        chunk_index=chunk_index,
                        article_number=article_num,
                        chunk_type="article"
                    )
                    chunks.append(chunk)
                    chunk_index += 1
            
            if chunks:  # Se encontrou artigos, usar este padrão
                break
        
        # Se não encontrou artigos, fazer chunking por parágrafos
        if not chunks:
            chunks = self._chunk_by_paragraphs(text, document_id)
        
        return chunks
    
    def _chunk_by_sections_and_articles(self, text: str, document_id: int) -> List[LegalChunk]:
        """Dividir por secções e artigos"""
        chunks = []
        chunk_index = 0
        
        # Primeiro detectar secções
        sections = []
        for pattern in self.SECTION_PATTERNS:
            matches = re.finditer(pattern, text, re.MULTILINE | re.DOTALL | re.IGNORECASE)
            for match in matches:
                sections.append({
                    'number': match.group(1),
                    'title': match.group(2).strip(),
                    'start': match.start(),
                    'end': match.end()
                })
        
        if sections:
            # Processar cada secção
            for i, section in enumerate(sections):
                section_end = sections[i + 1]['start'] if i + 1 < len(sections) else len(text)
                section_text = text[section['end']:section_end]
                
                # Procurar artigos dentro da secção
                article_chunks = self._chunk_by_articles(section_text, document_id)
                if article_chunks:
                    for chunk in article_chunks:
                        chunk.section_title = section['title']
                        chunk.chunk_index = chunk_index
                        chunks.append(chunk)
                        chunk_index += 1
                else:
                    # Se não há artigos, adicionar secção inteira
                    chunk = LegalChunk(
                        text=f"{section['title']}\n{section_text}",
                        document_id=document_id,
                        chunk_index=chunk_index,
                        section_title=section['title'],
                        chunk_type="section"
                    )
                    chunks.append(chunk)
                    chunk_index += 1
        else:
            # Fallback para artigos
            chunks = self._chunk_by_articles(text, document_id)
        
        return chunks
    
    def _chunk_by_paragraphs(self, text: str, document_id: int) -> List[LegalChunk]:
        """Dividir por parágrafos quando estrutura formal não é detectada"""
        chunks = []
        chunk_index = 0
        
        # Dividir por parágrafos duplos
        paragraphs = text.split('\n\n')
        
        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            if len(paragraph) > 100:  # Filtrar parágrafos muito pequenos
                chunk = LegalChunk(
                    text=paragraph,
                    document_id=document_id,
                    chunk_index=chunk_index,
                    chunk_type="paragraph"
                )
                chunks.append(chunk)
                chunk_index += 1
        
        # Se ainda não há chunks suficientes, dividir por tamanho
        if len(chunks) < 3:
            chunks = self._chunk_by_size(text, document_id, max_size=1000)
        
        return chunks
    
    def _chunk_by_size(self, text: str, document_id: int, max_size: int = 1000) -> List[LegalChunk]:
        """Dividir por tamanho máximo como fallback"""
        chunks = []
        chunk_index = 0
        
        words = text.split()
        current_chunk = []
        current_size = 0
        
        for word in words:
            current_chunk.append(word)
            current_size += len(word) + 1
            
            if current_size >= max_size:
                chunk_text = ' '.join(current_chunk)
                chunk = LegalChunk(
                    text=chunk_text,
                    document_id=document_id,
                    chunk_index=chunk_index,
                    chunk_type="general"
                )
                chunks.append(chunk)
                chunk_index += 1
                current_chunk = []
                current_size = 0
        
        # Adicionar último chunk se não vazio
        if current_chunk:
            chunk_text = ' '.join(current_chunk)
            chunk = LegalChunk(
                text=chunk_text,
                document_id=document_id,
                chunk_index=chunk_index,
                chunk_type="general"
            )
            chunks.append(chunk)
        
        return chunks
    
    def _enrich_chunk_metadata(self, chunk: LegalChunk):
        """Enriquecer chunk com metadados adicionais"""
        text_lower = chunk.text.lower()
        
        # Extrair conceitos jurídicos
        for concept in self.legal_terms:
            if concept.lower() in text_lower:
                chunk.legal_concepts.append(concept)
        
        # Detectar referências cruzadas
        cross_ref_patterns = [
            r'artigo\s+(\d+)[º°]?',
            r'art\.?\s*(\d+)[º°]?',
            r'lei\s+n[º°]?\s*(\d+/\d+)',
            r'decreto\s+n[º°]?\s*(\d+/\d+)',
            r'alínea\s+([a-z])\)'
        ]
        
        for pattern in cross_ref_patterns:
            matches = re.finditer(pattern, text_lower)
            for match in matches:
                chunk.cross_references.append(match.group(0))
        
        # Extrair palavras-chave para relevância
        important_words = re.findall(r'\b[a-záêç]{6,}\b', text_lower)
        chunk.relevance_keywords = list(set(important_words[:10]))  # Top 10 palavras únicas
    
    def create_legal_embeddings(self, chunks: List[LegalChunk]) -> List[Dict[str, Any]]:
        """Preparar chunks para criação de embeddings especializados"""
        embeddings_data = []
        
        for chunk in chunks:
            # Texto expandido com contexto jurídico
            expanded_text = self._expand_text_with_context(chunk)
            
            embedding_data = {
                'text': expanded_text,
                'original_text': chunk.text,
                'document_id': chunk.document_id,
                'chunk_index': chunk.chunk_index,
                'metadata': {
                    'article_number': chunk.article_number,
                    'section_title': chunk.section_title,
                    'chunk_type': chunk.chunk_type,
                    'legal_concepts': chunk.legal_concepts,
                    'cross_references': chunk.cross_references,
                    'relevance_keywords': chunk.relevance_keywords
                }
            }
            embeddings_data.append(embedding_data)
        
        return embeddings_data
    
    def _expand_text_with_context(self, chunk: LegalChunk) -> str:
        """Expandir texto com contexto jurídico para melhor embedding"""
        expanded_parts = [chunk.text]
        
        # Adicionar contexto estrutural
        if chunk.article_number:
            expanded_parts.append(f"Este é o artigo {chunk.article_number}")
        
        if chunk.section_title:
            expanded_parts.append(f"Pertence à secção: {chunk.section_title}")
        
        # Adicionar conceitos jurídicos
        if chunk.legal_concepts:
            concepts_text = f"Conceitos jurídicos: {', '.join(chunk.legal_concepts[:5])}"
            expanded_parts.append(concepts_text)
        
        return ' | '.join(expanded_parts)
    
    def cross_reference_laws(self, chunk: LegalChunk, all_chunks: List[LegalChunk]) -> List[LegalChunk]:
        """Encontrar chunks relacionados através de referências cruzadas"""
        related_chunks = []
        
        for ref in chunk.cross_references:
            for other_chunk in all_chunks:
                if other_chunk.document_id != chunk.document_id:
                    continue
                
                # Procurar referência no texto de outros chunks
                if ref.lower() in other_chunk.text.lower():
                    related_chunks.append(other_chunk)
        
        # Também procurar por conceitos jurídicos similares
        for other_chunk in all_chunks:
            if other_chunk.chunk_index == chunk.chunk_index:
                continue
            
            common_concepts = set(chunk.legal_concepts) & set(other_chunk.legal_concepts)
            if len(common_concepts) >= 2:  # Pelo menos 2 conceitos em comum
                related_chunks.append(other_chunk)
        
        return related_chunks[:5]  # Máximo 5 chunks relacionados