from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from services.rag_service import RAGService
from database.config import get_db
import uuid

router = APIRouter()

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    citations: List[Dict[str, Any]]
    session_id: str
    success: bool

class ChatHistoryResponse(BaseModel):
    messages: List[Dict[str, Any]]
    session_id: str

@router.post("/send", response_model=ChatResponse)
async def send_message(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Send a message to the legal chatbot
    """
    try:
        # Generate session ID if not provided
        session_id = request.session_id or str(uuid.uuid4())
        
        # Initialize RAG service
        rag_service = RAGService(db)
        
        # Process the query
        result = await rag_service.process_query(request.message, session_id)
        
        if result["success"]:
            return ChatResponse(
                response=result["response"],
                citations=result["citations"],
                session_id=result["session_id"],
                success=True
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "Erro interno do servidor")
            )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar mensagem: {str(e)}"
        )

@router.get("/history/{session_id}", response_model=ChatHistoryResponse)
async def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    """
    Get chat history for a session
    """
    try:
        rag_service = RAGService(db)
        messages = await rag_service.get_chat_history(session_id)
        
        return ChatHistoryResponse(
            messages=messages,
            session_id=session_id
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao recuperar histórico: {str(e)}"
        )

@router.delete("/session/{session_id}")
async def clear_session(session_id: str, db: Session = Depends(get_db)):
    """
    Clear a chat session
    """
    try:
        from models import ChatSession, ChatMessage
        
        # Delete messages
        db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
        ).delete()
        
        # Delete session
        db.query(ChatSession).filter(
            ChatSession.session_id == session_id
        ).delete()
        
        db.commit()
        
        return {"message": "Sessão removida com sucesso"}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao limpar sessão: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """
    Health check endpoint for chat service
    """
    return {"status": "healthy", "service": "chat"}
