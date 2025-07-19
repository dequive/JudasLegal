from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from models import Base

class UserRole(enum.Enum):
    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    USER = "user"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
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
    uploaded_by = Column(Integer, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    processed_at = Column(DateTime)
    chunks_count = Column(Integer, default=0)
    error_message = Column(Text)
    
    # Relationship com user
    uploaded_by_user = relationship("User", back_populates="uploaded_documents")