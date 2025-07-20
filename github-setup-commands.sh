#!/bin/bash

echo "📚 Setup GitHub para Deploy Automático"
echo "======================================"

# Verificar se git está configurado
echo "🔍 Verificando configuração Git..."

if ! git config --global user.name > /dev/null 2>&1; then
    echo "📝 Configurar Git:"
    echo "git config --global user.name 'Vosso Nome'"
    echo "git config --global user.email 'vosso@email.com'"
    echo ""
    read -p "Quer configurar agora? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Nome: " git_name
        read -p "Email: " git_email
        git config --global user.name "$git_name"
        git config --global user.email "$git_email"
        echo "✅ Git configurado"
    fi
fi

echo ""
echo "📦 COMANDOS PARA CRIAR REPOSITÓRIO:"
echo "==================================="
echo ""

# Verificar se já é repositório git
if [ -d ".git" ]; then
    echo "✅ Já é repositório Git"
    echo ""
    echo "Status actual:"
    git status --short
    echo ""
    echo "Para actualizar repositório existente:"
    echo "git add ."
    echo "git commit -m 'Configuração deployment completa'"
    echo "git push"
else
    echo "📋 Comandos para novo repositório:"
    echo ""
    echo "# 1. Inicializar repositório local"
    echo "git init"
    echo ""
    echo "# 2. Adicionar todos os arquivos"
    echo "git add ."
    echo ""
    echo "# 3. Commit inicial"
    echo 'git commit -m "Initial Muzaia deployment setup"'
    echo ""
    echo "# 4. Criar repositório no GitHub:"
    echo "#    - Ir para github.com"
    echo "#    - New repository"
    echo "#    - Nome: muzaia-backend"
    echo "#    - Não inicializar com README"
    echo ""
    echo "# 5. Conectar com GitHub (substituir URL)"
    echo "git remote add origin https://github.com/VOSSO-USERNAME/muzaia-backend.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    echo ""
fi

echo "🔗 LINKS ÚTEIS:"
echo "==============="
echo ""
echo "• GitHub: https://github.com/new"
echo "• Render: https://dashboard.render.com/select-repo?type=web"
echo "• DigitalOcean: https://cloud.digitalocean.com/apps/new"
echo ""

echo "📋 ARQUIVOS IMPORTANTES PARA DEPLOY:"
echo "===================================="
echo ""
echo "✅ backend_complete.py (aplicação principal)"
echo "✅ requirements.txt (dependências Python)"
echo "✅ railway.json (configuração Railway)"
echo "✅ render.yaml (configuração Render)"
echo "✅ Dockerfile (configuração DigitalOcean)"
echo "✅ vercel.json (configuração Vercel)"
echo ""

echo "🚀 PRÓXIMOS PASSOS:"
echo "=================="
echo ""
echo "1. Escolher plataforma:"
echo "   • Render.com ($7/mês, fácil)"
echo "   • DigitalOcean ($12/mês, robusto)"
echo "   • Vercel (gratuito, limitações)"
echo ""
echo "2. Criar repositório GitHub"
echo "3. Conectar repositório à plataforma escolhida"
echo "4. Configurar variáveis de ambiente"
echo "5. Deploy automático!"
echo ""

read -p "Quer executar setup Git agora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ ! -d ".git" ]; then
        echo ""
        echo "🔧 Inicializando repositório..."
        git init
        echo ""
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

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Environment variables
.env
.env.local

# Logs
*.log

# Database
*.db
*.sqlite

# Temporary files
*.tmp
*.temp

# Node modules (para frontend)
node_modules/

# Build outputs
dist/
build/
EOF
        
        echo "📦 Adicionando arquivos..."
        git add .
        
        echo "💾 Commit inicial..."
        git commit -m "Initial Muzaia deployment setup

- Backend FastAPI completo
- Configurações para Railway, Render, DigitalOcean
- Sistema RAG com Gemini AI
- Suporte para 15 áreas legais moçambicanas
- Scripts de deploy automatizados"
        
        echo ""
        echo "✅ Repositório local criado!"
        echo ""
        echo "📋 Próximo passo:"
        echo "1. Ir para https://github.com/new"
        echo "2. Nome: muzaia-backend"
        echo "3. Criar repositório"
        echo "4. Executar comandos mostrados pelo GitHub"
        
    else
        echo ""
        echo "📦 Actualizando repositório existente..."
        git add .
        git commit -m "Deploy configuration updated

- Fixed Railway and Vercel configurations
- Added Render and DigitalOcean options
- Complete deployment automation"
        
        if git remote get-url origin > /dev/null 2>&1; then
            echo "🚀 Fazendo push..."
            git push
            echo "✅ Repositório actualizado!"
        else
            echo "❌ Remote origin não configurado"
            echo "Configure com: git remote add origin https://github.com/USERNAME/REPO.git"
        fi
    fi
fi