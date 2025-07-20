# Dockerfile para Muzaia Legal Assistant Backend
# Baseado nas melhores práticas de containerização

FROM python:3.11-slim

# Metadados
LABEL maintainer="Muzaia Team"
LABEL description="Assistente Jurídico AI para Legislação Moçambicana"
LABEL version="2.0.0"

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    software-properties-common \
    git \
    && rm -rf /var/lib/apt/lists/*

# Criar usuário não-root para segurança
RUN groupadd -r muzaia && useradd -r -g muzaia muzaia

# Configurar diretório de trabalho
WORKDIR /app

# Copiar e instalar dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Configurar permissões
RUN chown -R muzaia:muzaia /app
USER muzaia

# Expor porta
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Comando de execução
CMD ["uvicorn", "backend_complete:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]