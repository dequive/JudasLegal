"""
Router para demonstrar as melhorias implementadas
"""

from fastapi import APIRouter, Request, HTTPException
from typing import Dict, Any
import asyncio

try:
    from app.core.config import settings
    from app.services.cache_service import cache_service, cached
    CONFIG_AVAILABLE = True
except ImportError:
    CONFIG_AVAILABLE = False

router = APIRouter(prefix="/api/improvements", tags=["improvements"])

@router.get("/status")
async def get_improvements_status():
    """Status das melhorias implementadas"""
    status = {
        "improvements_available": CONFIG_AVAILABLE,
        "modules": {
            "config": False,
            "rate_limiting": False,
            "cache_service": False
        },
        "features": {}
    }
    
    if CONFIG_AVAILABLE:
        try:
            status["modules"]["config"] = True
            status["features"]["config"] = {
                "database_url_configured": bool(settings.database_url),
                "ai_providers_available": len(settings.available_llm_providers),
                "cache_enabled": settings.enable_query_cache,
                "rate_limiting_enabled": True
            }
        except Exception as e:
            status["errors"] = {"config": str(e)}
    
    try:
        from app.middleware.rate_limiting import rate_limiter
        status["modules"]["rate_limiting"] = True
        status["features"]["rate_limiting"] = {
            "enabled": rate_limiter.enabled,
            "per_minute_limit": rate_limiter.per_minute_limit,
            "per_hour_limit": rate_limiter.per_hour_limit,
            "active_clients": len(rate_limiter.request_cache)
        }
    except Exception as e:
        status["errors"] = status.get("errors", {})
        status["errors"]["rate_limiting"] = str(e)
    
    try:
        from app.services.cache_service import cache_service
        status["modules"]["cache_service"] = True
        cache_stats = cache_service.get_stats()
        status["features"]["cache_service"] = {
            "enabled": cache_service.enabled,
            "hit_ratio": cache_stats.get("hit_ratio", 0),
            "redis_available": cache_stats.get("redis_available", False),
            "memory_cache_size": cache_stats.get("memory_cache_stats", {}).get("size", 0)
        }
    except Exception as e:
        status["errors"] = status.get("errors", {})
        status["errors"]["cache_service"] = str(e)
    
    return status

@router.post("/test-cache")
async def test_cache_functionality():
    """Testar funcionalidade de cache"""
    if not CONFIG_AVAILABLE:
        raise HTTPException(status_code=503, detail="Cache service não disponível")
    
    try:
        from app.services.cache_service import cache_service
        
        # Teste de set/get
        test_key = "test_improvement"
        test_value = {"message": "Cache funcionando!", "timestamp": "2025-01-20"}
        
        await cache_service.set("test", test_key, test_value, ttl_seconds=60)
        cached_result = await cache_service.get("test", test_key)
        
        cache_stats = cache_service.get_stats()
        
        return {
            "test_successful": cached_result == test_value,
            "cached_data": cached_result,
            "cache_stats": cache_stats
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no teste de cache: {str(e)}")

@router.get("/test-rate-limit")
async def test_rate_limiting(request: Request):
    """Testar funcionalidade de rate limiting"""
    try:
        from app.middleware.rate_limiting import rate_limiter
        
        client_id = rate_limiter.get_client_identifier(request)
        is_limited, limit_info = rate_limiter.is_rate_limited(client_id)
        
        if not is_limited:
            rate_limiter.record_request(client_id)
        
        return {
            "client_id": client_id[:20] + "...",  # Apenas parte do ID por privacidade
            "is_rate_limited": is_limited,
            "limit_info": limit_info,
            "cache_size": len(rate_limiter.request_cache),
            "limits": {
                "per_minute": rate_limiter.per_minute_limit,
                "per_hour": rate_limiter.per_hour_limit
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no teste de rate limiting: {str(e)}")

@cached("expensive_operation", ttl_seconds=30)
async def expensive_mock_operation(input_data: str) -> Dict[str, Any]:
    """Operação simuladamente cara para testar cache"""
    await asyncio.sleep(1)  # Simular processamento
    return {
        "result": f"Processado: {input_data}",
        "computation_time": "1 segundo",
        "cached": True
    }

@router.post("/test-cached-function")
async def test_cached_function(data: Dict[str, str]):
    """Testar decorador de cache em função"""
    if not CONFIG_AVAILABLE:
        raise HTTPException(status_code=503, detail="Cache service não disponível")
    
    try:
        input_text = data.get("input", "teste padrão")
        
        # Primeira chamada - deve executar a função
        start_time = asyncio.get_event_loop().time()
        result1 = await expensive_mock_operation(input_text)
        first_call_time = asyncio.get_event_loop().time() - start_time
        
        # Segunda chamada - deve usar cache
        start_time = asyncio.get_event_loop().time()
        result2 = await expensive_mock_operation(input_text)
        second_call_time = asyncio.get_event_loop().time() - start_time
        
        return {
            "first_call": {
                "result": result1,
                "execution_time": f"{first_call_time:.3f}s"
            },
            "second_call": {
                "result": result2,
                "execution_time": f"{second_call_time:.3f}s",
                "cache_hit": second_call_time < 0.1  # Se foi muito rápido, foi cache
            },
            "performance_improvement": f"{(first_call_time / max(second_call_time, 0.001)):.1f}x mais rápido"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no teste de função cached: {str(e)}")

@router.get("/docker-status")
async def get_docker_status():
    """Verificar status dos containers Docker"""
    import subprocess
    from pathlib import Path
    
    try:
        # Verificar se Docker está disponível
        docker_version = subprocess.run(
            ["docker", "--version"], 
            capture_output=True, 
            text=True, 
            timeout=5
        )
        
        if docker_version.returncode != 0:
            return {"docker_available": False, "error": "Docker não encontrado"}
        
        # Verificar containers em execução
        running_containers = subprocess.run(
            ["docker", "ps", "--format", "table {{.Names}}\t{{.Status}}\t{{.Ports}}"],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        # Verificar imagens disponíveis
        available_images = subprocess.run(
            ["docker", "images", "--format", "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        return {
            "docker_available": True,
            "version": docker_version.stdout.strip(),
            "running_containers": running_containers.stdout,
            "available_images": available_images.stdout,
            "compose_file_exists": Path("docker-compose.yml").exists(),
            "dockerfile_exists": Path("Dockerfile").exists()
        }
        
    except subprocess.TimeoutExpired:
        return {"docker_available": False, "error": "Timeout ao verificar Docker"}
    except Exception as e:
        return {"docker_available": False, "error": str(e)}

@router.get("/setup-status") 
async def get_setup_status():
    """Status do script de setup"""
    from pathlib import Path
    
    setup_script = Path("setup.sh")
    
    status = {
        "setup_script_exists": setup_script.exists(),
        "is_executable": setup_script.is_file() and setup_script.stat().st_mode & 0o111,
        "directories_created": {
            "app": Path("app").exists(),
            "tests": Path("tests").exists(),
            "nginx": Path("nginx").exists() if Path("nginx").exists() else "not_created",
            "database": Path("database").exists() if Path("database").exists() else "not_created"
        },
        "config_files": {
            "docker-compose.yml": Path("docker-compose.yml").exists(),
            "Dockerfile": Path("Dockerfile").exists(),
            "Dockerfile.frontend": Path("Dockerfile.frontend").exists(),
            ".env": Path(".env").exists()
        }
    }
    
    if setup_script.exists():
        status["setup_script_size"] = setup_script.stat().st_size
        
    return status