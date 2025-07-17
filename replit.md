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
- **AI Integration**: OpenAI GPT-4o for response generation
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
- **OpenAIService**: Handles AI model interactions with legal-specific prompts
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
4. **Response Generation**: OpenAIService generates response with citations
5. **UI Update**: Chat interface displays response with citation cards
6. **Session Management**: Messages stored in database for history

## External Dependencies

### AI Services
- **OpenAI GPT-4o**: For intelligent response generation
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
- **OpenAI**: Official OpenAI Python client
- **Uvicorn**: ASGI server

## Deployment Strategy

### PWA Features
- **Service Worker**: Caches essential legal documents for offline access
- **Manifest**: Defines app metadata and installation behavior
- **Offline Support**: Core legal documents available without internet

### Environment Configuration
- **Database**: PostgreSQL with connection string configuration
- **API Keys**: OpenAI API key for AI services
- **CORS**: Configured for cross-origin requests between frontend and backend

### Production Considerations
- **Caching Strategy**: Static assets and legal documents cached for performance
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Security**: Input validation and API rate limiting considerations
- **Scalability**: Modular architecture supports horizontal scaling

The system is designed to be easily deployable on cloud platforms with environment-based configuration and separation of concerns between frontend and backend services.

## Recent Changes: Latest modifications with dates

### 2025-07-17 - Deployment Fixes Applied (Updated)
- **Fixed FastAPI configuration for production deployment**
  - Added environment-based port configuration (PORT env var)
  - Disabled reload for production mode (REPL_DEPLOYMENT=true)
  - Simplified root endpoint for faster health checks
  - Updated CORS to allow all origins for deployment
  - Added production-ready uvicorn configuration

- **Created deployment scripts**
  - `start.sh`: Production start script with environment variables
  - `run.py`: Alternative production runner

- **Health check improvements**
  - Root endpoint now returns simple `{"status": "ok"}` response
  - All endpoints tested and working correctly
  - Database connection verified through `/api/status`

- **Multiple deployment entry points created**
  - `app.py`: Main deployment script with forced port 80
  - `deploy.py`: Production deployment with error handling
  - `judas.py`: Alternative entry point for deployment
  - All scripts are executable and configured for production

- **Health check optimization**
  - Root endpoint now synchronous (non-async) for faster response
  - Response time under 0.1 seconds for deployment health checks
  - Simplified JSON responses for faster parsing

- **System status confirmed**
  - Backend API: All endpoints responding correctly on port 80
  - Frontend: Compiling and serving on port 5000
  - Chat functionality: Working in fallback mode (no OpenAI API quota)
  - Database: 5 legal documents loaded successfully
  - Deployment: Multiple executable entry points ready