from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import sys
import os

# Add the root directory to the Python path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, root_dir)

# Create FastAPI app
app = FastAPI(title="Muzaia Legal Assistant API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Muzaia Legal Assistant API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "muzaia-backend"}

@app.post("/api/chat")
async def chat_endpoint():
    return {"message": "Chat endpoint funcionando", "status": "ok"}

# Vercel handler - CRITICAL for Vercel Functions
handler = Mangum(app)