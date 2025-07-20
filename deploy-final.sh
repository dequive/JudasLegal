#!/bin/bash

echo "🎯 DEPLOY FINAL - Arquivos Mínimos"
echo "=================================="
echo ""

echo "✅ OPTIMIZAÇÕES:"
echo "• .vercelignore criado - Exclui tudo exceto api/"
echo "• Apenas api/index.py + vercel.json"
echo "• Tamanho reduzido drasticamente"
echo "• Zero dependências Python"
echo ""

echo "📊 Arquivos incluídos:"
echo "• api/index.py ($(wc -c < api/index.py) bytes)"
echo "• vercel.json ($(wc -c < vercel.json) bytes)"
echo ""

echo "🚀 Deploy com arquivos mínimos:"
vercel --prod

echo ""
echo "🎉 Muzaia funcionando!"