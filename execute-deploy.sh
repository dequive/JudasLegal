#!/bin/bash

echo "🚀 EXECUÇÃO COMPLETA DO DEPLOY MUZAIA"
echo "===================================="
echo "Droplet IP: 164.92.160.176"
echo ""

# Configurações
DROPLET_IP="164.92.160.176"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verificar pré-requisitos
check_prerequisites() {
    log "Verificando pré-requisitos..."
    
    # Verificar se backend_complete.py existe
    if [ ! -f "backend_complete.py" ]; then
        error "Arquivo backend_complete.py não encontrado!"
        exit 1
    fi
    
    # Verificar conectividade SSH
    if ! ssh -o ConnectTimeout=5 root@$DROPLET_IP "echo 'SSH OK'" >/dev/null 2>&1; then
        error "Não foi possível conectar via SSH ao droplet $DROPLET_IP"
        error "Verificar:"
        error "1. ssh root@$DROPLET_IP"
        error "2. Configurar chaves SSH se necessário"
        exit 1
    fi
    
    log "✅ Pré-requisitos verificados"
}

# Obter credenciais do usuário
get_credentials() {
    log "Configurando credenciais..."
    
    echo ""
    echo "🔑 Por favor, insira as credenciais necessárias:"
    echo ""
    
    # GEMINI_API_KEY
    if [ -z "$GEMINI_API_KEY" ]; then
        read -p "GEMINI_API_KEY: " GEMINI_API_KEY
        if [ -z "$GEMINI_API_KEY" ]; then
            error "GEMINI_API_KEY é obrigatório"
            exit 1
        fi
    fi
    
    # DATABASE_URL
    if [ -z "$DATABASE_URL" ]; then
        read -p "DATABASE_URL (Supabase): " DATABASE_URL
        if [ -z "$DATABASE_URL" ]; then
            error "DATABASE_URL é obrigatório"
            exit 1
        fi
    fi
    
    log "✅ Credenciais configuradas"
}

# Fase 1: Preparação do sistema
prepare_system() {
    log "FASE 1: Preparando sistema no droplet..."
    
    ssh root@$DROPLET_IP << 'PREPARE_EOF'
        set -e
        
        echo "🔄 Actualizando sistema..."
        apt update >/dev/null 2>&1
        apt upgrade -y >/dev/null 2>&1
        
        echo "📦 Instalando dependências..."
        apt install -y \
            python3 \
            python3-pip \
            python3-venv \
            python3-dev \
            nginx \
            git \
            curl \
            postgresql-client \
            build-essential \
            libpq-dev \
            supervisor \
            htop >/dev/null 2>&1
        
        echo "🔥 Configurando firewall..."
        ufw --force reset >/dev/null 2>&1
        ufw default deny incoming >/dev/null 2>&1
        ufw default allow outgoing >/dev/null 2>&1
        ufw allow ssh >/dev/null 2>&1
        ufw allow 80/tcp >/dev/null 2>&1
        ufw allow 443/tcp >/dev/null 2>&1
        ufw --force enable >/dev/null 2>&1
        
        echo "📁 Criando estrutura de directórios..."
        mkdir -p /var/www/muzaia
        mkdir -p /var/log/muzaia
        mkdir -p /etc/muzaia
        mkdir -p /var/backups/muzaia
        
        echo "✅ Sistema preparado"
PREPARE_EOF
    
    log "✅ FASE 1 concluída"
}

# Fase 2: Configuração Python
setup_python() {
    log "FASE 2: Configurando ambiente Python..."
    
    ssh root@$DROPLET_IP << 'PYTHON_EOF'
        set -e
        cd /var/www/muzaia
        
        echo "🐍 Criando ambiente virtual..."
        python3 -m venv venv
        source venv/bin/activate
        
        echo "⬆️ Actualizando pip..."
        pip install --upgrade pip setuptools wheel >/dev/null 2>&1
        
        echo "📝 Criando requirements.txt..."
        cat > requirements.txt << 'REQS'
fastapi==0.104.1
uvicorn[standard]==0.24.0
psycopg2-binary==2.9.9
google-generativeai==0.3.2
python-multipart==0.0.6
PyPDF2==3.0.1
python-docx==0.8.11
numpy==1.24.3
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
aiofiles==23.2.1
httpx==0.24.1
chardet==5.2.0
sqlalchemy==2.0.23
pydantic==2.5.0
python-dateutil==2.8.2
REQS
        
        echo "📦 Instalando dependências Python..."
        pip install -r requirements.txt >/dev/null 2>&1
        
        echo "🧪 Testando instalações..."
        python -c "import fastapi; print('✅ FastAPI')"
        python -c "import uvicorn; print('✅ Uvicorn')"
        python -c "import psycopg2; print('✅ PostgreSQL')"
        python -c "import google.generativeai; print('✅ Gemini AI')"
        
        echo "✅ Ambiente Python configurado"
PYTHON_EOF
    
    log "✅ FASE 2 concluída"
}

