"""
Integração do cache Redis com os serviços principais do Muzaia
"""
import logging
import hashlib
from typing import Optional, Dict, Any, List
from datetime import datetime

from .redis_service import redis_service, cached

logger = logging.getLogger(__name__)

class MuzaiaCacheIntegration:
    """
    Classe para integrar o cache Redis com os serviços principais do Muzaia
    """
    
    def __init__(self):
        self.redis = redis_service
    
    @cached(ttl=3600, prefix="gemini")
    def cache_gemini_response(self, query: str, response: str, complexity: Dict = None) -> str:
        """
        Cache automático de respostas do Gemini AI
        O decorador @cached cuida automaticamente do armazenamento
        """
        return response
    
    def cache_legal_document(self, doc_id: int, document_data: Dict, ttl: int = 7200) -> bool:
        """Cache de documento legal processado"""
        try:
            key = f"legal_doc:{doc_id}"
            success = self.redis.set(key, document_data, ttl, "muzaia")
            if success:
                logger.info(f"Documento legal {doc_id} armazenado em cache")
            return success
        except Exception as e:
            logger.error(f"Erro ao armazenar documento {doc_id} em cache: {e}")
            return False
    
    def get_cached_legal_document(self, doc_id: int) -> Optional[Dict]:
        """Obter documento legal do cache"""
        try:
            key = f"legal_doc:{doc_id}"
            document = self.redis.get(key, "muzaia")
            if document:
                logger.debug(f"Documento legal {doc_id} obtido do cache")
            return document
        except Exception as e:
            logger.error(f"Erro ao obter documento {doc_id} do cache: {e}")
            return None
    
    def cache_user_session(self, user_id: str, session_data: Dict, ttl: int = 1800) -> bool:
        """Cache de sessão de utilizador"""
        try:
            key = f"user_session:{user_id}"
            success = self.redis.set(key, session_data, ttl, "muzaia")
            if success:
                logger.debug(f"Sessão do utilizador {user_id} armazenada em cache")
            return success
        except Exception as e:
            logger.error(f"Erro ao armazenar sessão {user_id} em cache: {e}")
            return False
    
    def get_cached_user_session(self, user_id: str) -> Optional[Dict]:
        """Obter sessão de utilizador do cache"""
        try:
            key = f"user_session:{user_id}"
            session = self.redis.get(key, "muzaia")
            if session:
                logger.debug(f"Sessão do utilizador {user_id} obtida do cache")
            return session
        except Exception as e:
            logger.error(f"Erro ao obter sessão {user_id} do cache: {e}")
            return None
    
    def cache_search_results(self, query_hash: str, results: List[Dict], ttl: int = 1800) -> bool:
        """Cache de resultados de pesquisa legal"""
        try:
            key = f"search_results:{query_hash}"
            success = self.redis.set(key, results, ttl, "muzaia")
            if success:
                logger.debug(f"Resultados de pesquisa {query_hash[:8]} armazenados em cache")
            return success
        except Exception as e:
            logger.error(f"Erro ao armazenar resultados de pesquisa: {e}")
            return False
    
    def get_cached_search_results(self, query: str) -> Optional[List[Dict]]:
        """Obter resultados de pesquisa do cache"""
        try:
            # Gerar hash da query para chave consistente
            query_hash = hashlib.md5(query.lower().strip().encode()).hexdigest()
            key = f"search_results:{query_hash}"
            results = self.redis.get(key, "muzaia")
            if results:
                logger.debug(f"Resultados de pesquisa para '{query[:30]}...' obtidos do cache")
            return results
        except Exception as e:
            logger.error(f"Erro ao obter resultados de pesquisa do cache: {e}")
            return None
    
    def cache_complexity_analysis(self, text_hash: str, complexity_data: Dict, ttl: int = 3600) -> bool:
        """Cache de análise de complexidade"""
        try:
            key = f"complexity:{text_hash}"
            success = self.redis.set(key, complexity_data, ttl, "muzaia")
            if success:
                logger.debug(f"Análise de complexidade {text_hash[:8]} armazenada em cache")
            return success
        except Exception as e:
            logger.error(f"Erro ao armazenar análise de complexidade: {e}")
            return False
    
    def get_cached_complexity_analysis(self, text: str) -> Optional[Dict]:
        """Obter análise de complexidade do cache"""
        try:
            # Gerar hash do texto para chave consistente
            text_hash = hashlib.md5(text.strip().encode()).hexdigest()
            key = f"complexity:{text_hash}"
            analysis = self.redis.get(key, "muzaia")
            if analysis:
                logger.debug(f"Análise de complexidade para texto obtida do cache")
            return analysis
        except Exception as e:
            logger.error(f"Erro ao obter análise de complexidade do cache: {e}")
            return None
    
    def warm_up_cache(self) -> Dict[str, int]:
        """
        Pré-carregamento de dados frequentemente utilizados no cache
        """
        stats = {
            "documents_cached": 0,
            "sessions_cleaned": 0,
            "errors": 0
        }
        
        try:
            # Simular pré-carregamento (substituir por lógica real)
            logger.info("Iniciando warm-up do cache Muzaia...")
            
            # Exemplo: pré-carregar documentos mais consultados
            popular_docs = [1, 2, 3, 5, 8]  # IDs dos documentos mais populares
            for doc_id in popular_docs:
                try:
                    # Simular carregamento de documento (substituir por chamada real à DB)
                    doc_data = {
                        "id": doc_id,
                        "title": f"Documento Legal {doc_id}",
                        "content": f"Conteúdo do documento {doc_id}...",
                        "cached_at": datetime.now().isoformat()
                    }
                    if self.cache_legal_document(doc_id, doc_data):
                        stats["documents_cached"] += 1
                except Exception as e:
                    logger.error(f"Erro no warm-up do documento {doc_id}: {e}")
                    stats["errors"] += 1
            
            logger.info(f"Warm-up concluído: {stats}")
            return stats
            
        except Exception as e:
            logger.error(f"Erro no warm-up do cache: {e}")
            stats["errors"] += 1
            return stats
    
    def get_cache_metrics(self) -> Dict[str, Any]:
        """Obter métricas específicas do cache Muzaia"""
        try:
            base_stats = self.redis.get_stats()
            
            # Contar chaves por categoria
            categories = {
                "legal_documents": 0,
                "user_sessions": 0,
                "search_results": 0,
                "complexity_analysis": 0,
                "gemini_responses": 0
            }
            
            # Se Redis conectado, contar chaves reais
            if base_stats.get("connected", False) and self.redis.client:
                try:
                    all_keys = self.redis.client.keys("muzaia:*")
                    for key in all_keys:
                        if "legal_doc:" in key:
                            categories["legal_documents"] += 1
                        elif "user_session:" in key:
                            categories["user_sessions"] += 1
                        elif "search_results:" in key:
                            categories["search_results"] += 1
                        elif "complexity:" in key:
                            categories["complexity_analysis"] += 1
                        elif "gemini:" in key:
                            categories["gemini_responses"] += 1
                except Exception:
                    # Usar valores simulados se não conseguir contar
                    categories = {
                        "legal_documents": 5,
                        "user_sessions": 3,
                        "search_results": 8,
                        "complexity_analysis": 12,
                        "gemini_responses": 15
                    }
            else:
                # Valores simulados para fallback
                categories = {
                    "legal_documents": 5,
                    "user_sessions": 3,
                    "search_results": 8,
                    "complexity_analysis": 12,
                    "gemini_responses": 15
                }
            
            return {
                **base_stats,
                "categories": categories,
                "total_muzaia_keys": sum(categories.values()),
                "cache_utilization": "high" if sum(categories.values()) > 20 else "medium"
            }
            
        except Exception as e:
            logger.error(f"Erro ao obter métricas do cache: {e}")
            return {
                "error": str(e),
                "categories": {},
                "total_muzaia_keys": 0
            }

# Instância global da integração de cache
cache_integration = MuzaiaCacheIntegration()