#!/bin/bash

echo "🔧 Soluções para Login Railway"
echo "============================="

echo ""
echo "DIAGNÓSTICO:"
echo "============"

# Verificar Railway CLI
echo "1. Railway CLI:"
if command -v railway &> /dev/null; then
    echo "   ✅ Instalado ($(railway --version))"
else
    echo "   ❌ Não instalado"
fi

# Verificar conectividade
echo "2. Conectividade:"
if curl -s --max-time 5 https://railway.app > /dev/null; then
    echo "   ✅ OK"
else
    echo "   ❌ Problema de rede"
fi

# Verificar autenticação
echo "3. Autenticação:"
if railway whoami &> /dev/null; then
    echo "   ✅ Autenticado como: $(railway whoami)"
else
    echo "   ❌ Não autenticado"
fi

echo ""
echo "SOLUÇÕES:"
echo "========="

echo ""
echo "Opção 1: Login Browserless (Recomendado para Replit)"
echo "1. Ir para: https://railway.app/account/tokens"
echo "2. Criar novo token"
echo "3. Executar: railway login --browserless"
echo "4. Colar token quando solicitado"

echo ""
echo "Opção 2: Limpar Cache e Tentar Novamente"
echo "rm -rf ~/.railway"
echo "railway login"

echo ""
echo "Opção 3: Login Manual"
echo "1. railway auth"
echo "2. Seguir instruções"

echo ""
echo "ALTERNATIVAS SE RAILWAY NÃO FUNCIONAR:"
echo "====================================="

echo ""
echo "1. Deploy Vercel (Backend Serverless):"
echo "   ./deploy-backend-vercel.sh"

echo ""
echo "2. Deploy Render.com:"
echo "   - Criar conta em render.com"
echo "   - Conectar GitHub"
echo "   - Deploy automático"

echo ""
echo "3. Deploy DigitalOcean:"
echo "   - Usar Docker"
echo "   - App Platform"

echo ""
echo "4. Usar Replit Deploy:"
echo "   - Clicar botão Deploy no Replit"
echo "   - Configurar variáveis"

echo ""
read -p "Qual opção quer tentar? (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🔑 Login Browserless"
        echo "=================="
        echo ""
        echo "1. Abra no browser: https://railway.app/account/tokens"
        echo "2. Crie um novo token"
        echo "3. Volte aqui e execute o comando abaixo:"
        echo ""
        echo "railway login --browserless"
        echo ""
        echo "4. Cole o token quando solicitado"
        ;;
    2)
        echo ""
        echo "🧹 Limpando cache..."
        rm -rf ~/.railway
        rm -rf ~/.config/railway
        echo "✅ Cache limpo"
        echo ""
        echo "Agora execute: railway login"
        ;;
    3)
        echo ""
        echo "🔐 Tentando login manual..."
        railway auth
        ;;
    4)
        echo ""
        echo "📦 Deploy Vercel Alternative"
        echo "=========================="
        echo ""
        echo "Executando deploy backend no Vercel:"
        ./deploy-backend-vercel.sh
        ;;
    *)
        echo "Opção inválida. Execute o script novamente."
        ;;
esac