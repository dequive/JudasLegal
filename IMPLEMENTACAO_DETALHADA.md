# Implementação Detalhada - Muzaia no Droplet DigitalOcean

## 🎯 Objectivo Final
Ter o sistema Muzaia funcionando em: **http://164.92.160.176**

---

# FASE 1: PREPARAÇÃO E VERIFICAÇÃO

## Passo 1.1: Verificar Conectividade SSH

### Comando para testar SSH:
```bash
ssh -o ConnectTimeout=10 root@164.92.160.176 "echo 'Conectividade SSH OK'"
```

**Se falhar, configurar SSH:**
```bash
# Gerar par de chaves SSH (se não existir)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""

# Copiar chave pública para o droplet
ssh-copy-id root@164.92.160.176

# Testar novamente
ssh root@164.92.160.176 "echo 'SSH configurado com sucesso'"
```

## Passo 1.2: Verificar Estado Actual do Droplet

### Conectar e verificar sistema:
```bash
ssh root@164.92.160.176 << 'EOF'
echo "=== INFORMAÇÕES DO SISTEMA ==="
echo "OS: $(lsb_release -d | cut -f2)"
echo "Kernel: $(uname -r)"
echo "CPU: $(nproc) cores"
echo "RAM: $(free -h | awk '/^Mem:/ {print $2}')"
echo "Disco: $(df -h / | awk 'NR==2 {print $4 " disponível"}')"
echo ""

echo "=== SERVIÇOS ACTUAIS ==="
systemctl is-active nginx 2>/dev/null && echo "✅ Nginx já instalado" || echo "❌ Nginx não instalado"
python3 --version 2>/dev/null && echo "✅ Python3: $(python3 --version)" || echo "❌ Python3 não instalado"
which pip3 >/dev/null 2>&1 && echo "✅ Pip3 disponível" || echo "❌ Pip3 não disponível"

echo ""
echo "=== PORTAS EM USO ==="
netstat -tulpn 2>/dev/null | grep -E ":(80|443|8000|3000|5000)" | head -10 || echo "Nenhuma porta conflitante detectada"
EOF
```

## Passo 1.3: Preparar Credenciais

### No terminal local, definir variáveis:
```bash
# Substituir pelos valores reais
export GEMINI_API_KEY="vossa_chave_gemini_aqui"
export DATABASE_URL="postgresql://postgres:senha@db.xxx.supabase.co:5432/postgres"

# Verificar se foram definidas
echo "GEMINI_API_KEY: ${GEMINI_API_KEY:0:10}..."
echo "DATABASE_URL: ${DATABASE_URL:0:30}..."
```

---

# FASE 2: CONFIGURAÇÃO DO SISTEMA

## Passo 2.1: Actualizar Sistema e Instalar Dependências

### Actualizar pacotes do sistema:
```bash
ssh root@164.92.160.176 << 'EOF'
echo "🔄 Actualizando sistema..."
apt update
apt upgrade -y

echo "📦 Instalando dependências essenciais..."
apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    nginx \
    git \
    curl \
    wget \
    unzip \
    postgresql-client \
    build-essential \
    libpq-dev \
    supervisor \
    htop \
    nano

echo "✅ Dependências instaladas"
EOF
```

## Passo 2.2: Configurar Firewall (UFW)

### Configurar regras de firewall:
```bash
ssh root@164.92.160.176 << 'EOF'
echo "🔥 Configurando firewall..."

# Activar UFW se não estiver
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Permitir SSH, HTTP, HTTPS
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp

# Activar firewall
ufw --force enable

echo "✅ Firewall configurado"
ufw status
EOF
```

## Passo 2.3: Criar Estrutura de Directórios

### Criar directórios da aplicação:
```bash
ssh root@164.92.160.176 << 'EOF'
echo "📁 Criando estrutura de directórios..."

# Criar directórios principais
mkdir -p /var/www/muzaia
mkdir -p /var/log/muzaia
mkdir -p /etc/muzaia
mkdir -p /var/backups/muzaia

# Definir permissões iniciais
chown -R www-data:www-data /var/www/muzaia
chown -R www-data:www-data /var/log/muzaia

echo "✅ Estrutura criada"
ls -la /var/www/
EOF
```

---

# FASE 3: CONFIGURAÇÃO PYTHON E AMBIENTE VIRTUAL

## Passo 3.1: Criar Ambiente Virtual Python

### Configurar ambiente virtual:
```bash
ssh root@164.92.160.176 << 'EOF'
cd /var/www/muzaia

echo "🐍 Criando ambiente virtual Python..."
python3 -m venv venv

echo "🔧 Activando ambiente virtual..."
source venv/bin/activate

echo "⬆️ Actualizando pip..."
pip install --upgrade pip setuptools wheel

echo "✅ Ambiente virtual criado"
which python
python --version
EOF
```

