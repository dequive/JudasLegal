# Deploy do Backend Muzaia no Railway

## Vantagens do Railway para o Muzaia

- **Sempre ativo**: Sem cold starts como no Vercel
- **Sem timeouts**: Processamento de documentos sem limite de 60s
- **PostgreSQL nativo**: Suporte completo para Supabase
- **Logs em tempo real**: Monitorização completa
- **Custo fixo**: $5/mês independente do uso

## Passo-a-Passo: Deploy no Railway

### 1. Preparação Local
```bash
# Verificar se backend funciona
curl http://localhost:8000/health

# Instalar Railway CLI
npm install -g @railway/cli

# Fazer login
railway login
```

### 2. Inicializar Projeto Railway
```bash
# No directório do projecto
railway init

# Escolher opções:
# - "Empty project"
# - Nome: "muzaia-backend"
# - Público: No
```

### 3. Configurar Variáveis de Ambiente
```bash
# Configurar Gemini AI
railway variables set GEMINI_API_KEY=vossa-chave-google-gemini

# Configurar Supabase
railway variables set DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# Configurar outras variáveis
railway variables set PYTHONPATH=/app
railway variables set PORT=8000
```

### 4. Deploy Inicial
```bash
# Fazer primeiro deploy
railway up

# Monitorizar logs
railway logs --follow
```

### 5. Verificar Deploy
```bash
# Obter URL do serviço
railway status

# Testar endpoints
curl https://vosso-projeto.railway.app/health
curl https://vosso-projeto.railway.app/api/legal/hierarchy
```

## Estrutura de Arquivos para Railway

O Railway detecta automaticamente:

### requirements.txt (já existe)
```
fastapi==0.104.1
uvicorn==0.24.0
psycopg2-binary==2.9.9
google-generativeai==0.3.2
python-multipart==0.0.6
...
```

### railway.json (criado)
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python -m uvicorn backend_complete:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health"
  }
}
```

### nixpacks.toml (criado)
```toml
[phases.setup]
nixPkgs = ["python311", "postgresql"]

[start]
cmd = "python -m uvicorn backend_complete:app --host 0.0.0.0 --port $PORT"
```

## Scripts Automatizados

### Script de Deploy Completo
```bash
#!/bin/bash
# deploy-railway.sh

echo "🚀 Deploy Muzaia Backend no Railway"

# 1. Verificar Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não instalado"
    echo "Execute: npm install -g @railway/cli"
    exit 1
fi

# 2. Login se necessário
if ! railway whoami &> /dev/null; then
    echo "🔐 Fazendo login no Railway..."
    railway login
fi

# 3. Inicializar se necessário
if [ ! -f "railway.toml" ]; then
    echo "📋 Inicializando projeto Railway..."
    railway init
fi

# 4. Configurar variáveis
echo "🔧 Configurando variáveis de ambiente..."
echo "GEMINI_API_KEY (pressione Enter para manter actual):"
read -r gemini_key
if [ ! -z "$gemini_key" ]; then
    railway variables set GEMINI_API_KEY="$gemini_key"
fi

echo "DATABASE_URL (pressione Enter para manter actual):"
read -r database_url
if [ ! -z "$database_url" ]; then
    railway variables set DATABASE_URL="$database_url"
fi

# 5. Deploy
echo "🚀 Fazendo deploy..."
railway up

# 6. Mostrar informações
echo "✅ Deploy concluído!"
railway status
echo ""
echo "🌐 Vosso backend está disponível em:"
railway status --json | jq -r '.deployments[0].url'
```

### Script de Monitorização
```bash
#!/bin/bash
# monitor-railway.sh

echo "📊 Monitorização Railway"
echo "======================"

# Status do serviço
echo "📈 Status:"
railway status

# Últimos logs
echo ""
echo "📋 Últimos logs:"
railway logs --tail 50

# Health check
echo ""
echo "🏥 Health check:"
URL=$(railway status --json | jq -r '.deployments[0].url')
curl -s "$URL/health" | python3 -c "import json,sys; data=json.load(sys.stdin); print(f'Status: {data[\"status\"]} | Service: {data[\"service\"]} | Version: {data[\"version\"]}')"
```

## Configuração Frontend para Railway

Após deploy do backend, actualizar frontend:

### next.config.js
```javascript
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

### Deploy Frontend no Vercel
```bash
# Definir URL do backend Railway
vercel --prod --env BACKEND_URL=https://vosso-backend.railway.app
```

## URLs Finais

Após deploy completo:

- **Backend Railway**: `https://vosso-projeto.railway.app`
- **Frontend Vercel**: `https://vosso-frontend.vercel.app`

### APIs Disponíveis:
- Health: `https://vosso-projeto.railway.app/health`
- Chat: `https://vosso-projeto.railway.app/api/chat`
- Upload: `https://vosso-projeto.railway.app/api/admin/upload-document`
- Hierarquia: `https://vosso-projeto.railway.app/api/legal/hierarchy`
- Admin Avançado: `https://vosso-projeto.railway.app/api/legal/upload-advanced`

## Monitorização e Logs

```bash
# Ver logs em tempo real
railway logs --follow

# Ver uso de recursos
railway status

# Reiniciar serviço
railway restart

# Ver variáveis
railway variables
```

## Custos

- **Railway**: $5/mês (500 horas de execução)
- **Vercel Frontend**: Gratuito
- **Supabase**: Gratuito (até 500MB)
- **Google Gemini**: Gratuito (até quota)

**Total: $5/mês para sistema completo**

## Troubleshooting

### Build Fails
```bash
# Ver logs detalhados
railway logs --deployment <deployment-id>

# Verificar requirements.txt
railway shell
pip install -r requirements.txt
```

### Database Connection
```bash
# Testar conexão dentro do Railway
railway shell
python3 -c "import psycopg2; print('DB OK')"
```

### Memory Issues
```bash
# Verificar uso de memória
railway metrics

# Aumentar plano se necessário
railway upgrade
```

O Railway é ideal para o Muzaia porque suporta o processamento pesado de documentos legais e mantém o sistema sempre ativo para consultas rápidas de IA.