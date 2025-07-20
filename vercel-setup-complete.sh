#!/bin/bash

echo "▲ Configuração Completa Vercel + GitHub"
echo "======================================="
echo ""

# Verificar dependências
check_dependencies() {
    echo "🔍 Verificando dependências..."
    
    if ! command -v git &> /dev/null; then
        echo "❌ Git não encontrado. Instalar: apt install git"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm não encontrado. Instalar Node.js"
        exit 1
    fi
    
    echo "✅ Dependências verificadas"
}

# Instalar Vercel CLI
install_vercel_cli() {
    echo ""
    echo "📦 Instalando Vercel CLI..."
    
    if ! command -v vercel &> /dev/null; then
        npm i -g vercel
        echo "✅ Vercel CLI instalado"
    else
        echo "ℹ️ Vercel CLI já instalado"
    fi
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

# Vercel
.vercel
EOF
    
    # Adicionar arquivos
    git add .
    
    # Commit
    if git diff --cached --quiet; then
        echo "ℹ️ Nenhuma alteração para commit"
    else
        git commit -m "Configure Muzaia backend for Vercel deployment

- FastAPI backend with Gemini AI integration
- Vercel serverless deployment configuration
- PostgreSQL/Supabase database support
- Legal document processing and RAG system
- Admin interface for document management"
        echo "✅ Commit realizado"
    fi
}

# Login Vercel
vercel_login() {
    echo ""
    echo "🔑 Login Vercel..."
    
    if ! vercel whoami &> /dev/null; then
        echo "Fazendo login no Vercel..."
        vercel login
    else
        echo "✅ Já logado no Vercel: $(vercel whoami)"
    fi
}

# Deploy inicial
initial_deploy() {
    echo ""
    read -p "Fazer deploy inicial agora? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Fazendo deploy inicial..."
        vercel --prod
        echo "✅ Deploy inicial concluído"
        
        # Obter URL do projeto
        PROJECT_URL=$(vercel ls | grep "muzaia" | head -n 1 | awk '{print $2}')
        if [ -n "$PROJECT_URL" ]; then
            echo ""
            echo "🎯 URL do projeto: https://$PROJECT_URL"
            echo "🧪 Health check: https://$PROJECT_URL/health"
            echo "📖 Docs: https://$PROJECT_URL/docs"
        fi
    fi
}

# Configurar variáveis de ambiente
setup_environment_variables() {
    echo ""
    read -p "Configurar variáveis de ambiente? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔧 Configurando variáveis de ambiente..."
        
        read -p "GEMINI_API_KEY: " gemini_key
        read -p "DATABASE_URL: " database_url
        
        echo ""
        echo "⚙️ Adicionando variáveis ao Vercel..."
        
        # Adicionar variáveis para produção
        echo "$gemini_key" | vercel env add GEMINI_API_KEY production
        echo "$database_url" | vercel env add DATABASE_URL production
        
        # Adicionar variáveis para preview
        echo "$gemini_key" | vercel env add GEMINI_API_KEY preview
        echo "$database_url" | vercel env add DATABASE_URL preview
        
        echo "✅ Variáveis configuradas"
        
        # Redeploy para aplicar variáveis
        echo ""
        echo "🔄 Fazendo redeploy para aplicar variáveis..."
        vercel --prod
        echo "✅ Redeploy concluído"
    fi
}

# Mostrar instruções GitHub (opcional)
show_github_instructions() {
    echo ""
    read -p "Configurar integração GitHub? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "🐙 INSTRUÇÕES GITHUB:"
        echo "===================="
        echo ""
        
        read -p "Username GitHub: " github_username
        
        echo ""
        echo "1. Criar repositório GitHub:"
        echo "   • https://github.com/new"
        echo "   • Nome: muzaia-backend"
        echo "   • Público (recomendado)"
        echo ""
        
        echo "2. Push para GitHub:"
        echo "   git remote add origin https://github.com/${github_username}/muzaia-backend.git"
        echo "   git push -u origin main"
        echo ""
        
        echo "3. No painel Vercel:"
        echo "   • https://vercel.com/dashboard"
        echo "   • Import Project"
        echo "   • Conectar GitHub repository"
        echo "   • Deploy automático activado"
        echo ""
        
        echo "✨ COMANDOS PRONTOS:"
        echo "git remote add origin https://github.com/${github_username}/muzaia-backend.git"
        echo "git push -u origin main"
    fi
}

# Mostrar resultados finais
show_final_results() {
    echo ""
    echo "🎉 CONFIGURAÇÃO COMPLETA!"
    echo "========================"
    echo ""
    
    # Obter informações do projeto
    PROJECT_URL=$(vercel ls | grep -v "Age" | head -n 1 | awk '{print $2}')
    
    if [ -n "$PROJECT_URL" ]; then
        echo "🎯 URLs DO PROJETO:"
        echo "• Backend: https://$PROJECT_URL"
        echo "• Health: https://$PROJECT_URL/health"
        echo "• Docs: https://$PROJECT_URL/docs"
        echo "• Chat: https://$PROJECT_URL/api/chat"
        echo ""
        
        echo "🧪 TESTAR AGORA:"
        echo "curl https://$PROJECT_URL/health"
    else
        echo "🎯 URLs GENÉRICAS:"
        echo "• Backend: https://muzaia-backend-xxx.vercel.app"
        echo "• Health: https://muzaia-backend-xxx.vercel.app/health"
        echo "• Docs: https://muzaia-backend-xxx.vercel.app/docs"
    fi
    
    echo ""
    echo "💡 GESTÃO CONTÍNUA:"
    echo "• Deploy: vercel --prod"
    echo "• Logs: vercel logs"
    echo "• Domains: vercel domains"
    echo "• Painel: https://vercel.com/dashboard"
    echo ""
    
    echo "💰 CUSTOS VERCEL:"
    echo "• Gratuito para hobby projects"
    echo "• 100GB bandwidth/mês"
    echo "• Execuções serverless ilimitadas"
    echo "• HTTPS e CDN incluídos"
    echo ""
    
    echo "🚀 Muzaia está pronto no Vercel!"
}

# Execução principal
main() {
    check_dependencies
    install_vercel_cli
    setup_git
    prepare_repository
    vercel_login
    initial_deploy
    setup_environment_variables
    show_github_instructions
    show_final_results
}

# Executar se chamado directamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi