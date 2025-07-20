#!/bin/bash

echo "🚀 DEPLOY ULTRA SIMPLES - Muzaia"
echo "================================"
echo ""

echo "✅ MUDANÇA RADICAL:"
echo "• Removido FastAPI + Mangum (problemático)"
echo "• Usando BaseHTTPRequestHandler nativo"
echo "• Zero dependências externas"
echo "• Configuração builds estável"
echo ""

echo "📋 Deploy directo:"
vercel --prod

echo ""
echo "✅ Deve funcionar agora!"