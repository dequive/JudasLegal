"""
Advanced RAG Service - Fase 2 do Muzaia
Sistema de busca semântica avançada com embeddings e análise de relevância
"""
import re
import json
import random
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from dataclasses import dataclass

@dataclass
class SearchResult:
    document_id: int
    title: str
    content: str
    relevance_score: float
    document_type: str
    legal_area: str
    date_published: Optional[str]
    chunk_index: int
    metadata: Dict[str, Any]

class AdvancedRAGService:
    """Serviço RAG avançado com busca semântica e análise contextual"""
    
    def __init__(self, db_connection):
        self.db = db_connection
        self.legal_keywords = self._load_legal_keywords()
        self.concept_weights = self._initialize_concept_weights()
        
    def _load_legal_keywords(self) -> Dict[str, List[str]]:
        """Carrega keywords jurídicas por área do direito"""
        return {
            "constitucional": ["constituição", "direitos fundamentais", "liberdades", "estado", "poderes"],
            "civil": ["contrato", "propriedade", "obrigação", "responsabilidade", "danos"],
            "penal": ["crime", "pena", "prisão", "delito", "infracção"],
            "comercial": ["empresa", "sociedade", "comércio", "negócio", "actividade"],
            "trabalho": ["trabalhador", "empregador", "salário", "contrato trabalho", "despedimento"],
            "administrativo": ["administração pública", "funcionário público", "procedimento", "decisão"],
            "fiscal": ["imposto", "taxa", "tributação", "receita", "contribuição"],
            "fundiario": ["terra", "propriedade fundiária", "uso da terra", "direito fundiário"],
            "ambiental": ["ambiente", "conservação", "poluição", "recursos naturais"],
            "familia": ["casamento", "divórcio", "filhos", "adopção", "família"],
            "processo_civil": ["acção", "recurso", "sentença", "tribunal", "processo"],
            "processo_penal": ["acusação", "defesa", "julgamento", "prisão preventiva"],
            "seguranca_social": ["pensão", "reforma", "subsídio", "segurança social"],
            "imigracao": ["visto", "residência", "nacionalidade", "estrangeiro"],
            "propriedade_intelectual": ["marca", "patente", "direitos autorais", "propriedade industrial"]
        }
    
    def _initialize_concept_weights(self) -> Dict[str, float]:
        """Inicializa pesos para diferentes conceitos jurídicos"""
        return {
            "hierarchical": 1.5,  # Peso para documentos de maior hierarquia
            "recent": 1.2,        # Peso para documentos mais recentes
            "specific": 1.3,      # Peso para termos específicos da área
            "general": 1.0        # Peso base
        }
    
    def advanced_search(
        self, 
        query: str, 
        filters: Dict[str, Any] = None,
        max_results: int = 10
    ) -> List[SearchResult]:
        """
        Executa busca avançada com análise semântica e filtros
        """
        if not filters:
            filters = {}
            
        # 1. Análise e expansão da query
        expanded_query = self._expand_query(query)
        legal_concepts = self._extract_legal_concepts(query)
        
        # 2. Busca na base de dados com filtros
        sql_query = self._build_search_query(expanded_query, filters)
        
        try:
            with self.db.cursor() as cursor:
                cursor.execute(sql_query['query'], sql_query['params'])
                raw_results = cursor.fetchall()
        except Exception as e:
            print(f"Erro na busca: {e}")
            return []
        
        # 3. Calcular relevância avançada
        scored_results = []
        for result in raw_results:
            relevance_score = self._calculate_advanced_relevance(
                query, expanded_query, legal_concepts, result
            )
            
            if relevance_score >= filters.get('relevanceThreshold', 0.3):
                scored_results.append(SearchResult(
                    document_id=result[0],
                    title=result[1],
                    content=result[2][:500] + "..." if len(result[2]) > 500 else result[2],
                    relevance_score=relevance_score,
                    document_type=str(result[3]) if result[3] else "",
                    legal_area=str(result[4]) if result[4] else "",
                    date_published=result[5].isoformat() if result[5] else None,
                    chunk_index=result[6] if len(result) > 6 else 0,
                    metadata={
                        'description': result[7] if len(result) > 7 else "",
                        'keywords': result[8] if len(result) > 8 else []
                    }
                ))
        
        # 4. Ordenar por relevância e retornar top results
        scored_results.sort(key=lambda x: x.relevance_score, reverse=True)
        return scored_results[:max_results]
    
    def _expand_query(self, query: str) -> List[str]:
        """Expande a query com sinónimos e termos relacionados"""
        synonyms = {
            "trabalhador": ["empregado", "funcionário", "operário"],
            "empresa": ["sociedade", "companhia", "firma"],
            "casa": ["habitação", "residência", "lar"],
            "dinheiro": ["valor", "quantia", "montante"],
            "lei": ["legislação", "norma", "diploma"],
            "tribunal": ["corte", "juízo", "instância"],
            "crime": ["delito", "infracção", "ilícito"]
        }
        
        words = query.lower().split()
        expanded = list(words)
        
        for word in words:
            if word in synonyms:
                expanded.extend(synonyms[word])
                
        return expanded
    
    def _extract_legal_concepts(self, query: str) -> Dict[str, float]:
        """Extrai conceitos jurídicos da query e atribui pesos"""
        concepts = {}
        query_lower = query.lower()
        
        for area, keywords in self.legal_keywords.items():
            area_score = 0
            for keyword in keywords:
                if keyword in query_lower:
                    area_score += 1
            
            if area_score > 0:
                concepts[area] = area_score / len(keywords)
                
        return concepts
    
    def _build_search_query(self, expanded_query: List[str], filters: Dict[str, Any]) -> Dict[str, Any]:
        """Constrói query SQL com filtros avançados"""
        base_query = """
        SELECT DISTINCT
            ld.id,
            ld.title,
            ld.content,
            ld.document_type,
            ld.legal_area,
            ld.date_published,
            ld.chunk_index,
            ld.description,
            ld.keywords
        FROM legal_documents ld
        WHERE 1=1
        """
        
        params = []
        conditions = []
        
        # Busca textual usando full-text search do PostgreSQL
        if expanded_query:
            search_terms = " | ".join(expanded_query)
            conditions.append("to_tsvector('portuguese', ld.content || ' ' || ld.title) @@ plainto_tsquery('portuguese', %s)")
            params.append(search_terms)
        
        # Filtro por tipo de documento
        if filters.get('documentType'):
            conditions.append("ld.document_type = %s")
            params.append(int(filters['documentType']))
        
        # Filtro por área legal
        if filters.get('legalArea'):
            conditions.append("ld.legal_area = %s")
            params.append(int(filters['legalArea']))
        
        # Filtro por data
        if filters.get('dateRange'):
            if filters['dateRange'] == 'recent':
                conditions.append("ld.date_published >= CURRENT_DATE - INTERVAL '2 years'")
            elif filters['dateRange'] == 'last_5_years':
                conditions.append("ld.date_published >= CURRENT_DATE - INTERVAL '5 years'")
        
        # Combinar condições
        if conditions:
            base_query += " AND " + " AND ".join(conditions)
        
        # Ordenação inicial por data e tipo
        base_query += " ORDER BY ld.document_type ASC, ld.date_published DESC"
        base_query += " LIMIT 50"  # Limitar resultados iniciais
        
        return {
            'query': base_query,
            'params': params
        }
    
    def _calculate_advanced_relevance(
        self, 
        original_query: str, 
        expanded_query: List[str], 
        legal_concepts: Dict[str, float],
        result: tuple
    ) -> float:
        """Calcula score de relevância avançado considerando múltiplos fatores"""
        
        content = result[2].lower()
        title = result[1].lower()
        doc_type = result[3] if result[3] else 0
        legal_area = result[4] if result[4] else 0
        date_published = result[5]
        
        # 1. Score textual básico (TF-IDF simplificado)
        text_score = self._calculate_text_relevance(original_query, content, title)
        
        # 2. Score por área legal
        area_score = legal_concepts.get(str(legal_area), 0) * 0.3
        
        # 3. Score hierárquico (documentos de maior hierarquia têm mais peso)
        hierarchy_score = self._get_hierarchy_weight(doc_type) * 0.2
        
        # 4. Score temporal (documentos mais recentes têm ligeiro boost)
        temporal_score = self._get_temporal_weight(date_published) * 0.1
        
        # 5. Score de especificidade (termos específicos da área)
        specificity_score = self._calculate_specificity_score(content, legal_concepts) * 0.2
        
        # Combinar scores com pesos
        final_score = (
            text_score * 0.4 +
            area_score +
            hierarchy_score +
            temporal_score +
            specificity_score
        )
        
        # Normalizar para 0-1
        return min(max(final_score, 0), 1)
    
    def _calculate_text_relevance(self, query: str, content: str, title: str) -> float:
        """Calcula relevância textual usando TF-IDF simplificado"""
        query_terms = query.lower().split()
        
        # Score no título (peso maior)
        title_score = sum(1 for term in query_terms if term in title) / len(query_terms)
        
        # Score no conteúdo
        content_words = content.split()
        content_score = 0
        
        for term in query_terms:
            term_count = content.count(term)
            if term_count > 0:
                # TF normalizado
                tf = term_count / len(content_words)
                content_score += tf
        
        content_score = content_score / len(query_terms)
        
        # Combinar com peso para título
        return title_score * 0.6 + content_score * 0.4
    
    def _get_hierarchy_weight(self, doc_type: int) -> float:
        """Retorna peso baseado na hierarquia legal"""
        hierarchy_weights = {
            1: 1.0,   # Constituição
            2: 0.9,   # Lei
            3: 0.8,   # Decreto-Lei
            4: 0.7,   # Decreto
            5: 0.6,   # Regulamento
            6: 0.5,   # Portaria
            7: 0.4,   # Diploma Ministerial
            8: 0.3,   # Instrução
            9: 0.2,   # Circular
            10: 0.1   # Despacho
        }
        return hierarchy_weights.get(doc_type, 0.5)
    
    def _get_temporal_weight(self, date_published) -> float:
        """Retorna peso baseado na idade do documento"""
        if not date_published:
            return 0.5
        
        try:
            years_old = (datetime.now().date() - date_published).days / 365.25
            
            if years_old < 1:
                return 1.0
            elif years_old < 5:
                return 0.8
            elif years_old < 10:
                return 0.6
            else:
                return 0.4
        except:
            return 0.5
    
    def _calculate_specificity_score(self, content: str, legal_concepts: Dict[str, float]) -> float:
        """Calcula score baseado em termos específicos da área legal"""
        if not legal_concepts:
            return 0.5
        
        specificity_score = 0
        content_lower = content.lower()
        
        for area, score in legal_concepts.items():
            if area in self.legal_keywords:
                area_terms_found = sum(
                    1 for keyword in self.legal_keywords[area] 
                    if keyword in content_lower
                )
                area_specificity = area_terms_found / len(self.legal_keywords[area])
                specificity_score += area_specificity * score
        
        return min(specificity_score, 1.0)

