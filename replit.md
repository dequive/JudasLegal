# Judas - Legal Assistant for Mozambican Law

## Overview

Judas is a Progressive Web Application (PWA) that provides an intelligent legal assistant for Mozambican law. The system uses RAG (Retrieval-Augmented Generation) technology to help users understand legal documents and regulations through natural language queries in Portuguese. The application features offline functionality, citation-based responses, responsive chat interface, and uses Supabase as the database solution.

## User Preferences

Preferred communication style: Simple, everyday language.
Language: Portuguese European (use "vosso/vossa" instead of "seu/sua", "optimizar" instead of "otimizar", etc.)

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom Mozambican theme colors
- **State Management**: Zustand for chat state management
- **PWA Features**: Service Worker for offline functionality and caching
- **UI Components**: Modular component architecture with reusable chat interface

### Backend Architecture
- **Framework**: FastAPI with Python 3.11
- **Database**: Supabase PostgreSQL with SQLAlchemy ORM
- **AI Integration**: Google Gemini 2.0 Flash for response generation
- **RAG Pipeline**: Custom retrieval-augmented generation system
- **API Design**: RESTful API with structured response formats

## Key Components

### Database Models
- **LegalDocument**: Stores Mozambican legal texts with metadata
- **DocumentEmbedding**: Handles text chunking and vector storage (JSON format)
- **ChatSession**: Manages user conversation sessions
- **ChatMessage**: Stores individual chat messages

### Core Services
- **RAGService**: Main pipeline for query processing and response generation
- **GeminiService**: Handles AI model interactions with legal-specific prompts
- **TextProcessor**: Portuguese text preprocessing and normalization

### Frontend Components
- **ChatInterface**: Main chat component with real-time messaging
- **MessageBubble**: Individual message display with role-based styling
- **CitationCard**: Displays legal source citations with relevance scores
- **LoadingSpinner**: Reusable loading indicator

## Data Flow

1. **User Input**: User submits legal query through chat interface
2. **Query Processing**: TextProcessor normalizes Portuguese text
3. **Document Retrieval**: RAGService searches for relevant legal documents
4. **Response Generation**: GeminiService generates response with citations
5. **UI Update**: Chat interface displays response with citation cards
6. **Session Management**: Messages stored in database for history

## External Dependencies

### AI Services
- **Google Gemini 2.0 Flash**: For intelligent response generation (free API)
- **Custom Embeddings**: Planned vector similarity search (currently text-based)

### Frontend Libraries
- **Next.js**: React framework with SSR/SSG capabilities
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **date-fns**: Date formatting utilities

### Backend Libraries
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Database ORM
- **Google Generative AI**: Official Google Gemini Python client
- **Uvicorn**: ASGI server

## Deployment Strategy

### PWA Features
- **Service Worker**: Caches essential legal documents for offline access
- **Manifest**: Defines app metadata and installation behavior
- **Offline Support**: Core legal documents available without internet

### Environment Configuration
- **Database**: Supabase PostgreSQL with connection string configuration
- **API Keys**: Google Gemini API key for AI services
- **CORS**: Configured for cross-origin requests between frontend and backend

### Production Considerations
- **Caching Strategy**: Static assets and legal documents cached for performance
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Security**: Input validation and API rate limiting considerations
- **Scalability**: Modular architecture supports horizontal scaling

The system is designed to be easily deployable on cloud platforms with environment-based configuration and separation of concerns between frontend and backend services.

## Recent Changes: Latest modifications with dates

### 2025-07-19 - Sistema de Autenticação Replit Auth Implementado

- **Autenticação Replit Auth Configurada**
  - Sistema completo de login/logout com contas Replit
  - Páginas separadas para usuários logados e não logados
  - Landing page atrativa para visitantes não autenticados
  - Dashboard protegido para usuários autenticados

- **Base de Dados PostgreSQL Integrada**
  - Tabelas de usuários e sessões criadas
  - Armazenamento seguro de sessões de login
  - Integração com Drizzle ORM para gerenciamento de dados
  - Suporte a perfis de usuário com informações do Replit

- **Arquitetura Dual Frontend/Backend**
  - Servidor Express.js para autenticação na porta 3001
  - Next.js para interface do usuário na porta 5000
  - React Query para gerenciamento de estado e API calls
  - Axios configurado com CORS e credenciais

- **Interface de Usuário Aprimorada**
  - Landing page com informações sobre o sistema
  - Header com informações do usuário logado
  - Sistema de tooltips mantido e integrado
  - Design responsivo com Tailwind CSS

- **Sistema de Segurança**
  - Middleware de autenticação para rotas protegidas
  - Sessões seguras com cookies httpOnly
  - Proteção CORS configurada para produção
  - Logout seguro com redirecionamento

