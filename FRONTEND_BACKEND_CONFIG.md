# Configuração Frontend → Backend para Vercel

## Problema Actual
Vosso backend está funcionando localmente (`localhost:8000`), mas precisam de acesso via Vercel. Há 3 opções principais:

## Opção 1: Backend no Vercel (Recomendado para Simplicidade)

### Passos:
1. **Deploy Backend no Vercel:**
```bash
# No directório do projecto
./deploy-backend-vercel.sh
```

2. **Configurar Variáveis no Vercel:**
```bash
vercel env add GEMINI_API_KEY
# Colar: vossa chave do Google Gemini

vercel env add DATABASE_URL  
# Colar: postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

3. **URL Final:**
- Backend: `https://vosso-projeto.vercel.app/api/chat`
- Frontend: `https://vosso-projeto.vercel.app/`

### Vantagens:
- ✅ Tudo numa única URL
- ✅ Sem problemas de CORS
- ✅ Configuração simples

### Desvantagens:  
- ❌ Timeouts de 60s nas funções
- ❌ Cold starts ocasionais

## Opção 2: Backend no Railway + Frontend no Vercel

### Passos:
1. **Deploy Backend no Railway:**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login e deploy
railway login
railway init muzaia-backend
railway up
```

2. **Configurar Frontend para Backend Externo:**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.BACKEND_URL + '/:path*',
      },
    ]
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:8000',
  },
}
module.exports = nextConfig
```

3. **Deploy Frontend:**
```bash
vercel --prod --env BACKEND_URL=https://vosso-backend.railway.app
```

### Vantagens:
- ✅ Backend sempre activo
- ✅ Sem timeouts
- ✅ Melhor performance

### Desvantagens:
- ❌ Custo adicional ($5/mês)
- ❌ Configuração CORS necessária

## Opção 3: Manter Local + Ngrok (Desenvolvimento)

Para testes rápidos:
```bash
# Instalar ngrok
npm install -g ngrok

# Expor backend local
ngrok http 8000

# Usar URL temporária: https://abc123.ngrok.io
```

## Configuração Actual Recomendada

Para vosso caso, recomendo a **Opção 1** (Vercel completo):

### 1. Deploy Backend
```bash
./deploy-backend-vercel.sh
```

### 2. Actualizar Frontend
Se necessário, actualizar URLs no frontend:

```javascript
// Em qualquer página que faz chamadas API
const API_BASE = process.env.NODE_ENV === 'production' 
  ? '' // Usar URL relativa (mesmo domínio)
  : 'http://localhost:8000';

// Exemplos de uso:
fetch(`${API_BASE}/api/chat`, { ... })
fetch(`${API_BASE}/api/legal/hierarchy`, { ... })
```

### 3. Verificar CORS
O vosso backend já tem CORS configurado para Vercel:

```python
# backend_complete.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Já permite qualquer origem
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## URLs Após Deploy

### Desenvolvimento (Local):
- Frontend: `http://localhost:5000`
- Backend: `http://localhost:8000`
- Auth: `http://localhost:3001`

### Produção (Vercel):
- Frontend + Backend: `https://vosso-projeto.vercel.app`
- APIs: `https://vosso-projeto.vercel.app/api/*`

## Testes Após Deploy

```bash
# Verificar saúde do sistema
curl https://vosso-projeto.vercel.app/health

# Testar chat
curl -X POST https://vosso-projeto.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá Muzaia!"}'

# Testar hierarquia legal
curl https://vosso-projeto.vercel.app/api/legal/hierarchy
```

## Troubleshooting

### 1. Função Timeout
Se virem erro de timeout (60s), considerem Railway:
```bash
railway login
railway init
railway up
```

### 2. CORS Error
Adicionar domínio específico no backend:
```python
allow_origins=["https://vosso-dominio.vercel.app"]
```

### 3. Variables Missing
Verificar variáveis no Vercel:
```bash
vercel env ls
```

### 4. Database Connection
Testar conexão Supabase:
```bash
curl https://vosso-projeto.vercel.app/api/admin/stats
```

## Custos

### Opção 1 (Vercel Completo):
- Vercel Hobby: **Gratuito**
- Limitações: 100GB bandwidth, timeouts 60s

### Opção 2 (Railway + Vercel):
- Vercel Hobby: **Gratuito**  
- Railway: **$5/mês**
- Total: **$5/mês**

Qual opção preferem? Posso ajudar com a implementação de qualquer uma delas.