class CitationAnalyzer:
    """Analisa e extrai citações legais de documentos"""
    
    def __init__(self):
        self.citation_patterns = [
            r'artigo\s+(\d+)º?',
            r'art\.?\s*(\d+)º?',
            r'lei\s+n\.?º?\s*(\d+/\d+)',
            r'decreto[-\s]lei\s+n\.?º?\s*(\d+/\d+)',
            r'código\s+(\w+)',
            r'capítulo\s+([IVX]+|\d+)',
            r'secção\s+([IVX]+|\d+)',
            r'alínea\s+([a-z])\)',
            r'parágrafo\s+(\d+)º?',
            r'§\s*(\d+)º?'
        ]
    
    def extract_citations(self, text: str) -> List[Dict[str, str]]:
        """Extrai citações legais do texto"""
        citations = []
        
        for pattern in self.citation_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                citations.append({
                    'type': self._get_citation_type(pattern),
                    'reference': match.group(),
                    'position': match.start()
                })
        
        return citations
    
    def _get_citation_type(self, pattern: str) -> str:
        """Determina o tipo de citação baseado no padrão"""
        if 'artigo' in pattern or 'art' in pattern:
            return 'artigo'
        elif 'lei' in pattern:
            return 'lei'
        elif 'decreto' in pattern:
            return 'decreto'
        elif 'código' in pattern:
            return 'codigo'
        elif 'capítulo' in pattern:
            return 'capitulo'
        elif 'secção' in pattern:
            return 'seccao'
        elif 'alínea' in pattern:
            return 'alinea'
        elif 'parágrafo' in pattern or '§' in pattern:
            return 'paragrafo'
        else:
            return 'desconhecido'

# Função de utilidade para integração com o backend
def create_advanced_rag_service(db_connection):
    """Factory function para criar o serviço RAG avançado"""
    return AdvancedRAGService(db_connection)