#!/bin/bash

echo "▲ Deploy Muzaia Vercel - Configuração Mínima"
echo "============================================"

# Instalar Vercel CLI se necessário
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm i -g vercel
fi

echo "✅ Configuração atual:"
echo "• vercel.json - builds + routes (sem functions)"
echo "• api/main.py - Entry point FastAPI"
echo ""

# Teste rápido do comando vercel
echo "🧪 Testando configuração..."
vercel --help > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Vercel CLI funcionando"
else
    echo "❌ Problema com Vercel CLI"
    exit 1
fi

echo ""
echo "🚀 Executar deploy:"
echo "vercel login"
echo "vercel --prod"
echo ""
echo "📋 Arquivos prontos para deploy:"
ls -la vercel.json api/main.py requirements-vercel.txt