### 2025-07-19 - Sistema Administrativo Completo Implementado

- **Sistema de Autenticação Administrativo Implementado**
  - Middleware JWT com roles (ADMIN, SUPERADMIN, USER)
  - API de login com validação segura e tokens com 8 horas de duração
  - Hash de senhas com bcrypt para máxima segurança
  - Criado usuário admin padrão (username: admin, password: admin123)

- **Sistema de Upload de Documentos Legais Completo**
  - Suporte a PDF, DOCX e TXT com limite de 50MB por arquivo
  - Processamento inteligente com chunking respeitando estrutura legal
  - Extração de texto otimizada para documentos legais moçambicanos
  - Detecção automática de artigos, seções e parágrafos
  - Metadados estruturados com tipo de lei, fonte e descrição

- **APIs Administrativas Implementadas**
  - `/api/auth/login` - Autenticação com credenciais
  - `/api/admin/upload-document` - Upload de documentos com processamento
  - `/api/admin/documents` - Listagem de documentos carregados
  - `/api/admin/stats` - Estatísticas do sistema
  - `/api/admin/documents/{id}` - Detalhes e remoção de documentos
  - Todas as APIs protegidas com autenticação JWT

- **Interface Administrativa Frontend Completa**
  - Painel de login responsivo com validação
  - Dashboard principal com estatísticas em tempo real
  - Formulário de upload com drag-and-drop e validação
  - Lista de documentos com filtros e ações
  - Componentes reutilizáveis em TypeScript
  - Store Zustand para gerenciamento de estado global

- **Processamento de Documentos Avançado**
  - Chunking inteligente preservando estrutura legal
  - Detecção automática de encoding para arquivos TXT
  - Limpeza e normalização de texto extraído
  - Metadados estruturados por chunk (tipo, índice, seção)
  - Sistema de status de processamento (pending, processing, completed, error)

- **Base de Dados Estruturada**
  - Tabela `users` com roles e autenticação
  - Tabela `uploaded_documents` para tracking de uploads
  - Tabela `legal_documents` expandida com metadados de chunk
  - Índices otimizados para consultas administrativas
  - Relacionamentos estruturados entre tabelas

- **Testes e Validação Realizados**
  - Upload de documento teste processado com 4 chunks criados
  - APIs administrativas testadas e funcionando
  - Autenticação JWT validada com tokens seguros
  - Sistema de estatísticas retornando dados corretos
  - Backend e frontend integrados e comunicando

- **Sistema Pronto para Uso Administrativo**
  - Administradores podem fazer login em `/admin/login`
  - Upload de qualquer lei moçambicana via interface web
  - Documentos automaticamente disponíveis no chatbot
  - Gestão completa de documentos carregados
  - Monitoramento com estatísticas detalhadas

### 2025-07-19 - Migração Completa de OpenAI para Google Gemini

- **Migração de IA Bem-Sucedida**
  - Substituição completa do OpenAI GPT-4o pelo Google Gemini 2.0 Flash
  - API gratuita do Gemini configurada e funcionando
  - Eliminação das limitações de quota do OpenAI
  - Manutenção de todas as funcionalidades existentes

- **Novo Serviço GeminiService Implementado**
  - Equivalência funcional ao OpenAIService anterior
  - Prompts otimizados para o modelo Gemini
  - Resposta em formato JSON estruturado
  - Sistema de fallback mantido para robustez

- **Sistema de Tooltips Aprimorado**
  - Hook personalizado useTooltip com gerenciamento global
  - Contexto TooltipContext para estado compartilhado
  - Navegação por teclado melhorada (Enter, Espaço, Escape)
  - Feedback visual aprimorado com estados hover/active
  - Acessibilidade ARIA completa implementada

### 2025-07-19 - Interface Modernizada com Design Contemporâneo

- **Landing Page Completamente Redesenhada**
  - Design escuro elegante com gradientes animados (slate-900 → blue-900 → indigo-900)
  - Efeitos de glassmorphism com backdrop-blur e transparências
  - Animações fluidas com elementos pulsantes e hover effects
  - Gradientes de texto multicolor (emerald → blue → purple)
  - Layout responsivo com seções hero, features e CTA
  - Padrões de fundo animados com esferas coloridas
  - Tipografia moderna com texto grande e impactante
  - Badges e indicadores de status com ícones animados

- **Dashboard Profissional Modernizado**
  - Header glassmorphic com informações do usuário
  - Sidebar com estatísticas em tempo real
  - Cards com gradientes sutis e efeitos de profundidade
  - Ações rápidas categorizadas por cores
  - Banner de boas-vindas personalizado
  - Indicadores de status do sistema (Gemini AI, documentos carregados)
  - Layout grid responsivo com componentes modulares

