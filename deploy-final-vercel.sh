#!/bin/bash

echo "▲ Deploy Final Muzaia no Vercel"
echo "==============================="
echo ""

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm i -g vercel@latest
fi

echo "✅ Configuração Final:"
echo "• vercel.json - Runtime @vercel/python"
echo "• api/main.py - Entry point com fallback"
echo "• requirements-vercel.txt - Dependências específicas"
echo ""

# Login automático se necessário
if ! vercel whoami &> /dev/null; then
    echo "🔑 Fazendo login..."
    vercel login
fi

echo "🚀 Iniciando deploy..."
vercel --prod --yes

echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "=================="
echo "1. Configurar variáveis:"
echo "   https://vercel.com/dashboard"
echo ""
echo "2. Environment Variables:"
echo "   GEMINI_API_KEY = [vossa chave]"
echo "   DATABASE_URL = [vossa URL Supabase]"
echo ""
echo "✅ Deploy concluído!"