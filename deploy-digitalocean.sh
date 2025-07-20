#!/bin/bash

echo "🐳 Deploy Muzaia no DigitalOcean App Platform"
echo "=============================================="

# Verificar se está no directório correcto
if [ ! -f "backend_complete.py" ]; then
    echo "❌ Erro: backend_complete.py não encontrado!"
    exit 1
fi

echo "📦 Criando configuração DigitalOcean..."

# Criar app.yaml para DigitalOcean App Platform
cat > app.yaml << 'EOF'
name: muzaia-backend
services:
- name: backend
  source_dir: /
  github:
    branch: main
    deploy_on_push: true
  run_command: python -m uvicorn backend_complete:app --host 0.0.0.0 --port 8080
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  http_port: 8080
  health_check:
    http_path: /health
  envs:
  - key: GEMINI_API_KEY
    scope: RUN_TIME
    type: SECRET
  - key: DATABASE_URL
    scope: RUN_TIME
    type: SECRET
  - key: PYTHONPATH
    scope: RUN_TIME
    value: "/app"
  - key: PORT
    scope: RUN_TIME
    value: "8080"
EOF

# Criar Dockerfile otimizado
cat > Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primeiro para cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Criar utilizador não-root
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Expor porta
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Comando de inicialização
CMD ["python", "-m", "uvicorn", "backend_complete:app", "--host", "0.0.0.0", "--port", "8080"]
EOF

echo "✅ Configuração criada"
echo ""
echo "📋 INSTRUÇÕES PARA DIGITALOCEAN:"
echo "================================"
echo ""
echo "1. Criar conta em: https://cloud.digitalocean.com"
echo "2. Ir para Apps → Create App"
echo "3. Conectar GitHub ou fazer upload manual"
echo "4. Configurar variáveis de ambiente:"
echo "   - GEMINI_API_KEY: vossa chave Google"
echo "   - DATABASE_URL: vossa URL Supabase"
echo ""
echo "5. DigitalOcean detectará automaticamente o Dockerfile"
echo "6. Deploy automático será configurado"
echo ""
echo "💰 CUSTO ESTIMADO:"
echo "Basic plan: $12/mês (sempre activo)"
echo ""
echo "🌐 URL FINAL:"
echo "https://vossa-app.ondigitalocean.app"
echo ""
echo "📁 Arquivos criados:"
echo "- app.yaml (configuração DigitalOcean)"
echo "- Dockerfile (container Python)"
echo ""

read -p "Deseja continuar com setup DigitalOcean? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔗 Abrindo DigitalOcean..."
    echo "Link: https://cloud.digitalocean.com/apps/new"
    echo ""
    echo "📋 Checklist de Deploy:"
    echo "1. ✅ Dockerfile criado"
    echo "2. ✅ app.yaml configurado"
    echo "3. 🔲 Conta DigitalOcean criada"
    echo "4. 🔲 Repositório GitHub conectado"
    echo "5. 🔲 Variáveis de ambiente configuradas"
    echo "6. 🔲 Deploy iniciado"
else
    echo "Deploy DigitalOcean cancelado"
fi