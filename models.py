from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, JSON, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

Base = declarative_base()

class UserRole(enum.Enum):
    SUPERADMIN = "SUPERADMIN"
    ADMIN = "ADMIN"
    USER = "USER"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    last_login = Column(DateTime)
    
    # Relationship com uploads
    uploaded_documents = relationship("UploadedDocument", back_populates="uploaded_by_user")

class UploadedDocument(Base):
    __tablename__ = "uploaded_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    original_filename = Column(String(255), nullable=False)
    title = Column(String(500), nullable=False)
    law_type = Column(String(100), nullable=False)
    source = Column(String(200), nullable=False)
    description = Column(Text)
    file_size = Column(Integer)
    file_format = Column(String(10))
    processing_status = Column(String(20), default='pending')
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    uploaded_at = Column(DateTime, default=func.now(), nullable=False)
    processed_at = Column(DateTime)
    chunks_count = Column(Integer, default=0)
    error_message = Column(Text)
    
    # Relationship com user
    uploaded_by_user = relationship("User", back_populates="uploaded_documents")

class LegalDocument(Base):
    __tablename__ = "legal_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    source = Column(String(200))
    law_type = Column(String(100))
    article_number = Column(String(50))
    language = Column(String(10), default="pt")
    uploaded_doc_id = Column(Integer, ForeignKey("uploaded_documents.id"))
    chunk_index = Column(Integer, default=0)
    processing_metadata = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    embeddings = relationship("DocumentEmbedding", back_populates="document")
    uploaded_document = relationship("UploadedDocument")

class DocumentEmbedding(Base):
    __tablename__ = "document_embeddings"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("legal_documents.id"))
    chunk_text = Column(Text, nullable=False)
    chunk_index = Column(Integer)
    embedding_vector = Column(JSON)  # Store as JSON for now (simplified)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    document = relationship("LegalDocument", back_populates="embeddings")

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), unique=True, index=True)
    user_id = Column(String(255))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    messages = relationship("ChatMessage", back_populates="session")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), ForeignKey("chat_sessions.session_id"))
    role = Column(String(50))  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    citations = Column(JSON)  # Store citations as JSON
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    session = relationship("ChatSession", back_populates="messages")
