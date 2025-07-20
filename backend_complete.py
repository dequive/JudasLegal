#!/usr/bin/env python3
"""
Judas Legal Assistant - Backend Completo
Sistema RAG para legislação moçambicana com Gemini AI
"""

import os
import json
import asyncio
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from pathlib import Path

# FastAPI imports
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError

# Database imports
import psycopg2
from psycopg2.extras import RealDictCursor
import sqlalchemy
from sqlalchemy import create_engine, text

# AI imports
import google.generativeai as genai

# Text processing imports
import re
import unicodedata
from pathlib import Path
import chardet

# Document processing imports
try:
    import PyPDF2
    import docx
    from docx import Document
except ImportError:
    PyPDF2 = None
    docx = None

# Import new legal system components - moved after logger setup
LEGAL_SYSTEM_AVAILABLE = False

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import new legal system components after logger setup
try:
    from models.legal_document_hierarchy import (
        LegalDocumentType, LegalArea, DocumentStatus, 
        LegalDocumentHierarchy, PRIORITY_DOCUMENTS
    )
    from services.legal_chunker import LegalChunker
    from services.document_ingestor import DocumentIngestor
    LEGAL_SYSTEM_AVAILABLE = True
    logger.info("✓ Sistema legal avançado carregado")
except ImportError as e:
    logger.warning(f"Componentes do sistema legal não disponíveis: {e}")
    LEGAL_SYSTEM_AVAILABLE = False

# Initialize Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("✓ Gemini AI configurado")
else:
    logger.warning("⚠️ GEMINI_API_KEY não configurada")

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

