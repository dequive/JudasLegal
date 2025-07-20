from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import os
import re

app = FastAPI(title="Muzaia Legal Assistant API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://0.0.0.0:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash-preview')

# Data models
class ChatMessage(BaseModel):
    text: str

class ComplexityRating(BaseModel):
    level: int
    emoji: str
    label: str
    color: str

class Citation(BaseModel):
    title: str
    source: str
    relevance: float

class ChatResponse(BaseModel):
    text: str
    citations: List[Citation]
    complexity: ComplexityRating

# Legal complexity rating system
def get_complexity_rating(text: str) -> ComplexityRating:
    legal_terms = [
        'constituição', 'código civil', 'código penal', 'código comercial',
        'habeas corpus', 'mandado de segurança', 'usucapião', 'prescrição',
        'jurisprudência', 'acórdão', 'recurso', 'apelação', 'cassação',
        'responsabilidade civil', 'danos morais', 'indenização',
        'contrato', 'obrigação', 'direito real', 'propriedade',
        'sucessão', 'herança', 'testamento', 'inventário',
        'processo civil', 'processo penal', 'processo administrativo'
    ]
    
    complex_words = [
        'interpretação', 'aplicação', 'competência', 'jurisdição',
        'legitimidade', 'interesse processual', 'mérito',
        'preliminar', 'prejudicial', 'conexão', 'continência'
    ]
    
    text_lower = text.lower()
    complexity = 0
    
    # Count legal terms
    for term in legal_terms:
        if term in text_lower:
            complexity += 1
    
    # Count complex words (worth more)
    for word in complex_words:
        if word in text_lower:
            complexity += 2
    
    # Text length factor
    if len(text) > 500:
        complexity += 1
    if len(text) > 1000:
        complexity += 2
    
    # Return rating object
    if complexity <= 2:
        return ComplexityRating(level=1, emoji='🟢', label='Simples', color='#10b981')
    elif complexity <= 5:
        return ComplexityRating(level=2, emoji='🟡', label='Moderado', color='#f59e0b')
    elif complexity <= 8:
        return ComplexityRating(level=3, emoji='🟠', label='Complexo', color='#ef4444')
    else:
        return ComplexityRating(level=4, emoji='🔴', label='Muito Complexo', color='#dc2626')

# Generate AI response with Gemini
async def generate_ai_response(user_message: str) -> ChatResponse:
    try:
        prompt = f"""
        Você é o Judas, um assistente jurídico especializado em legislação moçambicana.
        Responda em português europeu (use "vosso/vossa" em vez de "seu/sua").
        
        Pergunta do usuário: {user_message}
        
        Forneça uma resposta detalhada e fundamentada sobre a legislação moçambicana.
        Seja preciso e cite fontes legais relevantes quando possível.
        """
        
        response = model.generate_content(prompt)
        ai_text = response.text if response.text else "Desculpe, não consegui processar a vossa pergunta neste momento."
        
        # Generate mock citations (in production, these would come from a RAG system)
        citations = [
            Citation(
                title="Código Civil de Moçambique",
                source=f"Artigo relacionado à {user_message[:30]}...",
                relevance=0.85
            ),
            Citation(
                title="Constituição da República de Moçambique",
                source="Direitos e deveres fundamentais",
                relevance=0.72
            )
        ]
        
        complexity = get_complexity_rating(ai_text)
        
        return ChatResponse(
            text=ai_text,
            citations=citations,
            complexity=complexity
        )
        
    except Exception as e:
        # Fallback response
        fallback_text = f"Com base na vossa pergunta sobre '{user_message}', posso explicar que na legislação moçambicana este aspecto é regulamentado pelos códigos legais aplicáveis. Para informações mais específicas, recomendo consultar os documentos oficiais."
        
        return ChatResponse(
            text=fallback_text,
            citations=[
                Citation(
                    title="Legislação Moçambicana",
                    source="Documentos oficiais",
                    relevance=0.8
                )
            ],
            complexity=get_complexity_rating(fallback_text)
        )

@app.get("/")
async def root():
    return {"message": "Judas Legal Assistant API", "status": "running"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(message: ChatMessage):
    """
    Process user message and return AI response with complexity rating
    """
    if not message.text.strip():
        raise HTTPException(status_code=400, detail="Mensagem não pode estar vazia")
    
    response = await generate_ai_response(message.text)
    return response

@app.post("/api/complexity", response_model=ComplexityRating)
async def analyze_complexity(message: ChatMessage):
    """
    Analyze text complexity without generating AI response
    """
    if not message.text.strip():
        raise HTTPException(status_code=400, detail="Texto não pode estar vazio")
    
    complexity = get_complexity_rating(message.text)
    return complexity

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY")),
        "services": {
            "api": "running",
            "ai": "available" if os.getenv("GEMINI_API_KEY") else "not_configured"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)