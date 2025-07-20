#!/bin/bash

echo "🚀 Deploy Muzaia no Droplet DigitalOcean"
echo "========================================"
echo "IP: 164.92.160.176"
echo ""

# Configurações
DROPLET_IP="164.92.160.176"
APP_DIR="/var/www/muzaia"
SERVICE_NAME="muzaia-backend"

echo "📋 Este script vai:"
echo "1. Conectar ao droplet via SSH"
echo "2. Instalar dependências necessárias"
echo "3. Fazer deploy do código"
echo "4. Configurar como serviço systemd"
echo "5. Configurar nginx como proxy"
echo ""

read -p "Tem acesso SSH ao droplet? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Precisa de acesso SSH primeiro"
    echo ""
    echo "Para configurar SSH:"
    echo "1. ssh-keygen -t rsa -b 4096"
    echo "2. ssh-copy-id root@164.92.160.176"
    echo "3. Ou adicionar chave no painel DigitalOcean"
    exit 1
fi

echo "🔑 Configurar variáveis de ambiente:"
echo ""
read -p "GEMINI_API_KEY: " GEMINI_KEY
read -p "DATABASE_URL (Supabase): " DATABASE_URL

echo ""
echo "📦 Criando arquivos de configuração..."

# Criar script de setup remoto
cat > setup-droplet.sh << 'EOF'
#!/bin/bash

echo "🔧 Configurando Droplet para Muzaia"

# Atualizar sistema
apt update && apt upgrade -y

# Instalar dependências
apt install -y python3 python3-pip python3-venv nginx git postgresql-client curl

# Criar diretório da aplicação
mkdir -p /var/www/muzaia
cd /var/www/muzaia

# Criar ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Clonar código (ou criar arquivos)
echo "Criando estrutura da aplicação..."

# Criar requirements.txt
cat > requirements.txt << 'REQS'
fastapi==0.104.1
uvicorn==0.24.0
psycopg2-binary==2.9.9
google-generativeai==0.3.2
python-multipart==0.0.6
PyPDF2==3.0.1
python-docx==0.8.11
numpy==1.24.3
python-jose==3.3.0
passlib==1.7.4
aiofiles==23.2.1
httpx==0.24.1
chardet==5.2.0
sqlalchemy==2.0.23
pydantic==2.5.0
REQS

# Instalar dependências
pip install -r requirements.txt

echo "✅ Dependências instaladas"
EOF

# Criar serviço systemd
cat > muzaia.service << 'EOF'
[Unit]
Description=Muzaia Backend FastAPI
After=network.target

[Service]
Type=exec
User=www-data
Group=www-data
WorkingDirectory=/var/www/muzaia
Environment=PATH=/var/www/muzaia/venv/bin
EnvironmentFile=/var/www/muzaia/.env
ExecStart=/var/www/muzaia/venv/bin/uvicorn backend_complete:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# Criar configuração nginx
cat > muzaia-nginx.conf << 'EOF'
server {
    listen 80;
    server_name 164.92.160.176;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Para uploads grandes
        client_max_body_size 50M;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /health {
        proxy_pass http://127.0.0.1:8000/health;
        access_log off;
    }
}
EOF

# Criar arquivo de variáveis de ambiente
cat > .env << EOF
GEMINI_API_KEY=${GEMINI_KEY}
DATABASE_URL=${DATABASE_URL}
PYTHONPATH=/var/www/muzaia
PORT=8000
EOF

echo "✅ Arquivos de configuração criados"
echo ""

# Verificar conectividade SSH
echo "🔍 Testando conexão SSH..."
if ssh -o ConnectTimeout=5 root@$DROPLET_IP "echo 'SSH OK'" 2>/dev/null; then
    echo "✅ SSH funcionando"
else
    echo "❌ Erro SSH. Verificar:"
    echo "1. ssh root@164.92.160.176"
    echo "2. Chaves SSH configuradas"
    echo "3. Firewall permite SSH (porta 22)"
    exit 1
fi

echo ""
echo "📁 Fazendo upload dos arquivos..."

# Upload do código principal
scp backend_complete.py root@$DROPLET_IP:/tmp/
scp requirements.txt root@$DROPLET_IP:/tmp/
scp setup-droplet.sh root@$DROPLET_IP:/tmp/
scp muzaia.service root@$DROPLET_IP:/tmp/
scp muzaia-nginx.conf root@$DROPLET_IP:/tmp/
scp .env root@$DROPLET_IP:/tmp/

echo "✅ Upload concluído"
echo ""

echo "🔧 Configurando droplet..."

# Executar setup no droplet
ssh root@$DROPLET_IP << 'REMOTE'
    echo "🚀 Iniciando configuração..."
    
    # Executar script de setup
    chmod +x /tmp/setup-droplet.sh
    /tmp/setup-droplet.sh
    
    # Mover arquivos para local correto
    cp /tmp/backend_complete.py /var/www/muzaia/
    cp /tmp/.env /var/www/muzaia/
    
    # Configurar serviço
    cp /tmp/muzaia.service /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable muzaia
    
    # Configurar nginx
    cp /tmp/muzaia-nginx.conf /etc/nginx/sites-available/muzaia
    ln -sf /etc/nginx/sites-available/muzaia /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Testar configuração nginx
    nginx -t
    
    # Definir permissões
    chown -R www-data:www-data /var/www/muzaia
    
    echo "✅ Configuração base concluída"
REMOTE

echo ""
echo "🚀 Iniciando serviços..."

ssh root@$DROPLET_IP << 'REMOTE'
    # Iniciar serviços
    systemctl restart muzaia
    systemctl restart nginx
    
    # Verificar status
    echo "📊 Status dos serviços:"
    systemctl is-active muzaia && echo "✅ Muzaia: ativo" || echo "❌ Muzaia: erro"
    systemctl is-active nginx && echo "✅ Nginx: ativo" || echo "❌ Nginx: erro"
    
    # Teste de conectividade
    echo ""
    echo "🧪 Teste local:"
    curl -s http://localhost:8000/health | head -3 || echo "❌ Backend não responde"
REMOTE

echo ""
echo "✅ DEPLOY CONCLUÍDO!"
echo "=================="
echo ""
echo "🌐 URLs disponíveis:"
echo "• Backend: http://164.92.160.176"
echo "• Health: http://164.92.160.176/health"
echo "• APIs: http://164.92.160.176/api/*"
echo ""
echo "🧪 Testar agora:"
echo "curl http://164.92.160.176/health"
echo ""
echo "📋 Gestão do serviço:"
echo "• Logs: ssh root@164.92.160.176 'journalctl -fu muzaia'"
echo "• Restart: ssh root@164.92.160.176 'systemctl restart muzaia'"
echo "• Status: ssh root@164.92.160.176 'systemctl status muzaia'"
echo ""
echo "🔧 Próximos passos:"
echo "1. Testar todas as APIs"
echo "2. Configurar domínio (opcional)"
echo "3. Configurar SSL com Let's Encrypt"
echo "4. Configurar frontend para usar http://164.92.160.176"

# Limpeza
rm -f setup-droplet.sh muzaia.service muzaia-nginx.conf .env

echo ""
echo "🎉 Muzaia está agora rodando no vosso droplet!"