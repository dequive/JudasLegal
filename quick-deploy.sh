#!/bin/bash

# Deploy simples e funcional - Judas Legal Assistant
echo "🚀 Deploy simples do Judas Legal Assistant..."

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Instalando Vercel CLI...${NC}"
    npm install -g vercel
fi

# Login se necessário
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}Fazendo login no Vercel...${NC}"
    vercel login
fi

echo -e "${BLUE}📱 Deployando Frontend (Next.js)...${NC}"
# Deploy frontend simples
vercel --prod

echo -e "${GREEN}✅ Deploy do Frontend concluído!${NC}"
echo ""
echo -e "${BLUE}🌐 Sua aplicação estará disponível em:${NC}"
vercel --prod | grep -o 'https://[^[:space:]]*' | head -1

echo ""
echo -e "${YELLOW}🔧 Para o sistema completo funcionar:${NC}"
echo "1. Configure as variáveis de ambiente no dashboard do Vercel"
echo "2. Deploy o backend e auth server separadamente"
echo ""
echo -e "${GREEN}✅ Frontend online!${NC}"