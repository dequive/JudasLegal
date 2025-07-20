"""
Gemini AI Service for Legal Assistant
Handles interactions with Google's Gemini AI model
"""

import google.generativeai as genai
import os
from typing import Dict, Any, List
import json

class GeminiService:
    """Service for interacting with Gemini AI"""
    
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash-preview')
        else:
            self.model = None
    
    def is_configured(self) -> bool:
        """Check if Gemini is properly configured"""
        return self.model is not None
    
    async def generate_legal_response(self, user_question: str, context: str = "") -> Dict[str, Any]:
        """
        Generate legal response using Gemini AI
        
        Args:
            user_question: User's legal question
            context: Additional context or retrieved documents
            
        Returns:
            Dictionary with AI response and metadata
        """
        if not self.is_configured():
            return {
                'success': False,
                'error': 'Gemini AI não está configurado',
                'response': 'Serviço de IA temporariamente indisponível'
            }
        
        try:
            prompt = self._build_legal_prompt(user_question, context)
            response = self.model.generate_content(prompt)
            
            if response.text:
                return {
                    'success': True,
                    'response': response.text,
                    'model_used': 'gemini-2.0-flash-preview',
                    'response_length': len(response.text)
                }
            else:
                return {
                    'success': False,
                    'error': 'Resposta vazia do modelo',
                    'response': 'Não foi possível gerar uma resposta adequada'
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': f'Erro na geração de resposta: {str(e)}',
                'response': 'Erro temporário no serviço de IA'
            }
    
    def _build_legal_prompt(self, question: str, context: str = "") -> str:
        """Build optimized prompt for legal queries"""
        base_prompt = """
Você é o Judas, um assistente jurídico especializado em legislação moçambicana.

INSTRUÇÕES IMPORTANTES:
1. Responda SEMPRE em português europeu (use "vosso/vossa" em vez de "seu/sua")
2. Base suas respostas na legislação moçambicana vigente
3. Seja preciso, claro e fundamentado juridicamente
4. Cite fontes legais específicas quando possível
5. Se não tiver certeza, indique claramente as limitações
6. Use linguagem acessível mas juridicamente correcta

"""
        
        if context:
            base_prompt += f"CONTEXTO LEGAL RELEVANTE:\n{context}\n\n"
        
        base_prompt += f"PERGUNTA DO USUÁRIO:\n{question}\n\n"
        base_prompt += """
RESPOSTA (em português europeu, fundamentada na lei moçambicana):
"""
        
        return base_prompt
    
    async def analyze_legal_document(self, document_text: str) -> Dict[str, Any]:
        """
        Analyze legal document and extract key information
        
        Args:
            document_text: Text of legal document
            
        Returns:
            Analysis results
        """
        if not self.is_configured():
            return {'error': 'Gemini AI não configurado'}
        
        try:
            prompt = f"""
Analise o seguinte documento jurídico moçambicano e extraia:

1. Tipo de documento (lei, decreto, regulamento, etc.)
2. Área do direito (civil, penal, comercial, etc.)
3. Principais temas abordados
4. Artigos ou seções mais relevantes
5. Resumo executivo em português europeu

DOCUMENTO:
{document_text[:2000]}  # Limit text for processing

Forneça a análise em formato JSON estruturado.
"""
            
            response = self.model.generate_content(prompt)
            
            if response.text:
                return {
                    'success': True,
                    'analysis': response.text,
                    'document_length': len(document_text)
                }
            else:
                return {
                    'success': False,
                    'error': 'Falha na análise do documento'
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': f'Erro na análise: {str(e)}'
            }
    
    async def generate_legal_summary(self, long_text: str, max_words: int = 200) -> str:
        """Generate concise legal summary"""
        if not self.is_configured():
            return "Serviço de resumo indisponível"
        
        try:
            prompt = f"""
Crie um resumo jurídico conciso (máximo {max_words} palavras) do seguinte texto legal, 
mantendo os pontos essenciais e usando português europeu:

{long_text[:1500]}

RESUMO:
"""
            
            response = self.model.generate_content(prompt)
            return response.text if response.text else "Não foi possível gerar resumo"
            
        except Exception as e:
            return f"Erro na geração de resumo: {str(e)}"
    
    def get_service_status(self) -> Dict[str, Any]:
        """Get current service status"""
        return {
            'gemini_configured': self.is_configured(),
            'api_key_present': bool(self.api_key),
            'model_name': 'gemini-2.0-flash-preview' if self.is_configured() else None,
            'status': 'ready' if self.is_configured() else 'not_configured'
        }