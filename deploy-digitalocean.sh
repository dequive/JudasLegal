#!/bin/bash

# Deploy script for DigitalOcean Droplet
# Usage: ./deploy-digitalocean.sh

set -e

echo "🚀 Starting deployment to DigitalOcean..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "Docker installed. You may need to log out and back in."
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
# Database Configuration
DATABASE_URL=postgresql://judas:your_password_here@postgres:5432/judas
POSTGRES_PASSWORD=your_secure_password_here

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Authentication Configuration
SESSION_SECRET=your_session_secret_here
REPL_ID=your_repl_id
REPLIT_DOMAINS=your-domain.com
ISSUER_URL=https://replit.com/oidc

# Production Configuration
NODE_ENV=production
PORT=5000
EOL
    echo "⚠️  Please edit .env file with your actual configuration before continuing!"
    echo "Press Enter to continue when ready..."
    read
fi

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down || true

# Build and start containers
echo "Building and starting containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 30

# Check if services are running
echo "Checking service health..."
if curl -f http://localhost:5000 >/dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo "🌐 Access your application at: http://$(curl -s ifconfig.me):5000"
else
    echo "❌ Application failed to start. Check logs with: docker-compose logs"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo ""
echo "Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop app: docker-compose down"
echo "  Restart: docker-compose restart"
echo "  Update: git pull && docker-compose up --build -d"