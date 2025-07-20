#!/bin/bash

echo "🐙 Configuração GitHub para Deploy Render"
echo "=========================================="
echo ""

# Verificar se git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git não está instalado"
    echo "Instalar: apt install git (Ubuntu) ou brew install git (Mac)"
    exit 1
fi

echo "📋 Este script vai:"
echo "1. Configurar repositório Git local"
echo "2. Adicionar todos os arquivos"
echo "3. Fazer commit inicial" 
echo "4. Mostrar comandos para GitHub"
echo ""

read -p "Continuar? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Configurar Git se necessário
echo "🔧 Configurando Git..."
if [ -z "$(git config --global user.name)" ]; then
    read -p "Nome Git: " git_name
    git config --global user.name "$git_name"
fi

if [ -z "$(git config --global user.email)" ]; then
    read -p "Email Git: " git_email
    git config --global user.email "$git_email"
fi

# Inicializar repositório
echo "📁 Inicializando repositório..."
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git repo inicializado"
else
    echo "ℹ️ Git repo já existe"
fi

# Criar .gitignore
echo "📝 Criando .gitignore..."
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual environments
venv/
env/
ENV/

# Environment variables
.env
.env.local
.env.production

# Logs
*.log
logs/

# OS
.DS_Store
Thumbs.db

# IDEs
.vscode/
.idea/
*.swp
*.swo

# Uploads
uploads/
*.pdf
*.docx

# Backups
*.backup
*.bak

# Temporary files
*.tmp
temp/

# Database
*.db
*.sqlite
*.sqlite3

# Cache
.cache/
.pytest_cache/

# Coverage
.coverage
htmlcov/
EOF

# Adicionar arquivos importantes
echo "📦 Adicionando arquivos..."
git add backend_complete.py
git add requirements.txt
git add render.yaml
git add Procfile
git add .gitignore
git add README.md 2>/dev/null || true
git add RENDER_ENV_SETUP.md 2>/dev/null || true

# Verificar o que será commitado
echo ""
echo "📋 Arquivos a serem commitados:"
git status --porcelain

# Fazer commit
echo ""
echo "💾 Fazendo commit..."
git commit -m "Initial commit: Muzaia backend for Render deployment

- FastAPI backend with Gemini AI integration
- PostgreSQL/Supabase database support
- Legal document processing and RAG system
- Admin interface for document management
- Ready for Render.com deployment"

echo "✅ Commit realizado"
echo ""

# Instruções para GitHub
echo "🌐 PRÓXIMOS PASSOS - GITHUB:"
echo "============================"
echo ""
echo "1. Criar repositório no GitHub:"
echo "   • Ir para: https://github.com/new"
echo "   • Nome: muzaia-backend"
echo "   • Descrição: Muzaia Legal Assistant Backend"
echo "   • Público (recomendado para Render gratuito)"
echo ""

# Perguntar o username GitHub
read -p "Qual o vosso username GitHub? " github_username

echo ""
echo "2. Conectar e fazer push:"
echo "   git remote add origin https://github.com/${github_username}/muzaia-backend.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

echo "3. Após push, ir para Render:"
echo "   • https://render.com"
echo "   • New > Web Service"
echo "   • Connect GitHub repository: ${github_username}/muzaia-backend"
echo ""

echo "4. Configurar no Render:"
echo "   • Name: muzaia-backend"
echo "   • Branch: main"
echo "   • Build Command: pip install -r requirements.txt"
echo "   • Start Command: uvicorn backend_complete:app --host 0.0.0.0 --port \$PORT"
echo ""

echo "5. Environment Variables no Render:"
echo "   GEMINI_API_KEY = [vossa chave]"
echo "   DATABASE_URL = [vossa URL Supabase]"
echo ""

echo "✨ COMANDOS PRONTOS PARA COPIAR:"
echo "================================"
echo ""
echo "# Conectar ao GitHub:"
echo "git remote add origin https://github.com/${github_username}/muzaia-backend.git"
echo "git branch -M main"
echo "git push -u origin main"
echo ""

echo "🎯 Após executar estes comandos:"
echo "• Repositório estará no GitHub"
echo "• Pronto para deploy no Render"
echo "• Backend funcionando em ~5 minutos"
echo ""

echo "💡 URL final será:"
echo "https://muzaia-backend.onrender.com"