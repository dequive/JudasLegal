"""
Legal Chunker - Sistema de divisão inteligente de documentos legais
Preserva a estrutura jurídica durante o processo de chunking
"""
import re
import json
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from models.legal_document_hierarchy import LegalArea, LegalDocumentType

@dataclass
class LegalChunk:
    """Chunk de documento legal com metadados jurídicos"""
    content: str
    chunk_type: str  # "artigo", "secção", "parágrafo", "alínea", "texto_livre"
    chunk_index: int
    section_number: Optional[str] = None
    article_number: Optional[str] = None
    subsection: Optional[str] = None
    legal_concepts: List[str] = None
    citations: List[str] = None
    word_count: int = 0
    complexity_level: int = 1  # 1-4

class LegalChunker:
    """Sistema de chunking especializado para documentos legais moçambicanos"""
    
    def __init__(self, max_chunk_size: int = 1000, overlap_size: int = 200):
        self.max_chunk_size = max_chunk_size
        self.overlap_size = overlap_size
        
        # Padrões para identificar estruturas legais
        self.patterns = {
            'artigo': [
                r'artigo\s+(\d+)\.?º?\s*[-–—]?\s*(.*?)(?=artigo\s+\d+|$)',
                r'art\.?\s*(\d+)\.?º?\s*[-–—]?\s*(.*?)(?=art\.?\s*\d+|$)',
                r'^(\d+)\.?\s*[-–—]\s*(.*?)(?=^\d+\.|$)'
            ],
            'seccao': [
                r'secção\s+([IVX]+|\d+)\s*[-–—]?\s*(.*?)(?=secção|artigo|$)',
                r'seção\s+([IVX]+|\d+)\s*[-–—]?\s*(.*?)(?=seção|artigo|$)'
            ],
            'capitulo': [
                r'capítulo\s+([IVX]+|\d+)\s*[-–—]?\s*(.*?)(?=capítulo|secção|$)',
                r'titulo\s+([IVX]+|\d+)\s*[-–—]?\s*(.*?)(?=titulo|capítulo|$)'
            ],
            'alinea': [
                r'^([a-z])\)\s*(.*?)(?=^[a-z]\)|$)',
                r'alínea\s+([a-z])\)\s*(.*?)(?=alínea|$)'
            ],
            'paragrafo': [
                r'§\s*(\d+)º?\s*[-–—]?\s*(.*?)(?=§|artigo|$)',
                r'parágrafo\s+(\d+)º?\s*[-–—]?\s*(.*?)(?=parágrafo|artigo|$)',
                r'^\s*(\d+)\.?\s+(.*?)(?=^\s*\d+\.|$)'
            ],
            'numero': [
                r'^\s*(\d+)\.\s+(.*?)(?=^\s*\d+\.|$)',
                r'^\s*(\d+)\s*[-–—]\s*(.*?)(?=^\s*\d+\s*[-–—]|$)'
            ]
        }
        
        # Conceitos jurídicos por área para detecção
        self.legal_concepts = {
            LegalArea.CIVIL: [
                "personalidade jurídica", "capacidade", "responsabilidade civil", 
                "contrato", "propriedade", "obrigação", "direitos reais", "posse",
                "usufruito", "servidão", "hipoteca", "penhor", "herança", "sucessão"
            ],
            LegalArea.PENAL: [
                "crime", "dolo", "culpa", "pena", "prisão", "multa", "medida de segurança",
                "legítima defesa", "estado de necessidade", "tentativa", "comparticipação",
                "prescrição", "extinção da responsabilidade", "atenuação", "agravação"
            ],
            LegalArea.COMERCIAL: [
                "sociedade comercial", "empresa", "estabelecimento comercial", "marca",
                "patente", "concorrência", "falência", "recuperação", "títulos de crédito",
                "letra de câmbio", "cheque", "nota promissória", "seguro", "transporte"
            ],
            LegalArea.TRABALHO: [
                "contrato de trabalho", "trabalhador", "empregador", "salário", "férias",
                "despedimento", "cessação", "horário de trabalho", "horas extraordinárias",
                "segurança no trabalho", "acidentes de trabalho", "greve", "sindicato"
            ],
            LegalArea.ADMINISTRATIVO: [
                "administração pública", "funcionário público", "acto administrativo",
                "procedimento administrativo", "recurso administrativo", "contrato público",
                "serviço público", "domínio público", "expropriação", "licenciamento"
            ]
        }
    
    def chunk_legal_document(
        self, 
        text: str, 
        title: str, 
        legal_area: LegalArea,
        document_type: LegalDocumentType
    ) -> List[LegalChunk]:
        """Divide documento legal preservando estrutura jurídica"""
        
        # Limpeza inicial do texto
        cleaned_text = self._clean_text(text)
        
        # Tentar chunking estrutural primeiro
        structural_chunks = self._extract_structural_chunks(cleaned_text, legal_area)
        
        if structural_chunks and len(structural_chunks) > 1:
            # Se encontrou estrutura legal, usar chunking estrutural
            return self._process_structural_chunks(structural_chunks, legal_area, document_type)
        else:
            # Caso contrário, usar chunking semântico
            return self._semantic_chunking(cleaned_text, title, legal_area, document_type)
    
    def _clean_text(self, text: str) -> str:
        """Limpa e normaliza texto legal"""
        # Remover caracteres de controle
        text = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', text)
        
        # Normalizar espaços em branco
        text = re.sub(r'\s+', ' ', text)
        
        # Normalizar quebras de linha
        text = re.sub(r'\n\s*\n', '\n\n', text)
        
        # Remover espaços no início e fim
        text = text.strip()
        
        return text
    
    def _extract_structural_chunks(self, text: str, legal_area: LegalArea) -> List[Dict[str, Any]]:
        """Extrai chunks baseados na estrutura legal do documento"""
        chunks = []
        
        # Tentar extrair artigos primeiro (estrutura mais comum)
        for pattern in self.patterns['artigo']:
            matches = list(re.finditer(pattern, text, re.MULTILINE | re.DOTALL | re.IGNORECASE))
            if matches:
                for i, match in enumerate(matches):
                    chunk_content = match.group(0).strip()
                    if len(chunk_content) > 50:  # Filtrar chunks muito pequenos
                        chunks.append({
                            'content': chunk_content,
                            'type': 'artigo',
                            'number': match.group(1),
                            'start_pos': match.start(),
                            'end_pos': match.end()
                        })
                break  # Se encontrou artigos, parar
        
        # Se não encontrou artigos, tentar secções
        if not chunks:
            for pattern in self.patterns['seccao']:
                matches = list(re.finditer(pattern, text, re.MULTILINE | re.DOTALL | re.IGNORECASE))
                if matches:
                    for match in matches:
                        chunk_content = match.group(0).strip()
                        if len(chunk_content) > 50:
                            chunks.append({
                                'content': chunk_content,
                                'type': 'seccao',
                                'number': match.group(1),
                                'start_pos': match.start(),
                                'end_pos': match.end()
                            })
                    break
        
        # Se não encontrou nem artigos nem secções, tentar parágrafos numerados
        if not chunks:
            for pattern in self.patterns['paragrafo']:
                matches = list(re.finditer(pattern, text, re.MULTILINE | re.IGNORECASE))
                if len(matches) > 2:  # Pelo menos 3 parágrafos para ser considerado estrutural
                    for match in matches:
                        chunk_content = match.group(0).strip()
                        if len(chunk_content) > 30:
                            chunks.append({
                                'content': chunk_content,
                                'type': 'paragrafo',
                                'number': match.group(1),
                                'start_pos': match.start(),
                                'end_pos': match.end()
                            })
                    break
        
        return sorted(chunks, key=lambda x: x['start_pos'])
    
    def _process_structural_chunks(
        self, 
        raw_chunks: List[Dict[str, Any]], 
        legal_area: LegalArea,
        document_type: LegalDocumentType
    ) -> List[LegalChunk]:
        """Processa chunks estruturais em chunks legais finais"""
        
        processed_chunks = []
        
        for i, chunk_data in enumerate(raw_chunks):
            content = chunk_data['content']
            
            # Se chunk é muito grande, dividir mantendo estrutura
            if len(content) > self.max_chunk_size:
                sub_chunks = self._split_large_chunk(content, chunk_data['type'])
                for j, sub_content in enumerate(sub_chunks):
                    legal_chunk = self._create_legal_chunk(
                        content=sub_content,
                        chunk_type=f"{chunk_data['type']}_parte",
                        chunk_index=len(processed_chunks),
                        section_number=chunk_data.get('number'),
                        legal_area=legal_area,
                        document_type=document_type
                    )
                    processed_chunks.append(legal_chunk)
            else:
                legal_chunk = self._create_legal_chunk(
                    content=content,
                    chunk_type=chunk_data['type'],
                    chunk_index=len(processed_chunks),
                    section_number=chunk_data.get('number'),
                    legal_area=legal_area,
                    document_type=document_type
                )
                processed_chunks.append(legal_chunk)
        
        return processed_chunks
    
    def _semantic_chunking(
        self, 
        text: str, 
        title: str, 
        legal_area: LegalArea,
        document_type: LegalDocumentType
    ) -> List[LegalChunk]:
        """Chunking semântico para documentos sem estrutura clara"""
        
        # Dividir em parágrafos primeiro
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        
        chunks = []
        current_chunk = ""
        current_concepts = []
        
        for para in paragraphs:
            # Se adicionar este parágrafo exceder o limite, finalizar chunk atual
            if len(current_chunk) + len(para) > self.max_chunk_size and current_chunk:
                legal_chunk = self._create_legal_chunk(
                    content=current_chunk.strip(),
                    chunk_type="texto_livre",
                    chunk_index=len(chunks),
                    legal_area=legal_area,
                    document_type=document_type
                )
                chunks.append(legal_chunk)
                
                # Começar novo chunk com sobreposição
                if len(current_chunk) > self.overlap_size:
                    overlap_text = current_chunk[-self.overlap_size:]
                    current_chunk = overlap_text + "\n\n" + para
                else:
                    current_chunk = para
            else:
                if current_chunk:
                    current_chunk += "\n\n" + para
                else:
                    current_chunk = para
        
        # Adicionar último chunk se houver conteúdo
        if current_chunk.strip():
            legal_chunk = self._create_legal_chunk(
                content=current_chunk.strip(),
                chunk_type="texto_livre",
                chunk_index=len(chunks),
                legal_area=legal_area,
                document_type=document_type
            )
            chunks.append(legal_chunk)
        
        return chunks
    
    def _split_large_chunk(self, content: str, chunk_type: str) -> List[str]:
        """Divide chunks grandes mantendo coerência"""
        # Tentar dividir por frases primeiro
        sentences = re.split(r'(?<=[.!?])\s+', content)
        
        sub_chunks = []
        current_sub = ""
        
        for sentence in sentences:
            if len(current_sub) + len(sentence) > self.max_chunk_size and current_sub:
                sub_chunks.append(current_sub.strip())
                current_sub = sentence
            else:
                if current_sub:
                    current_sub += " " + sentence
                else:
                    current_sub = sentence
        
        if current_sub.strip():
            sub_chunks.append(current_sub.strip())
        
        return sub_chunks
    
    def _create_legal_chunk(
        self,
        content: str,
        chunk_type: str,
        chunk_index: int,
        legal_area: LegalArea,
        document_type: LegalDocumentType,
        section_number: Optional[str] = None,
        article_number: Optional[str] = None,
        subsection: Optional[str] = None
    ) -> LegalChunk:
        """Cria chunk legal com metadados completos"""
        
        # Detectar conceitos legais no conteúdo
        legal_concepts = self._detect_legal_concepts(content, legal_area)
        
        # Extrair citações legais
        citations = self._extract_citations(content)
        
        # Calcular nível de complexidade
        complexity_level = self._calculate_complexity(content, legal_concepts)
        
        # Contar palavras
        word_count = len(content.split())
        
        return LegalChunk(
            content=content,
            chunk_type=chunk_type,
            chunk_index=chunk_index,
            section_number=section_number,
            article_number=article_number,
            subsection=subsection,
            legal_concepts=legal_concepts,
            citations=citations,
            word_count=word_count,
            complexity_level=complexity_level
        )
    
    def _detect_legal_concepts(self, content: str, legal_area: LegalArea) -> List[str]:
        """Detecta conceitos jurídicos no conteúdo"""
        content_lower = content.lower()
        concepts_found = []
        
        # Verificar conceitos da área específica
        if legal_area in self.legal_concepts:
            for concept in self.legal_concepts[legal_area]:
                if concept.lower() in content_lower:
                    concepts_found.append(concept)
        
        # Verificar conceitos gerais
        general_concepts = [
            "direito", "dever", "obrigação", "responsabilidade", "lei", "norma",
            "tribunal", "processo", "sentença", "recurso", "prazo", "procedimento"
        ]
        
        for concept in general_concepts:
            if concept in content_lower and concept not in concepts_found:
                concepts_found.append(concept)
        
        return concepts_found
    
    def _extract_citations(self, content: str) -> List[str]:
        """Extrai citações legais do conteúdo"""
        citation_patterns = [
            r'artigo\s+\d+\.?º?',
            r'art\.?\s*\d+\.?º?',
            r'lei\s+n\.?º?\s*\d+/\d+',
            r'decreto[-\s]lei\s+n\.?º?\s*\d+/\d+',
            r'código\s+\w+',
            r'constituição',
            r'capítulo\s+[IVX]+',
            r'secção\s+[IVX]+',
            r'alínea\s+[a-z]\)',
            r'parágrafo\s+\d+\.?º?'
        ]
        
        citations = []
        for pattern in citation_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            citations.extend(matches)
        
        return list(set(citations))  # Remover duplicados
    
    def _calculate_complexity(self, content: str, legal_concepts: List[str]) -> int:
        """Calcula nível de complexidade do chunk (1-4)"""
        
        factors = {
            'length': len(content),
            'concepts': len(legal_concepts),
            'technical_terms': len(re.findall(r'\b[A-Z][a-z]*\b', content)),
            'sentences': len(re.split(r'[.!?]+', content)),
            'legal_refs': len(re.findall(r'artigo|lei|decreto|código', content, re.IGNORECASE))
        }
        
        # Cálculo baseado em múltiplos factores
        complexity_score = 0
        
        # Comprimento (peso: 20%)
        if factors['length'] > 800:
            complexity_score += 3
        elif factors['length'] > 400:
            complexity_score += 2
        elif factors['length'] > 200:
            complexity_score += 1
        
        # Conceitos legais (peso: 30%)
        if factors['concepts'] > 5:
            complexity_score += 3
        elif factors['concepts'] > 2:
            complexity_score += 2
        elif factors['concepts'] > 0:
            complexity_score += 1
        
        # Referências legais (peso: 25%)
        if factors['legal_refs'] > 3:
            complexity_score += 2
        elif factors['legal_refs'] > 1:
            complexity_score += 1
        
        # Termos técnicos (peso: 25%)
        tech_ratio = factors['technical_terms'] / max(factors['sentences'], 1)
        if tech_ratio > 2:
            complexity_score += 2
        elif tech_ratio > 1:
            complexity_score += 1
        
        # Normalizar para escala 1-4
        max_possible_score = 10
        normalized_score = (complexity_score / max_possible_score) * 3 + 1
        
        return min(max(round(normalized_score), 1), 4)
    
    def get_chunk_metadata(self, chunk: LegalChunk) -> Dict[str, Any]:
        """Retorna metadados do chunk em formato serializável"""
        return {
            'chunk_type': chunk.chunk_type,
            'chunk_index': chunk.chunk_index,
            'section_number': chunk.section_number,
            'article_number': chunk.article_number,
            'subsection': chunk.subsection,
            'legal_concepts': chunk.legal_concepts or [],
            'citations': chunk.citations or [],
            'word_count': chunk.word_count,
            'complexity_level': chunk.complexity_level
        }