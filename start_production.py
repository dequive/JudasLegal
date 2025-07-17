#!/usr/bin/env python3
"""
Simple production startup script for Judas Legal Assistant
Optimized for deployment with minimal configuration
"""

import os
import sys
import uvicorn

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set deployment environment
os.environ["REPL_DEPLOYMENT"] = "true"
os.environ["PYTHONUNBUFFERED"] = "1"

def main():
    """Main production startup"""
    try:
        # Import the FastAPI app
        from main import app
        
        # Run with minimal configuration for fastest startup
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=80,
            reload=False,
            workers=1,
            access_log=True,
            log_level="info"
        )
        
    except Exception as e:
        print(f"Production startup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()