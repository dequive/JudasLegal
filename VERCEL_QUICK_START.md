# 🚀 Deploy no Vercel - Guia Rápido

## Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Conta no [GitHub](https://github.com) (para repositório)
- [Vercel CLI](https://vercel.com/cli) instalado

## 1. Preparação (Feito ✅)

Os arquivos já estão configurados:
- ✅ `vercel.json` - Frontend Next.js
- ✅ `vercel-backend.json` - Backend FastAPI  
- ✅ `vercel-auth.json` - Auth Server Express.js
- ✅ `deploy-vercel.sh` - Script automatizado
- ✅ `requirements-vercel.txt` - Dependências Python

## 2. Configurar Variáveis de Ambiente

```bash
# Script automatizado para configurar todas as variáveis
./vercel-env-setup.sh
```

Você será solicitado a fornecer:
- GEMINI_API_KEY (da Google AI Studio)
- DATABASE_URL (PostgreSQL gratuito)
- SESSION_SECRET (será gerado automaticamente)
- REPL_ID (do seu projeto atual)

## 3. Deploy Automático

```bash
# Instalar Vercel CLI (se não tiver)
npm install -g vercel

# Login (primeira vez)
vercel login

# Deploy automático de tudo
./deploy-vercel.sh
```

## 3. Configurar Variáveis de Ambiente

No dashboard do Vercel ([vercel.com/dashboard](https://vercel.com/dashboard)):

### Para o Frontend (judas-legal-assistant):
```
NEXT_PUBLIC_API_URL=https://judas-backend.vercel.app
NEXT_PUBLIC_AUTH_URL=https://judas-auth.vercel.app
NODE_ENV=production
```

### Para o Backend (judas-backend):
```
GEMINI_API_KEY=sua_chave_gemini_aqui
DATABASE_URL=sua_connection_string_postgresql
```

### Para o Auth Server (judas-auth):
```
SESSION_SECRET=string_secreta_muito_longa
DATABASE_URL=sua_connection_string_postgresql
REPL_ID=seu_repl_id
REPLIT_DOMAINS=judas-legal-assistant.vercel.app
ISSUER_URL=https://replit.com/oidc
NODE_ENV=production
```

## 4. Onde Conseguir as Chaves

### 🤖 GEMINI_API_KEY
1. Acesse [aistudio.google.com](https://aistudio.google.com)
2. Clique em "Get API key"
3. Crie uma chave gratuita

### 🐘 DATABASE_URL (Supabase PostgreSQL)
1. Acesse [supabase.com](https://supabase.com) 
2. Crie projeto gratuito (até 500MB)
3. Settings > Database > Connection string
4. Substitua `[YOUR-PASSWORD]` pela sua senha

### 🔐 SESSION_SECRET
```bash
# Gerar uma string aleatória segura
openssl rand -hex 32
```

### 📱 Configurações Replit Auth
- Use seu REPL_ID atual do Replit
- REPLIT_DOMAINS deve ser o domínio final do Vercel

## 5. URLs Finais

Após o deploy, sua aplicação estará em:
- **Frontend**: `https://judas-legal-assistant.vercel.app`
- **Backend**: `https://judas-backend.vercel.app`  
- **Auth**: `https://judas-auth.vercel.app`

## 6. Verificação

Teste se tudo funciona:
```bash
# Frontend
curl https://judas-legal-assistant.vercel.app

# Backend
curl https://judas-backend.vercel.app/api/health

# Auth
curl https://judas-auth.vercel.app/api/health
```

## 🎯 Vantagens do Vercel

- ✅ **Gratuito** para projetos pessoais
- ✅ **SSL automático** com certificados
- ✅ **CDN global** para performance
- ✅ **Deploy automático** em push no GitHub
- ✅ **Preview deployments** para branches
- ✅ **Analytics integrado**
- ✅ **Rollback fácil**

## 🆘 Problemas Comuns

### Deploy falha
```bash
# Ver logs detalhados
vercel logs <deployment-url>
```

### Variáveis não funcionam
- Redeploy após adicionar variáveis
- Verificar se estão no projeto correto

### Banco não conecta
- Verificar se DATABASE_URL está correto
- Testar conexão localmente primeiro

---

🚀 **Pronto!** Sua aplicação jurídica está no ar gratuitamente!