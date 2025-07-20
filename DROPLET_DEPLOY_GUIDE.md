# Guia Passo-a-Passo: Deploy Muzaia no Droplet

## 📋 Informações do Droplet
- **IP**: 164.92.160.176
- **SO**: Ubuntu (assumido)
- **Acesso**: SSH necessário

## 🎯 Objectivo Final
Ter o Muzaia rodando em: `http://164.92.160.176`

## 📝 Passo-a-Passo Detalhado

### **Passo 1: Verificar Acesso SSH**
```bash
# Testar conectividade SSH
ssh root@164.92.160.176

# Se não funcionar, configurar chaves SSH:
ssh-keygen -t rsa -b 4096
ssh-copy-id root@164.92.160.176
```

### **Passo 2: Preparar Credenciais**
Antes de começar, ter prontos:
- **GEMINI_API_KEY**: Chave do Google Gemini
- **DATABASE_URL**: URL completa do Supabase
  ```
  postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
  ```

### **Passo 3: Executar Deploy Automático**
```bash
# No Replit, executar:
./deploy-droplet.sh
```

**O que acontece internamente:**

#### 3.1 Configuração Inicial no Droplet
```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar dependências
apt install -y python3 python3-pip python3-venv nginx git postgresql-client curl
```

#### 3.2 Criar Estrutura da Aplicação
```bash
# Criar directório
mkdir -p /var/www/muzaia
cd /var/www/muzaia

# Ambiente virtual Python
python3 -m venv venv
source venv/bin/activate

# Instalar dependências Python
pip install fastapi uvicorn psycopg2-binary google-generativeai python-multipart PyPDF2 python-docx
```

#### 3.3 Upload e Configuração do Código
```bash
# Upload arquivos via SCP
scp backend_complete.py root@164.92.160.176:/var/www/muzaia/
scp requirements.txt root@164.92.160.176:/var/www/muzaia/

# Criar arquivo de variáveis
echo "GEMINI_API_KEY=vossa_chave" > /var/www/muzaia/.env
echo "DATABASE_URL=vossa_url_supabase" >> /var/www/muzaia/.env
```

#### 3.4 Configurar Serviço Systemd
```bash
# Criar /etc/systemd/system/muzaia.service
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
```

#### 3.5 Configurar Nginx como Proxy
```bash
# Criar /etc/nginx/sites-available/muzaia
server {
    listen 80;
    server_name 164.92.160.176;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 50M;
    }
}
```

#### 3.6 Activar e Iniciar Serviços
```bash
# Activar serviço Muzaia
systemctl daemon-reload
systemctl enable muzaia
systemctl start muzaia

# Configurar Nginx
ln -sf /etc/nginx/sites-available/muzaia /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
systemctl restart nginx

# Definir permissões
chown -R www-data:www-data /var/www/muzaia
```

### **Passo 4: Verificação e Testes**

#### 4.1 Verificar Status dos Serviços
```bash
# SSH no droplet
ssh root@164.92.160.176

# Verificar status
systemctl status muzaia
systemctl status nginx
```

#### 4.2 Testes de Conectividade
```bash
# Teste interno (no droplet)
curl http://localhost:8000/health

# Teste externo (do vosso computador)
curl http://164.92.160.176/health
```

#### 4.3 Testar APIs Principais
```bash
# Health check
curl http://164.92.160.176/health

# Chat API
curl -X POST http://164.92.160.176/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "O que é um contrato?"}'

# Hierarquia legal
curl http://164.92.160.176/api/legal/hierarchy
```

### **Passo 5: Gestão e Monitorização**

#### 5.1 Ver Logs em Tempo Real
```bash
ssh root@164.92.160.176 'journalctl -fu muzaia'
```

#### 5.2 Reiniciar Serviços
```bash
ssh root@164.92.160.176 'systemctl restart muzaia'
```

#### 5.3 Usar Script de Gestão
```bash
# No Replit
./manage-droplet.sh
```

## 🔧 Solução de Problemas

### **Problema: SSH não conecta**
```bash
# Verificar se SSH está activo
nmap -p 22 164.92.160.176

# Configurar chaves SSH
ssh-keygen -t rsa
ssh-copy-id root@164.92.160.176
```

### **Problema: Serviço não inicia**
```bash
# Verificar logs
ssh root@164.92.160.176 'journalctl -u muzaia --no-pager'

# Verificar dependências
ssh root@164.92.160.176 'cd /var/www/muzaia && source venv/bin/activate && python -c "import fastapi; print(\"OK\")"'
```

### **Problema: Nginx erro 502**
```bash
# Verificar se backend está rodando
ssh root@164.92.160.176 'curl http://localhost:8000/health'

# Verificar configuração Nginx
ssh root@164.92.160.176 'nginx -t'
```

### **Problema: Base de dados não conecta**
```bash
# Testar conectividade Supabase
ssh root@164.92.160.176 'psql "postgresql://postgres:password@db.xxx.supabase.co:5432/postgres" -c "SELECT 1;"'
```

## ✅ Resultado Final

Após conclusão bem-sucedida:

### **URLs Funcionais:**
- **Backend**: http://164.92.160.176
- **Health**: http://164.92.160.176/health
- **Chat**: http://164.92.160.176/api/chat
- **Admin**: http://164.92.160.176/api/admin/stats
- **Docs**: http://164.92.160.176/docs

### **Serviços Activos:**
- ✅ Muzaia Backend (porta 8000)
- ✅ Nginx Proxy (porta 80)
- ✅ Systemd auto-restart
- ✅ Logs centralizados

### **Funcionalidades Disponíveis:**
- ✅ Chat jurídico com Gemini AI
- ✅ Upload de documentos legais
- ✅ Sistema RAG completo
- ✅ 15+ APIs administrativas
- ✅ Análise de complexidade jurídica

## 🚀 Próximos Passos Opcionais

### **1. Configurar HTTPS (se tiver domínio)**
```bash
./setup-ssl.sh
```

### **2. Configurar Frontend**
Actualizar frontend para usar:
```javascript
const BACKEND_URL = 'http://164.92.160.176';
```

### **3. Backup Automático**
```bash
./manage-droplet.sh # Opção 7
```

## 📞 Comandos de Emergência

```bash
# Parar tudo
ssh root@164.92.160.176 'systemctl stop muzaia nginx'

# Reiniciar tudo
ssh root@164.92.160.176 'systemctl restart muzaia nginx'

# Ver tudo
ssh root@164.92.160.176 'systemctl status muzaia nginx'
```