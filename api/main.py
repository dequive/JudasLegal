# Vercel entry point for FastAPI Muzaia Backend
import sys
import os

# Add the root directory to the Python path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, root_dir)

# Import the FastAPI app
from backend_complete import app

# Export for Vercel
handler = app

# For direct testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)