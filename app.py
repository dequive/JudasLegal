#!/usr/bin/env python3
"""
Deployment entry point for Judas Legal Assistant
This file is specifically for deployment and forces port 80
"""

import os
import sys
import uvicorn

# Force production environment
os.environ["REPL_DEPLOYMENT"] = "true"
os.environ["PYTHONUNBUFFERED"] = "1"
os.environ["PORT"] = "80"

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the FastAPI app
from main import app

def main():
    """Main entry point for deployment"""
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=80,  # Force port 80 for deployment
        reload=False,
        workers=1,
        access_log=True,
        log_level="info",
        timeout_keep_alive=30,
        timeout_graceful_shutdown=10
    )

if __name__ == "__main__":
    main()