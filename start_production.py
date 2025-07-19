#!/usr/bin/env python3
import os
import subprocess
import sys
import time
import signal
from multiprocessing import Process

def start_auth_server():
    """Start the Express authentication server"""
    print("Starting authentication server...")
    try:
        subprocess.run(["node", "auth-server.js"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Auth server failed: {e}")
        sys.exit(1)

def start_backend_api():
    """Start the FastAPI backend"""
    print("Starting FastAPI backend...")
    try:
        subprocess.run([
            "python3", "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "80",
            "--workers", "1"
        ], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Backend API failed: {e}")
        sys.exit(1)

def start_frontend():
    """Start the Next.js frontend"""
    print("Starting Next.js frontend...")
    try:
        # Build the frontend first
        subprocess.run(["npm", "run", "build"], check=True)
        # Start the production server
        subprocess.run([
            "npm", "start", 
            "--", 
            "-p", str(os.environ.get('PORT', '5000'))
        ], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Frontend failed: {e}")
        sys.exit(1)

def signal_handler(signum, frame):
    print("\nShutting down gracefully...")
    sys.exit(0)

def main():
    # Handle graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    print("Starting Judas Legal Assistant in production mode...")
    
    # Check required environment variables
    required_vars = ['DATABASE_URL', 'GEMINI_API_KEY']
    missing_vars = [var for var in required_vars if not os.environ.get(var)]
    
    if missing_vars:
        print(f"Missing required environment variables: {', '.join(missing_vars)}")
        sys.exit(1)
    
    # Set production environment
    os.environ['NODE_ENV'] = 'production'
    os.environ['PYTHONPATH'] = '.'
    
    processes = []
    
    try:
        # Start auth server in background
        auth_process = Process(target=start_auth_server)
        auth_process.start()
        processes.append(auth_process)
        time.sleep(2)
        
        # Start backend API in background  
        backend_process = Process(target=start_backend_api)
        backend_process.start()
        processes.append(backend_process)
        time.sleep(2)
        
        # Start frontend (main process)
        start_frontend()
        
    except KeyboardInterrupt:
        print("\nReceived interrupt signal...")
    finally:
        print("Terminating all processes...")
        for process in processes:
            if process.is_alive():
                process.terminate()
                process.join(timeout=5)
                if process.is_alive():
                    process.kill()

if __name__ == "__main__":
    main()