#!/bin/bash

# Configuração manual das variáveis de ambiente para Vercel
# Com as credenciais fornecidas pelo usuário

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Configurando variáveis de ambiente no Vercel...${NC}"

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

# Variáveis fornecidas
GEMINI_API_KEY="AIzaSyCUe9dn9580M9stl1IgEGwnmANUqtEDNMs"
DATABASE_URL="postgresql://postgres:Wez0@821722@db.dcqftukouimxugezypwd.supabase.co:5432/postgres"

# Gerar SESSION_SECRET
SESSION_SECRET=$(openssl rand -hex 32)
echo -e "${GREEN}🔑 SESSION_SECRET gerado: $SESSION_SECRET${NC}"

# Solicitar REPL_ID
echo ""
echo -e "${YELLOW}📱 Para encontrar o REPL_ID:${NC}"
echo "1. Olhe na URL do seu projeto Replit"
echo "2. Exemplo: https://replit.com/@usuario/projeto-nome"
echo "3. O REPL_ID geralmente é algo como: projeto-nome"
echo ""
read -p "🔍 Digite seu REPL_ID: " REPL_ID

echo ""
echo -e "${BLUE}📱 Configurando Frontend...${NC}"
# Configurar Frontend
echo "$NEXT_PUBLIC_API_URL" | vercel env add NEXT_PUBLIC_API_URL production <<< "https://judas-backend.vercel.app"
echo "$NEXT_PUBLIC_AUTH_URL" | vercel env add NEXT_PUBLIC_AUTH_URL production <<< "https://judas-auth.vercel.app"
echo "$NODE_ENV" | vercel env add NODE_ENV production <<< "production"

echo -e "${BLUE}⚙️ Configurando Backend...${NC}"
# Configurar Backend
echo "$GEMINI_API_KEY" | vercel env add GEMINI_API_KEY production
echo "$DATABASE_URL" | vercel env add DATABASE_URL production
echo "." | vercel env add PYTHON_PATH production

echo -e "${BLUE}🔐 Configurando Auth Server...${NC}"
# Configurar Auth Server  
echo "$SESSION_SECRET" | vercel env add SESSION_SECRET production
echo "$DATABASE_URL" | vercel env add DATABASE_URL production
echo "$REPL_ID" | vercel env add REPL_ID production
echo "judas-legal-assistant.vercel.app" | vercel env add REPLIT_DOMAINS production
echo "https://replit.com/oidc" | vercel env add ISSUER_URL production
echo "production" | vercel env add NODE_ENV production

echo ""
echo -e "${GREEN}✅ Configuração completa!${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "1. Execute: ./deploy-vercel.sh"
echo "2. Aguarde o deployment"
echo "3. Teste as URLs:"
echo "   - Frontend: https://judas-legal-assistant.vercel.app"
echo "   - Backend: https://judas-backend.vercel.app"
echo "   - Auth: https://judas-auth.vercel.app"