import os
import shutil
import aiofiles
from fastapi import UploadFile, HTTPException
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session
import logging

from models import UploadedDocument, LegalDocument, DocumentEmbedding, User
from services.document_processor import DocumentProcessor

logger = logging.getLogger(__name__)

class DocumentUploadService:
    def __init__(self):
        self.supported_formats = ['.pdf', '.docx', '.txt']
        self.max_file_size = 50 * 1024 * 1024  # 50MB
        self.upload_dir = Path("uploads")
        self.processed_dir = Path("processed")
        self.processor = DocumentProcessor()
        
        # Criar diretórios se não existirem
        self.upload_dir.mkdir(exist_ok=True)
        self.processed_dir.mkdir(exist_ok=True)
    
    async def process_uploaded_file(
        self, 
        file: UploadFile, 
        metadata: Dict[str, Any],
        db: Session,
        user_id: int
    ) -> Dict[str, Any]:
        """
        Processa arquivo carregado completo:
        1. Valida formato e tamanho
        2. Salva arquivo temporário
        3. Extrai texto conforme formato
        4. Chunking inteligente
        5. Salva na base de dados
        """
        uploaded_doc = None
        temp_file_path = None
        
        try:
            # 1. Validar arquivo
            if not await self.validate_file(file):
                raise HTTPException(400, "Formato de arquivo não suportado ou arquivo muito grande")
            
            # 2. Criar registro na base de dados
            uploaded_doc = UploadedDocument(
                original_filename=file.filename,
                title=metadata['title'],
                law_type=metadata['law_type'],
                source=metadata['source'],
                description=metadata.get('description'),
                file_size=file.size,
                file_format=self._get_file_extension(file.filename),
                processing_status='processing',
                uploaded_by=user_id
            )
            
            db.add(uploaded_doc)
            db.commit()
            db.refresh(uploaded_doc)
            
            # 3. Salvar arquivo temporário
            temp_file_path = self.upload_dir / f"{uploaded_doc.id}_{file.filename}"
            await self._save_uploaded_file(file, temp_file_path)
            
            # 4. Extrair texto
            text_content = await self._extract_text_by_format(temp_file_path)
            
            if not text_content.strip():
                raise Exception("Não foi possível extrair texto do arquivo")
            
            # 5. Chunking inteligente
            chunks = self.processor.intelligent_chunking(
                text_content, 
                {
                    **metadata,
                    'uploaded_doc_id': uploaded_doc.id,
                    'original_filename': file.filename
                }
            )
            
            # 6. Salvar chunks na base de dados
            chunks_saved = await self._save_chunks_to_database(chunks, uploaded_doc.id, db)
            
            # 7. Atualizar status do documento
            uploaded_doc.processing_status = 'completed'
            uploaded_doc.processed_at = datetime.utcnow()
            uploaded_doc.chunks_count = len(chunks_saved)
            db.commit()
            
            # 8. Mover arquivo para pasta processados
            processed_file_path = self.processed_dir / f"{uploaded_doc.id}_{file.filename}"
            shutil.move(str(temp_file_path), str(processed_file_path))
            
            logger.info(f"Documento processado com sucesso: {uploaded_doc.id}, {len(chunks_saved)} chunks criados")
            
            return {
                "document_id": uploaded_doc.id,
                "chunks_count": len(chunks_saved),
                "status": "success",
                "processed_at": uploaded_doc.processed_at
            }
            
        except Exception as e:
            logger.error(f"Erro ao processar documento: {str(e)}")
            
            # Atualizar status de erro
            if uploaded_doc:
                uploaded_doc.processing_status = 'error'
                uploaded_doc.error_message = str(e)
                db.commit()
            
            # Limpar arquivo temporário
            if temp_file_path and temp_file_path.exists():
                temp_file_path.unlink()
            
            raise Exception(f"Erro ao processar documento: {str(e)}")
    
    async def validate_file(self, file: UploadFile) -> bool:
        """Validação de formato e tamanho"""
        if not file.filename:
            return False
            
        # Verificar extensão
        file_extension = self._get_file_extension(file.filename)
        if file_extension not in self.supported_formats:
            return False
        
        # Verificar tamanho
        if file.size and file.size > self.max_file_size:
            return False
            
        return True
    
    def _get_file_extension(self, filename: str) -> str:
        """Obtém extensão do arquivo"""
        return Path(filename).suffix.lower()
    
    async def _save_uploaded_file(self, file: UploadFile, file_path: Path):
        """Salva arquivo carregado no disco"""
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
    
    async def _extract_text_by_format(self, file_path: Path) -> str:
        """Extrai texto baseado no formato do arquivo"""
        file_extension = file_path.suffix.lower()
        
        if file_extension == '.pdf':
            return await self.processor.process_pdf(file_path)
        elif file_extension == '.docx':
            return await self.processor.process_docx(file_path)
        elif file_extension == '.txt':
            return await self.processor.process_txt(file_path)
        else:
            raise Exception(f"Formato não suportado: {file_extension}")
    
    async def _save_chunks_to_database(
        self, 
        chunks: List[Dict[str, Any]], 
        uploaded_doc_id: int,
        db: Session
    ) -> List[int]:
        """Salva chunks na base de dados"""
        saved_chunks = []
        
        for chunk in chunks:
            # Criar documento legal
            legal_doc = LegalDocument(
                title=f"{chunk['metadata']['title']} - Parte {chunk['chunk_index']}",
                content=chunk['text'],
                source=chunk['metadata']['source'],
                law_type=chunk['metadata']['law_type'],
                uploaded_doc_id=uploaded_doc_id,
                chunk_index=chunk['chunk_index'],
                processing_metadata=chunk['metadata']
            )
            
            db.add(legal_doc)
            db.commit()
            db.refresh(legal_doc)
            
            # Criar embedding (por enquanto vazio, pode ser implementado depois)
            embedding = DocumentEmbedding(
                document_id=legal_doc.id,
                chunk_text=chunk['text'],
                chunk_index=chunk['chunk_index'],
                embedding_vector={}  # Por enquanto vazio
            )
            
            db.add(embedding)
            saved_chunks.append(legal_doc.id)
        
        db.commit()
        return saved_chunks
    
    def get_uploaded_documents(self, db: Session, user_id: Optional[int] = None) -> List[UploadedDocument]:
        """Lista documentos carregados"""
        query = db.query(UploadedDocument)
        
        if user_id:
            query = query.filter(UploadedDocument.uploaded_by == user_id)
        
        return query.order_by(UploadedDocument.uploaded_at.desc()).all()
    
    def delete_document(self, db: Session, document_id: int, user_id: int) -> bool:
        """Remove documento e seus chunks"""
        try:
            # Buscar documento
            uploaded_doc = db.query(UploadedDocument).filter(
                UploadedDocument.id == document_id,
                UploadedDocument.uploaded_by == user_id
            ).first()
            
            if not uploaded_doc:
                return False
            
            # Remover chunks relacionados
            legal_docs = db.query(LegalDocument).filter(
                LegalDocument.uploaded_doc_id == document_id
            ).all()
            
            for legal_doc in legal_docs:
                # Remover embeddings
                db.query(DocumentEmbedding).filter(
                    DocumentEmbedding.document_id == legal_doc.id
                ).delete()
                
                # Remover documento legal
                db.delete(legal_doc)
            
            # Remover registro de upload
            db.delete(uploaded_doc)
            db.commit()
            
            # Remover arquivo físico se existir
            processed_file = self.processed_dir / f"{document_id}_{uploaded_doc.original_filename}"
            if processed_file.exists():
                processed_file.unlink()
            
            logger.info(f"Documento {document_id} removido com sucesso")
            return True
            
        except Exception as e:
            logger.error(f"Erro ao remover documento {document_id}: {str(e)}")
            db.rollback()
            return False
    
    def get_upload_statistics(self, db: Session) -> Dict[str, Any]:
        """Obtém estatísticas de uploads"""
        total_docs = db.query(UploadedDocument).count()
        completed_docs = db.query(UploadedDocument).filter(
            UploadedDocument.processing_status == 'completed'
        ).count()
        error_docs = db.query(UploadedDocument).filter(
            UploadedDocument.processing_status == 'error'
        ).count()
        processing_docs = db.query(UploadedDocument).filter(
            UploadedDocument.processing_status == 'processing'
        ).count()
        
        total_chunks = db.query(LegalDocument).filter(
            LegalDocument.uploaded_doc_id.isnot(None)
        ).count()
        
        return {
            "total_documents": total_docs,
            "completed_documents": completed_docs,
            "error_documents": error_docs,
            "processing_documents": processing_docs,
            "total_chunks": total_chunks,
            "success_rate": (completed_docs / total_docs * 100) if total_docs > 0 else 0
        }