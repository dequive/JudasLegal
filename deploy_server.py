#!/usr/bin/env python3
"""
Deployment server for Judas Legal Assistant
Optimized for Replit deployment with proper health checks
"""

import os
import sys
import uvicorn
from pathlib import Path

# Add current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# Set production environment variables
os.environ["REPL_DEPLOYMENT"] = "true"
os.environ["PYTHONUNBUFFERED"] = "1"

def main():
    """Main deployment function optimized for Replit"""
    try:
        # Import the FastAPI app
        from main import app
        
        # Start the server with deployment-optimized settings
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=80,  # Fixed port for deployment
            reload=False,  # No reload in production
            workers=1,  # Single worker for Replit
            access_log=True,
            log_level="info",
            timeout_keep_alive=30
        )
        
    except Exception as e:
        print(f"Deployment failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()