from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add the root directory to the Python path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, root_dir)

try:
    # Import the main FastAPI app from backend_complete
    from backend_complete import app
except ImportError:
    # Fallback minimal app if import fails
    app = FastAPI(title="Muzaia Legal Assistant API")
    
    @app.get("/")
    async def root():
        return {"message": "Muzaia Legal Assistant API", "status": "running"}
    
    @app.get("/health")
    async def health():
        return {"status": "healthy", "service": "muzaia-backend"}

# Configure CORS for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)