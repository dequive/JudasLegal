"""
Testes para o sistema de rate limiting
"""

import pytest
import asyncio
from fastapi.testclient import TestClient
from fastapi import FastAPI, Request
from app.middleware.rate_limiting import rate_limiter, rate_limit_middleware
import time

# Mock app para testes
app = FastAPI()

@app.middleware("http")
async def add_rate_limiting(request: Request, call_next):
    return await rate_limit_middleware(request, call_next)

@app.get("/test")
async def test_endpoint():
    return {"message": "success"}

@app.get("/health")
async def health_endpoint():
    return {"status": "healthy"}

client = TestClient(app)

class TestRateLimiting:
    
    def setup_method(self):
        """Reset rate limiter antes de cada teste"""
        rate_limiter.__init__()
        rate_limiter.request_cache.clear()
    
    def test_normal_request_passes(self):
        """Teste que request normal passa sem problemas"""
        response = client.get("/test")
        assert response.status_code == 200
        assert response.json() == {"message": "success"}
    
    def test_health_endpoint_bypasses_rate_limit(self):
        """Health check deve passar sem rate limiting"""
        for _ in range(50):  # Muito mais que o limite
            response = client.get("/health")
            assert response.status_code == 200
    
    def test_rate_limit_per_minute_enforcement(self):
        """Teste que rate limit por minuto é aplicado"""
        # Configurar limite baixo para teste
        rate_limiter.per_minute_limit = 3
        
        # Primeiros 3 requests devem passar
        for i in range(3):
            response = client.get("/test")
            assert response.status_code == 200
        
        # 4º request deve ser bloqueado
        response = client.get("/test")
        assert response.status_code == 429
        assert "Taxa de pedidos excedida" in response.json()["detail"]["message"]
    
    def test_rate_limit_headers(self):
        """Teste que headers de rate limit são adicionados"""
        rate_limiter.per_minute_limit = 10
        
        response = client.get("/test")
        assert response.status_code == 200
        assert "X-RateLimit-Limit" in response.headers
        assert "X-RateLimit-Remaining" in response.headers
        assert response.headers["X-RateLimit-Limit"] == "10"
    
    def test_client_identification(self):
        """Teste identificação única de clientes"""
        client_id = rate_limiter.get_client_identifier(
            type('MockRequest', (), {
                'client': type('Client', (), {'host': '127.0.0.1'})(),
                'headers': {'user-agent': 'test-agent'}
            })()
        )
        
        assert isinstance(client_id, str)
        assert "127.0.0.1" in client_id
    
    def test_cache_cleanup(self):
        """Teste limpeza automática do cache"""
        # Adicionar entrada antiga
        old_time = time.time() - 7200  # 2 horas atrás
        rate_limiter.request_cache["old_client"] = {
            "requests_per_minute": [],
            "requests_per_hour": [],
            "first_request": old_time
        }
        
        # Trigger cleanup
        rate_limiter._cleanup_old_entries()
        
        # Entrada antiga deve ter sido removida
        assert "old_client" not in rate_limiter.request_cache
    
    @pytest.mark.asyncio
    async def test_concurrent_requests(self):
        """Teste rate limiting com requests concorrentes"""
        rate_limiter.per_minute_limit = 5
        
        async def make_request():
            response = client.get("/test")
            return response.status_code
        
        # Fazer 10 requests concorrentes
        tasks = [make_request() for _ in range(10)]
        results = await asyncio.gather(*tasks)
        
        # Alguns devem passar (200) e outros ser bloqueados (429)
        success_count = sum(1 for code in results if code == 200)
        blocked_count = sum(1 for code in results if code == 429)
        
        assert success_count <= 5
        assert blocked_count >= 5

if __name__ == "__main__":
    pytest.main([__file__])