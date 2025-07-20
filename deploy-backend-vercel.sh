#!/bin/bash

echo "🚀 Deploy do Backend Muzaia no Vercel"
echo "======================================"

# Verificar se está no directório correcto
if [ ! -f "backend_complete.py" ]; then
    echo "❌ Erro: backend_complete.py não encontrado!"
    echo "Execute este script no directório raiz do projecto."
    exit 1
fi

# Verificar dependências
echo "📦 Verificando dependências..."

# Usar requirements.txt otimizado para Vercel
if [ ! -f "requirements.txt" ] || [ "requirements-vercel.txt" -nt "requirements.txt" ]; then
    echo "📝 Copiando requirements.txt otimizado para Vercel..."
    cp requirements-vercel.txt requirements.txt
    echo "✅ requirements.txt atualizado"
fi

# Verificar vercel.json
echo "📝 Verificando vercel.json..."
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json encontrado e já está configurado para backend"
else
    echo "❌ vercel.json não encontrado!"
    exit 1
fi

echo ""
echo "🔧 CONFIGURAÇÃO NECESSÁRIA:"
echo "=========================="
echo ""
echo "1. Configurar variáveis de ambiente no Vercel:"
echo "   vercel env add GEMINI_API_KEY"
echo "   vercel env add DATABASE_URL"
echo ""
echo "2. Suas variáveis actuais devem ser:"
echo "   GEMINI_API_KEY: Vossa chave do Google Gemini"
echo "   DATABASE_URL: Vossa URL do Supabase PostgreSQL"
echo ""

# Verificar se o utilizador quer continuar
read -p "Deseja continuar com o deploy? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deploy cancelado pelo utilizador"
    exit 1
fi

echo ""
echo "🚀 Iniciando deploy no Vercel..."

# Fazer login se necessário
if ! vercel whoami > /dev/null 2>&1; then
    echo "🔐 A fazer login no Vercel..."
    vercel login
fi

# Deploy do backend
echo "📤 Fazendo deploy do backend..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
    echo "==============================="
    echo ""
    echo "Vosso backend está agora disponível em:"
    vercel ls | grep muzaia | head -1 | awk '{print "🌐 https://" $2}'
    echo ""
    echo "📋 PRÓXIMOS PASSOS:"
    echo "1. Testar os endpoints:"
    echo "   curl https://vosso-projeto.vercel.app/health"
    echo "   curl https://vosso-projeto.vercel.app/api/chat"
    echo ""
    echo "2. Actualizar frontend para usar a nova URL do backend"
    echo "3. Configurar CORS se necessário"
    echo ""
    echo "📖 Documentação completa: VERCEL_BACKEND_ACCESS.md"
else
    echo ""
    echo "❌ ERRO NO DEPLOY"
    echo "================"
    echo ""
    echo "Possíveis soluções:"
    echo "1. Verificar se todas as variáveis de ambiente estão definidas"
    echo "2. Verificar se requirements.txt está correcto"
    echo "3. Verificar logs: vercel logs"
    echo "4. Consultar VERCEL_BACKEND_ACCESS.md para mais informações"
fi