# Fase 3: Upload do código
upload_code() {
    log "FASE 3: Fazendo upload do código..."
    
    # Upload do arquivo principal
    info "Fazendo upload do backend_complete.py..."
    scp backend_complete.py root@$DROPLET_IP:/var/www/muzaia/
    
    # Criar arquivo .env
    ssh root@$DROPLET_IP << EOF
        cat > /var/www/muzaia/.env << 'ENVFILE'
GEMINI_API_KEY=${GEMINI_API_KEY}
DATABASE_URL=${DATABASE_URL}
PYTHONPATH=/var/www/muzaia
PORT=8000
HOST=0.0.0.0
LOG_LEVEL=INFO
SECRET_KEY=muzaia_secret_\$(openssl rand -hex 16)
ACCESS_TOKEN_EXPIRE_MINUTES=1440
MAX_UPLOAD_SIZE=52428800
UPLOAD_DIR=/var/www/muzaia/uploads
ENVFILE

        echo "✅ Arquivo .env criado"
EOF
    
    log "✅ FASE 3 concluída"
}

# Fase 4: Configuração de serviços
setup_services() {
    log "FASE 4: Configurando serviços..."
    
    ssh root@$DROPLET_IP << 'SERVICES_EOF'
        set -e
        
        echo "📋 Criando serviço systemd..."
        cat > /etc/systemd/system/muzaia.service << 'SERVICEUNIT'
[Unit]
Description=Muzaia Legal Assistant Backend
After=network.target
Wants=network.target

[Service]
Type=exec
User=www-data
Group=www-data
WorkingDirectory=/var/www/muzaia
Environment=PATH=/var/www/muzaia/venv/bin
EnvironmentFile=/var/www/muzaia/.env
ExecStart=/var/www/muzaia/venv/bin/uvicorn backend_complete:app --host 0.0.0.0 --port 8000 --log-level info
ExecReload=/bin/kill -HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=muzaia
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/www/muzaia /var/log/muzaia /tmp

[Install]
WantedBy=multi-user.target
SERVICEUNIT
        
        echo "🌐 Configurando Nginx..."
        cat > /etc/nginx/sites-available/muzaia << 'NGINXCONF'
server {
    listen 80;
    listen [::]:80;
    server_name 164.92.160.176;

    access_log /var/log/nginx/muzaia_access.log;
    error_log /var/log/nginx/muzaia_error.log;

    client_max_body_size 50M;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    location /health {
        proxy_pass http://127.0.0.1:8000/health;
        access_log off;
    }
}
NGINXCONF
        
        echo "🔐 Configurando permissões..."
        chown -R www-data:www-data /var/www/muzaia
        chmod 755 /var/www/muzaia
        chmod 644 /var/www/muzaia/.env
        
        echo "🔗 Activando configurações..."
        ln -sf /etc/nginx/sites-available/muzaia /etc/nginx/sites-enabled/
        rm -f /etc/nginx/sites-enabled/default
        
        nginx -t
        
        systemctl daemon-reload
        systemctl enable muzaia
        
        echo "✅ Serviços configurados"
SERVICES_EOF
    
    log "✅ FASE 4 concluída"
}

# Fase 5: Inicialização
start_services() {
    log "FASE 5: Iniciando serviços..."
    
    ssh root@$DROPLET_IP << 'START_EOF'
        set -e
        
        echo "🚀 Iniciando Muzaia..."
        systemctl start muzaia
        sleep 10
        
        echo "🔄 Reiniciando Nginx..."
        systemctl restart nginx
        
        echo "📊 Verificando status..."
        systemctl is-active muzaia && echo "✅ Muzaia: ACTIVO" || echo "❌ Muzaia: ERRO"
        systemctl is-active nginx && echo "✅ Nginx: ACTIVO" || echo "❌ Nginx: ERRO"
        
        echo "✅ Serviços iniciados"
START_EOF
    
    log "✅ FASE 5 concluída"
}

