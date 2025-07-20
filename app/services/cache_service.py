"""
Sistema de Cache inteligente para Muzaia Legal Assistant
Implementa caching em múltiplas camadas para optimizar performance
"""

import hashlib
import json
import pickle
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
import asyncio
from app.core.config import settings

logger = logging.getLogger(__name__)

class InMemoryCache:
    """Cache em memória para desenvolvimento e fallback"""
    
    def __init__(self, max_size: int = 1000):
        self.cache: Dict[str, Dict] = {}
        self.max_size = max_size
        self.access_order: List[str] = []
    
    def _evict_lru(self):
        """Remove o item menos recentemente usado"""
        if len(self.cache) >= self.max_size and self.access_order:
            lru_key = self.access_order.pop(0)
            if lru_key in self.cache:
                del self.cache[lru_key]
    
    def get(self, key: str) -> Optional[Any]:
        """Obtém item do cache"""
        if key in self.cache:
            item = self.cache[key]
            
            # Verificar expiração
            if item['expires_at'] and datetime.now() > item['expires_at']:
                del self.cache[key]
                if key in self.access_order:
                    self.access_order.remove(key)
                return None
            
            # Atualizar ordem de acesso
            if key in self.access_order:
                self.access_order.remove(key)
            self.access_order.append(key)
            
            return item['data']
        
        return None
    
    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None):
        """Armazena item no cache"""
        self._evict_lru()
        
        expires_at = None
        if ttl_seconds:
            expires_at = datetime.now() + timedelta(seconds=ttl_seconds)
        
        self.cache[key] = {
            'data': value,
            'created_at': datetime.now(),
            'expires_at': expires_at
        }
        
        if key in self.access_order:
            self.access_order.remove(key)
        self.access_order.append(key)
    
    def delete(self, key: str):
        """Remove item do cache"""
        if key in self.cache:
            del self.cache[key]
        if key in self.access_order:
            self.access_order.remove(key)
    
    def clear(self):
        """Limpa todo o cache"""
        self.cache.clear()
        self.access_order.clear()
    
    def stats(self) -> Dict[str, Any]:
        """Estatísticas do cache"""
        return {
            'size': len(self.cache),
            'max_size': self.max_size,
            'hit_ratio': 0.0,  # Simplificado para demo
            'memory_usage': sum(len(str(item)) for item in self.cache.values())
        }

class RedisCache:
    """Cache Redis para produção"""
    
    def __init__(self):
        self.redis = None
        self._initialize_redis()
    
    def _initialize_redis(self):
        """Inicializa conexão Redis se disponível"""
        if settings.redis_url:
            try:
                import redis
                self.redis = redis.from_url(settings.redis_url, decode_responses=True)
                # Testar conexão
                self.redis.ping()
                logger.info("✓ Redis conectado com sucesso")
            except Exception as e:
                logger.warning(f"Falha ao conectar Redis: {e}")
                self.redis = None
    
    async def get(self, key: str) -> Optional[Any]:
        """Obtém item do Redis"""
        if not self.redis:
            return None
        
        try:
            data = self.redis.get(key)
            if data:
                return pickle.loads(data.encode('latin-1'))
        except Exception as e:
            logger.error(f"Erro ao obter do Redis: {e}")
        
        return None
    
    async def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None):
        """Armazena item no Redis"""
        if not self.redis:
            return
        
        try:
            serialized = pickle.dumps(value).decode('latin-1')
            if ttl_seconds:
                self.redis.setex(key, ttl_seconds, serialized)
            else:
                self.redis.set(key, serialized)
        except Exception as e:
            logger.error(f"Erro ao armazenar no Redis: {e}")
    
    async def delete(self, key: str):
        """Remove item do Redis"""
        if not self.redis:
            return
        
        try:
            self.redis.delete(key)
        except Exception as e:
            logger.error(f"Erro ao remover do Redis: {e}")
    
    def is_available(self) -> bool:
        """Verifica se Redis está disponível"""
        return self.redis is not None

