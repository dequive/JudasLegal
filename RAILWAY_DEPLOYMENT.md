# Deploy Railway - Guia Completo

## 🚂 Por que Railway?

Railway é uma plataforma moderna de deploy que oferece:
- ✅ **$5 grátis** para começar
- ✅ **Deploy em 2-3 minutos**
- ✅ **HTTPS automático**
- ✅ **Logs em tempo real**
- ✅ **Métricas detalhadas**
- ✅ **Restart automático**
- ✅ **Domínios personalizados**

## 🎯 Processo Completo

### Método 1: Script Automatizado (Recomendado)

```bash
# Preparar arquivos Railway
./deploy-railway.sh

# Configurar Git + GitHub + Railway
./railway-setup-complete.sh
```

### Método 2: Manual

#### Passo 1: Preparar Arquivos
```bash
./deploy-railway.sh
```

#### Passo 2: GitHub
1. Criar repositório: https://github.com/new
2. Nome: `muzaia-backend`
3. Push código:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU_USUARIO/muzaia-backend.git
git push -u origin main
```

#### Passo 3: Railway
1. Ir para https://railway.app
2. Criar conta (recomendo GitHub)
3. **New Project** > **Deploy from GitHub repo**
4. Selecionar `muzaia-backend`
5. Configurar variáveis:
   - `GEMINI_API_KEY` = vossa chave
   - `DATABASE_URL` = vossa URL Supabase

## 📋 Arquivos Criados

### `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn backend_complete:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ['python311', 'postgresql']

[phases.install]
cmds = [
    'pip install --upgrade pip',
    'pip install -r requirements.txt'
]

[start]
cmd = 'uvicorn backend_complete:app --host 0.0.0.0 --port $PORT --workers 1'
```

### `requirements.txt`
```
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
gunicorn==21.2.0
```

## 🔧 Variáveis de Ambiente

No painel Railway, configurar:

```
GEMINI_API_KEY = vossa_chave_gemini_aqui
DATABASE_URL = postgresql://postgres:senha@db.xxx.supabase.co:5432/postgres
```

## 🌐 URLs Resultantes

Após deploy:
- **Backend**: `https://muzaia-backend-production-xxxx.up.railway.app`
- **Health**: `https://muzaia-backend-production-xxxx.up.railway.app/health`
- **Docs**: `https://muzaia-backend-production-xxxx.up.railway.app/docs`
- **Chat**: `https://muzaia-backend-production-xxxx.up.railway.app/api/chat`

## 🧪 Testes

```bash
# Health check
curl https://vossa-url.up.railway.app/health

# Chat API
curl -X POST https://vossa-url.up.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "O que é um contrato?"}'

# Hierarquia legal
curl https://vossa-url.up.railway.app/api/legal/hierarchy
```

## 💰 Custos Railway

- **$5 grátis** para começar
- **~$0.10/hora** quando em uso
- **$0/hora** quando inactivo (suspende automaticamente)
- **Estimativa**: $2-5/mês para uso moderado

## 📊 Monitorização

Railway fornece:
- **Logs em tempo real**
- **Métricas de CPU/RAM**
- **Tempo de resposta**
- **Número de requests**
- **Status de deploy**

## 🔧 Gestão

### Logs
```bash
# Via CLI (se instalado)
railway logs

# Via web: https://railway.app > Projeto > Logs
```

### Restart
```bash
# Via CLI
railway restart

# Via web: https://railway.app > Projeto > Settings > Restart
```

### Variáveis
```bash
# Via CLI
railway variables set GEMINI_API_KEY=nova_chave

# Via web: https://railway.app > Projeto > Variables
```

## ⚡ Vantagens vs Outras Plataformas

| Aspecto | Railway | Render | Vercel | DigitalOcean |
|---------|---------|---------|---------|--------------|
| **Setup** | 2 min | 5 min | 3 min | 30+ min |
| **Custo** | $5 grátis | 750h grátis | Grátis | $12+/mês |
| **Python** | ✅ Excelente | ✅ Bom | ⚠️ Serverless | ✅ Manual |
| **Logs** | ✅ Tempo real | ✅ Bom | ⚠️ Limitado | ⚠️ Manual |
| **Domínios** | ✅ Grátis | ✅ Grátis | ✅ Grátis | ⚠️ Manual |

## 🚀 Comando Rápido

Para deploy imediato:

```bash
# Tudo em um comando
./railway-setup-complete.sh
```

Railway é perfeito para o Muzaia - estável, rápido e com excelente suporte para Python!