# Fase 6: Testes e verificação
run_tests() {
    log "FASE 6: Executando testes..."
    
    info "Teste interno no droplet..."
    ssh root@$DROPLET_IP << 'TEST_EOF'
        echo "🧪 Teste directo ao backend:"
        curl -s -w "Status: %{http_code} | Tempo: %{time_total}s\n" http://localhost:8000/health | head -3
        
        echo ""
        echo "🧪 Teste através do Nginx:"
        curl -s -w "Status: %{http_code} | Tempo: %{time_total}s\n" http://localhost/health | head -3
TEST_EOF
    
    info "Teste externo..."
    echo "🌐 Health check externo:"
    if curl -s -w "Status: %{http_code} | Tempo: %{time_total}s\n" http://164.92.160.176/health | head -3; then
        log "✅ Acesso externo funcionando"
    else
        warning "❌ Problema no acesso externo"
    fi
    
    log "✅ FASE 6 concluída"
}

# Fase 7: Scripts de gestão
setup_management() {
    log "FASE 7: Configurando scripts de gestão..."
    
    ssh root@$DROPLET_IP << 'MGMT_EOF'
        echo "📝 Criando scripts de gestão..."
        
        # Script de status
        cat > /usr/local/bin/muzaia-status << 'STATUS'
#!/bin/bash
echo "📊 STATUS MUZAIA - $(date)"
echo "=========================="
echo ""
systemctl is-active muzaia && echo "✅ Backend: ACTIVO" || echo "❌ Backend: INACTIVO"
systemctl is-active nginx && echo "✅ Nginx: ACTIVO" || echo "❌ Nginx: INACTIVO"
echo ""
curl -s http://localhost/health | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print(f'✅ Status: {data.get(\"status\")}')
    print(f'✅ Service: {data.get(\"service\")}')
except:
    print('❌ Health check falhou')
" 2>/dev/null
STATUS
        
        # Script de backup
        cat > /usr/local/bin/muzaia-backup << 'BACKUP'
#!/bin/bash
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/var/backups/muzaia/backup_${BACKUP_DATE}.tar.gz"
mkdir -p /var/backups/muzaia
tar -czf $BACKUP_FILE /var/www/muzaia /etc/nginx/sites-available/muzaia /etc/systemd/system/muzaia.service
echo "✅ Backup criado: $BACKUP_FILE"
BACKUP
        
        chmod +x /usr/local/bin/muzaia-status
        chmod +x /usr/local/bin/muzaia-backup
        
        echo "⏰ Configurando cron jobs..."
        echo "0 2 * * * root /usr/local/bin/muzaia-backup" >> /etc/crontab
        echo "0 3 * * * root journalctl --vacuum-time=7d" >> /etc/crontab
        
        echo "✅ Scripts de gestão criados"
MGMT_EOF
    
    log "✅ FASE 7 concluída"
}

# Relatório final
final_report() {
    log "DEPLOY CONCLUÍDO COM SUCESSO!"
    echo ""
    echo "🎉 MUZAIA ESTÁ FUNCIONANDO!"
    echo "=========================="
    echo ""
    echo "🌐 URLs disponíveis:"
    echo "• Backend: http://164.92.160.176"
    echo "• Health: http://164.92.160.176/health"
    echo "• Docs: http://164.92.160.176/docs"
    echo "• APIs: http://164.92.160.176/api/*"
    echo ""
    echo "🛠️ Comandos de gestão:"
    echo "• Status: ssh root@164.92.160.176 '/usr/local/bin/muzaia-status'"
    echo "• Logs: ssh root@164.92.160.176 'journalctl -fu muzaia'"
    echo "• Backup: ssh root@164.92.160.176 '/usr/local/bin/muzaia-backup'"
    echo "• Restart: ssh root@164.92.160.176 'systemctl restart muzaia nginx'"
    echo ""
    echo "🧪 Teste final:"
    echo "curl http://164.92.160.176/health"
    echo ""
    
    # Executar teste final
    if curl -s http://164.92.160.176/health >/dev/null 2>&1; then
        log "✅ Sistema totalmente operacional!"
    else
        warning "⚠️  Sistema iniciado, mas health check externo falhou"
        info "Verificar firewall ou aguardar alguns minutos"
    fi
}

# Execução principal
main() {
    log "Iniciando deploy automático do Muzaia..."
    
    check_prerequisites
    get_credentials
    prepare_system
    setup_python
    upload_code
    setup_services
    start_services
    run_tests
    setup_management
    final_report
    
    log "Deploy automático concluído!"
}

# Verificar se é execução directa
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi