#!/bin/bash

echo "🎨 Deploy Muzaia no Render.com"
echo "==============================="

# Verificar se está no directório correcto
if [ ! -f "backend_complete.py" ]; then
    echo "❌ Erro: backend_complete.py não encontrado!"
    exit 1
fi

echo "📦 Criando configuração Render..."

# Criar render.yaml
cat > render.yaml << 'EOF'
services:
  - type: web
    name: muzaia-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python -m uvicorn backend_complete:app --host 0.0.0.0 --port $PORT
    plan: starter
    healthCheckPath: /health
    envVars:
      - key: GEMINI_API_KEY
        sync: false
      - key: DATABASE_URL
        sync: false
      - key: PYTHONPATH
        value: /opt/render/project/src
      - key: PYTHON_VERSION
        value: 3.11.0
EOF

# Criar build script específico para Render
cat > build.sh << 'EOF'
#!/bin/bash
echo "🔧 Build script para Render"
pip install --upgrade pip
pip install -r requirements.txt
echo "✅ Build concluído"
EOF

chmod +x build.sh

echo "✅ Configuração Render criada"
echo ""
echo "📋 INSTRUÇÕES PARA RENDER:"
echo "=========================="
echo ""
echo "1. Criar conta em: https://render.com"
echo "2. Conectar GitHub:"
echo "   - New → Web Service"
echo "   - Connect GitHub repository"
echo "   - Seleccionar este repositório"
echo ""
echo "3. Configurar serviço:"
echo "   - Environment: Python 3"
echo "   - Build Command: pip install -r requirements.txt"
echo "   - Start Command: python -m uvicorn backend_complete:app --host 0.0.0.0 --port \$PORT"
echo ""
echo "4. Configurar variáveis de ambiente:"
echo "   - GEMINI_API_KEY: vossa chave Google"
echo "   - DATABASE_URL: vossa URL Supabase"
echo "   - PYTHONPATH: /opt/render/project/src"
echo ""
echo "💰 CUSTO:"
echo "Starter plan: $7/mês"
echo "Free tier: Disponível (com limitações)"
echo ""
echo "🌐 URL FINAL:"
echo "https://vossa-app.onrender.com"
echo ""
echo "📁 Arquivos criados:"
echo "- render.yaml (configuração automática)"
echo "- build.sh (script de build)"
echo ""

echo "🔗 PASSOS DETALHADOS:"
echo "===================="
echo ""
echo "1. Ir para: https://dashboard.render.com/select-repo?type=web"
echo "2. Conectar GitHub se ainda não fez"
echo "3. Seleccionar repositório com código Muzaia"
echo "4. Configurar:"
echo "   - Name: muzaia-backend"
echo "   - Environment: Python 3"
echo "   - Region: Frankfurt (mais próximo)"
echo "   - Branch: main"
echo "   - Build Command: pip install -r requirements.txt"
echo "   - Start Command: python -m uvicorn backend_complete:app --host 0.0.0.0 --port \$PORT"
echo ""
echo "5. Environment Variables:"
echo "   - Clicar 'Advanced' → 'Add Environment Variable'"
echo "   - GEMINI_API_KEY = vossa_chave_aqui"
echo "   - DATABASE_URL = vossa_url_supabase"
echo ""
echo "6. Clicar 'Create Web Service'"
echo "7. Aguardar deploy (5-10 minutos)"
echo ""

read -p "Deseja ver instruções de setup GitHub? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📚 SETUP GITHUB PARA RENDER:"
    echo "============================"
    echo ""
    echo "Se ainda não tem repositório GitHub:"
    echo ""
    echo "1. Criar repositório:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial Muzaia commit'"
    echo ""
    echo "2. Ir para github.com → New repository"
    echo "   - Nome: muzaia-backend"
    echo "   - Público ou Privado"
    echo "   - Criar repositório"
    echo ""
    echo "3. Conectar local com GitHub:"
    echo "   git remote add origin https://github.com/vosso-username/muzaia-backend.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "4. Voltar para Render e conectar este repositório"
    echo ""
    echo "✅ Render detectará automaticamente Python e fará deploy!"
fi