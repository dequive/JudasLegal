# Como Aceder ao Backend Muzaia no Vercel

## Opções de Deploy do Backend

### Opção 1: Deploy Separado do Backend (Recomendado)

1. **Deploy do Backend FastAPI no Vercel:**
```bash
# Clone o projecto se ainda não o fez
git clone <seu-repo>
cd muzaia

# Deploy apenas do backend
vercel --prod --env GEMINI_API_KEY=<sua-chave> --env DATABASE_URL=<supabase-url>
```

2. **Configurar Variáveis de Ambiente no Vercel:**
- Ir para vercel.com → Vosso projecto → Settings → Environment Variables
- Adicionar:
  - `GEMINI_API_KEY`: Vossa chave do Google Gemini
  - `DATABASE_URL`: URL da base de dados Supabase
  - `PYTHONPATH`: `/var/task`

### Opção 2: Backend como Serverless Functions

**Estrutura recomendada:**
```
/api/
  ├── chat.py          # Endpoint /api/chat
  ├── upload.py        # Endpoint /api/upload  
  ├── health.py        # Endpoint /api/health
  └── legal/
      ├── hierarchy.py # Endpoint /api/legal/hierarchy
      └── advanced.py  # Endpoint /api/legal/upload-advanced
```

### Opção 3: Backend Externo (Railway/DigitalOcean)

Se preferir manter o backend separado:

1. **Deploy no Railway:**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login e deploy
railway login
railway init
railway up
```

2. **Configurar CORS no Frontend:**
```javascript
// Actualizar URLs no frontend para apontar para vosso backend
const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? 'https://vosso-backend.railway.app'
  : 'http://localhost:8000';
```

## Configuração Actual Recomendada

### 1. Verificar Estado Actual
```bash
# Verificar se o backend está funcionando localmente
curl http://localhost:8000/health

# Verificar base de dados
curl http://localhost:8000/api/legal/hierarchy
```

### 2. Deploy do Frontend com Backend Externo

**Actualizar next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.BACKEND_URL + '/api/:path*', // Proxy para backend externo
      },
    ]
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:8000',
  },
}

module.exports = nextConfig
```

### 3. Variáveis de Ambiente para Vercel

Criar `.env.production`:
```bash
# Backend URL (Railway, DigitalOcean, ou outro serviço)
BACKEND_URL=https://vosso-muzaia-backend.railway.app

# Supabase (se usar directamente no frontend)
DATABASE_URL=postgresql://postgres:Wez0@821722@db.dcqftukouimxugezypwd.supabase.co:5432/postgres

# Google Gemini (se necessário no frontend)
GEMINI_API_KEY=vossa-chave-aqui
```

## Scripts de Deploy Automático

### Script Completo de Deploy
```bash
#!/bin/bash
# deploy-vercel-complete.sh

echo "🚀 Deploy completo Muzaia no Vercel"

# 1. Deploy do backend no Railway
echo "📦 Deploying backend..."
railway up

# 2. Obter URL do backend
BACKEND_URL=$(railway status --json | jq -r '.deployments[0].url')

# 3. Deploy do frontend no Vercel com URL do backend
echo "🌐 Deploying frontend..."
vercel --prod --env BACKEND_URL=$BACKEND_URL

echo "✅ Deploy completo!"
echo "Frontend: $(vercel ls --scope=vossa-conta | grep muzaia)"
echo "Backend: $BACKEND_URL"
```

## URLs de Acesso

Após o deploy, vossas URLs serão:

- **Frontend**: `https://vosso-projecto.vercel.app`
- **Backend (Railway)**: `https://vosso-backend.railway.app`
- **APIs**: 
  - Chat: `https://vosso-backend.railway.app/api/chat`
  - Upload: `https://vosso-backend.railway.app/api/admin/upload-document`
  - Hierarquia: `https://vosso-backend.railway.app/api/legal/hierarchy`

## Resolução de Problemas

### 1. CORS Errors
Actualizar CORS no backend:
```python
# backend_complete.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://vosso-projecto.vercel.app", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Database Connection
Verificar se Supabase permite conexões externas:
- Database Settings → Network Restrictions
- Adicionar IP do Railway/Vercel se necessário

### 3. Environment Variables
Confirmar todas as variáveis estão definidas:
```bash
# No Railway
railway variables

# No Vercel  
vercel env ls
```

## Monitorização

### Logs do Backend
```bash
# Railway
railway logs

# Vercel Functions
vercel logs vosso-projecto
```

### Health Checks
```bash
# Verificar backend
curl https://vosso-backend.railway.app/health

# Verificar frontend
curl https://vosso-projecto.vercel.app/api/health
```

## Custos Estimados

- **Vercel Pro**: $20/mês (frontend + algunas funções)
- **Railway**: $5/mês (backend FastAPI)  
- **Supabase**: Gratuito até 500MB
- **Google Gemini**: Gratuito até quota

**Total: ~$25/mês para produção completa**