"""
Legal Complexity Analysis Service
Provides automated complexity rating for legal texts
"""

from typing import Dict, Any

class ComplexityService:
    """Service for analyzing legal text complexity"""
    
    def __init__(self):
        self.legal_terms = [
            'constituição', 'código civil', 'código penal', 'código comercial',
            'habeas corpus', 'mandado de segurança', 'usucapião', 'prescrição',
            'jurisprudência', 'acórdão', 'recurso', 'apelação', 'cassação',
            'responsabilidade civil', 'danos morais', 'indenização',
            'contrato', 'obrigação', 'direito real', 'propriedade',
            'sucessão', 'herança', 'testamento', 'inventário',
            'processo civil', 'processo penal', 'processo administrativo',
            'tribunal', 'sentença', 'decisão judicial', 'competência',
            'jurisdição', 'legitimidade', 'interesse processual'
        ]
        
        self.complex_concepts = [
            'interpretação constitucional', 'aplicação da lei', 'hermenêutica jurídica',
            'princípios gerais do direito', 'analogia legal', 'lacuna da lei',
            'retroatividade', 'irretroatividade', 'direito adquirido',
            'ato jurídico perfeito', 'coisa julgada', 'devido processo legal',
            'contraditório', 'ampla defesa', 'presunção de inocência'
        ]
        
        self.complexity_weights = {
            'basic_legal_term': 1,
            'complex_concept': 3,
            'text_length_500': 1,
            'text_length_1000': 2,
            'multiple_areas': 2,
            'procedural_terms': 2
        }
    
    def analyze_complexity(self, text: str) -> Dict[str, Any]:
        """
        Analyze the complexity of legal text
        
        Args:
            text: The legal text to analyze
            
        Returns:
            Dictionary with complexity analysis results
        """
        text_lower = text.lower()
        complexity_score = 0
        analysis_details = {
            'legal_terms_found': [],
            'complex_concepts_found': [],
            'text_length': len(text),
            'analysis_factors': []
        }
        
        # Check for legal terms
        for term in self.legal_terms:
            if term in text_lower:
                complexity_score += self.complexity_weights['basic_legal_term']
                analysis_details['legal_terms_found'].append(term)
        
        # Check for complex concepts
        for concept in self.complex_concepts:
            if concept in text_lower:
                complexity_score += self.complexity_weights['complex_concept']
                analysis_details['complex_concepts_found'].append(concept)
        
        # Text length factors
        if len(text) > 500:
            complexity_score += self.complexity_weights['text_length_500']
            analysis_details['analysis_factors'].append('texto_extenso_500+')
            
        if len(text) > 1000:
            complexity_score += self.complexity_weights['text_length_1000']
            analysis_details['analysis_factors'].append('texto_muito_extenso_1000+')
        
        # Determine complexity level
        complexity_rating = self._get_complexity_rating(complexity_score)
        
        return {
            'complexity_score': complexity_score,
            'level': complexity_rating['level'],
            'emoji': complexity_rating['emoji'],
            'label': complexity_rating['label'],
            'color': complexity_rating['color'],
            'description': complexity_rating['description'],
            'analysis_details': analysis_details
        }
    
    def _get_complexity_rating(self, score: int) -> Dict[str, Any]:
        """Convert complexity score to rating"""
        if score <= 3:
            return {
                'level': 1,
                'emoji': '🟢',
                'label': 'Simples',
                'color': '#10b981',
                'description': 'Questão jurídica básica, adequada para consulta geral'
            }
        elif score <= 7:
            return {
                'level': 2,
                'emoji': '🟡',
                'label': 'Moderado',
                'color': '#f59e0b',
                'description': 'Questão de complexidade moderada, requer conhecimento jurídico'
            }
        elif score <= 12:
            return {
                'level': 3,
                'emoji': '🟠',
                'label': 'Complexo',
                'color': '#ef4444',
                'description': 'Questão complexa, recomenda-se consulta especializada'
            }
        else:
            return {
                'level': 4,
                'emoji': '🔴',
                'label': 'Muito Complexo',
                'color': '#dc2626',
                'description': 'Questão muito complexa, requer análise jurídica especializada'
            }
    
    def get_complexity_statistics(self, texts: list) -> Dict[str, Any]:
        """Get statistics for multiple texts"""
        if not texts:
            return {'error': 'Nenhum texto fornecido'}
        
        analyses = [self.analyze_complexity(text) for text in texts]
        levels = [analysis['level'] for analysis in analyses]
        
        return {
            'total_texts': len(texts),
            'average_complexity': sum(levels) / len(levels),
            'distribution': {
                'simples': levels.count(1),
                'moderado': levels.count(2),
                'complexo': levels.count(3),
                'muito_complexo': levels.count(4)
            },
            'most_common_level': max(set(levels), key=levels.count)
        }