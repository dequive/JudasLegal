#!/usr/bin/env python3
"""
Production runner for Judas Legal Assistant API
"""
import os
import uvicorn
from main import app

if __name__ == "__main__":
    # For deployment, use port 80 (or from environment)
    port = int(os.getenv("PORT", 80))
    
    # Run with production settings
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        reload=False,
        workers=1,
        access_log=True,
        log_level="info"
    )