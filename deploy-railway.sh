#!/bin/bash

echo "🚀 Deploy Muzaia Backend no Railway"
echo "===================================="

# Verificar se está no directório correcto
if [ ! -f "backend_complete.py" ]; then
    echo "❌ Erro: backend_complete.py não encontrado!"
    echo "Execute este script no directório raiz do projecto."
    exit 1
fi

# Verificar Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não instalado"
    echo ""
    echo "Para instalar:"
    echo "npm install -g @railway/cli"
    echo ""
    echo "Ou baixar de: https://railway.app/cli"
    exit 1
fi

echo "✅ Railway CLI encontrado"

# Login se necessário
if ! railway whoami &> /dev/null; then
    echo "🔐 Fazendo login no Railway..."
    railway login
    
    if [ $? -ne 0 ]; then
        echo "❌ Erro no login. Tente novamente."
        exit 1
    fi
fi

echo "✅ Login Railway confirmado"

# Verificar se já existe projeto
if [ ! -f "railway.toml" ]; then
    echo "📋 Inicializando projeto Railway..."
    echo ""
    echo "Seleccione as opções:"
    echo "1. Empty project"
    echo "2. Nome: muzaia-backend"
    echo "3. Público: No"
    echo ""
    
    railway init
    
    if [ $? -ne 0 ]; then
        echo "❌ Erro na inicialização do projeto"
        exit 1
    fi
else
    echo "✅ Projeto Railway já configurado"
fi

# Configurar variáveis de ambiente
echo ""
echo "🔧 Configuração de Variáveis de Ambiente"
echo "========================================"

# Verificar variáveis existentes
echo "📋 Variáveis actuais:"
railway variables

echo ""
echo "Configurar novas variáveis:"

# GEMINI_API_KEY
echo ""
echo "GEMINI_API_KEY (vossa chave do Google Gemini):"
echo "(Pressione Enter para manter actual se já existe)"
read -r gemini_key
if [ ! -z "$gemini_key" ]; then
    railway variables set GEMINI_API_KEY="$gemini_key"
    echo "✅ GEMINI_API_KEY configurado"
fi

# DATABASE_URL
echo ""
echo "DATABASE_URL (vossa URL do Supabase PostgreSQL):"
echo "Formato: postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
echo "(Pressione Enter para manter actual se já existe)"
read -r database_url
if [ ! -z "$database_url" ]; then
    railway variables set DATABASE_URL="$database_url"
    echo "✅ DATABASE_URL configurado"
fi

# Configurar variáveis de sistema
railway variables set PYTHONPATH="/app"
railway variables set PORT="8000"
echo "✅ Variáveis de sistema configuradas"

# Mostrar configuração final
echo ""
echo "📋 Configuração final:"
railway variables

# Confirmar deploy
echo ""
echo "🚀 PRONTO PARA DEPLOY"
echo "===================="
echo ""
echo "Configuração:"
echo "- Backend: backend_complete.py"
echo "- Dependências: requirements.txt"
echo "- Configuração: railway.json + nixpacks.toml"
echo ""

read -p "Deseja prosseguir com o deploy? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deploy cancelado pelo utilizador"
    exit 1
fi

# Fazer deploy
echo ""
echo "🚀 Fazendo deploy no Railway..."
echo "Isto pode demorar alguns minutos..."

railway up

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
    echo "==============================="
    echo ""
    
    # Obter informações do deploy
    echo "📊 Informações do deploy:"
    railway status
    
    echo ""
    echo "🌐 Vosso backend está disponível em:"
    BACKEND_URL=$(railway status --json 2>/dev/null | python3 -c "import json,sys; data=json.load(sys.stdin); print(data.get('deployments', [{}])[0].get('url', 'URL não disponível'))" 2>/dev/null || echo "Executar 'railway status' para ver URL")
    echo "$BACKEND_URL"
    
    echo ""
    echo "🧪 TESTES RECOMENDADOS:"
    echo "======================"
    echo ""
    echo "1. Health check:"
    echo "   curl $BACKEND_URL/health"
    echo ""
    echo "2. Testar chat:"
    echo "   curl -X POST $BACKEND_URL/api/chat \\"
    echo "     -H 'Content-Type: application/json' \\"
    echo "     -d '{\"message\": \"Olá Muzaia!\"}'"
    echo ""
    echo "3. Testar hierarquia legal:"
    echo "   curl $BACKEND_URL/api/legal/hierarchy"
    echo ""
    echo "📋 PRÓXIMOS PASSOS:"
    echo "=================="
    echo ""
    echo "1. Testar os endpoints acima"
    echo "2. Configurar frontend para usar:"
    echo "   BACKEND_URL=$BACKEND_URL"
    echo "3. Deploy frontend no Vercel:"
    echo "   vercel --prod --env BACKEND_URL=$BACKEND_URL"
    echo ""
    echo "📖 Monitorização:"
    echo "   railway logs --follow (logs em tempo real)"
    echo "   railway status (status do serviço)"
    
else
    echo ""
    echo "❌ ERRO NO DEPLOY"
    echo "================"
    echo ""
    echo "Possíveis soluções:"
    echo "1. Verificar logs: railway logs"
    echo "2. Verificar variáveis: railway variables"
    echo "3. Verificar requirements.txt"
    echo "4. Tentar novamente: railway up"
    echo ""
    echo "Para suporte: https://railway.app/help"
fi