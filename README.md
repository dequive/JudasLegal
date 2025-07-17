# Judas - Legal Assistant for Mozambican Law

A Progressive Web Application (PWA) that provides an intelligent legal assistant for Mozambican law using RAG (Retrieval-Augmented Generation) technology.

## Features

- **Portuguese Language Support**: Native Portuguese interface for Mozambican legal queries
- **RAG-powered Search**: Retrieval-Augmented Generation for accurate legal information
- **Offline Functionality**: PWA capabilities for offline access to legal documents
- **Real-time Chat**: Interactive chat interface for legal consultations
- **Citation System**: Proper citations from Mozambican legal sources
- **Responsive Design**: Mobile-friendly interface with Mozambican theme colors

## Quick Start

### Development Mode
```bash
# Backend (port 8000)
python main.py

# Frontend (port 5000)
npx next dev -p 5000 -H 0.0.0.0
```

### Production Mode
```bash
# Single command for production
./start.sh
```

## API Endpoints

- `GET /` - Health check endpoint
- `GET /health` - API health status
- `GET /api/status` - Database connection status
- `POST /api/chat/send` - Send chat message

## Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.11
- **Database**: PostgreSQL with SQLAlchemy ORM
- **AI Integration**: OpenAI GPT-4o (with fallback mode)
- **Legal Documents**: Pre-loaded Mozambican legal texts

### Frontend (Next.js)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with Mozambican theme
- **State Management**: Zustand for chat state
- **PWA**: Service Worker for offline functionality

## Legal Documents Included

1. **Constituição da República de Moçambique** - Direitos Fundamentais
2. **Lei do Trabalho** - Idade Mínima e Condições de Trabalho
3. **Código Penal** - Crimes contra o patrimônio
4. **Lei da Família** - Casamento e Divórcio
5. **Código Civil** - Contratos e Obrigações

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API key (optional, has fallback)
- `PORT`: Server port (default: 80 for production, 8000 for development)
- `REPL_DEPLOYMENT`: Set to "true" for production mode

## Deployment

The application is configured for deployment on cloud platforms:

- **Port Configuration**: Automatically uses port 80 for production
- **Health Checks**: Simple endpoints for monitoring
- **Production Mode**: Optimized uvicorn configuration
- **CORS**: Configured for cross-origin requests

## Example Queries

Try these queries in Portuguese:
- "Quais são os direitos fundamentais?"
- "Idade mínima para trabalhar"
- "Como funciona o casamento civil?"
- "Contratos e obrigações"

## License

This project is designed for educational and legal assistance purposes in Mozambique.