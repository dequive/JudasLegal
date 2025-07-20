#!/bin/bash

echo "▲ Deploy Muzaia no Vercel"
echo "========================="
echo ""

# Verificar se temos os arquivos necessários
if [ ! -f "backend_complete.py" ]; then
    echo "❌ Arquivo backend_complete.py não encontrado"
    exit 1
fi

echo "📦 Preparando arquivos para Vercel..."

# Criar requirements.txt otimizado para Vercel
cat > requirements.txt << 'EOF'
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
EOF

# Criar vercel.json para deploy backend
cat > vercel.json << 'EOF'
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
EOF

# Criar api/index.py para Vercel
mkdir -p api
cat > api/index.py << 'EOF'
# Vercel entry point for FastAPI
import sys
import os

# Add the root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend_complete import app

# Export the FastAPI app for Vercel
handler = app
EOF

# Criar __init__.py para tornar api um módulo
touch api/__init__.py

# Criar script de configuração de variáveis Vercel
cat > vercel-env-setup.sh << 'EOF'
#!/bin/bash

echo "🔧 Configuração Variáveis Vercel"
echo "================================"
echo ""

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm i -g vercel
fi

echo "🔑 Configurando variáveis de ambiente..."
echo ""

# Solicitar credenciais
read -p "GEMINI_API_KEY: " gemini_key
read -p "DATABASE_URL: " database_url

echo ""
echo "⚙️ Configurando no Vercel..."

# Configurar variáveis
vercel env add GEMINI_API_KEY production <<< "$gemini_key"
vercel env add DATABASE_URL production <<< "$database_url"

# Configurar para preview
vercel env add GEMINI_API_KEY preview <<< "$gemini_key"
vercel env add DATABASE_URL preview <<< "$database_url"

echo ""
echo "✅ Variáveis configuradas!"
echo ""
echo "🚀 Para fazer deploy:"
echo "vercel --prod"
EOF

chmod +x vercel-env-setup.sh

# Criar README específico para Vercel
cat > README.md << 'EOF'
# Muzaia Legal Assistant Backend

Sistema de assistente jurídico especializado em legislação moçambicana.

## Deploy no Vercel

### Configuração Automática
Este repositório está configurado para deploy automático no Vercel.

### Deploy Rápido
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Variáveis de Ambiente
```
GEMINI_API_KEY=sua_chave_gemini
DATABASE_URL=postgresql://user:password@host:port/database
```

### URLs de Produção
- Backend: https://muzaia-backend.vercel.app
- Health: https://muzaia-backend.vercel.app/health
- Docs: https://muzaia-backend.vercel.app/docs

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
- Vercel Serverless
EOF

# Criar .vercelignore
cat > .vercelignore << 'EOF'
__pycache__
*.pyc
.env
.env.local
node_modules
.git
*.log
uploads/
*.pdf
*.docx
.pytest_cache
.coverage
EOF

echo "✅ Arquivos criados para Vercel:"
echo "• requirements.txt - Dependências Python"
echo "• vercel.json - Configuração Vercel"
echo "• api/index.py - Entry point Vercel"
echo "• vercel-env-setup.sh - Configuração variáveis"
echo "• README.md - Documentação"
echo "• .vercelignore - Arquivos ignorados"
echo ""

echo "▲ PRÓXIMOS PASSOS - VERCEL:"
echo "==========================="
echo ""
echo "MÉTODO 1 - Vercel CLI (Recomendado):"
echo "1. npm i -g vercel"
echo "2. vercel login"
echo "3. vercel --prod"
echo ""
echo "MÉTODO 2 - GitHub + Vercel:"
echo "1. Push para GitHub"
echo "2. Conectar Vercel ao repositório"
echo "3. Deploy automático"
echo ""

echo "🔧 CONFIGURAÇÃO VARIÁVEIS:"
echo "=========================="
echo ""
echo "Executar após deploy inicial:"
echo "./vercel-env-setup.sh"
echo ""
echo "Ou manualmente no painel Vercel:"
echo "• GEMINI_API_KEY = [vossa chave]"
echo "• DATABASE_URL = [vossa URL Supabase]"
echo ""

echo "🎯 URLs FINAIS:"
echo "Backend: https://muzaia-backend.vercel.app"
echo "Health: https://muzaia-backend.vercel.app/health"
echo "Docs: https://muzaia-backend.vercel.app/docs"
echo ""

echo "💡 VANTAGENS VERCEL:"
echo "• Deploy gratuito"
echo "• HTTPS automático"
echo "• CDN global"
echo "• Deploy em segundos"
echo "• Integração GitHub perfeita"
echo "• Serverless scaling"
echo "• Analytics incluídas"
echo ""

echo "▲ Vercel é perfeito para FastAPI!"
echo "Deploy mais rápido que qualquer alternativa."
EOF