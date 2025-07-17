import json
import os
from typing import Dict, Any, List
from openai import OpenAI

class OpenAIService:
    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv("OPENAI_API_KEY", "default_key")
        )
    
    async def generate_legal_response(
        self, 
        query: str, 
        context: str, 
        relevant_docs: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Generate legal response using OpenAI with proper citations
        """
        try:
            # Prepare system prompt for legal assistant
            system_prompt = self.get_legal_system_prompt()
            
            # Prepare user prompt with context
            user_prompt = f"""
            Consulta jurídica: {query}
            
            Contexto legal disponível:
            {context}
            
            Por favor, responda em português e inclua citações específicas das fontes legais.
            """
            
            # Call OpenAI API
            # the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
            # do not change this unless explicitly requested by the user
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.3,
                max_tokens=1000
            )
            
            # Parse response
            response_content = response.choices[0].message.content
            parsed_response = json.loads(response_content)
            
            # Extract citations from relevant docs
            citations = self.extract_citations(relevant_docs)
            
            return {
                "content": parsed_response.get("response", "Desculpe, não foi possível processar sua consulta."),
                "citations": citations
            }
            
        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            # Fallback to basic response generation
            return self.generate_fallback_response(query, relevant_docs)
    
    def get_legal_system_prompt(self) -> str:
        """
        System prompt for legal assistant specialized in Mozambican law
        """
        return """
        Você é um assistente jurídico especializado em legislação moçambicana. 
        
        Instruções:
        1. Responda sempre em português
        2. Base suas respostas apenas no contexto legal fornecido
        3. Seja preciso e objetivo
        4. Inclua citações específicas das leis quando aplicável
        5. Se não tiver informação suficiente, seja honesto sobre isso
        6. Forneça respostas estruturadas e claras
        
        Formato de resposta (JSON):
        {
            "response": "Sua resposta detalhada aqui",
            "confidence": "alto/médio/baixo",
            "legal_basis": "Base legal da resposta"
        }
        
        Lembre-se: Você está ajudando com consultas sobre direito moçambicano.
        """
    
    def extract_citations(self, relevant_docs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Extract and format citations from relevant documents
        """
        citations = []
        
        for doc in relevant_docs:
            citation = {
                "id": doc["id"],
                "title": doc["title"],
                "source": doc["source"],
                "law_type": doc["law_type"],
                "article_number": doc.get("article_number"),
                "relevance_score": doc.get("score", 0)
            }
            citations.append(citation)
        
        return citations
    
    def generate_fallback_response(self, query: str, relevant_docs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generate a basic response when OpenAI API is not available
        """
        if not relevant_docs:
            return {
                "content": "Desculpe, não encontrei documentos legais relevantes para sua consulta. Tente reformular sua pergunta ou seja mais específico.",
                "citations": []
            }
        
        # Create a basic response based on the most relevant document
        best_doc = relevant_docs[0]
        response_content = f"""
        Com base na legislação moçambicana, encontrei informações relevantes sobre sua consulta:

        **{best_doc['title']}**
        
        {best_doc['content'][:800]}...
        
        Esta informação é baseada em {best_doc['source']} ({best_doc['law_type']}).
        
        **Importante:** Esta é uma resposta automática baseada em documentos legais. Para consultas específicas, recomendo consultar um advogado qualificado.
        """
        
        citations = self.extract_citations(relevant_docs)
        
        return {
            "content": response_content,
            "citations": citations
        }

    async def summarize_legal_document(self, content: str) -> str:
        """
        Summarize legal document content
        """
        try:
            prompt = f"""
            Resuma o seguinte documento legal em português, mantendo os pontos principais:
            
            {content}
            
            Forneça um resumo claro e estruturado.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=500
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error summarizing document: {e}")
            return "Erro ao resumir documento."