## Passo 3.2: Criar requirements.txt

### Criar ficheiro de dependências:
```bash
ssh root@164.92.160.176 << 'EOF'
cat > /var/www/muzaia/requirements.txt << 'REQS'
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
typing-extensions==4.8.0
REQS

echo "✅ Requirements.txt criado"
EOF
```

## Passo 3.3: Instalar Dependências Python

### Instalar todas as dependências:
```bash
ssh root@164.92.160.176 << 'EOF'
cd /var/www/muzaia
source venv/bin/activate

echo "📦 Instalando dependências Python..."
pip install -r requirements.txt

echo "🧪 Testando instalações críticas..."
python -c "import fastapi; print('✅ FastAPI OK')"
python -c "import uvicorn; print('✅ Uvicorn OK')"
python -c "import psycopg2; print('✅ PostgreSQL OK')"
python -c "import google.generativeai; print('✅ Gemini AI OK')"

echo "✅ Todas as dependências instaladas"
EOF
```

---

# FASE 4: UPLOAD E CONFIGURAÇÃO DO CÓDIGO

## Passo 4.1: Upload do Código Principal

### Fazer upload do backend_complete.py:
```bash
echo "📤 Fazendo upload do código principal..."
scp backend_complete.py root@164.92.160.176:/var/www/muzaia/

# Verificar upload
ssh root@164.92.160.176 "ls -la /var/www/muzaia/backend_complete.py"
```

## Passo 4.2: Criar Arquivo de Configuração

### Criar ficheiro .env com credenciais:
```bash
ssh root@164.92.160.176 << EOF
cat > /var/www/muzaia/.env << 'ENVFILE'
# Configurações da API
GEMINI_API_KEY=${GEMINI_API_KEY}
DATABASE_URL=${DATABASE_URL}

# Configurações do servidor
PYTHONPATH=/var/www/muzaia
PORT=8000
HOST=0.0.0.0

# Configurações de logging
LOG_LEVEL=INFO
LOG_FILE=/var/log/muzaia/app.log

# Configurações de segurança
SECRET_KEY=muzaia_secret_key_$(openssl rand -hex 16)
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Configurações de upload
MAX_UPLOAD_SIZE=52428800
UPLOAD_DIR=/var/www/muzaia/uploads
ENVFILE

echo "✅ Arquivo .env criado"
EOF
```

## Passo 4.3: Criar Script de Inicialização

### Criar script para iniciar aplicação:
```bash
ssh root@164.92.160.176 << 'EOF'
cat > /var/www/muzaia/start.sh << 'STARTSCRIPT'
#!/bin/bash

# Ir para directório da aplicação
cd /var/www/muzaia

# Carregar variáveis de ambiente
source .env

# Activar ambiente virtual
source venv/bin/activate

# Criar directórios necessários
mkdir -p uploads
mkdir -p /var/log/muzaia

# Iniciar aplicação
exec uvicorn backend_complete:app \
    --host ${HOST:-0.0.0.0} \
    --port ${PORT:-8000} \
    --log-level ${LOG_LEVEL:-info} \
    --access-log \
    --reload
STARTSCRIPT

chmod +x /var/www/muzaia/start.sh
echo "✅ Script de inicialização criado"
EOF
```

---

# FASE 5: CONFIGURAÇÃO DE SERVIÇOS SYSTEMD

## Passo 5.1: Criar Serviço Systemd

### Criar ficheiro de serviço:
```bash
ssh root@164.92.160.176 << 'EOF'
cat > /etc/systemd/system/muzaia.service << 'SERVICEUNIT'
[Unit]
Description=Muzaia Legal Assistant Backend
Documentation=https://github.com/muzaia/backend
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

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=muzaia

# Security settings
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/www/muzaia /var/log/muzaia /tmp

[Install]
WantedBy=multi-user.target
SERVICEUNIT

echo "✅ Serviço systemd criado"
EOF
```

## Passo 5.2: Configurar Permissões e Activar Serviço

### Definir permissões e activar:
```bash
ssh root@164.92.160.176 << 'EOF'
echo "🔐 Configurando permissões..."

# Ajustar permissões de ficheiros
chown -R www-data:www-data /var/www/muzaia
chmod 755 /var/www/muzaia
chmod 644 /var/www/muzaia/.env
chmod +x /var/www/muzaia/start.sh

# Recarregar systemd
systemctl daemon-reload

# Activar serviço
systemctl enable muzaia

echo "✅ Serviço configurado e activado"
EOF
```

