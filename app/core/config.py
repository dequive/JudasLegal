"""
Configuração robusta para Muzaia Legal Assistant
Implementa as melhores práticas de configuração com Pydantic
"""

from pydantic import validator
from pydantic_settings import BaseSettings
from typing import Optional, List
import os

class Settings(BaseSettings):
    # Database
    database_url: str
    
    # AI Services
    gemini_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    
    # Server Configuration
    port: int = 8000
    host: str = "0.0.0.0"
    debug: bool = False
    
    # CORS
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5000",
        "https://muzaia.vercel.app"
    ]
    
    # AI Fallback Strategy
    primary_llm: str = "claude_3_sonnet"  # claude_3_sonnet, gemini_2_flash, openai_gpt4
    fallback_llm: str = "gemini_2_flash"
    enable_local_fallback: bool = True
    
    # Rate Limiting
    rate_limit_per_minute: int = 30
    rate_limit_per_hour: int = 500
    
    # Caching
    redis_url: Optional[str] = None
    cache_ttl_seconds: int = 3600
    enable_query_cache: bool = True
    
    # Logging
    log_level: str = "INFO"
    log_format: str = "json"
    
    # Performance
    max_concurrent_requests: int = 10
    request_timeout_seconds: int = 30
    
    # Legal Document Processing
    max_document_size_mb: int = 50
    allowed_file_types: List[str] = ["pdf", "docx", "txt"]
    chunk_size: int = 1000
    chunk_overlap: int = 200
    
    # Security
    session_secret: str = "change-this-in-production"
    jwt_secret: str = "change-this-in-production"
    jwt_expiry_hours: int = 8
    
    @validator('cors_origins', pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',')]
        return v
    
    @validator('database_url')
    def validate_database_url(cls, v):
        if not v or not v.startswith('postgresql://'):
            raise ValueError('DATABASE_URL deve ser uma URL PostgreSQL válida')
        return v
    
    @validator('primary_llm')
    def validate_primary_llm(cls, v):
        valid_llms = ['claude_3_sonnet', 'gemini_2_flash', 'openai_gpt4']
        if v not in valid_llms:
            raise ValueError(f'primary_llm deve ser um de: {valid_llms}')
        return v
    
    @property
    def has_ai_configured(self) -> bool:
        """Verifica se pelo menos um provedor de IA está configurado"""
        return bool(self.gemini_api_key or self.anthropic_api_key or self.openai_api_key)
    
    @property
    def available_llm_providers(self) -> List[str]:
        """Retorna lista de provedores de IA disponíveis"""
        providers = []
        if self.anthropic_api_key:
            providers.append('claude_3_sonnet')
        if self.gemini_api_key:
            providers.append('gemini_2_flash')
        if self.openai_api_key:
            providers.append('openai_gpt4')
        return providers
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "allow"  # Permitir campos extra para compatibilidade

# Instância global das configurações
settings = Settings()

# Configuração de logging estruturado
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        },
        "json": {
            "()": "pythonjsonlogger.jsonlogger.JsonFormatter",
            "format": "%(asctime)s %(name)s %(levelname)s %(message)s"
        }
    },
    "handlers": {
        "default": {
            "formatter": "json" if settings.log_format == "json" else "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stdout",
        },
    },
    "root": {
        "level": settings.log_level,
        "handlers": ["default"],
    },
    "loggers": {
        "uvicorn": {
            "level": "INFO",
            "handlers": ["default"],
            "propagate": False,
        },
        "llm_orchestra": {
            "level": "INFO", 
            "handlers": ["default"],
            "propagate": False,
        }
    }
}