# Initialize FastAPI
app = FastAPI(
    title="Muzaia Legal Assistant API",
    description="Sistema RAG avançado para legislação moçambicana com IA especializada",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    citations: List[Dict[str, Any]]
    complexity: Dict[str, Any]
    session_id: str

class ComplexityRequest(BaseModel):
    text: str

class ComplexityResponse(BaseModel):
    level: str
    score: float
    description: str
    factors: List[str]

class DocumentUpload(BaseModel):
    title: str
    description: str
    law_type: str
    source: str

class HealthResponse(BaseModel):
    status: str
    gemini_configured: bool
    services: Dict[str, str]

# Database connection
def get_db_connection():
    """Get database connection"""
    try:
        return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")

# Initialize database tables
def init_database():
    """Initialize database tables"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Legal documents table - updated for advanced system
            cur.execute("""
                CREATE TABLE IF NOT EXISTS legal_documents (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(500) NOT NULL,
                    content TEXT NOT NULL,
                    law_type VARCHAR(100),
                    source VARCHAR(200),
                    description TEXT,
                    document_type INTEGER DEFAULT 2,
                    legal_area INTEGER DEFAULT 2,
                    full_text TEXT,
                    metadata JSONB,
                    original_filename VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Add new columns if they don't exist
            cur.execute("""
                ALTER TABLE legal_documents 
                ADD COLUMN IF NOT EXISTS document_type INTEGER DEFAULT 2,
                ADD COLUMN IF NOT EXISTS legal_area INTEGER DEFAULT 2,
                ADD COLUMN IF NOT EXISTS full_text TEXT,
                ADD COLUMN IF NOT EXISTS metadata JSONB,
                ADD COLUMN IF NOT EXISTS original_filename VARCHAR(255);
            """)
            
            # Ensure description column exists
            cur.execute("""
                ALTER TABLE legal_documents 
                ADD COLUMN IF NOT EXISTS description TEXT;
            """)
            
            # Document chunks table for RAG - updated for advanced system
            cur.execute("""
                CREATE TABLE IF NOT EXISTS document_chunks (
                    id SERIAL PRIMARY KEY,
                    document_id INTEGER REFERENCES legal_documents(id) ON DELETE CASCADE,
                    chunk_text TEXT NOT NULL,
                    chunk_index INTEGER,
                    section_type VARCHAR(100),
                    content TEXT,
                    metadata JSONB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Add content column if it doesn't exist
            cur.execute("""
                ALTER TABLE document_chunks 
                ADD COLUMN IF NOT EXISTS content TEXT;
            """)

            # Update content from chunk_text if content is null
            cur.execute("""
                UPDATE document_chunks 
                SET content = chunk_text 
                WHERE content IS NULL;
            """)
            
            # Chat sessions table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS chat_sessions (
                    id VARCHAR(100) PRIMARY KEY,
                    user_id VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            
            # Chat messages table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS chat_messages (
                    id SERIAL PRIMARY KEY,
                    session_id VARCHAR(100) REFERENCES chat_sessions(id) ON DELETE CASCADE,
                    role VARCHAR(20) NOT NULL,
                    content TEXT NOT NULL,
                    metadata JSONB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            
            # Create indexes for better performance
            cur.execute("CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON document_chunks(document_id);")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_chunks_text ON document_chunks USING gin(to_tsvector('portuguese', chunk_text));")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_messages_session ON chat_messages(session_id);")
            
            conn.commit()
            logger.info("✓ Database tables initialized")

# Text processing utilities
class TextProcessor:
    """Process and normalize Portuguese legal text"""
    
    @staticmethod
    def normalize_text(text: str) -> str:
        """Normalize Portuguese text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Normalize unicode
        text = unicodedata.normalize('NFKD', text)
        
        # Fix common encoding issues
        replacements = {
            'Ã§': 'ç', 'Ã ': 'à', 'Ã¡': 'á', 'Ã¢': 'â', 'Ã£': 'ã',
            'Ã©': 'é', 'Ãª': 'ê', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
            'Ã¼': 'ü', 'Ã±': 'ñ'
        }
        
        for bad, good in replacements.items():
            text = text.replace(bad, good)
        
        return text.strip()
    
    @staticmethod
    def chunk_legal_text(text: str, max_chunk_size: int = 1000) -> List[Dict[str, Any]]:
        """Chunk legal text respecting structure"""
        text = TextProcessor.normalize_text(text)
        chunks = []
        
        # Split by legal sections
        sections = re.split(r'(?=(?:ARTIGO|CAPÍTULO|SECÇÃO|TÍTULO)\s+\d+)', text, flags=re.IGNORECASE)
        
        chunk_index = 0
        for section in sections:
            if not section.strip():
                continue
                
            # Detect section type
            section_type = "paragraph"
            if re.match(r'ARTIGO\s+\d+', section, re.IGNORECASE):
                section_type = "article"
            elif re.match(r'CAPÍTULO\s+\d+', section, re.IGNORECASE):
                section_type = "chapter"
            elif re.match(r'SECÇÃO\s+\d+', section, re.IGNORECASE):
                section_type = "section"
            elif re.match(r'TÍTULO\s+\d+', section, re.IGNORECASE):
                section_type = "title"
            
            # Further split if section is too large
            if len(section) > max_chunk_size:
                subsections = re.split(r'(?=\d+\.|\n\n)', section)
                for subsection in subsections:
                    if subsection.strip() and len(subsection) > 50:
                        chunks.append({
                            "text": subsection.strip(),
                            "index": chunk_index,
                            "section_type": section_type,
                            "metadata": {
                                "length": len(subsection),
                                "word_count": len(subsection.split())
                            }
                        })
                        chunk_index += 1
            else:
                if section.strip() and len(section) > 50:
                    chunks.append({
                        "text": section.strip(),
                        "index": chunk_index,
                        "section_type": section_type,
                        "metadata": {
                            "length": len(section),
                            "word_count": len(section.split())
                        }
                    })
                    chunk_index += 1
        
        return chunks

# Document processing utilities
class DocumentProcessor:
    """Process uploaded documents"""
    
    @staticmethod
    def detect_encoding(file_content: bytes) -> str:
        """Detect file encoding"""
        result = chardet.detect(file_content)
        return result['encoding'] or 'utf-8'
    
    @staticmethod
    def extract_text_from_pdf(file_content: bytes) -> str:
        """Extract text from PDF"""
        if not PyPDF2:
            raise ValueError("PyPDF2 not available for PDF processing")
        
        import io
        pdf_file = io.BytesIO(file_content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        return text
    
    @staticmethod
    def extract_text_from_docx(file_content: bytes) -> str:
        """Extract text from DOCX"""
        if not docx:
            raise ValueError("python-docx not available for DOCX processing")
        
        import io
        doc_file = io.BytesIO(file_content)
        doc = Document(doc_file)
        
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        
        return text
    
    @staticmethod
    def extract_text_from_txt(file_content: bytes) -> str:
        """Extract text from TXT"""
        encoding = DocumentProcessor.detect_encoding(file_content)
        return file_content.decode(encoding)

# Complexity analysis service
class ComplexityService:
    """Analyze legal text complexity"""
    
    LEGAL_TERMS = {
        'direito_civil': ['obrigação', 'contrato', 'propriedade', 'posse', 'usufructo'],
        'direito_penal': ['crime', 'pena', 'sanção', 'culpabilidade', 'dolo'],
        'direito_trabalho': ['contrato de trabalho', 'salário', 'despedimento', 'sindicato'],
        'direito_comercial': ['sociedade', 'empresa', 'comerciante', 'firma', 'registo'],
        'direito_administrativo': ['acto administrativo', 'funcionário público', 'serviço público']
    }
    
    @staticmethod
    def analyze_complexity(text: str) -> Dict[str, Any]:
        """Analyze text complexity"""
        text_lower = text.lower()
        
        # Count legal terms
        legal_term_count = 0
        found_categories = []
        
        for category, terms in ComplexityService.LEGAL_TERMS.items():
            category_count = sum(1 for term in terms if term in text_lower)
            if category_count > 0:
                legal_term_count += category_count
                found_categories.append(category)
        
        # Basic metrics
        word_count = len(text.split())
        sentence_count = len(re.split(r'[.!?]+', text))
        avg_sentence_length = word_count / max(sentence_count, 1)
        
        # Complexity factors
        factors = []
        score = 0
        
        # Length factor
        if word_count > 200:
            factors.append("Texto extenso")
            score += 0.3
        
        # Legal terminology density
        if legal_term_count > 3:
            factors.append("Muitos termos jurídicos especializados")
            score += 0.4
        
        # Sentence complexity
        if avg_sentence_length > 20:
            factors.append("Frases longas e complexas")
            score += 0.2
        
        # Multiple legal areas
        if len(found_categories) > 2:
            factors.append("Múltiplas áreas do direito")
            score += 0.3
        
        # Determine level
        if score >= 0.7:
            level = "Muito Complexo"
            emoji = "🔴"
        elif score >= 0.5:
            level = "Complexo"
            emoji = "🟠"
        elif score >= 0.3:
            level = "Moderado"
            emoji = "🟡"
        else:
            level = "Simples"
            emoji = "🟢"
        
        return {
            "level": f"{emoji} {level}",
            "score": min(score, 1.0),
            "description": f"Análise baseada em {word_count} palavras, {legal_term_count} termos jurídicos",
            "factors": factors,
            "categories": found_categories
        }

# RAG Service
class RAGService:
    """Retrieval-Augmented Generation service"""
    
    @staticmethod
    def search_relevant_documents(query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search for relevant document chunks"""
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Use PostgreSQL full-text search
                search_query = """
                    SELECT 
                        dc.chunk_text,
                        dc.section_type,
                        dc.metadata,
                        ld.title,
                        ld.law_type,
                        ld.source,
                        ts_rank(to_tsvector('portuguese', dc.chunk_text), plainto_tsquery('portuguese', %s)) as relevance
                    FROM document_chunks dc
                    JOIN legal_documents ld ON dc.document_id = ld.id
                    WHERE to_tsvector('portuguese', dc.chunk_text) @@ plainto_tsquery('portuguese', %s)
                    ORDER BY relevance DESC
                    LIMIT %s;
                """
                
                cur.execute(search_query, (query, query, limit))
                results = cur.fetchall()
                
                citations = []
                for row in results:
                    citations.append({
                        "text": row['chunk_text'][:300] + "..." if len(row['chunk_text']) > 300 else row['chunk_text'],
                        "source": row['title'],
                        "law_type": row['law_type'],
                        "section_type": row['section_type'],
                        "relevance": float(row['relevance']),
                        "full_source": row['source']
                    })
                
                return citations

# Gemini Service
class GeminiService:
    """Google Gemini AI service"""
    
    @staticmethod
    async def generate_response(query: str, context: List[Dict[str, Any]]) -> str:
        """Generate response using Gemini with context"""
        if not GEMINI_API_KEY:
            return "Serviço de IA temporariamente indisponível. Configuração pendente."
        
        try:
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
            
            # Build context from citations
            context_text = ""
            if context:
                context_text = "\n\nDocumentos de referência:\n"
                for i, doc in enumerate(context, 1):
                    context_text += f"{i}. {doc['source']} - {doc['text'][:200]}...\n"
            
            prompt = f"""
            Vós sois um assistente jurídico especializado na legislação moçambicana. 
            Responde em português europeu (usando "vós/vossa" em vez de "você/sua").
            
            Pergunta do utilizador: {query}
            
            {context_text}
            
            Instruções:
            1. Responde de forma clara e profissional
            2. Cita sempre as fontes quando disponíveis
            3. Usa terminologia jurídica moçambicana apropriada
            4. Se não tiveres informação suficiente, diz claramente
            5. Estrutura a resposta de forma organizada
            
            Resposta:
            """
            
            response = await asyncio.to_thread(model.generate_content, prompt)
            return response.text
            
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return f"Erro ao processar consulta: {str(e)}"

# API Routes
@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        gemini_configured=bool(GEMINI_API_KEY),
        services={
            "api": "running",
            "ai": "available" if GEMINI_API_KEY else "not_configured"
        }
    )

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatMessage):
    """Main chat endpoint with RAG"""
    try:
        # Create or get session
        import uuid
        session_id = request.session_id or str(uuid.uuid4())
        
        # Search for relevant documents
        citations = RAGService.search_relevant_documents(request.message)
        
        # Generate AI response
        ai_response = await GeminiService.generate_response(request.message, citations)
        
        # Analyze complexity
        complexity = ComplexityService.analyze_complexity(request.message)
        
        # Store message in database
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Ensure session exists
                cur.execute("""
                    INSERT INTO chat_sessions (id, user_id) VALUES (%s, %s) 
                    ON CONFLICT (id) DO NOTHING
                """, (session_id, 'anonymous'))
                
                # Store user message
                cur.execute("""
                    INSERT INTO chat_messages (session_id, role, content, metadata)
                    VALUES (%s, %s, %s, %s)
                """, (session_id, 'user', request.message, json.dumps(complexity)))
                
                # Store AI response
                cur.execute("""
                    INSERT INTO chat_messages (session_id, role, content, metadata)
                    VALUES (%s, %s, %s, %s)
                """, (session_id, 'assistant', ai_response, json.dumps({"citations": len(citations)})))
                
                conn.commit()
        
        return ChatResponse(
            response=ai_response,
            citations=citations,
            complexity=complexity,
            session_id=session_id
        )
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/complexity", response_model=ComplexityResponse)
async def analyze_complexity_endpoint(request: ComplexityRequest):
    """Analyze text complexity"""
    try:
        result = ComplexityService.analyze_complexity(request.text)
        return ComplexityResponse(**result)
    except Exception as e:
        logger.error(f"Complexity analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/upload-document")
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(...),
    law_type: str = Form(...),
    source: str = Form(...)
):
    """Upload and process legal document"""
    try:
        # Validate file type
        allowed_types = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Tipo de arquivo não suportado")
        
        # Read file content
        file_content = await file.read()
        
        # Extract text based on file type
        if file.content_type == 'application/pdf':
            text = DocumentProcessor.extract_text_from_pdf(file_content)
        elif file.content_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            text = DocumentProcessor.extract_text_from_docx(file_content)
        else:  # text/plain
            text = DocumentProcessor.extract_text_from_txt(file_content)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Não foi possível extrair texto do documento")
        
        # Process and chunk text
        chunks = TextProcessor.chunk_legal_text(text)
        
        if not chunks:
            raise HTTPException(status_code=400, detail="Documento não produziu chunks válidos")
        
        # Store in database
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Insert document
                cur.execute("""
                    INSERT INTO legal_documents (title, content, law_type, source)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id
                """, (title, text, law_type, source))
                
                document_id = cur.fetchone()['id']
                
                # Insert chunks
                for chunk in chunks:
                    cur.execute("""
                        INSERT INTO document_chunks (document_id, chunk_text, chunk_index, section_type, metadata)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (
                        document_id,
                        chunk['text'],
                        chunk['index'],
                        chunk['section_type'],
                        json.dumps(chunk['metadata'])
                    ))
                
                conn.commit()
        
        return {
            "message": "Documento carregado com sucesso",
            "document_id": document_id,
            "chunks_created": len(chunks),
            "text_length": len(text)
        }
        
    except Exception as e:
        logger.error(f"Document upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/documents")
async def list_documents():
    """List all uploaded documents"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT 
                        ld.id,
                        ld.title,
                        ld.law_type,
                        ld.source,
                        ld.created_at,
                        COUNT(dc.id) as chunk_count
                    FROM legal_documents ld
                    LEFT JOIN document_chunks dc ON ld.id = dc.document_id
                    GROUP BY ld.id, ld.title, ld.law_type, ld.source, ld.created_at
                    ORDER BY ld.created_at DESC
                """)
                
                documents = cur.fetchall()
                return {"documents": [dict(doc) for doc in documents]}
                
    except Exception as e:
        logger.error(f"List documents error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/stats")
async def get_stats():
    """Get system statistics"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Count documents
                cur.execute("SELECT COUNT(*) as count FROM legal_documents")
                doc_count = cur.fetchone()['count']
                
                # Count chunks
                cur.execute("SELECT COUNT(*) as count FROM document_chunks")
                chunk_count = cur.fetchone()['count']
                
                # Count chat sessions
                cur.execute("SELECT COUNT(*) as count FROM chat_sessions")
                session_count = cur.fetchone()['count']
                
                # Count messages
                cur.execute("SELECT COUNT(*) as count FROM chat_messages")
                message_count = cur.fetchone()['count']
                
                return {
                    "documents": doc_count,
                    "chunks": chunk_count,
                    "chat_sessions": session_count,
                    "messages": message_count,
                    "ai_status": "configured" if GEMINI_API_KEY else "not_configured"
                }
                
    except Exception as e:
        logger.error(f"Stats error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/documents/{document_id}")
async def delete_document(document_id: int):
    """Delete a document and its chunks"""
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # Check if document exists
                cur.execute("SELECT id FROM legal_documents WHERE id = %s", (document_id,))
                if not cur.fetchone():
                    raise HTTPException(status_code=404, detail="Documento não encontrado")
                
                # Delete document (chunks will be deleted automatically due to CASCADE)
                cur.execute("DELETE FROM legal_documents WHERE id = %s", (document_id,))
                conn.commit()
                
                return {"message": "Documento removido com sucesso"}
                
    except Exception as e:
        logger.error(f"Delete document error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Initialize database on startup
# Advanced Legal System APIs
@app.get("/api/legal/hierarchy")
async def get_legal_hierarchy():
    """Obter informações sobre hierarquia de documentos legais"""
    if not LEGAL_SYSTEM_AVAILABLE:
        raise HTTPException(status_code=503, detail="Sistema legal avançado não disponível")
    
    return {
        "document_types": {str(t.value): LegalDocumentHierarchy.get_type_name(t) for t in LegalDocumentType},
        "legal_areas": {str(a.value): LegalDocumentHierarchy.get_area_name(a) for a in LegalArea},
        "priority_documents": PRIORITY_DOCUMENTS,
        "hierarchy_levels": {
            "1": "Constituição (Autoridade máxima)",
            "2": "Leis ordinárias",
            "3": "Decretos-Lei",
            "4": "Decretos",
            "5": "Regulamentos",
            "6-10": "Portarias e outros diplomas"
        }
    }

@app.post("/api/legal/upload-advanced")
async def upload_document_advanced(
    file: UploadFile = File(...),
    title: str = Form(...),
    document_type: Optional[int] = Form(None),
    legal_area: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    source: Optional[str] = Form(None)
):
    """Upload e processamento avançado de documento legal"""
    if not LEGAL_SYSTEM_AVAILABLE:
        raise HTTPException(status_code=503, detail="Sistema legal avançado não disponível")
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="Nome do arquivo é obrigatório")
    
    # Verificar tipo de arquivo
    allowed_extensions = ['.pdf', '.docx', '.txt']
    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Tipo de arquivo não suportado. Use: {', '.join(allowed_extensions)}")
    
    try:
        # Salvar arquivo temporário
        upload_dir = Path("uploads")
        upload_dir.mkdir(exist_ok=True)
        
        temp_file_path = upload_dir / f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
        
        with open(temp_file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Processar com sistema avançado
        ingestor = DocumentIngestor(get_db_connection)
        
        override_metadata = {}
        if document_type:
            override_metadata['document_type'] = document_type
        if legal_area:
            override_metadata['legal_area'] = legal_area
        if description:
            override_metadata['description'] = description
        if source:
            override_metadata['source'] = source
        
        result = ingestor.process_document(
            str(temp_file_path),
            file.filename,
            override_metadata if override_metadata else None
        )
        
        # Remover arquivo temporário
        temp_file_path.unlink()
        
        if result['success']:
            return {
                "message": "Documento processado com sucesso",
                "document_id": result['document_id'],
                "title": result['title'],
                "chunks_created": result['chunks_created'],
                "metadata": result['metadata'],
                "processing_info": {
                    "chunking_method": "legal_structure",
                    "legal_concepts_extracted": len(result['metadata'].get('keywords', [])),
                    "document_type": LegalDocumentHierarchy.get_type_name(LegalDocumentType(result['metadata']['document_type'])),
                    "legal_area": LegalDocumentHierarchy.get_area_name(LegalArea(result['metadata']['legal_area']))
                }
            }
        else:
            raise HTTPException(status_code=500, detail=f"Erro no processamento: {result['error']}")
    
    except Exception as e:
        logger.error(f"Erro no upload avançado: {e}")
        if temp_file_path.exists():
            temp_file_path.unlink()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/legal/documents-advanced")
async def list_documents_advanced():
    """Listar documentos com informações detalhadas da hierarquia"""
    if not LEGAL_SYSTEM_AVAILABLE:
        raise HTTPException(status_code=503, detail="Sistema legal avançado não disponível")
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT 
                        ld.id,
                        ld.title,
                        ld.metadata->>'document_type' as document_type,
                        ld.metadata->>'legal_area' as legal_area,
                        ld.metadata->>'publication_date' as publication_date,
                        ld.metadata->>'status' as status,
                        ld.created_at,
                        COUNT(dc.id) as chunk_count,
                        ld.metadata->>'keywords' as keywords
                    FROM legal_documents ld
                    LEFT JOIN document_chunks dc ON ld.id = dc.document_id
                    WHERE ld.metadata IS NOT NULL
                    GROUP BY ld.id, ld.title, ld.metadata, ld.created_at
                    ORDER BY 
                        CAST(ld.metadata->>'document_type' AS INTEGER) ASC,
                        ld.created_at DESC
                """)
                
                documents = []
                for row in cur.fetchall():
                    doc_type_id = int(row['document_type']) if row['document_type'] else 2
                    legal_area_id = int(row['legal_area']) if row['legal_area'] else 2
                    
                    documents.append({
                        'id': row['id'],
                        'title': row['title'],
                        'document_type': {
                            'id': doc_type_id,
                            'name': LegalDocumentHierarchy.get_type_name(LegalDocumentType(doc_type_id)),
                            'hierarchy_level': doc_type_id
                        },
                        'legal_area': {
                            'id': legal_area_id,
                            'name': LegalDocumentHierarchy.get_area_name(LegalArea(legal_area_id))
                        },
                        'publication_date': row['publication_date'],
                        'status': row['status'] or 'active',
                        'chunk_count': row['chunk_count'],
                        'keywords': json.loads(row['keywords']) if row['keywords'] else [],
                        'created_at': row['created_at'].isoformat() if row['created_at'] else None
                    })
                
                return {
                    "documents": documents,
                    "total_count": len(documents),
                    "document_types_summary": {},
                    "legal_areas_summary": {}
                }
                
    except Exception as e:
        logger.error(f"Erro ao listar documentos avançados: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/legal/processing-stats")
async def get_processing_statistics():
    """Obter estatísticas detalhadas do processamento de documentos"""
    if not LEGAL_SYSTEM_AVAILABLE:
        raise HTTPException(status_code=503, detail="Sistema legal avançado não disponível")
    
    try:
        ingestor = DocumentIngestor(get_db_connection)
        stats = ingestor.get_processing_statistics()
        
        # Enriquecer estatísticas com nomes legíveis
        if 'documents_by_type' in stats:
            enriched_types = {}
            for type_id, count in stats['documents_by_type'].items():
                try:
                    type_name = LegalDocumentHierarchy.get_type_name(LegalDocumentType(int(type_id)))
                    enriched_types[type_name] = count
                except:
                    enriched_types[f"Tipo {type_id}"] = count
            stats['documents_by_type_names'] = enriched_types
        
        if 'documents_by_area' in stats:
            enriched_areas = {}
            for area_id, count in stats['documents_by_area'].items():
                try:
                    area_name = LegalDocumentHierarchy.get_area_name(LegalArea(int(area_id)))
                    enriched_areas[area_name] = count
                except:
                    enriched_areas[f"Área {area_id}"] = count
            stats['documents_by_area_names'] = enriched_areas
        
        return stats
        
    except Exception as e:
        logger.error(f"Erro ao obter estatísticas: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint - redirect to health"""
    return {
        "message": "Muzaia Legal Assistant API",
        "version": "2.0.0",
        "status": "online",
        "endpoints": {
            "health": "/health",
            "chat": "/api/chat",
            "upload": "/api/upload",
            "legal_hierarchy": "/api/legal/hierarchy"
        }
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Muzaia Backend",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
        "database": "connected",
        "ai": "configured" if GEMINI_API_KEY else "not_configured",
        "legal_system": "available" if LEGAL_SYSTEM_AVAILABLE else "not_available",
        "features": {
            "basic_rag": True,
            "advanced_chunking": LEGAL_SYSTEM_AVAILABLE,
            "legal_hierarchy": LEGAL_SYSTEM_AVAILABLE,
            "document_processing": LEGAL_SYSTEM_AVAILABLE
        }
    }

@app.on_event("startup")
async def startup_event():
    """Initialize the application"""
    logger.info("🚀 Iniciando Muzaia Backend")
    init_database()
    logger.info("✓ Sistema pronto para uso")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv('PORT', 8000))
    uvicorn.run("backend_complete:app", host="0.0.0.0", port=port, reload=True)