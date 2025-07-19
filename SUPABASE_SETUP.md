# 🗃️ Configuração Supabase para Judas Legal Assistant

## Passo 1: Criar Projeto no Supabase

1. **Acesse** [supabase.com](https://supabase.com)
2. **Faça login** com GitHub, Google ou email
3. **Clique** em "New project"
4. **Escolha** uma organização (ou crie uma)
5. **Configure** o projeto:
   - **Project name**: `judas-legal-assistant`
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: East US (us-east-1) - mais próximo
   - **Pricing plan**: Free (até 500MB)
6. **Clique** em "Create new project"
7. **Aguarde** 2-3 minutos para setup completo

## Passo 2: Obter Connection String

1. **No dashboard** do seu projeto
2. **Vá em** Settings → Database (no menu lateral)
3. **Na seção** "Connection parameters"
4. **Copie** a "Connection string":
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
5. **Substitua** `[YOUR-PASSWORD]` pela senha criada no Passo 1

## Passo 3: Configurar Tabelas

O Supabase criará as tabelas automaticamente quando a aplicação inicializar, mas você pode verificar:

1. **Vá em** Table Editor (no menu lateral)
2. **Aguarde** o primeiro acesso da aplicação criar as tabelas:
   - `users` - Usuários do sistema
   - `sessions` - Sessões de autenticação
   - `legal_documents` - Documentos jurídicos
   - `uploaded_documents` - Controle de uploads
   - `chat_sessions` - Sessões de chat
   - `chat_messages` - Mensagens do chat

## Passo 4: Configurar no Vercel

Use a connection string obtida no **Passo 2** como valor para:
- `DATABASE_URL` no frontend
- `DATABASE_URL` no backend  
- `DATABASE_URL` no auth server

## Vantagens do Supabase

✅ **500MB gratuitos** - Suficiente para milhares de documentos legais  
✅ **Interface visual** - Visualizar e editar dados facilmente  
✅ **Backups automáticos** - Seus dados sempre protegidos  
✅ **APIs REST automáticas** - Se precisar integrar outras funcionalidades  
✅ **Authentication integrada** - Pode expandir no futuro  
✅ **Edge Functions** - Para funcionalidades serverless  
✅ **Realtime** - Para chat em tempo real no futuro  

## Monitoramento

No dashboard do Supabase você pode:
- **Visualizar** uso do banco (Database → Usage)
- **Executar** queries SQL (SQL Editor)
- **Ver logs** (Logs)
- **Gerenciar** usuários (Authentication)
- **Configurar** políticas de segurança (Policies)

## Limites do Plano Gratuito

- **500MB** de espaço em disco
- **2GB** de transferência de dados/mês
- **100MB** de arquivos de storage
- **50,000** requisições de autenticação/mês
- **2** projetos ativos

Para o Judas Legal Assistant, isso é mais que suficiente!

## Troubleshooting

### Erro de conexão
- Verifique se a senha está correta
- Confirme que não há espaços extras na connection string
- Teste a conexão em um cliente SQL

### Tabelas não criadas
- A aplicação cria as tabelas no primeiro acesso
- Verifique se a connection string tem permissões de CREATE TABLE
- Execute manualmente as migrations se necessário

### Performance lenta
- Supabase free tem algumas limitações de performance
- Para produção, considere upgrade para Pro ($25/mês)

---

🎯 **Próximo passo**: Use a connection string no script `./vercel-env-setup.sh`