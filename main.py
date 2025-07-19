import os
import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
import httpx
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.ext.declarative import declarative_base
from contextlib import asynccontextmanager

# Import models and services
from models import Base, LegalDocument, ChatSession, DocumentEmbedding, User, UploadedDocument
from api.chat import router as chat_router
from api.auth import router as auth_router
from api.admin import router as admin_router
from database.init_data import initialize_legal_documents

# Database setup
from database.connection import engine, SessionLocal

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up...")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Initialize legal documents
    db = SessionLocal()
    try:
        await initialize_legal_documents(db)
    finally:
        db.close()
    
    yield
    
    # Shutdown
    print("Shutting down...")

# FastAPI app
app = FastAPI(
    title="Judas Legal Assistant API",
    description="RAG-powered legal chatbot for Mozambican law",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(admin_router, prefix="/api", tags=["admin"])

@app.get("/")
def root():
    """Simple root endpoint for health checks - synchronous for speed"""
    return {"status": "ok", "service": "judas-legal-api"}

@app.get("/health")
def health_check():
    """Fast health check endpoint"""
    return {"status": "healthy", "service": "judas-legal-api"}

# Auth proxy routes
@app.get("/api/login")
async def proxy_login(request: Request):
    """Proxy login to auth server"""
    return RedirectResponse(url="http://localhost:3001/api/login", status_code=302)

@app.get("/api/logout")
async def proxy_logout(request: Request):
    """Proxy logout to auth server"""
    return RedirectResponse(url="http://localhost:3001/api/logout", status_code=302)

@app.get("/api/callback")
async def proxy_callback(request: Request):
    """Proxy auth callback to auth server"""
    query_string = str(request.url.query)
    callback_url = f"http://localhost:3001/api/callback?{query_string}" if query_string else "http://localhost:3001/api/callback"
    return RedirectResponse(url=callback_url, status_code=302)

@app.get("/api/auth/user")
async def proxy_auth_user(request: Request):
    """Proxy user info from auth server"""
    try:
        async with httpx.AsyncClient() as client:
            # Forward cookies and headers
            headers = dict(request.headers)
            cookies = dict(request.cookies)
            
            response = await client.get(
                "http://localhost:3001/api/auth/user",
                headers=headers,
                cookies=cookies
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return JSONResponse(
                    status_code=response.status_code,
                    content={"message": "Not authenticated"}
                )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": "Auth service unavailable"}
        )

@app.get("/api/status")
async def api_status():
    try:
        # Test database connection
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        
        return {
            "status": "healthy",
            "database": "connected",
            "message": "All systems operational"
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "database": "disconnected",
                "message": f"Database error: {str(e)}"
            }
        )

if __name__ == "__main__":
    # Always use port 80 for deployment
    port = int(os.getenv("PORT", 80))
    
    uvicorn.run(
        app,  # Direct app reference instead of string
        host="0.0.0.0",
        port=port,
        reload=False,  # No reload in production
        workers=1,
        access_log=True,
        log_level="info"
    )
