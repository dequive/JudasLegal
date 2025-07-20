#!/bin/bash

echo "🚀 Deploy do Backend Muzaia no Vercel"
echo "======================================"

# Verificar se está no directório correcto
if [ ! -f "backend_complete.py" ]; then
    echo "❌ Erro: backend_complete.py não encontrado!"
    echo "Execute este script no directório raiz do projecto."
    exit 1
fi

# Verificar dependências
echo "📦 Verificando dependências..."

# Criar requirements.txt específico para Vercel se não existir
if [ ! -f "requirements.txt" ]; then
    echo "📝 Criando requirements.txt para Vercel..."
    cat > requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn==0.24.0
psycopg2-binary==2.9.9
google-generativeai==0.3.2
python-multipart==0.0.6
PyPDF2==3.0.1
python-docx==0.8.11
pytesseract==0.3.10
trafilatura==1.6.4
numpy==1.24.3
python-jose==3.3.0
passlib==1.7.4
aiofiles==23.2.1
httpx==0.24.1
chardet==5.2.0
sqlalchemy==2.0.23
pydantic==2.5.0
EOF
    echo "✅ requirements.txt criado"
fi

# Verificar se vercel.json existe e está correctamente configurado
if [ ! -f "vercel.json" ]; then
    echo "📝 Criando vercel.json para backend..."
    cat > vercel.json << 'EOF'
{
  "name": "muzaia-backend",
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
      "dest": "/backend_complete.py"
    }
  ],
  "env": {
    "GEMINI_API_KEY": "@gemini_api_key",
    "DATABASE_URL": "@database_url",
    "PYTHONPATH": "/var/task"
  },
  "functions": {
    "backend_complete.py": {
      "runtime": "python3.9",
      "maxDuration": 60
    }
  }
}
EOF
    echo "✅ vercel.json criado para backend"
fi

echo ""
echo "🔧 CONFIGURAÇÃO NECESSÁRIA:"
echo "=========================="
echo ""
echo "1. Configurar variáveis de ambiente no Vercel:"
echo "   vercel env add GEMINI_API_KEY"
echo "   vercel env add DATABASE_URL"
echo ""
echo "2. Suas variáveis actuais devem ser:"
echo "   GEMINI_API_KEY: Vossa chave do Google Gemini"
echo "   DATABASE_URL: Vossa URL do Supabase PostgreSQL"
echo ""

# Verificar se o utilizador quer continuar
read -p "Deseja continuar com o deploy? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deploy cancelado pelo utilizador"
    exit 1
fi

echo ""
echo "🚀 Iniciando deploy no Vercel..."

# Fazer login se necessário
if ! vercel whoami > /dev/null 2>&1; then
    echo "🔐 A fazer login no Vercel..."
    vercel login
fi

# Deploy do backend
echo "📤 Fazendo deploy do backend..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
    echo "==============================="
    echo ""
    echo "Vosso backend está agora disponível em:"
    vercel ls | grep muzaia | head -1 | awk '{print "🌐 https://" $2}'
    echo ""
    echo "📋 PRÓXIMOS PASSOS:"
    echo "1. Testar os endpoints:"
    echo "   curl https://vosso-projeto.vercel.app/health"
    echo "   curl https://vosso-projeto.vercel.app/api/chat"
    echo ""
    echo "2. Actualizar frontend para usar a nova URL do backend"
    echo "3. Configurar CORS se necessário"
    echo ""
    echo "📖 Documentação completa: VERCEL_BACKEND_ACCESS.md"
else
    echo ""
    echo "❌ ERRO NO DEPLOY"
    echo "================"
    echo ""
    echo "Possíveis soluções:"
    echo "1. Verificar se todas as variáveis de ambiente estão definidas"
    echo "2. Verificar se requirements.txt está correcto"
    echo "3. Verificar logs: vercel logs"
    echo "4. Consultar VERCEL_BACKEND_ACCESS.md para mais informações"
fi