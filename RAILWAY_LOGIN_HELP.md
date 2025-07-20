# Soluções para Erro de Login Railway

## Problemas Comuns e Soluções

### 1. Railway CLI Não Instalado

**Problema**: Command not found: railway

**Soluções**:

#### Opção A: NPM (Recomendado)
```bash
# Instalar globalmente
npm install -g @railway/cli

# Verificar instalação
railway --version
```

#### Opção B: Download Direto
```bash
# Linux/macOS
curl -fsSL https://railway.app/install.sh | sh

# Ou baixar manualmente de:
# https://github.com/railwayapp/cli/releases
```

### 2. Erro de Autenticação

**Problema**: Authentication failed ou Invalid token

**Soluções**:

#### Método 1: Login Browser (Recomendado)
```bash
# Limpar cache de autenticação
rm -rf ~/.railway

# Login com browser
railway login

# Seguir instruções no browser que abrir
```

#### Método 2: Token Manual
```bash
# Obter token em: https://railway.app/account/tokens
railway login --browserless

# Colar token quando solicitado
```

### 3. Problemas de Rede/Firewall

**Problema**: Connection timeout ou Network error

**Soluções**:
```bash
# Verificar conectividade
curl -I https://railway.app

# Usar proxy se necessário
export HTTPS_PROXY=http://proxy:port
railway login
```

### 4. Browser Não Abre

**Problema**: Browser não abre automaticamente

**Soluções**:
```bash
# Login manual sem browser
railway login --browserless

# Copiar URL mostrada e abrir manualmente
# Colar token de volta no terminal
```

## Alternativas ao Railway

Se o login continuar a falhar, temos outras opções:

### Opção 1: Vercel Functions (Corrigido)
```bash
# Deploy backend como serverless functions
./deploy-backend-vercel.sh
```

### Opção 2: Render (Similar ao Railway)
```bash
# Criar conta em render.com
# Deploy via GitHub
# Configurar variáveis de ambiente
```

### Opção 3: DigitalOcean App Platform
```bash
# Usar Docker
docker build -t muzaia-backend .
# Deploy via DigitalOcean
```

## Script de Diagnóstico

Execute este comando para diagnosticar:

```bash
echo "🔍 DIAGNÓSTICO RAILWAY"
echo "====================="
echo ""

echo "1. Verificando Railway CLI..."
if command -v railway &> /dev/null; then
    echo "✅ Railway CLI instalado"
    railway --version
else
    echo "❌ Railway CLI não instalado"
    echo "Instalar: npm install -g @railway/cli"
fi

echo ""
echo "2. Verificando conectividade..."
if curl -s --max-time 5 https://railway.app > /dev/null; then
    echo "✅ Conectividade OK"
else
    echo "❌ Problema de conectividade"
fi

echo ""
echo "3. Verificando autenticação..."
if railway whoami &> /dev/null; then
    echo "✅ Autenticado como:"
    railway whoami
else
    echo "❌ Não autenticado"
    echo "Execute: railway login"
fi

echo ""
echo "4. Verificando projetos..."
railway list 2>/dev/null || echo "❌ Não foi possível listar projetos"
```

## Processo de Login Detalhado

### Passo 1: Instalar Railway CLI
```bash
npm install -g @railway/cli
```

### Passo 2: Iniciar Login
```bash
railway login
```

### Passo 3: Seguir Instruções
1. Browser abre automaticamente
2. Fazer login na conta Railway
3. Autorizar CLI
4. Voltar ao terminal

### Passo 4: Verificar Sucesso
```bash
railway whoami
```

## Se Nada Funcionar

### Deploy Alternativo no Vercel
```bash
# Usar backend serverless (já corrigido)
./deploy-backend-vercel.sh

# Ou deploy manual:
vercel --prod
```

### Usar Replit Deploy
```bash
# Deploy direto do Replit
# Clicar no botão Deploy
# Configurar variáveis de ambiente
```

## Comandos de Troubleshooting

```bash
# Limpar cache
rm -rf ~/.railway
rm -rf ~/.config/railway

# Reinstalar CLI
npm uninstall -g @railway/cli
npm install -g @railway/cli

# Verificar versão Node.js
node --version  # Deve ser >= 16

# Login verbose
railway login --debug
```

Que erro específico está a receber? Posso ajudar com a solução exacta.