#!/bin/bash

echo "🚂 Deploy Muzaia no Railway"
echo "==========================="
echo ""

# Verificar se temos os arquivos necessários
if [ ! -f "backend_complete.py" ]; then
    echo "❌ Arquivo backend_complete.py não encontrado"
    exit 1
fi

echo "📦 Preparando arquivos para Railway..."

# Criar requirements.txt otimizado para Railway
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

# Criar railway.json
cat > railway.json << 'EOF'
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
EOF

# Criar nixpacks.toml para Railway
cat > nixpacks.toml << 'EOF'
[phases.setup]
nixPkgs = ['python311', 'postgresql']

[phases.install]
cmds = [
    'pip install --upgrade pip',
    'pip install -r requirements.txt'
]

[phases.build]
cmds = ['python -c "print(\"Build completed\")"']

[start]
cmd = 'uvicorn backend_complete:app --host 0.0.0.0 --port $PORT --workers 1'
EOF

# Criar Procfile para Railway
cat > Procfile << 'EOF'
web: uvicorn backend_complete:app --host 0.0.0.0 --port $PORT --workers 1
EOF

# Criar script de inicialização
cat > railway-start.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando Muzaia no Railway..."
echo "PORT: $PORT"
echo "PYTHONPATH: $PYTHONPATH"

# Verificar variáveis essenciais
if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️ GEMINI_API_KEY não configurada"
fi

if [ -z "$DATABASE_URL" ]; then
    echo "⚠️ DATABASE_URL não configurada"
fi

# Iniciar aplicação
exec uvicorn backend_complete:app --host 0.0.0.0 --port $PORT --workers 1 --log-level info
EOF

chmod +x railway-start.sh

# Criar README específico para Railway
cat > README.md << 'EOF'
# Muzaia Legal Assistant Backend

Sistema de assistente jurídico especializado em legislação moçambicana.

## Deploy no Railway

### Configuração Automática
Este repositório está configurado para deploy automático no Railway.

### Variáveis de Ambiente Necessárias
```
GEMINI_API_KEY=sua_chave_gemini
DATABASE_URL=postgresql://user:password@host:port/database
```

### URLs de Produção
- Backend: https://muzaia-backend-production.up.railway.app
- Health: https://muzaia-backend-production.up.railway.app/health
- Docs: https://muzaia-backend-production.up.railway.app/docs

### Funcionalidades
- Chat jurídico com IA Gemini
- Upload e processamento de documentos legais
- Sistema RAG para pesquisa legal
- Interface administrativa
- APIs RESTful completas

### Tecnologias
- FastAPI
- Google Gemini AI
- PostgreSQL/Supabase
- Railway Platform
EOF

echo "✅ Arquivos criados para Railway:"
echo "• requirements.txt - Dependências Python"
echo "• railway.json - Configuração Railway"
echo "• nixpacks.toml - Build configuration"
echo "• Procfile - Comando de inicialização"
echo "• railway-start.sh - Script personalizado"
echo "• README.md - Documentação"
echo ""

echo "🌐 PRÓXIMOS PASSOS - RAILWAY:"
echo "============================"
echo ""
echo "MÉTODO 1 - GitHub (Recomendado):"
echo "1. Criar repositório GitHub público"
echo "2. Push do código para GitHub"
echo "3. Conectar Railway ao repositório"
echo ""
echo "MÉTODO 2 - Railway CLI:"
echo "1. Instalar CLI: npm install -g @railway/cli"
echo "2. Login: railway login"
echo "3. Deploy: railway deploy"
echo ""

echo "📋 CONFIGURAÇÃO RAILWAY:"
echo "========================"
echo ""
echo "1. Ir para https://railway.app"
echo "2. Criar conta (gratuito - $5 de crédito)"
echo "3. New Project > Deploy from GitHub repo"
echo "4. Selecionar repositório muzaia-backend"
echo "5. Configurar variáveis de ambiente:"
echo "   • GEMINI_API_KEY = [vossa chave]"
echo "   • DATABASE_URL = [vossa URL Supabase]"
echo ""
echo "6. Deploy automático será iniciado"
echo ""

echo "🎯 URLs FINAIS:"
echo "Backend: https://[seu-projeto].up.railway.app"
echo "Health: https://[seu-projeto].up.railway.app/health"
echo "Docs: https://[seu-projeto].up.railway.app/docs"
echo ""

echo "💡 VANTAGENS RAILWAY:"
echo "• $5 de crédito grátis"
echo "• Deploy em ~2 minutos"
echo "• HTTPS automático"
echo "• Logs em tempo real"
echo "• Métricas detalhadas"
echo "• Domínios personalizados"
echo "• Restart automático"
echo ""

echo "🚀 Railway é perfeito para projetos Python!"
echo "Muito mais estável que muitas alternativas."