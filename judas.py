#!/usr/bin/env python3
"""
Judas Legal Assistant - Production Entry Point
This file is designed to be the main entry point for deployment
"""

import os
import sys
import uvicorn

# Ensure current directory is in Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Production environment setup
os.environ["REPL_DEPLOYMENT"] = "true"
os.environ["PYTHONUNBUFFERED"] = "1"

# Import the FastAPI application
from main import app

# Run the application
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 80))
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        reload=False,
        workers=1,
        access_log=True,
        log_level="info"
    )