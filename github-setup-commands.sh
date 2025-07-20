#!/bin/bash

# Comandos para configurar repositório GitHub para MuzaIA
echo "🚀 Configurando MuzaIA para GitHub..."

# Inicializar git se necessário
if [ ! -d ".git" ]; then
    echo "📦 Inicializando repositório Git..."
    git init
fi

# Configurar informações do utilizador
echo "👤 Configurando utilizador Git..."
git config --global user.email "muzaia@example.com"
git config --global user.name "MuzaIA Developer"

# Criar .gitignore apropriado
echo "📝 Criando .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.venv/

# Build outputs
.next/
dist/
build/
*.egg-info/

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Database
*.db
*.sqlite

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Vercel
.vercel

# Temporary files
*.tmp
*.temp
.vercel-env.txt
EOF

# Preparar commit inicial
echo "📋 Preparando arquivos para commit..."
git add .

echo "✅ Configuração Git completa!"
echo ""
echo "🌐 Próximos passos manuais:"
echo "1. Criar repositório em: https://github.com/new"
echo "   - Nome: muzaia-legal-assistant"
echo "   - Descrição: Assistente jurídico online baseado em IA"
echo ""
echo "2. Conectar repositório:"
echo "   git remote add origin https://github.com/SEU_USERNAME/muzaia-legal-assistant.git"
echo ""
echo "3. Fazer primeiro push:"
echo "   git commit -m 'Initial commit - MuzaIA Legal Assistant'"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Configurar Vercel:"
echo "   - Importar do GitHub"
echo "   - Configurar variáveis de ambiente"
echo "   - Deploy automático activado!"