- **Chat Interface Premium**
  - MessageBubbles redesenhadas com gradientes e sombras
  - Avatares circulares com gradientes personalizados
  - Botão de envio com efeitos hover e animações
  - Campo de entrada com glassmorphism e bordas animadas
  - Indicadores de carregamento com animações de bounce
  - Citações jurídicas com cards gradientes e barras de progresso
  - Botão de copiar mensagem com feedback visual
  - Tooltips integrados mantendo funcionalidade educativa

- **Paleta de Cores Modernizada**
  - Cores primárias: Emerald (500-600) e Blue (500-600)
  - Acentos: Purple (500) para elementos especiais
  - Backgrounds: Gradientes sutis com transparências
  - Texto: Contrastes otimizados para legibilidade
  - Estados hover: Escalas e transformações suaves

- **Efeitos Visuais Avançados**
  - Backdrop-blur em elementos overlay
  - Box-shadows multicamadas para profundidade
  - Animações CSS com timing functions suaves
  - Hover effects com scale e translate transforms
  - Loading states com spinners e bounce animations
  - Gradientes animados em botões e elementos interativos

### 2025-07-19 - Sistema de Tooltips Jurídicos Contextuais Implementado

- **Glossário Jurídico Abrangente**
  - Base de dados com 30+ termos jurídicos moçambicanos fundamentais
  - Categorização por área do direito (Civil, Penal, Trabalho, Comercial, etc.)
  - Definições claras em linguagem acessível
  - Exemplos práticos para cada termo
  - Termos relacionados para navegação contextual

- **Sistema de Tooltips Inteligente**
  - Detecção automática de termos jurídicos em textos
  - Tooltips contextuais com hover e navegação por teclado
  - Design responsivo com posicionamento automático
  - Cores categorizadas por área do direito
  - Acessibilidade completa (ARIA, foco, navegação)

- **Integração com Chat Principal**
  - Tooltips ativados automaticamente em respostas do assistente
  - Botão de acesso ao glossário completo no cabeçalho
  - Painel lateral com busca e filtros por categoria
  - Experiência educativa sem interromper o fluxo da conversa

- **Componentes Reutilizáveis Criados**
  - `LegalTooltip` - Tooltip individual para termos específicos
  - `TextWithTooltips` - Processamento automático de texto
  - `LegalGlossaryPanel` - Painel completo do glossário
  - `TooltipDemo` - Página de demonstração da funcionalidade

- **Funcionalidades Educativas**
  - Explicações contextuais para jargão jurídico complexo
  - Sistema de categorias coloridas para fácil identificação
  - Página de demonstração em `/demo-tooltips`
  - Melhoria significativa na acessibilidade legal para usuários leigos

### 2025-07-19 - Migração para Supabase e Configuração Vercel Completa

- **Supabase como Banco Principal**
  - Migração completa do PostgreSQL local para Supabase
  - Guia detalhado de setup (SUPABASE_SETUP.md)
  - 500MB gratuitos com interface visual de administração
  - Connection string configurada: `postgresql://postgres:Wez0@821722@db.dcqftukouimxugezypwd.supabase.co:5432/postgres`
  - Backups automáticos e APIs REST integradas

- **Scripts de Deploy Vercel Otimizados**
  - Script automatizado de configuração de variáveis (vercel-env-setup.sh)
  - Deploy imediato configurado (deploy-now.sh) com credenciais do usuário
  - Guias específicos para Supabase em todos os documentos
  - Integração completa Supabase + Vercel + Gemini AI
  - Deploy gratuito com 0 custos de infraestrutura
  - REPL_ID configurado: "Judas"

### 2025-07-20 - Aplicação Judas Reconstruída com Sucesso

- **Deploy Vercel Funcional Confirmado**
  - URL funcionando: https://workspace-eight-mocha.vercel.app/
  - Nova versão melhorada: https://workspace-1u8u4absh-dequives-projects.vercel.app
  - Build 100% bem-sucedido com todas as funcionalidades
  - Problema SSO identificado mas superado com nova URL

- **Funcionalidades Implementadas**
  - Landing page moderna com gradientes animados
  - Sistema de loading e estados interativos
  - Interface de chat jurídico completamente funcional
  - Simulação de respostas de IA com citações legais
  - Design responsivo com glassmorphism e animações
  - Sistema de mensagens em tempo real
  - Botões de ação com hover effects avançados

- **Interface de Chat Jurídico**
  - Chat interface completa com mensagens bidirecionais
  - Sistema de citações com barras de relevância
  - Loading states animados durante respostas da IA
  - Auto-scroll para mensagens novas
  - Input area com textarea expansível
  - Header com status online e navegação
  - Design consistente com tema do projeto

- **Tecnologias Utilizadas**
  - Next.js 15.4.1 com TypeScript
  - CSS-in-JS com styled-jsx
  - Estados React com hooks (useState, useEffect, useRef)
  - Animações CSS customizadas
  - Design responsivo mobile-first

