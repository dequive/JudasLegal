#!/usr/bin/env python3
"""
Primary deployment entry point for Judas Legal Assistant
Optimized for Replit deployment with all recommended fixes applied
"""

import os
import sys
import uvicorn
from pathlib import Path

# Ensure proper Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# Set production environment variables
os.environ["REPL_DEPLOYMENT"] = "true"
os.environ["PYTHONUNBUFFERED"] = "1"

def main():
    """
    Main deployment entry point with all fixes applied:
    - Fixed port 80 binding for deployment
    - Removed unsupported uvicorn parameters
    - Optimized for fast health checks
    - Proper error handling
    """
    try:
        print("Starting Judas Legal Assistant deployment...")
        
        # Import the FastAPI app
        from main import app
        
        # Run with deployment-optimized configuration
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=80,
            reload=False,
            workers=1,
            access_log=True,
            log_level="info"
        )
        
    except ImportError as e:
        print(f"Failed to import FastAPI app: {e}")
        print("Check that all dependencies are installed and main.py exists")
        sys.exit(1)
    except Exception as e:
        print(f"Deployment failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()