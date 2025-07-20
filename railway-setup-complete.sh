#!/bin/bash

echo "🚂 Configuração Completa Railway + GitHub"
echo "========================================="
echo ""

# Verificar dependências
check_dependencies() {
    echo "🔍 Verificando dependências..."
    
    if ! command -v git &> /dev/null; then
        echo "❌ Git não encontrado. Instalar: apt install git"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "⚠️ npm não encontrado. Railway CLI será opcional."
    fi
    
    echo "✅ Dependências verificadas"
}

# Configurar Git
setup_git() {
    echo ""
    echo "🔧 Configurando Git..."
    
    if [ -z "$(git config --global user.name)" ]; then
        read -p "Nome Git: " git_name
        git config --global user.name "$git_name"
    fi
    
    if [ -z "$(git config --global user.email)" ]; then
        read -p "Email Git: " git_email
        git config --global user.email "$git_email"
    fi
    
    echo "✅ Git configurado"
}

# Preparar repositório
prepare_repository() {
    echo ""
    echo "📁 Preparando repositório..."
    
    # Inicializar Git se necessário
    if [ ! -d ".git" ]; then
        git init
        git branch -M main
    fi
    
    # Criar/atualizar .gitignore
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

# Uploads e backups
uploads/
*.pdf
*.docx
*.backup
*.bak

# Database
*.db
*.sqlite
*.sqlite3

# Cache
.cache/
.pytest_cache/

# Railway específicos
.railway/
EOF
    
    # Adicionar arquivos
    git add .
    
    # Commit
    if git diff --cached --quiet; then
        echo "ℹ️ Nenhuma alteração para commit"
    else
        git commit -m "Configure Muzaia backend for Railway deployment

- FastAPI backend with Gemini AI integration
- Railway deployment configuration
- PostgreSQL/Supabase database support
- Legal document processing and RAG system
- Admin interface for document management"
        echo "✅ Commit realizado"
    fi
}

# Configurar Railway CLI (opcional)
setup_railway_cli() {
    echo ""
    read -p "Instalar Railway CLI? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 Instalando Railway CLI..."
        if command -v npm &> /dev/null; then
            npm install -g @railway/cli
            echo "✅ Railway CLI instalado"
            
            echo ""
            echo "🔑 Para fazer login no Railway:"
            echo "railway login"
            echo ""
            echo "🚀 Para deploy direto:"
            echo "railway deploy"
        else
            echo "❌ npm não encontrado. Instalar Node.js primeiro."
        fi
    fi
}

# Mostrar instruções GitHub
show_github_instructions() {
    echo ""
    echo "🐙 INSTRUÇÕES GITHUB:"
    echo "===================="
    echo ""
    
    read -p "Qual o vosso username GitHub? " github_username
    
    echo ""
    echo "1. Criar repositório GitHub:"
    echo "   • Ir para: https://github.com/new"
    echo "   • Nome: muzaia-backend"
    echo "   • Descrição: Muzaia Legal Assistant Backend"
    echo "   • Público (recomendado)"
    echo ""
    
    echo "2. Conectar e push:"
    echo "   git remote add origin https://github.com/${github_username}/muzaia-backend.git"
    echo "   git push -u origin main"
    echo ""
    
    echo "✨ COMANDOS PRONTOS:"
    echo "git remote add origin https://github.com/${github_username}/muzaia-backend.git"
    echo "git push -u origin main"
    echo ""
}

# Mostrar instruções Railway
show_railway_instructions() {
    echo "🚂 INSTRUÇÕES RAILWAY:"
    echo "====================="
    echo ""
    echo "1. Ir para https://railway.app"
    echo "2. Criar conta (GitHub recomendado)"
    echo "3. New Project > Deploy from GitHub repo"
    echo "4. Autorizar acesso ao GitHub"
    echo "5. Selecionar: ${github_username}/muzaia-backend"
    echo ""
    echo "6. Configurar variáveis de ambiente:"
    echo ""
    
    read -p "GEMINI_API_KEY: " gemini_key
    read -p "DATABASE_URL: " database_url
    
    echo ""
    echo "📋 VARIÁVEIS PARA RAILWAY:"
    echo "========================="
    echo "GEMINI_API_KEY = ${gemini_key}"
    echo "DATABASE_URL = ${database_url}"
    echo ""
    echo "7. Deploy será automático após configuração"
    echo ""
}

# Mostrar URLs finais
show_final_urls() {
    echo "🎯 RESULTADO FINAL:"
    echo "=================="
    echo ""
    echo "Após deploy no Railway, URLs serão:"
    echo "• Backend: https://muzaia-backend-production-xxxx.up.railway.app"
    echo "• Health: https://muzaia-backend-production-xxxx.up.railway.app/health"
    echo "• Docs: https://muzaia-backend-production-xxxx.up.railway.app/docs"
    echo "• Chat: https://muzaia-backend-production-xxxx.up.railway.app/api/chat"
    echo ""
    echo "🧪 Para testar após deploy:"
    echo "curl https://[vossa-url].up.railway.app/health"
    echo ""
    echo "💰 CUSTOS RAILWAY:"
    echo "• $5 grátis para começar"
    echo "• ~$0.10/hora quando em uso"
    echo "• Suspende automaticamente quando inactivo"
    echo ""
    echo "📊 VANTAGENS:"
    echo "• Deploy em 2-3 minutos"
    echo "• HTTPS automático"
    echo "• Logs em tempo real"
    echo "• Métricas detalhadas"
    echo "• Restart automático"
    echo "• Domínios personalizados"
}

# Execução principal
main() {
    check_dependencies
    setup_git
    prepare_repository
    setup_railway_cli
    show_github_instructions
    show_railway_instructions
    show_final_urls
    
    echo ""
    echo "🎉 CONFIGURAÇÃO COMPLETA!"
    echo "========================"
    echo ""
    echo "Próximos passos:"
    echo "1. Executar comandos Git mostrados acima"
    echo "2. Configurar projeto no Railway"
    echo "3. Aguardar deploy (2-3 minutos)"
    echo "4. Testar APIs"
    echo ""
    echo "🚂 Railway é uma excelente escolha para Python!"
}

# Executar se chamado directamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi