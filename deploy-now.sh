#!/bin/bash

# Deploy imediato com as credenciais fornecidas
# REPL_ID: Judas
# GEMINI_API_KEY: AIzaSyCUe9dn9580M9stl1IgEGwnmANUqtEDNMs
# DATABASE_URL: postgresql://postgres:Wez0@821722@db.dcqftukouimxugezypwd.supabase.co:5432/postgres

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando deploy do Judas Legal Assistant...${NC}"

# Verificar e instalar Vercel CLI se necessário
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Vercel CLI...${NC}"
    npm install -g vercel
fi

# Login no Vercel se necessário
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}🔐 Fazendo login no Vercel...${NC}"
    vercel login
fi

# Variáveis
GEMINI_API_KEY="AIzaSyCUe9dn9580M9stl1IgEGwnmANUqtEDNMs"
DATABASE_URL="postgresql://postgres:Wez0@821722@db.dcqftukouimxugezypwd.supabase.co:5432/postgres"
REPL_ID="Judas"
SESSION_SECRET=$(openssl rand -hex 32)

echo -e "${GREEN}🔑 SESSION_SECRET gerado automaticamente${NC}"
echo -e "${BLUE}📋 Configurando variáveis de ambiente...${NC}"

# Primeiro, precisamos fazer deploy inicial para ter os projetos
echo -e "${YELLOW}🚀 Fazendo deploy inicial para criar projetos...${NC}"

# Deploy Frontend primeiro
echo -e "${YELLOW}📱 Deployando Frontend...${NC}"
vercel --prod --name judas-legal-assistant

# Deploy Backend
echo -e "${YELLOW}⚙️ Deployando Backend...${NC}"
vercel deploy deploy_server.py --prod --name judas-backend

# Deploy Auth Server  
echo -e "${YELLOW}🔐 Deployando Auth Server...${NC}"
vercel deploy auth-server.js --prod --name judas-auth

echo -e "${GREEN}✅ Projetos criados! Agora configurando variáveis...${NC}"

# Configurar variáveis usando a nova sintaxe
echo -e "${YELLOW}📋 Configurando variáveis para Frontend...${NC}"
echo "NEXT_PUBLIC_API_URL=https://judas-backend.vercel.app" | vercel env add NEXT_PUBLIC_API_URL production --name judas-legal-assistant
echo "NEXT_PUBLIC_AUTH_URL=https://judas-auth.vercel.app" | vercel env add NEXT_PUBLIC_AUTH_URL production --name judas-legal-assistant
echo "production" | vercel env add NODE_ENV production --name judas-legal-assistant

echo -e "${YELLOW}📋 Configurando variáveis para Backend...${NC}"
echo "$GEMINI_API_KEY" | vercel env add GEMINI_API_KEY production --name judas-backend
echo "$DATABASE_URL" | vercel env add DATABASE_URL production --name judas-backend
echo "." | vercel env add PYTHON_PATH production --name judas-backend

echo -e "${YELLOW}📋 Configurando variáveis para Auth Server...${NC}"
echo "$SESSION_SECRET" | vercel env add SESSION_SECRET production --name judas-auth
echo "$DATABASE_URL" | vercel env add DATABASE_URL production --name judas-auth
echo "$REPL_ID" | vercel env add REPL_ID production --name judas-auth
echo "judas-legal-assistant.vercel.app" | vercel env add REPLIT_DOMAINS production --name judas-auth
echo "https://replit.com/oidc" | vercel env add ISSUER_URL production --name judas-auth
echo "production" | vercel env add NODE_ENV production --name judas-auth

echo -e "${GREEN}✅ Variáveis configuradas!${NC}"

echo -e "${BLUE}🚀 Fazendo redeploy final com variáveis...${NC}"

# Redeploy com as variáveis configuradas
echo -e "${YELLOW}📱 Redeploy Frontend...${NC}"
vercel --prod --name judas-legal-assistant

echo -e "${YELLOW}⚙️ Redeploy Backend...${NC}"
vercel deploy deploy_server.py --prod --name judas-backend

echo -e "${YELLOW}🔐 Redeploy Auth Server...${NC}"
vercel deploy auth-server.js --prod --name judas-auth

echo ""
echo -e "${GREEN}🎉 Deploy completo!${NC}"
echo ""
echo -e "${BLUE}🌐 URLs da aplicação:${NC}"
echo "   Frontend: https://judas-legal-assistant.vercel.app"
echo "   Backend:  https://judas-backend.vercel.app"
echo "   Auth:     https://judas-auth.vercel.app"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "1. Aguarde alguns minutos para propagação"
echo "2. Teste cada URL"
echo "3. Faça login e teste o chat jurídico"
echo ""
echo -e "${GREEN}✅ Sua aplicação jurídica está online!${NC}"