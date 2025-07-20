#!/bin/bash

echo "▲ Deploy Muzaia no Vercel - Configuração Simples"
echo "================================================"
echo ""

# Verificar Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm i -g vercel
fi

echo "✅ Configuração corrigida:"
echo "• vercel.json - Usando functions apenas (sem builds)"
echo "• api/main.py - Entry point com fallback"
echo ""

echo "🚀 DEPLOY:"
echo "=========="
echo ""

# Login se necessário
if ! vercel whoami &> /dev/null; then
    echo "🔑 Fazendo login no Vercel..."
    vercel login
fi

echo "📤 Fazendo deploy..."
vercel --prod

echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "=================="
echo ""
echo "1. Configurar variáveis no painel Vercel:"
echo "   https://vercel.com/dashboard"
echo ""
echo "2. Settings > Environment Variables:"
echo "   GEMINI_API_KEY = [vossa chave]"
echo "   DATABASE_URL = [vossa URL Supabase]"
echo ""
echo "3. Testar API:"
echo "   curl https://[projeto].vercel.app/health"
echo ""

echo "✅ Deploy concluído!"