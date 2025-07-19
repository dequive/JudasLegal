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

# Configurar variáveis para cada projeto
echo -e "${YELLOW}📱 Frontend...${NC}"
vercel env add NEXT_PUBLIC_API_URL production --yes <<< "https://judas-backend.vercel.app"
vercel env add NEXT_PUBLIC_AUTH_URL production --yes <<< "https://judas-auth.vercel.app"
vercel env add NODE_ENV production --yes <<< "production"

echo -e "${YELLOW}⚙️ Backend...${NC}"
vercel env add GEMINI_API_KEY production --yes <<< "$GEMINI_API_KEY"
vercel env add DATABASE_URL production --yes <<< "$DATABASE_URL"
vercel env add PYTHON_PATH production --yes <<< "."

echo -e "${YELLOW}🔐 Auth Server...${NC}"
vercel env add SESSION_SECRET production --yes <<< "$SESSION_SECRET"
vercel env add DATABASE_URL production --yes <<< "$DATABASE_URL"
vercel env add REPL_ID production --yes <<< "$REPL_ID"
vercel env add REPLIT_DOMAINS production --yes <<< "judas-legal-assistant.vercel.app"
vercel env add ISSUER_URL production --yes <<< "https://replit.com/oidc"
vercel env add NODE_ENV production --yes <<< "production"

echo -e "${GREEN}✅ Variáveis configuradas!${NC}"
echo ""

echo -e "${BLUE}🚀 Iniciando deploys...${NC}"

# Deploy Frontend
echo -e "${YELLOW}📱 Deployando Frontend (Next.js)...${NC}"
vercel --prod --confirm --name judas-legal-assistant
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend deployado!${NC}"
else
    echo -e "${RED}❌ Erro no deploy do Frontend${NC}"
fi

# Deploy Backend
echo -e "${YELLOW}⚙️ Deployando Backend (FastAPI)...${NC}"
vercel deploy deploy_server.py --prod --confirm --name judas-backend
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend deployado!${NC}"
else
    echo -e "${RED}❌ Erro no deploy do Backend${NC}"
fi

# Deploy Auth Server
echo -e "${YELLOW}🔐 Deployando Auth Server (Express.js)...${NC}"
vercel deploy auth-server.js --prod --confirm --name judas-auth
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Auth Server deployado!${NC}"
else
    echo -e "${RED}❌ Erro no deploy do Auth Server${NC}"
fi

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