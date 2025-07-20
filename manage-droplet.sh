#!/bin/bash

echo "🛠️ Gestão Muzaia Droplet (164.92.160.176)"
echo "=========================================="

DROPLET_IP="164.92.160.176"

echo ""
echo "Escolha uma opção:"
echo "1. Status dos serviços"
echo "2. Logs do backend"
echo "3. Reiniciar backend"
echo "4. Atualizar código"
echo "5. Health check"
echo "6. Configurar SSL"
echo "7. Backup da aplicação"
echo "8. Monitorização em tempo real"
echo "9. Sair"
echo ""

while true; do
    read -p "Opção (1-9): " choice
    
    case $choice in
        1)
            echo ""
            echo "📊 Status dos Serviços:"
            echo "======================"
            ssh root@$DROPLET_IP << 'REMOTE'
                echo "🔍 Muzaia Backend:"
                systemctl is-active --quiet muzaia && echo "✅ Activo" || echo "❌ Inactivo"
                
                echo ""
                echo "🔍 Nginx:"
                systemctl is-active --quiet nginx && echo "✅ Activo" || echo "❌ Inactivo"
                
                echo ""
                echo "🔍 Uso de recursos:"
                echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
                echo "RAM: $(free -h | awk 'NR==2{printf "%.1f%%", $3*100/$2}')"
                echo "Disco: $(df -h /var/www/muzaia | awk 'NR==2{print $5}')"
                
                echo ""
                echo "🌐 Conectividade:"
                curl -s -o /dev/null -w "Status: %{http_code}\nTempo: %{time_total}s\n" http://localhost:8000/health
REMOTE
            echo ""
            ;;
        2)
            echo ""
            echo "📋 Logs do Backend (últimas 50 linhas):"
            echo "======================================"
            ssh root@$DROPLET_IP "journalctl -u muzaia -n 50 --no-pager"
            echo ""
            ;;
        3)
            echo ""
            echo "🔄 Reiniciando Backend..."
            ssh root@$DROPLET_IP << 'REMOTE'
                systemctl restart muzaia
                sleep 3
                systemctl is-active --quiet muzaia && echo "✅ Reiniciado com sucesso" || echo "❌ Erro no reinício"
REMOTE
            echo ""
            ;;
        4)
            echo ""
            echo "📦 Atualizando Código..."
            echo "Fazendo backup do código actual..."
            
            # Backup local
            ssh root@$DROPLET_IP "cp /var/www/muzaia/backend_complete.py /var/www/muzaia/backend_complete.py.backup"
            
            # Upload novo código
            scp backend_complete.py root@$DROPLET_IP:/var/www/muzaia/
            
            # Reiniciar serviço
            ssh root@$DROPLET_IP << 'REMOTE'
                chown www-data:www-data /var/www/muzaia/backend_complete.py
                systemctl restart muzaia
                sleep 3
                systemctl is-active --quiet muzaia && echo "✅ Código atualizado" || echo "❌ Erro na atualização"
REMOTE
            echo ""
            ;;
        5)
            echo ""
            echo "🏥 Health Check Completo:"
            echo "========================"
            
            # Teste local
            echo "🔍 Teste interno:"
            ssh root@$DROPLET_IP "curl -s http://localhost:8000/health | python3 -c 'import json,sys; data=json.load(sys.stdin); print(f\"Status: {data.get(\"status\")}\nService: {data.get(\"service\")}\nVersion: {data.get(\"version\")}\"' 2>/dev/null || echo 'Erro no health check'"
            
            echo ""
            echo "🌐 Teste externo:"
            curl -s http://164.92.160.176/health | python3 -c "import json,sys; data=json.load(sys.stdin); print(f'Status: {data.get(\"status\")}\nAI: {data.get(\"ai\")}\nLegal System: {data.get(\"legal_system\")}');" 2>/dev/null || echo "❌ Não acessível externamente"
            
            echo ""
            ;;
        6)
            echo ""
            ./setup-ssl.sh
            ;;
        7)
            echo ""
            echo "💾 Criando Backup..."
            BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
            
            ssh root@$DROPLET_IP << EOF
                mkdir -p /root/backups
                tar -czf /root/backups/muzaia_backup_${BACKUP_DATE}.tar.gz /var/www/muzaia
                echo "✅ Backup criado: /root/backups/muzaia_backup_${BACKUP_DATE}.tar.gz"
                
                echo ""
                echo "📊 Backups disponíveis:"
                ls -lh /root/backups/muzaia_backup_*.tar.gz 2>/dev/null || echo "Nenhum backup anterior"
EOF
            echo ""
            ;;
        8)
            echo ""
            echo "📊 Monitorização em Tempo Real:"
            echo "==============================="
            echo "Pressione Ctrl+C para sair"
            echo ""
            
            ssh root@$DROPLET_IP << 'REMOTE'
                while true; do
                    clear
                    echo "🕐 $(date)"
                    echo "=================="
                    echo ""
                    
                    echo "🔍 Status Serviços:"
                    systemctl is-active --quiet muzaia && echo "✅ Backend: Activo" || echo "❌ Backend: Inactivo"
                    systemctl is-active --quiet nginx && echo "✅ Nginx: Activo" || echo "❌ Nginx: Inactivo"
                    
                    echo ""
                    echo "📊 Recursos:"
                    echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
                    echo "RAM: $(free -h | awk 'NR==2{printf "%.1f%% (%s/%s)", $3*100/$2, $3, $2}')"
                    
                    echo ""
                    echo "🌐 Health Check:"
                    curl -s -w "Resposta: %{http_code} | Tempo: %{time_total}s\n" -o /dev/null http://localhost:8000/health
                    
                    echo ""
                    echo "📋 Últimos 3 logs:"
                    journalctl -u muzaia -n 3 --no-pager --since "5 minutes ago" | tail -3
                    
                    sleep 10
                done
REMOTE
            ;;
        9)
            echo "👋 Saindo..."
            exit 0
            ;;
        *)
            echo "❌ Opção inválida. Escolha 1-9."
            ;;
    esac
done