---

# FASE 6: CONFIGURAÇÃO NGINX

## Passo 6.1: Criar Configuração Nginx

### Configurar proxy reverso:
```bash
ssh root@164.92.160.176 << 'EOF'
cat > /etc/nginx/sites-available/muzaia << 'NGINXCONF'
server {
    listen 80;
    listen [::]:80;
    server_name 164.92.160.176;

    # Logs
    access_log /var/log/nginx/muzaia_access.log;
    error_log /var/log/nginx/muzaia_error.log;

    # Limite de upload
    client_max_body_size 50M;

    # Headers de segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Proxy para backend
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
        
        # Timeouts
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # Health check especial
    location /health {
        proxy_pass http://127.0.0.1:8000/health;
        access_log off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Arquivos estáticos (se houver)
    location /static/ {
        alias /var/www/muzaia/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINXCONF

echo "✅ Configuração Nginx criada"
EOF
```

## Passo 6.2: Activar Site e Testar Configuração

### Activar site e verificar configuração:
```bash
ssh root@164.92.160.176 << 'EOF'
echo "🔗 Activando site Nginx..."

# Activar site
ln -sf /etc/nginx/sites-available/muzaia /etc/nginx/sites-enabled/

# Remover site padrão
rm -f /etc/nginx/sites-enabled/default

# Testar configuração
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuração Nginx válida"
else
    echo "❌ Erro na configuração Nginx"
    exit 1
fi

echo "✅ Site Nginx configurado"
EOF
```

---

# FASE 7: INICIALIZAÇÃO DOS SERVIÇOS

## Passo 7.1: Iniciar Serviço Muzaia

### Iniciar backend:
```bash
ssh root@164.92.160.176 << 'EOF'
echo "🚀 Iniciando serviço Muzaia..."

# Iniciar serviço
systemctl start muzaia

# Aguardar inicialização
sleep 10

# Verificar status
systemctl is-active muzaia
systemctl status muzaia --no-pager -l

echo "📊 Status do serviço:"
systemctl is-active muzaia && echo "✅ Muzaia: ACTIVO" || echo "❌ Muzaia: ERRO"
EOF
```

## Passo 7.2: Iniciar e Configurar Nginx

### Iniciar nginx:
```bash
ssh root@164.92.160.176 << 'EOF'
echo "🔄 Reiniciando Nginx..."

# Reiniciar nginx
systemctl restart nginx

# Verificar status
systemctl is-active nginx
systemctl status nginx --no-pager -l

echo "📊 Status do Nginx:"
systemctl is-active nginx && echo "✅ Nginx: ACTIVO" || echo "❌ Nginx: ERRO"
EOF
```

---

# FASE 8: TESTES E VERIFICAÇÃO

## Passo 8.1: Testes Internos (no droplet)

### Testar conectividade interna:
```bash
ssh root@164.92.160.176 << 'EOF'
echo "🧪 Executando testes internos..."

echo "1. Teste directo ao backend (porta 8000):"
curl -s -w "Status: %{http_code} | Tempo: %{time_total}s\n" http://localhost:8000/health | head -5

echo ""
echo "2. Teste através do Nginx (porta 80):"
curl -s -w "Status: %{http_code} | Tempo: %{time_total}s\n" http://localhost/health | head -5

echo ""
echo "3. Teste de API de chat:"
curl -s -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "teste"}' | head -3

echo ""
echo "4. Verificar logs recentes:"
journalctl -u muzaia -n 5 --no-pager
EOF
```

## Passo 8.2: Testes Externos

### Testar acesso externo:
```bash
echo "🌐 Testando acesso externo..."

echo "1. Health check externo:"
curl -s -w "Status: %{http_code} | Tempo: %{time_total}s\n" http://164.92.160.176/health

echo ""
echo "2. Teste de API externa:"
curl -s -I http://164.92.160.176/api/legal/hierarchy | head -3

echo ""
echo "3. Teste de documentação:"
curl -s -I http://164.92.160.176/docs | head -3
```

## Passo 8.3: Verificação Completa do Sistema

