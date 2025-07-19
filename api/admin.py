from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import logging

from database.connection import get_database
from models import UploadedDocument, LegalDocument, User
from middleware.auth_middleware import verify_admin_token, get_current_user
from services.file_upload_service import DocumentUploadService

router = APIRouter(prefix="/admin", tags=["admin"])
security = HTTPBearer()
logger = logging.getLogger(__name__)

# Inicializar serviços
upload_service = DocumentUploadService()

# get_database já importado de database.connection

class DocumentListResponse(BaseModel):
    id: int
    title: str
    law_type: str
    source: str
    processing_status: str
    chunks_count: int
    uploaded_at: str
    uploaded_by_username: str
    file_size: Optional[int]
    original_filename: str

class UploadStatsResponse(BaseModel):
    total_documents: int
    completed_documents: int
    error_documents: int
    processing_documents: int
    total_chunks: int
    success_rate: float

@router.post("/upload-document")
async def upload_legal_document(
    file: UploadFile = File(...),
    title: str = Form(...),
    law_type: str = Form(...),
    source: str = Form(...),
    description: Optional[str] = Form(None),
    current_user: dict = Depends(verify_admin_token),
    db: Session = Depends(get_database)
):
    """
    Upload de documento legal com processamento completo:
    - Validação de arquivo
    - Extração de texto
    - Chunking inteligente  
    - Salvamento na BD
    """
    
    try:
        logger.info(f"Iniciando upload de documento: {file.filename} por usuário {current_user['user_id']}")
        
        # Validar parâmetros
        if not title.strip():
            raise HTTPException(400, "Título é obrigatório")
        if not law_type.strip():
            raise HTTPException(400, "Tipo de lei é obrigatório")
        if not source.strip():
            raise HTTPException(400, "Fonte é obrigatória")
        
        # Processar documento
        result = await upload_service.process_uploaded_file(
            file=file,
            metadata={
                "title": title.strip(),
                "law_type": law_type.strip(),
                "source": source.strip(),
                "description": description.strip() if description else None
            },
            db=db,
            user_id=current_user["user_id"]
        )
        
        logger.info(f"Documento processado com sucesso: ID {result['document_id']}, {result['chunks_count']} chunks")
        
        return {
            "status": "success",
            "document_id": result["document_id"],
            "chunks_created": result["chunks_count"],
            "message": f"Documento '{title}' processado com sucesso",
            "processed_at": result["processed_at"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao processar documento {file.filename}: {str(e)}")
        raise HTTPException(500, f"Erro ao processar documento: {str(e)}")

@router.get("/documents", response_model=List[DocumentListResponse])
async def list_uploaded_documents(
    current_user: dict = Depends(verify_admin_token),
    db: Session = Depends(get_database),
    limit: int = 50,
    offset: int = 0
):
    """Lista todos os documentos carregados com paginação"""
    
    try:
        # Buscar documentos com informações do usuário
        query = db.query(UploadedDocument, User).join(
            User, UploadedDocument.uploaded_by == User.id
        ).order_by(UploadedDocument.uploaded_at.desc())
        
        documents = query.offset(offset).limit(limit).all()
        
        result = []
        for uploaded_doc, user in documents:
            result.append(DocumentListResponse(
                id=uploaded_doc.id,
                title=uploaded_doc.title,
                law_type=uploaded_doc.law_type,
                source=uploaded_doc.source,
                processing_status=uploaded_doc.processing_status,
                chunks_count=uploaded_doc.chunks_count,
                uploaded_at=uploaded_doc.uploaded_at.isoformat(),
                uploaded_by_username=user.username,
                file_size=uploaded_doc.file_size,
                original_filename=uploaded_doc.original_filename
            ))
        
        return result
        
    except Exception as e:
        logger.error(f"Erro ao listar documentos: {str(e)}")
        raise HTTPException(500, f"Erro ao listar documentos: {str(e)}")

@router.get("/documents/{document_id}")
async def get_document_details(
    document_id: int,
    current_user: dict = Depends(verify_admin_token),
    db: Session = Depends(get_database)
):
    """Obtém detalhes completos de um documento"""
    
    try:
        # Buscar documento
        uploaded_doc = db.query(UploadedDocument).filter(
            UploadedDocument.id == document_id
        ).first()
        
        if not uploaded_doc:
            raise HTTPException(404, "Documento não encontrado")
        
        # Buscar usuário que fez upload
        user = db.query(User).filter(User.id == uploaded_doc.uploaded_by).first()
        
        # Buscar chunks relacionados
        chunks = db.query(LegalDocument).filter(
            LegalDocument.uploaded_doc_id == document_id
        ).order_by(LegalDocument.chunk_index).all()
        
        return {
            "document": {
                "id": uploaded_doc.id,
                "title": uploaded_doc.title,
                "law_type": uploaded_doc.law_type,
                "source": uploaded_doc.source,
                "description": uploaded_doc.description,
                "original_filename": uploaded_doc.original_filename,
                "file_size": uploaded_doc.file_size,
                "file_format": uploaded_doc.file_format,
                "processing_status": uploaded_doc.processing_status,
                "uploaded_at": uploaded_doc.uploaded_at,
                "processed_at": uploaded_doc.processed_at,
                "chunks_count": uploaded_doc.chunks_count,
                "error_message": uploaded_doc.error_message,
                "uploaded_by": user.username if user else "Usuário removido"
            },
            "chunks": [
                {
                    "id": chunk.id,
                    "title": chunk.title,
                    "content_preview": chunk.content[:200] + "..." if len(chunk.content) > 200 else chunk.content,
                    "chunk_index": chunk.chunk_index,
                    "created_at": chunk.created_at
                }
                for chunk in chunks
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao obter detalhes do documento {document_id}: {str(e)}")
        raise HTTPException(500, f"Erro ao obter detalhes: {str(e)}")

@router.delete("/documents/{document_id}")
async def delete_document(
    document_id: int,
    current_user: dict = Depends(verify_admin_token),
    db: Session = Depends(get_database)
):
    """Remove documento e seus embeddings"""
    
    try:
        success = upload_service.delete_document(db, document_id, current_user["user_id"])
        
        if not success:
            raise HTTPException(404, "Documento não encontrado ou sem permissão para remover")
        
        return {
            "status": "success",
            "message": f"Documento {document_id} removido com sucesso"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao remover documento {document_id}: {str(e)}")
        raise HTTPException(500, f"Erro ao remover documento: {str(e)}")

@router.post("/reprocess-document/{document_id}")
async def reprocess_document(
    document_id: int,
    current_user: dict = Depends(verify_admin_token),
    db: Session = Depends(get_database)
):
    """Reprocessa documento existente com novos parâmetros"""
    
    try:
        # Buscar documento
        uploaded_doc = db.query(UploadedDocument).filter(
            UploadedDocument.id == document_id
        ).first()
        
        if not uploaded_doc:
            raise HTTPException(404, "Documento não encontrado")
        
        # Por enquanto, apenas marcar para reprocessamento
        uploaded_doc.processing_status = 'pending'
        uploaded_doc.processed_at = None
        uploaded_doc.error_message = None
        db.commit()
        
        return {
            "status": "success",
            "message": f"Documento {document_id} marcado para reprocessamento",
            "note": "Funcionalidade de reprocessamento será implementada em breve"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao reprocessar documento {document_id}: {str(e)}")
        raise HTTPException(500, f"Erro ao reprocessar documento: {str(e)}")

@router.get("/stats", response_model=UploadStatsResponse)
async def get_upload_statistics(
    current_user: dict = Depends(verify_admin_token),
    db: Session = Depends(get_database)
):
    """Obtém estatísticas de uploads"""
    
    try:
        stats = upload_service.get_upload_statistics(db)
        return UploadStatsResponse(**stats)
        
    except Exception as e:
        logger.error(f"Erro ao obter estatísticas: {str(e)}")
        raise HTTPException(500, f"Erro ao obter estatísticas: {str(e)}")

@router.get("/users")
async def list_users(
    current_user: dict = Depends(verify_admin_token),
    db: Session = Depends(get_database)
):
    """Lista todos os usuários (apenas para admins)"""
    
    try:
        users = db.query(User).order_by(User.created_at.desc()).all()
        
        return [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role.value,
                "is_active": user.is_active,
                "created_at": user.created_at,
                "last_login": user.last_login,
                "documents_uploaded": len(user.uploaded_documents)
            }
            for user in users
        ]
        
    except Exception as e:
        logger.error(f"Erro ao listar usuários: {str(e)}")
        raise HTTPException(500, f"Erro ao listar usuários: {str(e)}")