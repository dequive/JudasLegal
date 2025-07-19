# Judas - Legal Assistant for Mozambican Law

## Overview

Judas is a Progressive Web Application (PWA) that provides an intelligent legal assistant for Mozambican law. The system uses RAG (Retrieval-Augmented Generation) technology to help users understand legal documents and regulations through natural language queries in Portuguese. The application features offline functionality, citation-based responses, and a responsive chat interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom Mozambican theme colors
- **State Management**: Zustand for chat state management
- **PWA Features**: Service Worker for offline functionality and caching
- **UI Components**: Modular component architecture with reusable chat interface

### Backend Architecture
- **Framework**: FastAPI with Python 3.11
- **Database**: PostgreSQL with SQLAlchemy ORM
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
- **Database**: PostgreSQL with connection string configuration
- **API Keys**: Google Gemini API key for AI services
- **CORS**: Configured for cross-origin requests between frontend and backend

### Production Considerations
- **Caching Strategy**: Static assets and legal documents cached for performance
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Security**: Input validation and API rate limiting considerations
- **Scalability**: Modular architecture supports horizontal scaling

The system is designed to be easily deployable on cloud platforms with environment-based configuration and separation of concerns between frontend and backend services.

## Recent Changes: Latest modifications with dates

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