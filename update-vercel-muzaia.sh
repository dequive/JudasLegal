#!/bin/bash

# Script para actualizar deployment do MuzaIA no Vercel
echo "🚀 Iniciando redeploy do MuzaIA no Vercel..."

# Verificar se o git está configurado
if ! git config --get user.email > /dev/null; then
    git config --global user.email "muzaia@example.com"
    git config --global user.name "MuzaIA Bot"
fi

# Fazer commit das alterações do MuzaIA
echo "📝 Fazendo commit das alterações..."
git add .
git commit -m "Renomeação para MuzaIA - Assistente Jurídico Online baseado em IA"

# Fazer push para o repositório (que fará redeploy automático no Vercel)
echo "📤 Fazendo push para o repositório..."
if git push origin main 2>/dev/null; then
    echo "✅ Push bem-sucedido!"
elif git push origin master 2>/dev/null; then
    echo "✅ Push bem-sucedido!"
else
    echo "ℹ️ Não foi possível fazer push automático. Por favor, faça push manual das alterações."
fi

echo ""
echo "🌐 URLs do MuzaIA:"
echo "- Vercel: https://workspace-eight-mocha.vercel.app/"
echo "- Local: http://localhost:5000"
echo ""
echo "📋 Alterações implementadas:"
echo "✓ Nome da aplicação mudado para MuzaIA"
echo "✓ Descrição: Assistente jurídico online baseado em inteligência artificial"
echo "✓ Especialização: Especialista em leis moçambicanas"
echo "✓ Todas as interfaces actualizadas"
echo "✓ Backend e frontend com novo branding"
echo ""
echo "⏰ O redeploy automático no Vercel pode demorar 2-3 minutos."
echo "🔄 Recarregue a página após alguns minutos para ver as alterações."