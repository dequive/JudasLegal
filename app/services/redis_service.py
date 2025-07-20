import json
import redis
import logging
from typing import Any, Optional, Dict, List
from datetime import datetime, timedelta
import pickle
import hashlib

logger = logging.getLogger(__name__)

class RedisService:
    """
    Serviço Redis para cache avançado e gestão de sessões do Muzaia.
    Suporta cache hierárquico, TTL configurável e fallback automático.
    """
    
    def __init__(self, host: str = "localhost", port: int = 6379, db: int = 0, password: Optional[str] = None):
        self.host = host
        self.port = port
        self.db = db
        self.password = password
        self.client = None
        self.fallback_cache = {}  # Cache em memória como fallback
        self.is_connected = False
        
        self._connect()
    
    def _connect(self):
        """Conecta ao Redis com fallback automático"""
        try:
            self.client = redis.Redis(
                host=self.host,
                port=self.port,
                db=self.db,
                password=self.password,
                decode_responses=True,
                socket_timeout=5,
                socket_connect_timeout=5,
                retry_on_timeout=True
            )
            
            # Testar conexão
            self.client.ping()
            self.is_connected = True
            logger.info(f"✅ Redis conectado: {self.host}:{self.port}")
            
        except Exception as e:
            logger.warning(f"⚠️ Redis não disponível: {e}. Usando cache em memória.")
            self.client = None
            self.is_connected = False
    
    def _generate_key(self, key: str, prefix: str = "muzaia") -> str:
        """Gera chave Redis com prefixo padronizado"""
        return f"{prefix}:{key}"
    
    def set(self, key: str, value: Any, ttl: int = 3600, prefix: str = "muzaia") -> bool:
        """
        Define valor no cache com TTL
        
        Args:
            key: Chave do cache
            value: Valor a armazenar (será serializado automaticamente)
            ttl: Time to live em segundos (padrão: 1 hora)
            prefix: Prefixo da chave
        
        Returns:
            bool: True se armazenado com sucesso
        """
        cache_key = self._generate_key(key, prefix)
        
        try:
            # Serializar valor
            if isinstance(value, (dict, list)):
                serialized_value = json.dumps(value, default=str, ensure_ascii=False)
            elif isinstance(value, (int, float, str, bool)):
                serialized_value = str(value)
            else:
                # Para objectos complexos, usar pickle
                serialized_value = pickle.dumps(value).hex()
                cache_key += ":pickle"
            
            if self.is_connected and self.client:
                result = self.client.setex(cache_key, ttl, serialized_value)
                logger.debug(f"Cache Redis SET: {cache_key} (TTL: {ttl}s)")
                return result
            else:
                # Fallback para cache em memória
                expiry = datetime.now() + timedelta(seconds=ttl)
                self.fallback_cache[cache_key] = {
                    'value': serialized_value,
                    'expires': expiry
                }
                logger.debug(f"Cache Memory SET: {cache_key}")
                return True
                
        except Exception as e:
            logger.error(f"Erro ao definir cache {cache_key}: {e}")
            return False
    
    def get(self, key: str, prefix: str = "muzaia") -> Optional[Any]:
        """
        Obtém valor do cache
        
        Args:
            key: Chave do cache
            prefix: Prefixo da chave
        
        Returns:
            Valor deserializado ou None se não encontrado/expirado
        """
        cache_key = self._generate_key(key, prefix)
        
        try:
            value = None
            
            if self.is_connected and self.client:
                value = self.client.get(cache_key)
                if value:
                    logger.debug(f"Cache Redis HIT: {cache_key}")
                else:
                    # Tentar chave pickle
                    pickle_key = cache_key + ":pickle"
                    pickle_value = self.client.get(pickle_key)
                    if pickle_value:
                        try:
                            return pickle.loads(bytes.fromhex(pickle_value))
                        except Exception:
                            pass
                    logger.debug(f"Cache Redis MISS: {cache_key}")
            else:
                # Fallback para cache em memória
                cached_item = self.fallback_cache.get(cache_key)
                if cached_item and cached_item['expires'] > datetime.now():
                    value = cached_item['value']
                    logger.debug(f"Cache Memory HIT: {cache_key}")
                elif cached_item:
                    # Remover item expirado
                    del self.fallback_cache[cache_key]
                    logger.debug(f"Cache Memory EXPIRED: {cache_key}")
                else:
                    logger.debug(f"Cache Memory MISS: {cache_key}")
            
            if value is None:
                return None
            
            # Tentar deserializar
            try:
                # Tentar JSON primeiro
                return json.loads(value)
            except (json.JSONDecodeError, TypeError):
                # Retornar como string se não for JSON
                return value
                
        except Exception as e:
            logger.error(f"Erro ao obter cache {cache_key}: {e}")
            return None
    
    def delete(self, key: str, prefix: str = "muzaia") -> bool:
        """Remove chave do cache"""
        cache_key = self._generate_key(key, prefix)
        
        try:
            if self.is_connected and self.client:
                result = self.client.delete(cache_key, cache_key + ":pickle")
                logger.debug(f"Cache Redis DELETE: {cache_key}")
                return result > 0
            else:
                # Fallback para cache em memória
                if cache_key in self.fallback_cache:
                    del self.fallback_cache[cache_key]
                    logger.debug(f"Cache Memory DELETE: {cache_key}")
                    return True
                return False
                
        except Exception as e:
            logger.error(f"Erro ao deletar cache {cache_key}: {e}")
            return False
    
    def exists(self, key: str, prefix: str = "muzaia") -> bool:
        """Verifica se chave existe no cache"""
        cache_key = self._generate_key(key, prefix)
        
        try:
            if self.is_connected and self.client:
                return self.client.exists(cache_key) > 0
            else:
                cached_item = self.fallback_cache.get(cache_key)
                return cached_item is not None and cached_item['expires'] > datetime.now()
                
        except Exception as e:
            logger.error(f"Erro ao verificar cache {cache_key}: {e}")
            return False
    
    def clear_prefix(self, prefix: str = "muzaia") -> int:
        """Remove todas as chaves com determinado prefixo"""
        try:
            if self.is_connected and self.client:
                pattern = f"{prefix}:*"
                keys = self.client.keys(pattern)
                if keys:
                    deleted = self.client.delete(*keys)
                    logger.info(f"Cache Redis CLEAR: {deleted} chaves removidas com prefixo '{prefix}'")
                    return deleted
                return 0
            else:
                # Fallback para cache em memória
                keys_to_delete = [k for k in self.fallback_cache.keys() if k.startswith(f"{prefix}:")]
                for key in keys_to_delete:
                    del self.fallback_cache[key]
                logger.info(f"Cache Memory CLEAR: {len(keys_to_delete)} chaves removidas")
                return len(keys_to_delete)
                
        except Exception as e:
            logger.error(f"Erro ao limpar cache com prefixo {prefix}: {e}")
            return 0
    
    def get_stats(self) -> Dict[str, Any]:
        """Obtém estatísticas do cache"""
        stats = {
            "connected": self.is_connected,
            "host": self.host,
            "port": self.port,
            "db": self.db
        }
        
        try:
            if self.is_connected and self.client:
                info = self.client.info()
                stats.update({
                    "redis_version": info.get("redis_version"),
                    "used_memory": info.get("used_memory_human"),
                    "connected_clients": info.get("connected_clients"),
                    "total_commands_processed": info.get("total_commands_processed"),
                    "keyspace_hits": info.get("keyspace_hits", 0),
                    "keyspace_misses": info.get("keyspace_misses", 0)
                })
                
                # Calcular hit ratio
                hits = stats.get("keyspace_hits", 0)
                misses = stats.get("keyspace_misses", 0)
                total = hits + misses
                stats["hit_ratio"] = round((hits / total * 100) if total > 0 else 0, 2)
            else:
                stats.update({
                    "fallback_cache_size": len(self.fallback_cache),
                    "fallback_mode": True
                })
                
        except Exception as e:
            logger.error(f"Erro ao obter estatísticas Redis: {e}")
            stats["error"] = str(e)
        
        return stats
    
    def health_check(self) -> Dict[str, Any]:
        """Verifica saúde da conexão Redis"""
        try:
            if self.client:
                start_time = datetime.now()
                self.client.ping()
                response_time = (datetime.now() - start_time).total_seconds() * 1000
                
                return {
                    "status": "healthy",
                    "connected": True,
                    "response_time_ms": round(response_time, 2),
                    "host": self.host,
                    "port": self.port
                }
            else:
                return {
                    "status": "fallback",
                    "connected": False,
                    "message": "Usando cache em memória",
                    "fallback_cache_size": len(self.fallback_cache)
                }
                
        except Exception as e:
            return {
                "status": "error",
                "connected": False,
                "error": str(e),
                "fallback_cache_size": len(self.fallback_cache)
            }


# Cache decorador para automatizar cache de funções
def cached(ttl: int = 3600, prefix: str = "func"):
    """
    Decorador para cache automático de funções
    
    Args:
        ttl: Time to live em segundos
        prefix: Prefixo para as chaves de cache
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Gerar chave única baseada na função e argumentos
            func_name = f"{func.__module__}.{func.__name__}"
            args_hash = hashlib.md5(str((args, kwargs)).encode()).hexdigest()[:8]
            cache_key = f"{func_name}:{args_hash}"
            
            # Tentar obter do cache
            redis_service = RedisService()
            cached_result = redis_service.get(cache_key, prefix)
            
            if cached_result is not None:
                logger.debug(f"Cache HIT para função {func_name}")
                return cached_result
            
            # Executar função e armazenar resultado
            result = func(*args, **kwargs)
            redis_service.set(cache_key, result, ttl, prefix)
            logger.debug(f"Cache SET para função {func_name}")
            
            return result
        
        return wrapper
    return decorator


# Instância global do serviço Redis
redis_service = RedisService()