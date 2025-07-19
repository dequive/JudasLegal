# Guia de Deploy - Judas Legal Assistant

Este guia explica como fazer deploy da aplicação Judas tanto no Railway quanto no DigitalOcean.

## 🚄 Deploy no Railway

Railway é uma plataforma moderna que facilita muito o deployment. É ideal para projetos que precisam de setup rápido.

### Passo a Passo Railway:

1. **Criar conta no Railway**
   - Acesse [railway.app](https://railway.app)
   - Faça login com GitHub

2. **Conectar repositório**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha seu repositório do Judas

3. **Configurar variáveis de ambiente**
   No painel do Railway, adicione estas variáveis:
   ```
   DATABASE_URL=postgresql://postgres:password@postgres:5432/judas
   GEMINI_API_KEY=sua_chave_gemini_aqui
   SESSION_SECRET=uma_string_secreta_aleatoria
   REPL_ID=seu_repl_id
   REPLIT_DOMAINS=seu-app.railway.app
   ISSUER_URL=https://replit.com/oidc
   NODE_ENV=production
   PORT=5000
   ```

4. **Adicionar PostgreSQL**
   - No dashboard, clique em "New"
   - Selecione "Database" → "PostgreSQL"
   - Conecte ao seu projeto

5. **Deploy automático**
   - Railway detecta automaticamente o `nixpacks.toml`
   - O build e deploy acontecem automaticamente
   - Acesse sua aplicação no domínio fornecido

### Vantagens do Railway:
- ✅ Setup extremamente fácil
- ✅ SSL automático
- ✅ Domínio gratuito (.railway.app)
- ✅ Scaling automático
- ✅ Logs integrados
- ✅ PostgreSQL gerenciado
- ✅ Deploy automático com git push

### Custos Railway:
- Plano gratuito: $5 de crédito/mês
- Plano Pro: $20/mês para uso intensivo

---

## 🌊 Deploy no DigitalOcean

DigitalOcean oferece mais controle e é mais econômico para aplicações com tráfego constante.

### Passo a Passo DigitalOcean:

1. **Criar Droplet**
   - Acesse [digitalocean.com](https://digitalocean.com)
   - Crie um Droplet Ubuntu 22.04
   - Recomendado: 2GB RAM, 1 vCPU ($12/mês)

2. **Conectar via SSH**
   ```bash
   ssh root@seu_ip_do_droplet
   ```

3. **Fazer upload do código**
   ```bash
   # Clone o repositório
   git clone https://github.com/seu_usuario/judas-legal-assistant.git
   cd judas-legal-assistant
   
   # Ou faça upload via scp
   scp -r . root@seu_ip:/root/judas-legal-assistant
   ```

4. **Executar script de deploy**
   ```bash
   chmod +x deploy-digitalocean.sh
   ./deploy-digitalocean.sh
   ```

5. **Configurar variáveis**
   - Edite o arquivo `.env` criado pelo script
   - Adicione suas chaves API e configurações

6. **Acessar aplicação**
   - Acesse: `http://seu_ip_do_droplet:5000`

### Configuração de Domínio (opcional):

1. **Configurar Nginx** (para produção com domínio próprio):
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/judas
   ```

   Adicione esta configuração:
   ```nginx
   server {
       listen 80;
       server_name seu-dominio.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. **Ativar site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/judas /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

3. **SSL com Certbot**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d seu-dominio.com
   ```

### Vantagens do DigitalOcean:
- ✅ Controle total do servidor
- ✅ Preços previsíveis
- ✅ Performance consistente
- ✅ Backup automático (opcional)
- ✅ Networking avançado
- ✅ Ideal para múltiplas aplicações

### Custos DigitalOcean:
- Droplet básico: $6/mês (1GB RAM)
- Droplet recomendado: $12/mês (2GB RAM)
- PostgreSQL gerenciado: +$15/mês (opcional)

---

## 🔧 Variáveis de Ambiente Necessárias

Para ambas as plataformas, configure estas variáveis:

```bash
# Base de dados
DATABASE_URL=postgresql://user:password@host:5432/database

# Inteligência Artificial
GEMINI_API_KEY=sua_chave_do_google_gemini

# Autenticação
SESSION_SECRET=string_secreta_aleatoria_muito_longa
REPL_ID=seu_repl_id_do_replit
REPLIT_DOMAINS=seu-dominio.com
ISSUER_URL=https://replit.com/oidc

# Ambiente
NODE_ENV=production
PORT=5000
```

### Como obter as chaves:

1. **GEMINI_API_KEY**:
   - Acesse [aistudio.google.com](https://aistudio.google.com)
   - Crie uma API key gratuita

2. **Configurações do Replit Auth**:
   - Use seu Repl ID existente
   - Configure o domínio de produção no Replit

---

## 🚀 Qual plataforma escolher?

### Escolha **Railway** se:
- ⭐ Quer deploy rápido e fácil
- ⭐ Não tem experiência com servidores
- ⭐ Tráfego baixo a médio
- ⭐ Prefere pagar por uso

### Escolha **DigitalOcean** se:
- ⭐ Quer controle total
- ⭐ Tem experiência com Linux
- ⭐ Tráfego alto e constante
- ⭐ Prefere custos previsíveis
- ⭐ Planeja hospedar outras aplicações

---

## 🆘 Solução de Problemas

### Problemas comuns:

1. **Erro de conexão com banco**:
   - Verifique a `DATABASE_URL`
   - Confirme que o PostgreSQL está rodando

2. **Erro de autenticação**:
   - Verifique `SESSION_SECRET` e configurações do Replit
   - Confirme o domínio no Replit Auth

3. **Erro de IA**:
   - Verifique a `GEMINI_API_KEY`
   - Confirme quota da API

4. **Aplicação não carrega**:
   - Verifique logs: `docker-compose logs`
   - Confirme que todas as portas estão expostas

---

## 📞 Suporte

Para problemas específicos:
1. Verifique os logs da aplicação
2. Confirme todas as variáveis de ambiente
3. Teste conexões de rede
4. Consulte a documentação das plataformas

Boa sorte com seu deploy! 🎉