### Status geral do sistema:
```bash
ssh root@164.92.160.176 << 'EOF'
echo "📊 RELATÓRIO FINAL DO SISTEMA"
echo "============================="

echo ""
echo "🔍 Serviços:"
systemctl is-active muzaia && echo "✅ Muzaia Backend: ACTIVO" || echo "❌ Muzaia Backend: INACTIVO"
systemctl is-active nginx && echo "✅ Nginx Proxy: ACTIVO" || echo "❌ Nginx Proxy: INACTIVO"

echo ""
echo "🌐 Portas:"
netstat -tulpn | grep -E ":(80|8000)" | awk '{print $1 " " $4}' | sort

echo ""
echo "💾 Uso de Recursos:"
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "RAM: $(free -h | awk 'NR==2{printf "%.1f%% (%s/%s)", $3*100/$2, $3, $2}')"
echo "Disco: $(df -h /var/www/muzaia | awk 'NR==2{print $5 " usado de " $2}')"

echo ""
echo "📋 Logs mais recentes:"
journalctl -u muzaia -n 3 --no-pager | tail -3

echo ""
echo "🎯 URLs Disponíveis:"
echo "• Backend: http://164.92.160.176"
echo "• Health: http://164.92.160.176/health"
echo "• Docs: http://164.92.160.176/docs"
echo "• APIs: http://164.92.160.176/api/*"
EOF
```

---

# FASE 9: CONFIGURAÇÃO DE GESTÃO E MONITORIZAÇÃO

## Passo 9.1: Criar Scripts de Gestão

### Script de backup:
```bash
ssh root@164.92.160.176 << 'EOF'
cat > /usr/local/bin/muzaia-backup << 'BACKUP'
#!/bin/bash
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/var/backups/muzaia/backup_${BACKUP_DATE}.tar.gz"

mkdir -p /var/backups/muzaia

echo "💾 Criando backup: $BACKUP_FILE"
tar -czf $BACKUP_FILE \
    /var/www/muzaia \
    /etc/nginx/sites-available/muzaia \
    /etc/systemd/system/muzaia.service

echo "✅ Backup criado: $(ls -lh $BACKUP_FILE | awk '{print $5}')"
BACKUP

chmod +x /usr/local/bin/muzaia-backup
echo "✅ Script de backup criado"
EOF
```

### Script de status:
```bash
ssh root@164.92.160.176 << 'EOF'
cat > /usr/local/bin/muzaia-status << 'STATUS'
#!/bin/bash
echo "📊 STATUS MUZAIA - $(date)"
echo "=========================="

echo ""
echo "🔍 Serviços:"
systemctl is-active muzaia && echo "✅ Backend: ACTIVO" || echo "❌ Backend: INACTIVO"
systemctl is-active nginx && echo "✅ Nginx: ACTIVO" || echo "❌ Nginx: INACTIVO"

echo ""
echo "🧪 Health Check:"
curl -s http://localhost/health | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print(f'✅ Status: {data.get(\"status\")}')
    print(f'✅ Service: {data.get(\"service\")}')
    print(f'✅ AI: {data.get(\"ai\")}')
except:
    print('❌ Health check falhou')
" 2>/dev/null

echo ""
echo "📊 Recursos:"
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "RAM: $(free -h | awk 'NR==2{printf "%.1f%%", $3*100/$2}')"

echo ""
echo "📋 Últimos logs:"
journalctl -u muzaia -n 3 --no-pager | tail -3
STATUS

chmod +x /usr/local/bin/muzaia-status
echo "✅ Script de status criado"
EOF
```

## Passo 9.2: Configurar Cron Jobs

### Configurar tarefas agendadas:
```bash
ssh root@164.92.160.176 << 'EOF'
echo "⏰ Configurando tarefas agendadas..."

# Backup diário às 2:00
echo "0 2 * * * root /usr/local/bin/muzaia-backup" >> /etc/crontab

# Limpeza de logs antigos (manter últimos 7 dias)
echo "0 3 * * * root journalctl --vacuum-time=7d" >> /etc/crontab

# Reinicialização semanal (domingo às 4:00)
echo "0 4 * * 0 root systemctl restart muzaia nginx" >> /etc/crontab

echo "✅ Cron jobs configurados"
crontab -l
EOF
```

---

# RESULTADO FINAL

## URLs Disponíveis:
- **Backend Principal**: http://164.92.160.176
- **Health Check**: http://164.92.160.176/health
- **Documentação API**: http://164.92.160.176/docs
- **Chat Jurídico**: http://164.92.160.176/api/chat
- **Admin**: http://164.92.160.176/api/admin/stats

## Comandos de Gestão:
```bash
# Status do sistema
ssh root@164.92.160.176 '/usr/local/bin/muzaia-status'

# Backup manual
ssh root@164.92.160.176 '/usr/local/bin/muzaia-backup'

# Logs em tempo real
ssh root@164.92.160.176 'journalctl -fu muzaia'

# Reiniciar serviços
ssh root@164.92.160.176 'systemctl restart muzaia nginx'
```

## Verificação Final:
```bash
curl http://164.92.160.176/health
```

**Tempo total estimado**: 15-25 minutos para implementação completa.