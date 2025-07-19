# 🏛️ Judas - Assistente Jurídico Inteligente para Moçambique

<div align="center">

![Judas Legal Assistant](https://img.shields.io/badge/Judas-Legal%20Assistant-emerald?style=for-the-badge&logo=scales&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**Assistente jurídico alimentado por IA para navegação inteligente da legislação moçambicana**

[🚀 Demo](#demo) • [📖 Documentação](#documentação) • [🔧 Installation](#instalação) • [🌐 Deploy](#deploy)

</div>

---

## 📋 Visão Geral

Judas é uma aplicação web progressiva (PWA) que oferece assistência jurídica inteligente especializada na legislação moçambicana. Utilizando tecnologia RAG (Retrieval-Augmented Generation) e Google Gemini AI, o sistema responde consultas jurídicas em linguagem natural com citações precisas de fontes oficiais.

### ✨ Características Principais

- 🤖 **IA Especializada**: Google Gemini 2.0 Flash treinado para direito moçambicano
- 📚 **Citações Precisas**: Respostas com referências específicas a leis e artigos
- 🌐 **Interface Moderna**: Design contemporâneo com gradientes e glassmorphism
- 🔐 **Autenticação Segura**: Sistema Replit Auth com sessões protegidas
- 📖 **Tooltips Educativos**: Glossário contextual de termos jurídicos
- 👨‍💼 **Painel Administrativo**: Upload e gestão de documentos legais
- 🚀 **PWA**: Funcionalidade offline e instalação no dispositivo

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 15** - Framework React com SSR
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **Zustand** - Gerenciamento de estado
- **React Query** - Cache e sincronização de dados

### Backend  
- **FastAPI** - API Python moderna
- **SQLAlchemy** - ORM para PostgreSQL
- **Google Gemini** - Modelo de IA gratuito
- **Express.js** - Servidor de autenticação
- **PostgreSQL** - Banco de dados principal

### Deployment
- **Docker** - Containerização
- **Railway** - Platform-as-a-Service
- **DigitalOcean** - VPS tradicional
- **Nginx** - Proxy reverso (opcional)

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Chave API do Google Gemini

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/judas-legal-assistant.git
cd judas-legal-assistant

# Instale dependências do frontend
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# Inicie os serviços
npm run dev        # Frontend (porta 5000)
node auth-server.js # Auth server (porta 3001)  
python main.py     # Backend API (porta 80)
```

### Variáveis de Ambiente

```env
# Base de dados
DATABASE_URL=postgresql://user:password@localhost:5432/judas

# IA
GEMINI_API_KEY=sua_chave_gemini

# Autenticação
SESSION_SECRET=string_secreta_aleatoria
REPL_ID=seu_repl_id
REPLIT_DOMAINS=localhost:5000

# Ambiente
NODE_ENV=development
PORT=5000
```

## 🌐 Deploy em Produção

### 🚄 Railway (Recomendado)

1. Fork este repositório
2. Conecte no [Railway](https://railway.app)
3. Configure variáveis de ambiente
4. Deploy automático!

### 🌊 DigitalOcean

```bash
# Em seu droplet Ubuntu
git clone https://github.com/seu-usuario/judas-legal-assistant.git
cd judas-legal-assistant
./deploy-digitalocean.sh
```

Ver guia completo em [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📖 Funcionalidades

### 🤖 Assistente Jurídico IA
- Consultas em linguagem natural português
- Respostas com citações de leis moçambicanas
- Sistema RAG para recuperação de documentos
- Interface de chat moderna e intuitiva

### 📚 Sistema de Tooltips
- Glossário com 30+ termos jurídicos
- Detecção automática em textos
- Categorização por área do direito
- Navegação por teclado e acessibilidade

### 👨‍💼 Painel Administrativo
- Upload de documentos PDF, DOCX, TXT
- Processamento inteligente de texto legal
- Gestão de base de dados jurídica
- Estatísticas e monitoramento

### 🔐 Autenticação
- Login com contas Replit
- Sessões seguras com cookies httpOnly
- Páginas protegidas e públicas
- Profile management

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- 📧 Email: suporte@judas-legal.com
- 💬 Discord: [Servidor da Comunidade](https://discord.gg/judas)
- 📚 Docs: [Documentação Completa](https://docs.judas-legal.com)

---

<div align="center">

**Desenvolvido com ❤️ para democratizar o acesso à justiça em Moçambique**

[⭐ Star](https://github.com/seu-usuario/judas-legal-assistant) • [🍴 Fork](https://github.com/seu-usuario/judas-legal-assistant/fork) • [🐛 Issues](https://github.com/seu-usuario/judas-legal-assistant/issues)

</div>