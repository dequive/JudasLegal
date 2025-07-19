# 🔧 Configuração de Variáveis no Vercel

## Passo 1: Acesse o Dashboard
1. Vá para [vercel.com/dashboard](https://vercel.com/dashboard)
2. Faça login com sua conta

## Passo 2: Configure cada projeto

### 📱 Frontend (judas-legal-assistant)

No projeto `judas-legal-assistant`:
```
NEXT_PUBLIC_API_URL = https://judas-backend.vercel.app
NEXT_PUBLIC_AUTH_URL = https://judas-auth.vercel.app
NODE_ENV = production
```

### ⚙️ Backend (judas-backend)

No projeto `judas-backend`:
```
GEMINI_API_KEY = [sua_chave_gemini]
DATABASE_URL = [sua_string_postgresql]
PYTHON_PATH = .
```

### 🔐 Auth Server (judas-auth)

No projeto `judas-auth`:
```
SESSION_SECRET = [string_secreta_longa]
DATABASE_URL = [sua_string_postgresql]
REPL_ID = [seu_repl_id]
REPLIT_DOMAINS = judas-legal-assistant.vercel.app
ISSUER_URL = https://replit.com/oidc
NODE_ENV = production
```

## Passo 3: Obter as Chaves Necessárias

### 🤖 GEMINI_API_KEY (Gratuito)
1. Acesse [aistudio.google.com](https://aistudio.google.com)
2. Clique em **"Get API Key"**
3. Crie uma nova chave
4. Copie a chave (formato: `AIzaSyA...`)

### 🐘 DATABASE_URL (Supabase PostgreSQL)

**Configuração no Supabase:**
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Clique em "New project"
4. Escolha organização e nome do projeto
5. Crie uma senha forte para o banco
6. Selecione região (ex: East US)
7. Aguarde a criação do projeto

**Obter Connection String:**
1. No dashboard, vá em **Settings > Database**
2. Na seção "Connection parameters"
3. Copie a **"Connection string"**
4. Substitua `[YOUR-PASSWORD]` pela senha criada
5. Formato: `postgresql://postgres:senha@host.supabase.co:5432/postgres`

### 🔐 SESSION_SECRET
Gere uma string aleatória segura:
```bash
# No terminal:
openssl rand -hex 32
```
Ou use um gerador online: [passwordsgenerator.net](https://passwordsgenerator.net)

### 📱 REPL_ID e REPLIT_DOMAINS
- **REPL_ID**: Encontre no URL do seu repl no Replit
- **REPLIT_DOMAINS**: Use `judas-legal-assistant.vercel.app`

## Passo 4: Configurar no Dashboard Vercel

Para cada projeto no Vercel:

1. **Acesse o projeto**
2. Vá em **Settings > Environment Variables**
3. **Adicione cada variável**:
   - Name: `GEMINI_API_KEY`
   - Value: `AIzaSyA...`
   - Environment: `Production`
4. **Clique em Save**
5. **Repita para todas as variáveis**

## Passo 5: Redeploy

Após adicionar todas as variáveis:
1. Vá em **Deployments**
2. Clique nos **3 pontos** no último deploy
3. Clique em **Redeploy**
4. Selecione **Use existing Build Cache**
5. Clique em **Redeploy**

## ✅ Verificação

Teste se tudo funciona:
```bash
# Frontend
curl https://judas-legal-assistant.vercel.app

# Backend  
curl https://judas-backend.vercel.app/api/health

# Auth
curl https://judas-auth.vercel.app/api/health
```

## 🆘 Problemas Comuns

### "Environment variable not found"
- Verifique se está no projeto correto
- Redeploy após adicionar variável
- Aguarde alguns minutos para propagar

### "Database connection failed"
- Teste a connection string localmente
- Verifique se o IP está na whitelist (Neon/Supabase)
- Confirme usuário/senha corretos

### "Gemini API error"  
- Verifique se a chave está correta
- Confirme que tem créditos/quota
- Teste a chave em outro projeto

---

🎉 **Pronto!** Sua aplicação está configurada no Vercel!