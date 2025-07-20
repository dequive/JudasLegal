#!/bin/bash

# Script de configuração inicial para Muzaia Legal Assistant
# Implementa setup automatizado baseado na análise de melhorias

set -e

echo "🚀 Configurando Muzaia Legal Assistant..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Docker está instalado
check_docker() {
    if command -v docker &> /dev/null; then
        log_success "Docker encontrado"
    else
        log_error "Docker não encontrado. Instale Docker primeiro."
        exit 1
    fi
    
    if command -v docker-compose &> /dev/null; then
        log_success "Docker Compose encontrado"
    else
        log_error "Docker Compose não encontrado. Instale Docker Compose primeiro."
        exit 1
    fi
}

# Criar estrutura de diretórios
create_directories() {
    log_info "Criando estrutura de diretórios..."
    
    mkdir -p app/{core,middleware,services,routers,models,schemas}
    mkdir -p tests/{unit,integration,e2e}
    mkdir -p nginx/{conf.d,ssl}
    mkdir -p database/{migrations,seeds}
    mkdir -p uploads/documents
    mkdir -p logs
    mkdir -p scripts/{deploy,backup,monitoring}
    
    log_success "Estrutura de diretórios criada"
}

# Configurar variáveis de ambiente
setup_environment() {
    log_info "Configurando variáveis de ambiente..."
    
    if [ ! -f .env ]; then
        log_info "Criando arquivo .env..."
        cat > .env << EOF
# Database
DATABASE_URL=postgresql://muzaia:muzaia123@localhost:5432/muzaia_legal

# AI Services
GEMINI_API_KEY=your_gemini_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Redis Cache
REDIS_URL=redis://localhost:6379/0

# Server Configuration
PORT=8000
HOST=0.0.0.0
DEBUG=false
LOG_LEVEL=INFO

# Rate Limiting
RATE_LIMIT_PER_MINUTE=30
RATE_LIMIT_PER_HOUR=500

# Security
SESSION_SECRET=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 32)

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5000,https://muzaia.vercel.app
EOF
        log_success "Arquivo .env criado"
    else
        log_warning "Arquivo .env já existe, pulando..."
    fi
}

# Instalar dependências Python
install_python_deps() {
    log_info "Verificando dependências Python..."
    
    if [ -f requirements.txt ]; then
        log_info "Instalando dependências Python..."
        pip install -r requirements.txt
        log_success "Dependências Python instaladas"
    else
        log_warning "requirements.txt não encontrado"
    fi
}

# Instalar dependências Node.js
install_node_deps() {
    log_info "Verificando dependências Node.js..."
    
    if [ -f package.json ]; then
        log_info "Instalando dependências Node.js..."
        npm install
        log_success "Dependências Node.js instaladas"
    else
        log_warning "package.json não encontrado"
    fi
}

# Configurar base de dados
setup_database() {
    log_info "Configurando base de dados..."
    
    # Verificar se PostgreSQL está rodando
    if docker ps | grep -q postgres; then
        log_success "PostgreSQL já está rodando"
    else
        log_info "Iniciando PostgreSQL com Docker..."
        docker run -d \
            --name muzaia-postgres \
            -e POSTGRES_DB=muzaia_legal \
            -e POSTGRES_USER=muzaia \
            -e POSTGRES_PASSWORD=muzaia123 \
            -p 5432:5432 \
            postgres:15-alpine
        
        log_info "Aguardando PostgreSQL inicializar..."
        sleep 10
        log_success "PostgreSQL iniciado"
    fi
}

# Configurar Redis
setup_redis() {
    log_info "Configurando Redis..."
    
    if docker ps | grep -q redis; then
        log_success "Redis já está rodando"
    else
        log_info "Iniciando Redis com Docker..."
        docker run -d \
            --name muzaia-redis \
            -p 6379:6379 \
            redis:7-alpine
        
        log_success "Redis iniciado"
    fi
}

