#!/bin/bash

# Deploy Judas Legal Assistant to Vercel
# Este script automatiza o deployment de todas as partes da aplicação

echo "🚀 Iniciando deployment para Vercel..."

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instalando..."
    npm install -g vercel
fi

# Login no Vercel (se necessário)
echo "🔐 Verificando login no Vercel..."
vercel whoami || vercel login

# Deploy do Frontend (Next.js)
echo "📱 Deployando Frontend (Next.js)..."
vercel --prod --confirm --name judas-legal-assistant

# Deploy do Backend (FastAPI)
echo "⚙️ Deployando Backend (FastAPI)..."
vercel deploy deploy_server.py --prod --confirm --name judas-backend --config vercel-backend.json

# Deploy do Auth Server (Express.js)
echo "🔐 Deployando Auth Server (Express.js)..."
vercel deploy auth-server.js --prod --confirm --name judas-auth --config vercel-auth.json

echo "✅ Deployment completo!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis de ambiente no dashboard da Vercel:"
echo "   - GEMINI_API_KEY"
echo "   - DATABASE_URL (PostgreSQL)"
echo "   - SESSION_SECRET"
echo "   - REPL_ID"
echo "   - REPLIT_DOMAINS"
echo ""
echo "2. Atualize os URLs nos arquivos de configuração com os domínios finais"
echo ""
echo "🌐 URLs esperadas:"
echo "   Frontend: https://judas-legal-assistant.vercel.app"
echo "   Backend:  https://judas-backend.vercel.app"
echo "   Auth:     https://judas-auth.vercel.app"