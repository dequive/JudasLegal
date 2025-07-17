import json
import asyncio
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from models import LegalDocument, DocumentEmbedding, ChatMessage, ChatSession
from services.openai_service import OpenAIService
from utils.text_processing import TextProcessor
import uuid
from datetime import datetime

class RAGService:
    def __init__(self, db: Session):
        self.db = db
        self.openai_service = OpenAIService()
        self.text_processor = TextProcessor()
    
    async def process_query(self, query: str, session_id: str) -> Dict[str, Any]:
        """
        Main RAG pipeline: analyze query -> retrieve docs -> generate response
        """
        try:
            # 1. Analyze and preprocess the query
            processed_query = self.text_processor.preprocess_text(query)
            
            # 2. Retrieve relevant documents
            relevant_docs = await self.retrieve_relevant_documents(processed_query)
            
            # 3. Generate response with citations
            response = await self.generate_response_with_citations(
                query, relevant_docs, session_id
            )
            
            return {
                "success": True,
                "response": response["content"],
                "citations": response["citations"],
                "session_id": session_id
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Erro ao processar consulta: {str(e)}",
                "session_id": session_id
            }
    
    async def retrieve_relevant_documents(self, query: str) -> List[Dict[str, Any]]:
        """
        Retrieve relevant legal documents based on query
        For now, using simple text matching - in production would use vector similarity
        """
        try:
            # Simple keyword-based retrieval (simplified for MVP)
            keywords = self.text_processor.extract_keywords(query)
            
            relevant_docs = []
            documents = self.db.query(LegalDocument).all()
            
            for doc in documents:
                # Calculate simple relevance score
                score = self.calculate_relevance_score(doc.content, keywords)
                
                if score > 0.1:  # Threshold for relevance
                    relevant_docs.append({
                        "id": doc.id,
                        "title": doc.title,
                        "content": doc.content[:1000],  # Truncate for context
                        "source": doc.source,
                        "law_type": doc.law_type,
                        "article_number": doc.article_number,
                        "score": score
                    })
            
            # Sort by relevance score
            relevant_docs.sort(key=lambda x: x["score"], reverse=True)
            
            return relevant_docs[:5]  # Return top 5 most relevant
            
        except Exception as e:
            print(f"Error retrieving documents: {e}")
            return []
    
    def calculate_relevance_score(self, text: str, keywords: List[str]) -> float:
        """
        Simple relevance scoring based on keyword matching
        """
        text_lower = text.lower()
        score = 0
        
        for keyword in keywords:
            if keyword.lower() in text_lower:
                score += 1
        
        return score / len(keywords) if keywords else 0
    
    async def generate_response_with_citations(
        self, 
        query: str, 
        relevant_docs: List[Dict[str, Any]], 
        session_id: str
    ) -> Dict[str, Any]:
        """
        Generate legal response with proper citations using OpenAI
        """
        try:
            # Prepare context from relevant documents
            context = self.prepare_context(relevant_docs)
            
            # Generate response using OpenAI
            response = await self.openai_service.generate_legal_response(
                query, context, relevant_docs
            )
            
            # Save the interaction to database
            await self.save_chat_interaction(session_id, query, response)
            
            return response
            
        except Exception as e:
            print(f"Error generating response: {e}")
            return {
                "content": "Desculpe, ocorreu um erro ao processar sua consulta jurídica. Tente novamente.",
                "citations": []
            }
    
    def prepare_context(self, relevant_docs: List[Dict[str, Any]]) -> str:
        """
        Prepare context string from relevant documents
        """
        if not relevant_docs:
            return "Nenhum documento relevante encontrado."
        
        context = "Documentos legais relevantes:\n\n"
        
        for i, doc in enumerate(relevant_docs, 1):
            context += f"{i}. {doc['title']}\n"
            context += f"   Fonte: {doc['source']}\n"
            context += f"   Tipo: {doc['law_type']}\n"
            if doc.get('article_number'):
                context += f"   Artigo: {doc['article_number']}\n"
            context += f"   Conteúdo: {doc['content'][:500]}...\n\n"
        
        return context
    
    async def save_chat_interaction(
        self, 
        session_id: str, 
        user_query: str, 
        assistant_response: Dict[str, Any]
    ):
        """
        Save chat interaction to database
        """
        try:
            # Get or create session
            session = self.db.query(ChatSession).filter(
                ChatSession.session_id == session_id
            ).first()
            
            if not session:
                session = ChatSession(
                    session_id=session_id,
                    user_id="anonymous"  # For now, all users are anonymous
                )
                self.db.add(session)
                self.db.commit()
            
            # Save user message
            user_message = ChatMessage(
                session_id=session_id,
                role="user",
                content=user_query
            )
            self.db.add(user_message)
            
            # Save assistant response
            assistant_message = ChatMessage(
                session_id=session_id,
                role="assistant",
                content=assistant_response["content"],
                citations=assistant_response.get("citations", [])
            )
            self.db.add(assistant_message)
            
            self.db.commit()
            
        except Exception as e:
            print(f"Error saving chat interaction: {e}")
            self.db.rollback()
    
    async def get_chat_history(self, session_id: str) -> List[Dict[str, Any]]:
        """
        Retrieve chat history for a session
        """
        try:
            messages = self.db.query(ChatMessage).filter(
                ChatMessage.session_id == session_id
            ).order_by(ChatMessage.created_at.asc()).all()
            
            return [
                {
                    "role": msg.role,
                    "content": msg.content,
                    "citations": msg.citations,
                    "timestamp": msg.created_at.isoformat()
                }
                for msg in messages
            ]
            
        except Exception as e:
            print(f"Error retrieving chat history: {e}")
            return []
