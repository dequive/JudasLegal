#!/bin/bash

echo "🚀 Deploy Muzaia no Render.com"
echo "==============================="
echo ""

# Verificar se temos os arquivos necessários
if [ ! -f "backend_complete.py" ]; then
    echo "❌ Arquivo backend_complete.py não encontrado"
    exit 1
fi

echo "📦 Preparando arquivos para Render..."

# Criar requirements.txt otimizado para Render
cat > requirements.txt << 'EOF'
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
EOF

# Criar render.yaml
cat > render.yaml << 'EOF'
services:
  - type: web
    name: muzaia-backend
    env: python
    region: oregon
    plan: free
    buildCommand: pip install --upgrade pip && pip install -r requirements.txt
    startCommand: uvicorn backend_complete:app --host 0.0.0.0 --port $PORT --workers 1
    envVars:
      - key: GEMINI_API_KEY
        sync: false
      - key: DATABASE_URL  
        sync: false
      - key: PYTHONPATH
        value: /opt/render/project/src
      - key: PORT
        value: 10000
EOF

# Criar Procfile (alternativo)
cat > Procfile << 'EOF'
web: uvicorn backend_complete:app --host 0.0.0.0 --port $PORT
EOF

# Criar arquivo de configuração para produção
cat > render-start.sh << 'EOF'
#!/bin/bash
export PYTHONPATH=/opt/render/project/src:$PYTHONPATH
uvicorn backend_complete:app --host 0.0.0.0 --port $PORT --workers 1 --log-level info
EOF

chmod +x render-start.sh

echo "✅ Arquivos criados:"
echo "• requirements.txt - Dependências Python"
echo "• render.yaml - Configuração Render"
echo "• Procfile - Comando de inicialização"
echo "• render-start.sh - Script de start personalizado"
echo ""

echo "🌐 PRÓXIMOS PASSOS:"
echo "==================="
echo ""
echo "1. Criar repositório GitHub:"
echo "   • Ir para https://github.com/new"
echo "   • Nome: muzaia-backend"
echo "   • Público ou privado"
echo ""
echo "2. Push do código:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Deploy Muzaia backend'"
echo "   git remote add origin https://github.com/SEU_USUARIO/muzaia-backend.git"
echo "   git push -u origin main"
echo ""
echo "3. Deploy no Render:"
echo "   • Ir para https://render.com"
echo "   • Criar conta (gratuito)"
echo "   • New > Web Service"
echo "   • Conectar repositório GitHub"
echo "   • Configurar:"
echo "     - Build Command: pip install -r requirements.txt"
echo "     - Start Command: uvicorn backend_complete:app --host 0.0.0.0 --port \$PORT"
echo "     - Environment Variables:"
echo "       * GEMINI_API_KEY=vossa_chave"
echo "       * DATABASE_URL=vossa_url_supabase"
echo ""
echo "4. Aguardar deploy (2-3 minutos)"
echo ""
echo "📱 RESULTADO:"
echo "Backend estará disponível em:"
echo "https://muzaia-backend.onrender.com"
echo ""
echo "🧪 TESTAR:"
echo "curl https://muzaia-backend.onrender.com/health"
echo ""
echo "💡 VANTAGENS RENDER:"
echo "• Deploy gratuito (750h/mês)"
echo "• HTTPS automático"
echo "• Restart automático"
echo "• Logs completos"
echo "• Zero configuração de servidor"

# Criar instruções para variáveis de ambiente
cat > RENDER_ENV_SETUP.md << 'EOF'
# Configuração Variáveis Render

## No painel Render.com:

### Environment Variables:
```
GEMINI_API_KEY = sua_chave_gemini_aqui
DATABASE_URL = postgresql://postgres:senha@db.xxx.supabase.co:5432/postgres
PYTHONPATH = /opt/render/project/src
PORT = 10000
```

### Build Settings:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn backend_complete:app --host 0.0.0.0 --port $PORT`
- **Python Version**: 3.11

### Auto-Deploy:
- ✅ Activar auto-deploy no push
- ✅ Branch: main

## URLs Resultantes:
- Backend: https://muzaia-backend.onrender.com
- Health: https://muzaia-backend.onrender.com/health
- Docs: https://muzaia-backend.onrender.com/docs
EOF

echo ""
echo "📖 Documentação criada: RENDER_ENV_SETUP.md"
echo ""
echo "✨ Render é muito mais simples que DigitalOcean!"
echo "🎯 Deploy em 5 minutos vs 30 minutos"