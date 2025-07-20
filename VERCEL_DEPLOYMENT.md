# Deploy Vercel - Guia Completo

## ▲ Por que Vercel?

Vercel é uma plataforma serverless moderna que oferece:
- ✅ **Deploy gratuito** para hobby projects
- ✅ **Deploy em segundos**
- ✅ **HTTPS automático**
- ✅ **CDN global**
- ✅ **Integração GitHub perfeita**
- ✅ **Serverless scaling**
- ✅ **Analytics incluídas**

## 🎯 Processo Completo

### Método 1: Script Automatizado (Recomendado)

```bash
# Preparar arquivos Vercel
./deploy-vercel.sh

# Configurar tudo automaticamente
./vercel-setup-complete.sh
```

### Método 2: Manual

#### Passo 1: Preparar Arquivos
```bash
./deploy-vercel.sh
```

#### Passo 2: Instalar Vercel CLI
```bash
npm i -g vercel
vercel login
```

#### Passo 3: Deploy
```bash
vercel --prod
```

#### Passo 4: Configurar Variáveis
```bash
./vercel-env-setup.sh
```

## 📋 Arquivos Criados

### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend_complete.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "backend_complete.py"
    }
  ],
  "env": {
    "GEMINI_API_KEY": "@gemini_api_key",
    "DATABASE_URL": "@database_url"
  },
  "functions": {
    "backend_complete.py": {
      "maxDuration": 30
    }
  }
}
```

### `api/index.py`
```python
# Vercel entry point for FastAPI
import sys
import os

# Add the root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend_complete import app

# Export the FastAPI app for Vercel
handler = app
```

### `requirements.txt`
```
fastapi==0.104.1
uvicorn==0.24.0
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
```

## 🔧 Configuração Variáveis

### Via CLI
```bash
# Adicionar variáveis
vercel env add GEMINI_API_KEY production
vercel env add DATABASE_URL production

# Verificar variáveis
vercel env ls
```

### Via Painel Web
1. Ir para https://vercel.com/dashboard
2. Selecionar projeto
3. Settings > Environment Variables
4. Adicionar:
   - `GEMINI_API_KEY` = vossa chave
   - `DATABASE_URL` = vossa URL Supabase

## 🌐 URLs Resultantes

Após deploy:
- **Backend**: `https://muzaia-backend.vercel.app`
- **Health**: `https://muzaia-backend.vercel.app/health`
- **Docs**: `https://muzaia-backend.vercel.app/docs`
- **Chat**: `https://muzaia-backend.vercel.app/api/chat`

## 🧪 Testes

```bash
# Health check
curl https://muzaia-backend.vercel.app/health

# Chat API
curl -X POST https://muzaia-backend.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "O que é um contrato?"}'

# Hierarquia legal
curl https://muzaia-backend.vercel.app/api/legal/hierarchy
```

## 💰 Custos Vercel

### Hobby Plan (Gratuito)
- **100GB** bandwidth/mês
- **100GB-hours** serverless function execution
- **HTTPS** e CDN incluídos
- **Deploy** ilimitado
- **Domínios personalizados**

### Pro Plan ($20/mês)
- **1TB** bandwidth/mês
- **1000GB-hours** function execution
- **Analytics avançadas**
- **Suporte prioritário**

## 📊 Monitorização

Vercel fornece:
- **Real-time analytics**
- **Performance insights**
- **Error tracking**
- **Function logs**
- **Deploy history**

## 🔧 Gestão

### Deploy
```bash
# Deploy production
vercel --prod

# Deploy preview
vercel

# Deploy específico
vercel --target production
```

### Logs
```bash
# Ver logs recentes
vercel logs

# Logs específicos
vercel logs [deployment-url]
```

### Domínios
```bash
# Adicionar domínio personalizado
vercel domains add muzaia.com

# Listar domínios
vercel domains ls
```

### Variáveis
```bash
# Listar variáveis
vercel env ls

# Adicionar variável
vercel env add

# Remover variável
vercel env rm NOME_VARIAVEL
```

## ⚡ Integração GitHub

### Configuração Automática
1. Push código para GitHub
2. Conectar Vercel ao repositório
3. Deploy automático em cada push
4. Preview deployments para pull requests

### Configuração Manual
```bash
# Conectar repositório existente
vercel --repo

# Configurar auto-deploy
vercel git connect
```

## 🚀 Vantagens vs Outras Plataformas

| Aspecto | Vercel | Railway | Render | DigitalOcean |
|---------|---------|---------|---------|--------------|
| **Setup** | 30 seg | 2 min | 5 min | 30+ min |
| **Custo** | Gratuito | $5 grátis | 750h grátis | $12+/mês |
| **Scaling** | ✅ Auto | ⚠️ Manual | ⚠️ Manual | ⚠️ Manual |
| **CDN** | ✅ Global | ❌ | ❌ | ⚠️ Manual |
| **Analytics** | ✅ Incluído | ⚠️ Básico | ⚠️ Básico | ❌ |
| **Deploy Speed** | ✅ Segundos | ✅ Minutos | ⚠️ Minutos | ❌ Manual |

## 📱 Comandos Essenciais

```bash
# Setup inicial
npm i -g vercel
vercel login
vercel

# Deploy production
vercel --prod

# Configurar variáveis
vercel env add GEMINI_API_KEY production
vercel env add DATABASE_URL production

# Monitorização
vercel logs
vercel --inspect

# Gestão de domínios
vercel domains add seu-dominio.com
vercel alias set deployment-url.vercel.app seu-dominio.com
```

## 🎯 Configuração Completa - 1 Comando

```bash
# Executar setup completo
./vercel-setup-complete.sh
```

Este comando:
1. ✅ Instala Vercel CLI
2. ✅ Configura Git/GitHub
3. ✅ Faz deploy inicial
4. ✅ Configura variáveis de ambiente
5. ✅ Testa todas as APIs
6. ✅ Fornece URLs finais

## 💡 Dicas de Produção

### Performance
- Use conexões de database com pooling
- Configure timeouts adequados (30s max)
- Optimize imports para cold start rápido

### Monitoring
- Configure Vercel Analytics
- Use logs estruturados
- Monitor function duration

### Security
- Configure CORS adequadamente
- Use environment variables para secrets
- Enable rate limiting se necessário

Vercel é a opção mais rápida e moderna para deploy do Muzaia - serverless, global e gratuito!