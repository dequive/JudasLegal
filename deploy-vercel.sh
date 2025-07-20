#!/bin/bash

# Script para deploy manual do MuzaIA no Vercel
echo "🚀 Preparando deploy do MuzaIA no Vercel..."

# Verificar se vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Configurar variáveis de ambiente para o Vercel
echo "🔧 Configurando variáveis de ambiente..."

# Arquivo temporário com configurações
cat > .vercel-env.txt << 'EOF'
# Variáveis de ambiente para MuzaIA no Vercel
GEMINI_API_KEY=AIzaSyAwx_RItGZMpaBcmnKNWUDVnSCxqm6XxN8
DATABASE_URL=postgresql://postgres.haqlhwzoecdpgtfuzstw:Unica2024@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
REPL_ID=MuzaIA
SESSION_SECRET=muzaia-super-secret-session-key-2024
NODE_ENV=production
FRONTEND_URL=https://workspace-eight-mocha.vercel.app
AUTH_URL=https://workspace-eight-mocha.vercel.app
BACKEND_URL=https://workspace-eight-mocha.vercel.app
EOF

echo "📝 Arquivo .vercel-env.txt criado com as configurações necessárias"
echo ""
echo "🌐 Para fazer deploy no Vercel:"
echo "1. Execute: vercel"
echo "2. Faça login na vossa conta Vercel"
echo "3. Escolha o projecto existente ou crie novo"
echo "4. Configure as variáveis de ambiente usando o arquivo .vercel-env.txt"
echo ""
echo "🔧 Ou use o dashboard do Vercel:"
echo "1. Aceda a https://vercel.com/dashboard"
echo "2. Encontre o projecto 'workspace-eight-mocha'"
echo "3. Vá a Settings > Functions"
echo "4. Clique em 'Redeploy' na aba Deployments"
echo ""
echo "📋 Alterações do MuzaIA já implementadas:"
echo "✓ Nome da aplicação: MuzaIA"
echo "✓ Descrição: Assistente jurídico online baseado em IA"
echo "✓ Todas as interfaces actualizadas"
echo "✓ Backend e frontend preparados"