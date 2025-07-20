#!/bin/bash

echo "📊 Monitorização Muzaia Backend - Railway"
echo "========================================"

# Verificar se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não instalado"
    echo "Execute: npm install -g @railway/cli"
    exit 1
fi

# Verificar login
if ! railway whoami &> /dev/null; then
    echo "❌ Não está logado no Railway"
    echo "Execute: railway login"
    exit 1
fi

# Menu de opções
echo ""
echo "Escolha uma opção:"
echo "1. Status do serviço"
echo "2. Logs em tempo real"
echo "3. Últimos logs"
echo "4. Health check"
echo "5. Variáveis de ambiente"
echo "6. Reiniciar serviço"
echo "7. Informações completas"
echo "8. Sair"
echo ""

while true; do
    read -p "Opção (1-8): " choice
    
    case $choice in
        1)
            echo ""
            echo "📈 Status do Serviço:"
            echo "===================="
            railway status
            echo ""
            ;;
        2)
            echo ""
            echo "📋 Logs em Tempo Real (Ctrl+C para sair):"
            echo "========================================"
            railway logs --follow
            echo ""
            ;;
        3)
            echo ""
            echo "📋 Últimos 50 Logs:"
            echo "=================="
            railway logs --tail 50
            echo ""
            ;;
        4)
            echo ""
            echo "🏥 Health Check:"
            echo "==============="
            
            # Obter URL do serviço
            URL=$(railway status --json 2>/dev/null | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print(data.get('deployments', [{}])[0].get('url', ''))
except:
    print('')
" 2>/dev/null)
            
            if [ -z "$URL" ]; then
                echo "❌ Não foi possível obter URL do serviço"
                echo "Execute 'railway status' manualmente"
            else
                echo "🌐 URL: $URL"
                echo ""
                echo "🔍 Testando /health..."
                
                if command -v curl &> /dev/null; then
                    RESPONSE=$(curl -s "$URL/health" 2>/dev/null)
                    if [ $? -eq 0 ]; then
                        echo "✅ Resposta:"
                        echo "$RESPONSE" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print(f\"Status: {data.get('status', 'N/A')}\")
    print(f\"Service: {data.get('service', 'N/A')}\")
    print(f\"Version: {data.get('version', 'N/A')}\")
    print(f\"AI: {data.get('ai', 'N/A')}\")
    print(f\"Legal System: {data.get('legal_system', 'N/A')}\")
except:
    print(sys.stdin.read())
" 2>/dev/null || echo "$RESPONSE"
                    else
                        echo "❌ Erro na conexão"
                    fi
                else
                    echo "❌ curl não disponível"
                    echo "Teste manualmente: $URL/health"
                fi
            fi
            echo ""
            ;;
        5)
            echo ""
            echo "🔧 Variáveis de Ambiente:"
            echo "========================"
            railway variables
            echo ""
            ;;
        6)
            echo ""
            echo "🔄 Reiniciando Serviço..."
            railway restart
            echo "✅ Reinício solicitado"
            echo ""
            ;;
        7)
            echo ""
            echo "📊 INFORMAÇÕES COMPLETAS"
            echo "========================"
            echo ""
            
            echo "👤 Utilizador Railway:"
            railway whoami
            echo ""
            
            echo "📈 Status do Projeto:"
            railway status
            echo ""
            
            echo "🔧 Variáveis:"
            railway variables
            echo ""
            
            echo "🏥 Health Check:"
            URL=$(railway status --json 2>/dev/null | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print(data.get('deployments', [{}])[0].get('url', ''))
except:
    print('')
" 2>/dev/null)
            
            if [ ! -z "$URL" ] && command -v curl &> /dev/null; then
                curl -s "$URL/health" 2>/dev/null | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print(f\"✅ Backend: {data.get('status', 'N/A')} - {data.get('service', 'N/A')} v{data.get('version', 'N/A')}\")
except:
    print('❌ Health check falhou')
" 2>/dev/null
            else
                echo "❌ Não foi possível fazer health check"
            fi
            echo ""
            
            echo "📋 Últimos 10 logs:"
            railway logs --tail 10
            echo ""
            ;;
        8)
            echo "👋 Saindo..."
            exit 0
            ;;
        *)
            echo "❌ Opção inválida. Escolha 1-8."
            ;;
    esac
done