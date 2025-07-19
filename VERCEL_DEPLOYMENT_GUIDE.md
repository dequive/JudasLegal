# 📋 Guia Passo-a-Passo: Deploy Judas Legal Assistant no Vercel

## Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Conta no [Supabase](https://supabase.com) 
- Conta no [Google AI Studio](https://aistudio.google.com)
- [Node.js](https://nodejs.org) instalado
- [Git](https://git-scm.com) instalado

## Passo 1: Configurar Supabase (5 minutos)

### 1.1 Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"Start your project"**
3. Faça login com GitHub, Google ou email
4. Clique em **"New project"**
5. Selecione organização (ou crie uma)
6. Configure:
   - **Project name**: `judas-legal-assistant`
   - **Database Password**: Crie senha forte (anote!)
   - **Region**: East US (us-east-1)
   - **Pricing Plan**: Free
7. Clique em **"Create new project"**
8. **Aguarde 2-3 minutos** para finalizar

### 1.2 Obter Connection String
1. No dashboard do projeto, vá em **Settings**
2. Clique em **Database** (menu lateral)
3. Role até **"Connection parameters"**
4. Copie a **"Connection string"**:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
5. **Substitua** `[YOUR-PASSWORD]` pela senha do Passo 1.1
6. **Salve** essa string - você vai usar várias vezes

## Passo 2: Obter API Key do Gemini (2 minutos)

1. Acesse [aistudio.google.com](https://aistudio.google.com)
2. Faça login com conta Google
3. Clique em **"Get API Key"**
4. Clique em **"Create API key in new project"**
5. **Copie** a chave (formato: `AIzaSyA...`)
6. **Salve** essa chave

## Passo 3: Instalar Vercel CLI (1 minuto)

Abra o terminal e execute:
```bash
npm install -g vercel
```

## Passo 4: Login no Vercel (1 minuto)

```bash
vercel login
```
Escolha seu método de login (GitHub recomendado)

## Passo 5: Configurar Variáveis Automaticamente (2 minutos)

No terminal do projeto, execute:
```bash
./vercel-env-setup.sh
```

Quando solicitado, forneça:
- **GEMINI_API_KEY**: Cole a chave do Passo 2
- **DATABASE_URL**: Cole a connection string do Passo 1.2
- **SESSION_SECRET**: Deixe vazio (será gerado automaticamente)
- **REPL_ID**: Cole o ID do seu projeto atual no Replit

## Passo 6: Deploy Automático (5 minutos)

Execute o script de deploy:
```bash
./deploy-vercel.sh
```

O script vai:
1. Verificar se você está logado
2. Fazer deploy do Frontend (Next.js)
3. Fazer deploy do Backend (FastAPI)
4. Fazer deploy do Auth Server (Express.js)

## Passo 7: Verificar Deployment

Ao final, você terá 3 URLs:

### Frontend
```
https://judas-legal-assistant.vercel.app
```
**Teste**: Deve carregar a página inicial

### Backend
```
https://judas-backend.vercel.app/api/health
```
**Teste**: Deve retornar `{"status": "ok"}`

### Auth Server
```
https://judas-auth.vercel.app/api/health  
```
**Teste**: Deve retornar status de funcionamento

## Passo 8: Testar a Aplicação

1. **Abra** `https://judas-legal-assistant.vercel.app`
2. **Clique** em "Entrar" (botão no canto superior direito)
3. **Faça login** com sua conta Replit
4. **Teste** o chat jurídico fazendo uma pergunta
5. **Verifique** se as citações aparecem corretamente

## Troubleshooting

### Erro: "Environment variable not found"
**Solução**: 
1. Vá no [dashboard do Vercel](https://vercel.com/dashboard)
2. Selecione o projeto com erro
3. Vá em Settings > Environment Variables
4. Adicione a variável faltante
5. Redeploy o projeto

### Erro: "Database connection failed"
**Solução**:
1. Teste a connection string localmente
2. Verifique se não há espaços extras
3. Confirme que a senha está correta
4. No Supabase, vá em Settings > Database e gere nova string

### Erro: "Gemini API quota exceeded"
**Solução**:
1. Verifique uso no [Google AI Studio](https://aistudio.google.com)
2. A API gratuita tem limites, mas deve ser suficiente para testes
3. Se necessário, ative billing no Google Cloud

### Deploy falha
**Solução**:
```bash
# Ver logs detalhados
vercel logs https://seu-projeto.vercel.app

# Tentar redeploy
vercel --prod
```

### Páginas não carregam
**Solução**:
1. Verifique se todas as 3 partes foram deployadas
2. Confirme que as URLs estão corretas nas variáveis de ambiente
3. Aguarde alguns minutos para propagação do DNS

## Monitoramento

### Dashboard Vercel
- **Analytics**: Veja quantos usuários estão usando
- **Functions**: Monitor de performance das APIs
- **Logs**: Debug de problemas em tempo real

### Dashboard Supabase  
- **Database**: Veja tabelas e dados
- **Usage**: Monitor do uso do banco
- **Logs**: Debug de queries SQL

## Custos

### Vercel (Hobby - Gratuito)
- ✅ 100GB de transferência/mês
- ✅ 1000 execuções serverless/dia
- ✅ Domínios personalizados
- ✅ SSL automático

### Supabase (Free Tier)
- ✅ 500MB de espaço
- ✅ 2GB de transferência/mês  
- ✅ 50,000 autenticações/mês
- ✅ Backups automáticos

### Google Gemini AI (Free Tier)
- ✅ 15 requests/minute
- ✅ 1,500 requests/dia
- ✅ Mais que suficiente para testes

## Próximos Passos

1. **Configurar domínio personalizado** (opcional)
2. **Configurar monitoring** com Sentry ou similar
3. **Configurar CI/CD** para deploys automáticos
4. **Upload de mais documentos legais** via painel admin
5. **Configurar Google Analytics** para métricas

---

🎉 **Parabéns!** Sua aplicação jurídica está online e funcionando!