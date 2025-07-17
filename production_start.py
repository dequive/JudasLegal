#!/usr/bin/env python3
"""
Production deployment script for Judas Legal Assistant
This script is optimized for Replit deployment
"""

import os
import sys
import uvicorn
from pathlib import Path

# Configure environment for production
os.environ["REPL_DEPLOYMENT"] = "true"
os.environ["PYTHONUNBUFFERED"] = "1"

# Add current directory to path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

def main():
    """Production entry point"""
    try:
        # Import the FastAPI application
        from main import app
        
        # Production configuration
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=80,
            reload=False,
            workers=1,
            access_log=True,
            log_level="info",
            timeout_keep_alive=30
        )
        
    except ImportError as e:
        print(f"Failed to import application: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Production server failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()