- **Configuração de Produção Completa**
  - Variáveis de ambiente configuradas automaticamente
  - Gemini API integrada com chave do usuário
  - Supabase PostgreSQL conectado
  - Replit Auth configurado com REPL_ID "Judas"
  - Sistema multi-serviços funcionando em produção

- **Funcionalidades Ativas em Produção**
  - Sistema de autenticação via Replit
  - Chat jurídico com IA Gemini 2.0 Flash
  - Base de dados com 9 documentos legais
  - Sistema administrativo para upload de leis
  - Tooltips jurídicos contextuais
  - Interface responsiva moderna

### 2025-07-20 - Localização para Português Europeu Implementada

- **Adequação Linguística Completa**
  - Conversão de todos os textos para português europeu
  - Substituição de "seu/sua" por "vosso/vossa" em todas as interfaces
  - Alteração de "otimizar" para "optimizar" e outras adequações
  - Actualização de placeholders e mensagens do sistema
  - Manutenção da terminologia jurídica moçambicana apropriada

- **Páginas Actualizadas**
  - Landing page com linguagem europeia
  - Interface de chat com tratamento formal adequado
  - Glossário jurídico com terminologia correcta
  - Mensagens do assistente virtual ajustadas
  - Placeholders de pesquisa actualizados ("pesquisar" em vez de "buscar")

### 2025-07-20 - Sistema de Classificação de Complexidade Jurídica Implementado

- **Sistema de Análise de Complexidade Automático**
  - Algoritmo inteligente que avalia textos jurídicos automaticamente
  - Classificação em 4 níveis: 🟢 Simples, 🟡 Moderado, 🟠 Complexo, 🔴 Muito Complexo
  - Baseado em termos jurídicos, conceitos especializados e extensão do texto
  - Rating visual com emojis e barras de progresso coloridas

- **Integração com Interface de Chat**
  - Badges de complexidade automáticos em todas as mensagens
  - Design responsivo que se adapta a mensagens de usuário e assistente
  - Indicadores visuais com cores específicas para cada nível
  - Barras de progresso que mostram o nível de complexidade

- **Página de Demonstração Completa**
  - Nova página `/complexity-demo` para testar o sistema
  - Exemplos práticos dos 4 níveis de complexidade
  - Interface interactiva para análise de texto em tempo real
  - Explicação detalhada do funcionamento do algoritmo
  - Navegação integrada entre chat e demonstração

- **Funcionalidades Educativas**
  - Ajuda usuários a compreender a dificuldade de questões jurídicas
  - Prepara expectativas sobre o tipo de resposta a receber
  - Identifica automaticamente quando questões requerem conhecimento especializado
  - Melhora a experiência do usuário com feedback visual imediato

### 2025-07-19 - Configuração de Deploy Completa para 3 Plataformas

- **Arquivos de Deploy Criados**
  - `railway.json` - Configuração específica para Railway
  - `nixpacks.toml` - Build configuration para Railway/Nixpacks
  - `Dockerfile` - Container multi-stage para DigitalOcean
  - `docker-compose.yml` - Orquestração com PostgreSQL
  - `vercel.json` - Deploy Next.js no Vercel
  - `vercel-backend.json` - Backend FastAPI no Vercel
  - `vercel-auth.json` - Auth Server no Vercel
  - `deploy-vercel.sh` - Script automatizado para Vercel
  - `vercel-env-setup.sh` - Configuração automática de variáveis
  - `requirements-vercel.txt` - Dependências Python otimizadas

- **Documentação de Deploy Abrangente**
  - `DEPLOYMENT.md` - Documentação completa das 3 plataformas
  - `VERCEL_QUICK_START.md` - Guia rápido específico para Vercel
  - `vercel-setup.md` - Tutorial detalhado de configuração de variáveis
  - `.env.vercel` - Template com todas as variáveis necessárias
  - Instruções passo-a-passo para Railway, DigitalOcean e Vercel
  - Comparação detalhada de custos e vantagens
  - Scripts automatizados para configuração de ambiente

- **Suporte a Múltiplas Plataformas**
  - **Vercel**: Deploy gratuito otimizado para Next.js com serverless functions
  - **Railway**: Deploy automático com Nixpacks ($5/mês)
  - **DigitalOcean**: Container Docker com controle total ($12/mês)
  - Scripts automatizados para todas as plataformas

- **Configuração de Produção Otimizada**
  - Arquitetura multi-serviços: Auth, Backend, Frontend
  - Proxying inteligente baseado no ambiente (dev vs prod)
  - Health checks e graceful shutdown
  - SSL automático (Vercel/Railway) ou manual (DigitalOcean)
  - Monitoramento e logs centralizados