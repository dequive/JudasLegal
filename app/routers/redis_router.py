from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, Optional
import logging
from datetime import datetime

from ..services.redis_service import redis_service
try:
    from ..security.authentication import get_current_admin_user
except ImportError:
    # Fallback simples para desenvolvimento
    async def get_current_admin_user():
        return {"username": "admin", "role": "admin"}

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/redis", tags=["Redis Cache"])

@router.get("/health")
async def redis_health():
    """Health check do serviço Redis"""
    try:
        health_info = redis_service.health_check()
        return {
            "service": "Redis Cache",
            "timestamp": datetime.now().isoformat(),
            **health_info
        }
    except Exception as e:
        logger.error(f"Erro no health check Redis: {e}")
        raise HTTPException(status_code=500, detail=f"Erro no Redis: {str(e)}")

@router.get("/stats", dependencies=[Depends(get_current_admin_user)])
async def redis_stats():
    """Estatísticas detalhadas do Redis (requer autenticação admin)"""
    try:
        stats = redis_service.get_stats()
        return {
            "service": "Muzaia Redis Cache",
            "timestamp": datetime.now().isoformat(),
            "statistics": stats
        }
    except Exception as e:
        logger.error(f"Erro ao obter estatísticas Redis: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao obter estatísticas: {str(e)}")

@router.post("/cache/set", dependencies=[Depends(get_current_admin_user)])
async def set_cache(key: str, value: str, ttl: int = 3600, prefix: str = "admin"):
    """Define valor no cache (requer autenticação admin)"""
    try:
        success = redis_service.set(key, value, ttl, prefix)
        if success:
            return {
                "success": True,
                "message": f"Valor armazenado em cache",
                "key": f"{prefix}:{key}",
                "ttl": ttl
            }
        else:
            raise HTTPException(status_code=500, detail="Falha ao armazenar no cache")
    except Exception as e:
        logger.error(f"Erro ao definir cache: {e}")
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")

@router.get("/cache/get/{key}")
async def get_cache(key: str, prefix: str = "admin"):
    """Obtém valor do cache"""
    try:
        value = redis_service.get(key, prefix)
        if value is not None:
            return {
                "found": True,
                "key": f"{prefix}:{key}",
                "value": value
            }
        else:
            return {
                "found": False,
                "key": f"{prefix}:{key}",
                "message": "Chave não encontrada ou expirada"
            }
    except Exception as e:
        logger.error(f"Erro ao obter cache: {e}")
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")

@router.delete("/cache/delete/{key}", dependencies=[Depends(get_current_admin_user)])
async def delete_cache(key: str, prefix: str = "admin"):
    """Remove chave do cache (requer autenticação admin)"""
    try:
        success = redis_service.delete(key, prefix)
        return {
            "success": success,
            "key": f"{prefix}:{key}",
            "message": "Chave removida" if success else "Chave não encontrada"
        }
    except Exception as e:
        logger.error(f"Erro ao deletar cache: {e}")
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")

@router.post("/cache/clear", dependencies=[Depends(get_current_admin_user)])
async def clear_cache(prefix: str = "muzaia"):
    """Limpa todas as chaves com determinado prefixo (requer autenticação admin)"""
    try:
        deleted_count = redis_service.clear_prefix(prefix)
        return {
            "success": True,
            "prefix": prefix,
            "deleted_keys": deleted_count,
            "message": f"{deleted_count} chaves removidas"
        }
    except Exception as e:
        logger.error(f"Erro ao limpar cache: {e}")
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")

@router.get("/cache/exists/{key}")
async def cache_exists(key: str, prefix: str = "admin"):
    """Verifica se chave existe no cache"""
    try:
        exists = redis_service.exists(key, prefix)
        return {
            "exists": exists,
            "key": f"{prefix}:{key}"
        }
    except Exception as e:
        logger.error(f"Erro ao verificar cache: {e}")
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")

# APIs específicas para cache de documentos legais
@router.get("/legal-cache/documents")
async def get_cached_documents():
    """Obtém documentos legais do cache"""
    try:
        documents = redis_service.get("legal_documents", "muzaia")
        if documents:
            return {
                "cached": True,
                "count": len(documents) if isinstance(documents, list) else 1,
                "documents": documents
            }
        else:
            return {
                "cached": False,
                "message": "Documentos não encontrados no cache"
            }
    except Exception as e:
        logger.error(f"Erro ao obter documentos do cache: {e}")
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")

@router.post("/legal-cache/documents", dependencies=[Depends(get_current_admin_user)])
async def cache_legal_documents(documents: list, ttl: int = 7200):
    """Armazena documentos legais no cache (requer autenticação admin)"""
    try:
        success = redis_service.set("legal_documents", documents, ttl, "muzaia")
        if success:
            return {
                "success": True,
                "message": f"{len(documents)} documentos armazenados no cache",
                "ttl": ttl
            }
        else:
            raise HTTPException(status_code=500, detail="Falha ao armazenar documentos")
    except Exception as e:
        logger.error(f"Erro ao armazenar documentos no cache: {e}")
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")

@router.get("/legal-cache/chat-sessions")
async def get_cached_chat_sessions():
    """Obtém sessões de chat do cache"""
    try:
        sessions = redis_service.get("chat_sessions", "muzaia")
        if sessions:
            return {
                "cached": True,
                "count": len(sessions) if isinstance(sessions, list) else 1,
                "sessions": sessions
            }
        else:
            return {
                "cached": False,
                "message": "Sessões não encontradas no cache"
            }
    except Exception as e:
        logger.error(f"Erro ao obter sessões do cache: {e}")
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")