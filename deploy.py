#!/usr/bin/env python3
"""
Deployment script for Judas Legal Assistant
Ensures port 80 is used and all configurations are set for production
"""

import os
import sys
import uvicorn

# Set production environment variables
os.environ["REPL_DEPLOYMENT"] = "true"
os.environ["PYTHONUNBUFFERED"] = "1"
os.environ["PORT"] = "80"

# Add current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

def main():
    """Main deployment function"""
    try:
        # Import the FastAPI app
        from main import app
        
        # Run with deployment configuration
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=80,
            reload=False,
            workers=1,
            access_log=True,
            log_level="info",
            timeout_keep_alive=30,
            timeout_graceful_shutdown=10
        )
    except Exception as e:
        print(f"Deployment failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()