# Guia de Correção - Deploy Vercel Backend

## Problema Identificado
O erro que receberam foi causado por:
1. Propriedade `name` deprecada no `vercel.json`
2. Configuração `functions` com problemas de sintaxe
3. `builds` desnecessários para Next.js e Python juntos

## Correções Aplicadas

### 1. vercel.json Corrigido
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
      "dest": "/backend_complete.py"
    }
  ],
  "env": {
    "GEMINI_API_KEY": "@gemini_api_key",
    "DATABASE_URL": "@database_url",
    "PYTHONPATH": "/var/task"
  },
  "functions": {
    "backend_complete.py": {
      "runtime": "python3.9",
      "maxDuration": 60
    }
  }
}
```

### 2. requirements.txt Otimizado
Criado `requirements-vercel.txt` com dependências mínimas:
- Removidas: `pytesseract`, `trafilatura` (problemas no Vercel)
- Mantidas: `fastapi`, `psycopg2-binary`, `google-generativeai`

### 3. Script de Deploy Atualizado
O `deploy-backend-vercel.sh` agora:
- Usa requirements otimizado
- Remove configurações deprecadas
- Verifica dependências automaticamente

## Como Deploy Agora

### Opção A: Backend Apenas no Vercel
```bash
# 1. Executar script corrigido
./deploy-backend-vercel.sh

# 2. Quando solicitado, adicionar variáveis:
# GEMINI_API_KEY: vossa chave do Google
# DATABASE_URL: vossa URL do Supabase
```

### Opção B: Deploy Separado (Recomendado)

**Backend no Railway (Mais Estável):**
```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login e criar projeto
railway login
railway init muzaia-backend

# 3. Configurar variáveis
railway variables set GEMINI_API_KEY=vossa-chave
railway variables set DATABASE_URL=vossa-url-supabase

# 4. Deploy
railway up
```

**Frontend no Vercel:**
```bash
# Criar vercel.json apenas para frontend
cat > vercel.json << 'EOF'
{
  "version": 2,
  "env": {
    "BACKEND_URL": "https://vosso-backend.railway.app"
  }
}
EOF

# Deploy frontend
vercel --prod
```

## URLs Finais

### Opção A (Vercel Completo):
- Backend + Frontend: `https://vosso-projeto.vercel.app`
- APIs: `https://vosso-projeto.vercel.app/api/chat`

### Opção B (Railway + Vercel):
- Backend: `https://vosso-backend.railway.app`
- Frontend: `https://vosso-frontend.vercel.app`
- APIs: `https://vosso-backend.railway.app/api/chat`

## Teste Após Deploy

```bash
# Verificar saúde
curl https://vossa-url/health

# Testar chat
curl -X POST https://vossa-url/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Teste"}'

# Verificar hierarquia legal
curl https://vossa-url/api/legal/hierarchy
```

## Recomendação

Para evitar problemas de timeouts e cold starts, recomendo:

1. **Backend no Railway** ($5/mês)
2. **Frontend no Vercel** (gratuito)

Isso garante:
- Backend sempre ativo
- Sem timeouts de 60s
- Melhor performance
- Configuração mais simples

## Próximos Passos

1. Escolher entre Opção A ou B
2. Executar deploy conforme escolha
3. Testar endpoints principais
4. Configurar domínio personalizado (opcional)

Qual opção preferem?