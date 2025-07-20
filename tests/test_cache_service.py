"""
Testes para o serviço de cache
"""

import pytest
import asyncio
import time
from app.services.cache_service import CacheService, InMemoryCache, cache_service

class TestInMemoryCache:
    
    def setup_method(self):
        """Configurar cache limpo para cada teste"""
        self.cache = InMemoryCache(max_size=5)
    
    def test_basic_set_get(self):
        """Teste operações básicas de set/get"""
        self.cache.set("key1", "value1")
        result = self.cache.get("key1")
        assert result == "value1"
    
    def test_ttl_expiration(self):
        """Teste expiração por TTL"""
        self.cache.set("key1", "value1", ttl_seconds=1)
        
        # Deve estar disponível imediatamente
        assert self.cache.get("key1") == "value1"
        
        # Simular passagem do tempo
        time.sleep(1.1)
        
        # Deve ter expirado
        assert self.cache.get("key1") is None
    
    def test_lru_eviction(self):
        """Teste remoção LRU quando cache está cheio"""
        # Encher o cache (max_size=5)
        for i in range(5):
            self.cache.set(f"key{i}", f"value{i}")
        
        # Adicionar mais um item deve remover o primeiro (LRU)
        self.cache.set("key5", "value5")
        
        # key0 deve ter sido removido
        assert self.cache.get("key0") is None
        assert self.cache.get("key5") == "value5"
    
    def test_access_updates_order(self):
        """Teste que acesso atualiza ordem LRU"""
        # Adicionar 3 itens
        for i in range(3):
            self.cache.set(f"key{i}", f"value{i}")
        
        # Acessar key0 para torná-lo mais recente
        self.cache.get("key0")
        
        # Encher cache até limite
        self.cache.set("key3", "value3")
        self.cache.set("key4", "value4")
        
        # Adicionar mais um deve remover key1 (não key0)
        self.cache.set("key5", "value5")
        
        assert self.cache.get("key0") == "value0"  # Ainda deve existir
        assert self.cache.get("key1") is None      # Deve ter sido removido
    
    def test_delete_operation(self):
        """Teste operação de delete"""
        self.cache.set("key1", "value1")
        assert self.cache.get("key1") == "value1"
        
        self.cache.delete("key1")
        assert self.cache.get("key1") is None
    
    def test_clear_operation(self):
        """Teste limpeza completa do cache"""
        for i in range(3):
            self.cache.set(f"key{i}", f"value{i}")
        
        self.cache.clear()
        
        for i in range(3):
            assert self.cache.get(f"key{i}") is None
    
    def test_stats(self):
        """Teste estatísticas do cache"""
        for i in range(3):
            self.cache.set(f"key{i}", f"value{i}")
        
        stats = self.cache.stats()
        assert stats["size"] == 3
        assert stats["max_size"] == 5

class TestCacheService:
    
    def setup_method(self):
        """Configurar serviço de cache para testes"""
        self.cache_service = CacheService()
        self.cache_service.memory_cache.clear()
        self.cache_service.stats = {
            'hits': 0,
            'misses': 0,
            'sets': 0,
            'errors': 0
        }
    
    @pytest.mark.asyncio
    async def test_cache_key_generation(self):
        """Teste geração de chaves de cache"""
        key1 = self.cache_service._get_cache_key("test", {"query": "test"})
        key2 = self.cache_service._get_cache_key("test", {"query": "test"})
        key3 = self.cache_service._get_cache_key("test", {"query": "different"})
        
        # Mesmos dados devem gerar mesma chave
        assert key1 == key2
        
        # Dados diferentes devem gerar chaves diferentes
        assert key1 != key3
        
        # Formato esperado
        assert key1.startswith("muzaia:test:")
    
    @pytest.mark.asyncio
    async def test_set_and_get(self):
        """Teste operações básicas set/get"""
        await self.cache_service.set("legal_query", "test_query", "test_response")
        result = await self.cache_service.get("legal_query", "test_query")
        
        assert result == "test_response"
        assert self.cache_service.stats['sets'] == 1
        assert self.cache_service.stats['hits'] == 1
    
    @pytest.mark.asyncio
    async def test_cache_miss(self):
        """Teste cache miss"""
        result = await self.cache_service.get("legal_query", "non_existent")
        
        assert result is None
        assert self.cache_service.stats['misses'] == 1
    
    @pytest.mark.asyncio
    async def test_ttl_functionality(self):
        """Teste funcionalidade TTL"""
        await self.cache_service.set("test", "key", "value", ttl_seconds=1)
        
        # Deve estar disponível imediatamente
        result = await self.cache_service.get("test", "key")
        assert result == "value"
        
        # Simular passagem do tempo
        time.sleep(1.1)
        
        # Deve ter expirado
        result = await self.cache_service.get("test", "key")
        assert result is None
    
    @pytest.mark.asyncio
    async def test_delete_operation(self):
        """Teste operação de delete"""
        await self.cache_service.set("test", "key", "value")
        result = await self.cache_service.get("test", "key")
        assert result == "value"
        
        await self.cache_service.delete("test", "key")
        result = await self.cache_service.get("test", "key")
        assert result is None
    
    @pytest.mark.asyncio
    async def test_disabled_cache(self):
        """Teste cache desabilitado"""
        self.cache_service.enabled = False
        
        await self.cache_service.set("test", "key", "value")
        result = await self.cache_service.get("test", "key")
        
        assert result is None  # Cache disabled, should not store/retrieve
    
    def test_stats_calculation(self):
        """Teste cálculo de estatísticas"""
        # Simular alguns hits e misses
        self.cache_service.stats = {
            'hits': 7,
            'misses': 3,
            'sets': 5,
            'errors': 1
        }
        
        stats = self.cache_service.get_stats()
        
        assert stats['hit_ratio'] == 70.0  # 7/(7+3) * 100
        assert stats['hits'] == 7
        assert stats['misses'] == 3
        assert 'redis_available' in stats
        assert 'memory_cache_stats' in stats

@pytest.mark.asyncio
async def test_cache_decorator():
    """Teste decorador de cache"""
    from app.services.cache_service import cached
    
    call_count = 0
    
    @cached("test_function", ttl_seconds=60)
    async def expensive_function(arg1, arg2=None):
        nonlocal call_count
        call_count += 1
        return f"result_{arg1}_{arg2}"
    
    # Primeira chamada deve executar função
    result1 = await expensive_function("test", arg2="value")
    assert result1 == "result_test_value"
    assert call_count == 1
    
    # Segunda chamada com mesmos argumentos deve usar cache
    result2 = await expensive_function("test", arg2="value")
    assert result2 == "result_test_value"
    assert call_count == 1  # Função não foi chamada novamente
    
    # Chamada com argumentos diferentes deve executar função
    result3 = await expensive_function("different", arg2="value")
    assert result3 == "result_different_value"
    assert call_count == 2

if __name__ == "__main__":
    pytest.main([__file__])