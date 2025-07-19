# 🚀 Deploy Rápido - Judas Legal Assistant

## Suas Credenciais (Já Obtidas ✅)

- **GEMINI_API_KEY**: `AIzaSyCUe9dn9580M9stl1IgEGwnmANUqtEDNMs`
- **DATABASE_URL**: `postgresql://postgres:Wez0@821722@db.dcqftukouimxugezypwd.supabase.co:5432/postgres`

## Falta Apenas: REPL_ID

### Como Encontrar o REPL_ID:

1. **Olhe na URL** do seu projeto Replit
2. **Formato**: `https://replit.com/@seu-usuario/nome-do-projeto`
3. **REPL_ID**: Pode ser `nome-do-projeto` ou um ID único

### Exemplos:
- Se a URL é: `https://replit.com/@joao/judas-legal`
- Então REPL_ID é: `judas-legal`

## Deploy em 3 Comandos

### 1. Configurar Variáveis
```bash
./configure-env.sh
```
(Você será solicitado a fornecer apenas o REPL_ID)

### 2. Deploy Completo
```bash
./deploy-vercel.sh
```

### 3. URLs Finais
- **Frontend**: https://judas-legal-assistant.vercel.app
- **Backend**: https://judas-backend.vercel.app  
- **Auth**: https://judas-auth.vercel.app

## Verificação Rápida

Teste se tudo funciona:
```bash
# Frontend
curl -I https://judas-legal-assistant.vercel.app

# Backend
curl https://judas-backend.vercel.app/api/health

# Auth
curl https://judas-auth.vercel.app/api/health
```

## Troubleshooting

### Se der erro "Environment variable not found":
1. Vá no [dashboard do Vercel](https://vercel.com/dashboard)
2. Selecione o projeto
3. Settings > Environment Variables
4. Adicione a variável faltante
5. Redeploy

### Se der erro de conexão com banco:
1. Teste a connection string localmente
2. Verifique se não há espaços extras
3. Confirme que a senha está correta

---

⏰ **Tempo Total**: ~5 minutos
💰 **Custo**: R$ 0,00 (100% gratuito)
🎯 **Resultado**: Aplicação jurídica online e funcionando!