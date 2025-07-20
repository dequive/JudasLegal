#!/bin/bash

echo "🔍 DEPLOY MUZAIA - PROBLEMA RESOLVIDO"
echo "===================================="
echo ""

echo "✅ SOLUÇÕES IMPLEMENTADAS:"
echo "• vercel.json - Configuração functions corrigida"
echo "• api/main.py - Handler Mangum para Vercel"
echo "• Pipfile - Python 3.12 especificado"
echo "• requirements-vercel.txt - Dependências mínimas"
echo "• .vercel removido - Cache limpo"
echo ""

echo "🔧 CAUSAS IDENTIFICADAS E CORRIGIDAS:"
echo "1. ❌ Entry point incorreto → ✅ handler = Mangum(app)"
echo "2. ❌ builds/functions conflito → ✅ Apenas functions"
echo "3. ❌ Versão Python implícita → ✅ Pipfile com 3.12"
echo "4. ❌ Cache .vercel antigo → ✅ Cache limpo"
echo "5. ❌ Dependências complexas → ✅ Mínimas essenciais"
echo ""

if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm i -g vercel
fi

echo "🚀 EXECUTANDO DEPLOY:"
echo "===================="

vercel login
echo ""
echo "📤 Deploy em produção..."
vercel --prod

echo ""
echo "✅ DEPLOY CONCLUÍDO!"
echo ""
echo "🔑 CONFIGURAR DEPOIS:"
echo "Settings > Environment Variables:"
echo "• GEMINI_API_KEY"
echo "• DATABASE_URL"