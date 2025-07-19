#!/bin/bash

# Deploy Judas Legal Assistant to Vercel
# Este script automatiza o deployment de todas as partes da aplicação

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando deployment para Vercel...${NC}"

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI não encontrado. Instalando...${NC}"
    npm install -g vercel
fi

# Login no Vercel (se necessário)
echo -e "${YELLOW}🔐 Verificando login no Vercel...${NC}"
if ! vercel whoami &> /dev/null; then
    vercel login
fi

# Verificar se variáveis foram configuradas
echo -e "${YELLOW}⚠️ IMPORTANTE: Certifique-se que as variáveis de ambiente foram configuradas!${NC}"
echo "Use: ./vercel-env-setup.sh (se não fez ainda)"
read -p "Pressione Enter para continuar ou Ctrl+C para cancelar..."

# Deploy do Frontend (Next.js)
echo -e "${BLUE}📱 Deployando Frontend (Next.js)...${NC}"
vercel --prod --confirm --name judas-legal-assistant
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend deployado com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro no deploy do Frontend${NC}"
    exit 1
fi

# Deploy do Backend (FastAPI)
echo -e "${BLUE}⚙️ Deployando Backend (FastAPI)...${NC}"
vercel deploy deploy_server.py --prod --confirm --name judas-backend
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend deployado com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro no deploy do Backend${NC}"
    exit 1
fi

# Deploy do Auth Server (Express.js)
echo -e "${BLUE}🔐 Deployando Auth Server (Express.js)...${NC}"
vercel deploy auth-server.js --prod --confirm --name judas-auth
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Auth Server deployado com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro no deploy do Auth Server${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Deployment completo!${NC}"
echo ""
echo -e "${BLUE}🌐 URLs da aplicação:${NC}"
echo "   Frontend: https://judas-legal-assistant.vercel.app"
echo "   Backend:  https://judas-backend.vercel.app"
echo "   Auth:     https://judas-auth.vercel.app"
echo ""
echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "1. Teste cada URL para verificar se está funcionando"
echo "2. Configure seu domínio personalizado (se desejar)"
echo "3. Configure monitoring e analytics"
echo ""
echo -e "${GREEN}✅ Sua aplicação jurídica está online!${NC}"