# Executar testes
run_tests() {
    log_info "Executando testes..."
    
    if command -v pytest &> /dev/null; then
        if [ -d tests/ ]; then
            pytest tests/ -v --tb=short
            log_success "Testes executados com sucesso"
        else
            log_warning "Diretório tests/ não encontrado"
        fi
    else
        log_warning "pytest não encontrado, instalando..."
        pip install pytest pytest-asyncio
        if [ -d tests/ ]; then
            pytest tests/ -v --tb=short
            log_success "Testes executados com sucesso"
        fi
    fi
}

# Construir imagens Docker
build_docker_images() {
    log_info "Construindo imagens Docker..."
    
    if [ -f Dockerfile ]; then
        docker build -t muzaia-backend .
        log_success "Imagem backend construída"
    fi
    
    if [ -f Dockerfile.frontend ]; then
        docker build -f Dockerfile.frontend -t muzaia-frontend .
        log_success "Imagem frontend construída"
    fi
}

# Verificar saúde do sistema
health_check() {
    log_info "Verificando saúde do sistema..."
    
    # Verificar backend
    if curl -f http://localhost:8000/health &> /dev/null; then
        log_success "Backend está saudável"
    else
        log_warning "Backend não está respondendo"
    fi
    
    # Verificar frontend
    if curl -f http://localhost:5000 &> /dev/null; then
        log_success "Frontend está saudável"
    else
        log_warning "Frontend não está respondendo"
    fi
}

# Menu principal
main_menu() {
    echo
    echo "=== Muzaia Legal Assistant Setup ==="
    echo "1. Setup Completo (Recomendado)"
    echo "2. Setup Básico (sem Docker)"
    echo "3. Setup Docker"
    echo "4. Apenas Testes"
    echo "5. Health Check"
    echo "6. Sair"
    echo
    read -p "Escolha uma opção: " choice
    
    case $choice in
        1)
            log_info "Iniciando setup completo..."
            check_docker
            create_directories
            setup_environment
            install_python_deps
            install_node_deps
            setup_database
            setup_redis
            build_docker_images
            run_tests
            health_check
            log_success "Setup completo finalizado!"
            ;;
        2)
            log_info "Iniciando setup básico..."
            create_directories
            setup_environment
            install_python_deps
            install_node_deps
            run_tests
            log_success "Setup básico finalizado!"
            ;;
        3)
            log_info "Iniciando setup Docker..."
            check_docker
            setup_database
            setup_redis
            build_docker_images
            log_success "Setup Docker finalizado!"
            ;;
        4)
            log_info "Executando apenas testes..."
            run_tests
            ;;
        5)
            log_info "Verificando saúde do sistema..."
            health_check
            ;;
        6)
            log_info "Saindo..."
            exit 0
            ;;
        *)
            log_error "Opção inválida"
            main_menu
            ;;
    esac
}

# Verificar argumentos da linha de comando
if [ $# -eq 0 ]; then
    main_menu
else
    case $1 in
        --full)
            log_info "Setup completo via argumento..."
            check_docker
            create_directories
            setup_environment
            install_python_deps
            install_node_deps
            setup_database
            setup_redis
            build_docker_images
            run_tests
            health_check
            ;;
        --basic)
            log_info "Setup básico via argumento..."
            create_directories
            setup_environment
            install_python_deps
            install_node_deps
            run_tests
            ;;
        --docker)
            log_info "Setup Docker via argumento..."
            check_docker
            setup_database
            setup_redis
            build_docker_images
            ;;
        --test)
            run_tests
            ;;
        --health)
            health_check
            ;;
        --help)
            echo "Uso: $0 [--full|--basic|--docker|--test|--health|--help]"
            echo "  --full    : Setup completo com Docker"
            echo "  --basic   : Setup básico sem Docker"
            echo "  --docker  : Apenas setup Docker"
            echo "  --test    : Executar apenas testes"
            echo "  --health  : Verificar saúde do sistema"
            echo "  --help    : Mostrar esta ajuda"
            ;;
        *)
            log_error "Argumento inválido: $1"
            log_info "Use --help para ver opções disponíveis"
            exit 1
            ;;
    esac
fi

echo
log_success "Configuração concluída! 🎉"
echo "Para iniciar o sistema:"
echo "  • Backend: python backend_complete.py"
echo "  • Frontend: npm run dev"
echo "  • Docker: docker-compose up"