class CacheService:
    """Serviço de cache principal com múltiplas camadas"""
    
    def __init__(self):
        self.memory_cache = InMemoryCache()
        self.redis_cache = RedisCache()
        self.default_ttl = settings.cache_ttl_seconds
        self.enabled = settings.enable_query_cache
        
        # Estatísticas
        self.stats = {
            'hits': 0,
            'misses': 0,
            'sets': 0,
            'errors': 0
        }
    
    def _get_cache_key(self, prefix: str, data: Any) -> str:
        """Gera chave de cache única"""
        if isinstance(data, dict):
            serialized = json.dumps(data, sort_keys=True)
        else:
            serialized = str(data)
        
        hash_value = hashlib.md5(serialized.encode()).hexdigest()
        return f"muzaia:{prefix}:{hash_value}"
    
    async def get(self, prefix: str, key_data: Any) -> Optional[Any]:
        """Obtém item do cache (tenta Redis primeiro, depois memória)"""
        if not self.enabled:
            return None
        
        cache_key = self._get_cache_key(prefix, key_data)
        
        try:
            # Tentar Redis primeiro
            if self.redis_cache.is_available():
                result = await self.redis_cache.get(cache_key)
                if result is not None:
                    self.stats['hits'] += 1
                    logger.debug(f"Cache hit (Redis): {cache_key}")
                    return result
            
            # Tentar cache em memória
            result = self.memory_cache.get(cache_key)
            if result is not None:
                self.stats['hits'] += 1
                logger.debug(f"Cache hit (Memory): {cache_key}")
                return result
            
            self.stats['misses'] += 1
            logger.debug(f"Cache miss: {cache_key}")
            return None
            
        except Exception as e:
            self.stats['errors'] += 1
            logger.error(f"Erro no cache get: {e}")
            return None
    
    async def set(self, prefix: str, key_data: Any, value: Any, ttl_seconds: Optional[int] = None):
        """Armazena item no cache (Redis e memória)"""
        if not self.enabled:
            return
        
        cache_key = self._get_cache_key(prefix, key_data)
        ttl = ttl_seconds or self.default_ttl
        
        try:
            # Armazenar no Redis
            if self.redis_cache.is_available():
                await self.redis_cache.set(cache_key, value, ttl)
            
            # Armazenar na memória
            self.memory_cache.set(cache_key, value, ttl)
            
            self.stats['sets'] += 1
            logger.debug(f"Cache set: {cache_key}")
            
        except Exception as e:
            self.stats['errors'] += 1
            logger.error(f"Erro no cache set: {e}")
    
    async def delete(self, prefix: str, key_data: Any):
        """Remove item do cache"""
        cache_key = self._get_cache_key(prefix, key_data)
        
        try:
            if self.redis_cache.is_available():
                await self.redis_cache.delete(cache_key)
            
            self.memory_cache.delete(cache_key)
            logger.debug(f"Cache delete: {cache_key}")
            
        except Exception as e:
            logger.error(f"Erro no cache delete: {e}")
    
    async def clear_prefix(self, prefix: str):
        """Limpa todas as entradas com um prefixo específico"""
        # Para implementação completa, seria necessário scan no Redis
        # Por agora, implementação simplificada
        logger.info(f"Cache clear prefix: {prefix}")
    
    def get_stats(self) -> Dict[str, Any]:
        """Obtém estatísticas do cache"""
        hit_ratio = 0.0
        total_requests = self.stats['hits'] + self.stats['misses']
        if total_requests > 0:
            hit_ratio = self.stats['hits'] / total_requests
        
        return {
            **self.stats,
            'hit_ratio': round(hit_ratio * 100, 2),
            'redis_available': self.redis_cache.is_available(),
            'memory_cache_stats': self.memory_cache.stats(),
            'enabled': self.enabled
        }

# Instância global do serviço de cache
cache_service = CacheService()

# Decorador para cache automático
def cached(prefix: str, ttl_seconds: Optional[int] = None):
    """Decorador para cache automático de funções"""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Criar chave baseada nos argumentos
            cache_key_data = {'args': args, 'kwargs': kwargs}
            
            # Tentar obter do cache
            cached_result = await cache_service.get(prefix, cache_key_data)
            if cached_result is not None:
                return cached_result
            
            # Executar função e cachear resultado
            result = await func(*args, **kwargs)
            await cache_service.set(prefix, cache_key_data, result, ttl_seconds)
            
            return result
        
        return wrapper
    return decorator