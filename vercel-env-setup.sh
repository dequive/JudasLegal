#!/bin/bash

# Script para configurar variáveis de ambiente no Vercel
# Execute após fazer login: vercel login

echo "🔧 Configurando variáveis de ambiente no Vercel..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI não encontrado. Instalando...${NC}"
    npm install -g vercel
fi

# Verificar login
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}🔐 Fazendo login no Vercel...${NC}"
    vercel login
fi

echo -e "${BLUE}📋 Você precisará fornecer as seguintes variáveis:${NC}"
echo "1. GEMINI_API_KEY (Google AI Studio)"
echo "2. DATABASE_URL (PostgreSQL - Neon/Supabase)"
echo "3. SESSION_SECRET (string aleatória)"
echo "4. REPL_ID (do seu projeto Replit)"
echo ""

# Solicitar variáveis do usuário
read -p "🤖 GEMINI_API_KEY: " GEMINI_API_KEY
read -p "🐘 DATABASE_URL: " DATABASE_URL
read -p "🔐 SESSION_SECRET (deixe vazio para gerar): " SESSION_SECRET
read -p "📱 REPL_ID: " REPL_ID

# Gerar SESSION_SECRET se vazio
if [ -z "$SESSION_SECRET" ]; then
    SESSION_SECRET=$(openssl rand -hex 32)
    echo -e "${GREEN}🔑 SESSION_SECRET gerado: $SESSION_SECRET${NC}"
fi

# Configurar Frontend
echo -e "${BLUE}📱 Configurando Frontend...${NC}"
vercel env add NEXT_PUBLIC_API_URL production <<< "https://judas-backend.vercel.app"
vercel env add NEXT_PUBLIC_AUTH_URL production <<< "https://judas-auth.vercel.app"
vercel env add NODE_ENV production <<< "production"

# Configurar Backend
echo -e "${BLUE}⚙️ Configurando Backend...${NC}"
vercel env add GEMINI_API_KEY production <<< "$GEMINI_API_KEY"
vercel env add DATABASE_URL production <<< "$DATABASE_URL"
vercel env add PYTHON_PATH production <<< "."

# Configurar Auth Server
echo -e "${BLUE}🔐 Configurando Auth Server...${NC}"
vercel env add SESSION_SECRET production <<< "$SESSION_SECRET"
vercel env add DATABASE_URL production <<< "$DATABASE_URL"
vercel env add REPL_ID production <<< "$REPL_ID"
vercel env add REPLIT_DOMAINS production <<< "judas-legal-assistant.vercel.app"
vercel env add ISSUER_URL production <<< "https://replit.com/oidc"
vercel env add NODE_ENV production <<< "production"

echo -e "${GREEN}✅ Configuração completa!${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "1. Execute: ./deploy-vercel.sh"
echo "2. Aguarde o deployment"
echo "3. Teste as URLs:"
echo "   - Frontend: https://judas-legal-assistant.vercel.app"
echo "   - Backend: https://judas-backend.vercel.app"
echo "   - Auth: https://judas-auth.vercel.app"