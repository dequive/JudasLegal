# Conectar MuzaIA ao GitHub + Vercel

## 🎯 Passos para Configuração

### 1. Criar Repositório GitHub
1. Aceda a https://github.com/new
2. Nome do repositório: `muzaia-legal-assistant`
3. Descrição: `Assistente jurídico online baseado em inteligência artificial, especialista em leis moçambicanas`
4. Escolha: **Público** ou **Privado**
5. **NÃO** inicializar com README (já temos arquivos)
6. Clique "Create repository"

### 2. Conectar Replit ao GitHub
1. No Replit, clique no ícone do GitHub na sidebar
2. Clique "Connect to GitHub"
3. Autorize a conexão
4. Escolha o repositório: `muzaia-legal-assistant`
5. Clique "Import from GitHub"

### 3. Conectar Vercel ao GitHub
1. Aceda a https://vercel.com/dashboard
2. Clique "Add New..." > "Project"
3. Escolha "Import Git Repository"
4. Seleccione o repositório `muzaia-legal-assistant`
5. Configure as variáveis de ambiente:

```env
GEMINI_API_KEY=AIzaSyAwx_RItGZMpaBcmnKNWUDVnSCxqm6XxN8
DATABASE_URL=postgresql://postgres.haqlhwzoecdpgtfuzstw:Unica2024@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
REPL_ID=MuzaIA
SESSION_SECRET=muzaia-super-secret-session-key-2024
NODE_ENV=production
FRONTEND_URL=https://vossa-nova-url.vercel.app
```

6. Clique "Deploy"

## ✅ Vantagens da Integração GitHub

- **Deploy Automático**: Cada push faz redeploy automático
- **Histórico**: Todas as alterações ficam guardadas
- **Colaboração**: Fácil partilha e trabalho em equipa
- **Rollback**: Voltar a versões anteriores facilmente
- **Branches**: Testar funcionalidades em separado

## 🔄 Fluxo de Trabalho Futuro

1. **Desenvolver** no Replit
2. **Commit** e **Push** para GitHub
3. **Deploy automático** no Vercel
4. **Verificar** a aplicação online

## 📋 Arquivos Preparados

Todos os arquivos do MuzaIA estão prontos:
- ✅ Frontend Next.js actualizado
- ✅ Backend FastAPI operacional  
- ✅ Sistema de autenticação configurado
- ✅ Base de dados Supabase conectada
- ✅ 11 documentos legais carregados
- ✅ Interface moderna implementada

## 🚀 Próximos Passos

Após configurar GitHub:
1. O MuzaIA será automaticamente disponibilizado
2. Qualquer alteração será deployada instantaneamente
3. Terá um URL personalizado do Vercel
4. Sistema totalmente automatizado