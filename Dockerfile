# Multi-stage Dockerfile for Judas Legal Assistant
FROM node:20-alpine AS frontend-build

# Install dependencies for frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Copy frontend source and build
COPY . .
RUN npm run build

# Python backend stage
FROM python:3.11-slim AS backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js for auth server
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Copy Python requirements and install
COPY pyproject.toml ./
RUN pip install -e .

# Copy Node.js package files and install
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Copy built frontend from previous stage
COPY --from=frontend-build /app/.next ./.next
COPY --from=frontend-build /app/public ./public

# Create non-root user
RUN addgroup --system --gid 1001 judas && \
    adduser --system --uid 1001 judas

# Change ownership
RUN chown -R judas:judas /app
USER judas

# Expose ports
EXPOSE 5000 3001 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/ || exit 1

# Start application
CMD ["python3", "start_production.py"]