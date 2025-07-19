# ✅ Checklist de Deploy - Judas Legal Assistant

## Preparação
- [ ] Conta Vercel criada
- [ ] Conta Supabase criada  
- [ ] API Key do Gemini obtida
- [ ] Node.js instalado
- [ ] Vercel CLI instalado (`npm install -g vercel`)

## Supabase Setup
- [ ] Projeto Supabase criado
- [ ] Senha do banco anotada
- [ ] Connection string copiada e testada
- [ ] Região East US selecionada

## Gemini AI Setup  
- [ ] Conta Google criada/logada
- [ ] API Key do Gemini gerada
- [ ] Chave testada em requisição simples

## Vercel Login
- [ ] `vercel login` executado
- [ ] Conta conectada com sucesso
- [ ] `vercel whoami` retorna seu usuário

## Configuração de Variáveis
- [ ] `./vercel-env-setup.sh` executado
- [ ] GEMINI_API_KEY fornecida
- [ ] DATABASE_URL (Supabase) fornecida
- [ ] SESSION_SECRET gerada automaticamente
- [ ] REPL_ID fornecido

## Deploy Principal
- [ ] `./deploy-vercel.sh` executado sem erros
- [ ] Frontend deployado com sucesso
- [ ] Backend deployado com sucesso  
- [ ] Auth Server deployado com sucesso
- [ ] URLs finais obtidas

## Testes de Funcionamento
- [ ] Frontend carrega: `https://judas-legal-assistant.vercel.app`
- [ ] Backend responde: `https://judas-backend.vercel.app/api/health`
- [ ] Auth funciona: `https://judas-auth.vercel.app/api/health`
- [ ] Login com Replit funciona
- [ ] Chat jurídico responde perguntas
- [ ] Citações legais aparecem
- [ ] Tooltips funcionam

## Configurações Pós-Deploy
- [ ] Variáveis de ambiente verificadas no dashboard
- [ ] Domínio personalizado configurado (opcional)
- [ ] Analytics configurado (opcional)
- [ ] Monitoring configurado (opcional)

## Verificação Final
- [ ] Aplicação totalmente funcional
- [ ] Documentos legais carregados
- [ ] Usuários podem se registrar/logar
- [ ] Chat responde em português
- [ ] Sistema administrativo acessível
- [ ] Performance satisfatória

## Backup & Segurança
- [ ] Backup do Supabase configurado
- [ ] Variáveis de ambiente seguras
- [ ] SSL funcionando em todos os domínios
- [ ] CORS configurado corretamente

---

**Status Geral**: ⏸️ Pendente / 🚀 Em Progresso / ✅ Completo

**Tempo Estimado Total**: ~15-20 minutos

**Custo Total**: R$ 0,00 (100% gratuito)