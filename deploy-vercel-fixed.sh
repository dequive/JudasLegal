#!/bin/bash

echo "▲ Deploy Muzaia no Vercel - Versão Corrigida"
echo "============================================"
echo ""

# Verificar se temos os arquivos necessários
if [ ! -f "backend_complete.py" ]; then
    echo "❌ Arquivo backend_complete.py não encontrado"
    exit 1
fi

echo "🔧 Corrigindo configuração Vercel..."

# Verificar se Vercel CLI está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instalar Node.js primeiro."
    exit 1
fi

if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm i -g vercel
fi

echo "✅ Arquivos já configurados:"
echo "• vercel.json - Configuração corrigida"
echo "• api/main.py - Entry point FastAPI"
echo "• requirements-vercel.txt - Dependências específicas"
echo ""

echo "🚀 DEPLOY NO VERCEL:"
echo "==================="
echo ""
echo "1. Login no Vercel:"
echo "   vercel login"
echo ""
echo "2. Deploy inicial:"
echo "   vercel"
echo ""
echo "3. Deploy produção:"
echo "   vercel --prod"
echo ""

echo "🔑 CONFIGURAR VARIÁVEIS APÓS DEPLOY:"
echo "===================================="
echo ""
echo "No painel Vercel (https://vercel.com/dashboard):"
echo "• Settings > Environment Variables"
echo "• Adicionar:"
echo "  - GEMINI_API_KEY = [vossa chave]"
echo "  - DATABASE_URL = [vossa URL Supabase]"
echo ""

echo "🧪 TESTAR APÓS DEPLOY:"
echo "======================"
echo ""
echo "URLs esperadas:"
echo "• Backend: https://[projeto].vercel.app"
echo "• Health: https://[projeto].vercel.app/health"
echo "• Docs: https://[projeto].vercel.app/docs"
echo ""

echo "💡 PROBLEMA IDENTIFICADO E CORRIGIDO:"
echo "• Entry point api/main.py criado corretamente"
echo "• Configuração vercel.json ajustada"
echo "• Requirements específicos para Vercel"
echo ""

echo "▲ Pronto para deploy no Vercel!"
echo ""
echo "Comando para começar:"
echo "vercel login && vercel"