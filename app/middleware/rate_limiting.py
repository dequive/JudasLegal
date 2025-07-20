"""
Rate Limiting middleware para Muzaia Legal Assistant
Implementa controlo de taxa de pedidos para proteger a API
"""

from fastapi import HTTPException, Request, Response
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import time
import logging
from typing import Dict, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

# Configuração do rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[f"{settings.rate_limit_per_minute}/minute"]
)

# Cache em memória para tracking de requests (para uso sem Redis)
request_cache: Dict[str, Dict] = {}

class AdvancedRateLimiter:
    """Rate limiter avançado com múltiplas estratégias"""
    
    def __init__(self):
        self.enabled = True
        self.per_minute_limit = settings.rate_limit_per_minute
        self.per_hour_limit = settings.rate_limit_per_hour
        self.request_cache = {}
    
    def get_client_identifier(self, request: Request) -> str:
        """Identifica o cliente de forma única"""
        # Usar IP como identificador primário
        client_ip = get_remote_address(request)
        
        # Se disponível, usar user-agent para identificação adicional
        user_agent = request.headers.get("user-agent", "unknown")
        
        return f"{client_ip}:{hash(user_agent) % 10000}"
    
    def is_rate_limited(self, client_id: str) -> tuple[bool, Optional[dict]]:
        """Verifica se o cliente excedeu os limites"""
        current_time = time.time()
        
        if client_id not in self.request_cache:
            self.request_cache[client_id] = {
                "requests_per_minute": [],
                "requests_per_hour": [],
                "first_request": current_time
            }
        
        client_data = self.request_cache[client_id]
        
        # Limpar requests antigos
        minute_ago = current_time - 60
        hour_ago = current_time - 3600
        
        client_data["requests_per_minute"] = [
            req_time for req_time in client_data["requests_per_minute"] 
            if req_time > minute_ago
        ]
        
        client_data["requests_per_hour"] = [
            req_time for req_time in client_data["requests_per_hour"] 
            if req_time > hour_ago
        ]
        
        # Verificar limites
        minute_count = len(client_data["requests_per_minute"])
        hour_count = len(client_data["requests_per_hour"])
        
        if minute_count >= self.per_minute_limit:
            return True, {
                "error": "Rate limit exceeded",
                "limit_type": "per_minute",
                "current_count": minute_count,
                "limit": self.per_minute_limit,
                "reset_time": int(minute_ago + 60)
            }
        
        if hour_count >= self.per_hour_limit:
            return True, {
                "error": "Rate limit exceeded", 
                "limit_type": "per_hour",
                "current_count": hour_count,
                "limit": self.per_hour_limit,
                "reset_time": int(hour_ago + 3600)
            }
        
        return False, None
    
    def record_request(self, client_id: str):
        """Regista um pedido para o cliente"""
        current_time = time.time()
        
        if client_id in self.request_cache:
            client_data = self.request_cache[client_id]
            client_data["requests_per_minute"].append(current_time)
            client_data["requests_per_hour"].append(current_time)
        
        # Limpar cache antigo (older than 1 hour)
        self._cleanup_old_entries()
    
    def _cleanup_old_entries(self):
        """Remove entradas antigas do cache"""
        current_time = time.time()
        hour_ago = current_time - 3600
        
        expired_clients = [
            client_id for client_id, data in self.request_cache.items()
            if data.get("first_request", 0) < hour_ago and not data["requests_per_hour"]
        ]
        
        for client_id in expired_clients:
            del self.request_cache[client_id]

# Instância global do rate limiter
rate_limiter = AdvancedRateLimiter()

async def rate_limit_middleware(request: Request, call_next):
    """Middleware para verificar rate limiting"""
    
    # Saltar rate limiting para endpoints de health check
    if request.url.path in ["/health", "/api/health", "/"]:
        response = await call_next(request)
        return response
    
    if not rate_limiter.enabled:
        response = await call_next(request)
        return response
    
    client_id = rate_limiter.get_client_identifier(request)
    
    # Verificar se rate limited
    is_limited, limit_info = rate_limiter.is_rate_limited(client_id)
    
    if is_limited:
        logger.warning(f"Rate limit exceeded for client {client_id}: {limit_info}")
        
        raise HTTPException(
            status_code=429,
            detail={
                "message": "Taxa de pedidos excedida. Tente novamente mais tarde.",
                "limit_info": limit_info
            },
            headers={
                "Retry-After": str(60 if limit_info["limit_type"] == "per_minute" else 3600),
                "X-RateLimit-Limit": str(rate_limiter.per_minute_limit),
                "X-RateLimit-Remaining": str(max(0, rate_limiter.per_minute_limit - limit_info["current_count"])),
                "X-RateLimit-Reset": str(limit_info["reset_time"])
            }
        )
    
    # Registar o pedido
    rate_limiter.record_request(client_id)
    
    # Processar pedido
    response = await call_next(request)
    
    # Adicionar headers informativos
    minute_count = len(request_cache.get(client_id, {}).get("requests_per_minute", []))
    
    response.headers["X-RateLimit-Limit"] = str(rate_limiter.per_minute_limit)
    response.headers["X-RateLimit-Remaining"] = str(max(0, rate_limiter.per_minute_limit - minute_count))
    
    return response

# Handler customizado para RateLimitExceeded do slowapi
def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """Handler personalizado para rate limit exceeded"""
    logger.warning(f"SlowAPI rate limit exceeded: {exc}")
    
    return HTTPException(
        status_code=429,
        detail={
            "message": "Taxa de pedidos excedida. Tente novamente mais tarde.",
            "limit": str(exc.detail)
        }
    )

# Decoradores específicos para endpoints críticos
def legal_chat_rate_limit():
    """Rate limit específico para endpoints de chat legal"""
    return limiter.limit("10/minute")

def admin_rate_limit():
    """Rate limit específico para endpoints administrativos"""
    return limiter.limit("20/minute")

def upload_rate_limit():
    """Rate limit específico para upload de documentos"""
    return limiter.limit("5/minute")