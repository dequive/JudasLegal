#!/bin/bash
# Production start script for Judas Legal Assistant

# Set production environment variables
export REPL_DEPLOYMENT=true
export PYTHONUNBUFFERED=1

# Start the FastAPI application
exec python3 main.py