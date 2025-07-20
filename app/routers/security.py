"""
Router de segurança para APIs administrativas
Implementa endpoints para gestão de segurança, auditoria e monitorização
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
from app.security.authentication import require_admin, security_manager, get_current_user
from app.logging.structured_logger import audit_logger, security_logger
from app.monitoring.system_monitor import system_monitor

router = APIRouter(prefix="/api/security", tags=["security"])

# Modelos Pydantic
class SecurityStats(BaseModel):
    total_requests: int
    blocked_requests: int
    failed_login_attempts: int
    active_sessions: int
    security_events: int
    system_health: str

class SecurityEvent(BaseModel):
    timestamp: str
    event_type: str
    ip_address: str
    user_id: Optional[str]
    details: Dict
    severity: str

class IPBlock(BaseModel):
    ip_address: str
    reason: str
    expires_at: Optional[str]

class AuditLogEntry(BaseModel):
    timestamp: str
    user_id: str
    action: str
    resource: Optional[str]
    details: Dict

@router.get("/stats", response_model=SecurityStats)
async def get_security_stats(current_user = Depends(require_admin)):
    """Obter estatísticas de segurança"""
    try:
        # Coletar métricas de segurança
        health_status = system_monitor.get_health_status()
        
        # Contar eventos de segurança recentes
        recent_errors = [
            err for err in system_monitor.error_log 
            if err['timestamp'] > datetime.utcnow() - timedelta(hours=24)
        ]
        
        security_events = len([
            err for err in recent_errors 
            if 'security' in err.get('error_type', '').lower()
        ])
        
        stats = SecurityStats(
            total_requests=len(system_monitor.request_log),
            blocked_requests=len([
                req for req in system_monitor.request_log 
                if req.get('status_code', 200) == 403
            ]),
            failed_login_attempts=len(security_manager.failed_attempts),
            active_sessions=len(set(
                req.get('client_id', '') for req in system_monitor.request_log
                if req.get('timestamp', datetime.min) > datetime.utcnow() - timedelta(hours=1)
            )),
            security_events=security_events,
            system_health=health_status.status
        )
        
        # Log da consulta administrativa
        audit_logger.log_admin_action(
            admin_id=current_user.get('user_id', 'unknown'),
            action="view_security_stats",
            details={"stats_requested": True}
        )
        
        return stats
        
    except Exception as e:
        security_logger.error(f"Erro ao obter estatísticas de segurança: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.get("/events", response_model=List[SecurityEvent])
async def get_security_events(
    limit: int = 100,
    hours: int = 24,
    current_user = Depends(require_admin)
):
    """Obter eventos de segurança recentes"""
    try:
        since = datetime.utcnow() - timedelta(hours=hours)
        
        # Filtrar eventos de segurança
        events = []
        for error in system_monitor.error_log:
            if error['timestamp'] > since:
                if 'security' in error.get('error_type', '').lower():
                    events.append(SecurityEvent(
                        timestamp=error['timestamp'].isoformat(),
                        event_type=error.get('error_type', 'unknown'),
                        ip_address=error.get('ip_address', 'unknown'),
                        user_id=error.get('user_id'),
                        details={"message": error.get('message', '')},
                        severity="high" if "blocked" in error.get('message', '').lower() else "medium"
                    ))
        
        # Limitar resultados
        events = events[:limit]
        
        # Log da consulta administrativa
        audit_logger.log_admin_action(
            admin_id=current_user.get('user_id', 'unknown'),
            action="view_security_events",
            details={"limit": limit, "hours": hours, "events_count": len(events)}
        )
        
        return events
        
    except Exception as e:
        security_logger.error(f"Erro ao obter eventos de segurança: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.get("/blocked-ips", response_model=List[IPBlock])
async def get_blocked_ips(current_user = Depends(require_admin)):
    """Obter lista de IPs bloqueados"""
    try:
        blocked_ips = []
        
        # Obter IPs bloqueados do security manager
        for ip, attempt_data in security_manager.failed_attempts.items():
            if attempt_data["count"] >= security_manager.max_attempts:
                blocked_ips.append(IPBlock(
                    ip_address=ip,
                    reason=f"Excesso de tentativas ({attempt_data['count']})",
                    expires_at=(
                        attempt_data["last_attempt"] + 
                        timedelta(seconds=security_manager.block_duration)
                    ).isoformat()
                ))
        
        # Log da consulta administrativa
        audit_logger.log_admin_action(
            admin_id=current_user.get('user_id', 'unknown'),
            action="view_blocked_ips",
            details={"blocked_count": len(blocked_ips)}
        )
        
        return blocked_ips
        
    except Exception as e:
        security_logger.error(f"Erro ao obter IPs bloqueados: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.post("/unblock-ip/{ip_address}")
async def unblock_ip(ip_address: str, current_user = Depends(require_admin)):
    """Desbloquear IP específico"""
    try:
        # Remover do security manager
        if ip_address in security_manager.failed_attempts:
            del security_manager.failed_attempts[ip_address]
        
        if ip_address in security_manager.blocked_ips:
            security_manager.blocked_ips.remove(ip_address)
        
        # Log da acção administrativa
        audit_logger.log_admin_action(
            admin_id=current_user.get('user_id', 'unknown'),
            action="unblock_ip",
            target=ip_address,
            details={"reason": "manual_unblock"}
        )
        
        security_logger.log_security_event(
            "ip_unblocked",
            ip_address=ip_address,
            user_id=current_user.get('user_id', 'unknown'),
            details={"admin_action": True}
        )
        
        return {"message": f"IP {ip_address} desbloqueado com sucesso"}
        
    except Exception as e:
        security_logger.error(f"Erro ao desbloquear IP: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.post("/block-ip/{ip_address}")
async def block_ip(
    ip_address: str, 
    reason: str = "Manual block",
    current_user = Depends(require_admin)
):
    """Bloquear IP específico manualmente"""
    try:
        # Adicionar ao security manager
        security_manager.blocked_ips.add(ip_address)
        
        # Registar como tentativa máxima para persistir o bloqueio
        security_manager.failed_attempts[ip_address] = {
            "count": security_manager.max_attempts,
            "last_attempt": datetime.utcnow()
        }
        
        # Log da acção administrativa
        audit_logger.log_admin_action(
            admin_id=current_user.get('user_id', 'unknown'),
            action="block_ip",
            target=ip_address,
            details={"reason": reason}
        )
        
        security_logger.log_security_event(
            "ip_blocked",
            ip_address=ip_address,
            user_id=current_user.get('user_id', 'unknown'),
            details={"admin_action": True, "reason": reason}
        )
        
        return {"message": f"IP {ip_address} bloqueado com sucesso"}
        
    except Exception as e:
        security_logger.error(f"Erro ao bloquear IP: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.get("/audit-log", response_model=List[AuditLogEntry])
async def get_audit_log(
    limit: int = 100,
    hours: int = 24,
    user_id: Optional[str] = None,
    current_user = Depends(require_admin)
):
    """Obter log de auditoria"""
    try:
        # Simular log de auditoria (em produção viria de base de dados)
        audit_entries = []
        
        # Obter requests recentes como base para auditoria
        since = datetime.utcnow() - timedelta(hours=hours)
        recent_requests = [
            req for req in system_monitor.request_log 
            if req.get('timestamp', datetime.min) > since
        ]
        
        for req in recent_requests[:limit]:
            if user_id and req.get('client_id') != user_id:
                continue
                
            audit_entries.append(AuditLogEntry(
                timestamp=req['timestamp'].isoformat(),
                user_id=req.get('client_id', 'anonymous'),
                action=f"{req['method']} {req['path']}",
                resource=req['path'],
                details={
                    "status_code": req.get('status_code'),
                    "response_time": req.get('response_time')
                }
            ))
        
        # Log da consulta administrativa
        audit_logger.log_admin_action(
            admin_id=current_user.get('user_id', 'unknown'),
            action="view_audit_log",
            details={
                "limit": limit, 
                "hours": hours, 
                "user_filter": user_id,
                "entries_count": len(audit_entries)
            }
        )
        
        return audit_entries
        
    except Exception as e:
        security_logger.error(f"Erro ao obter log de auditoria: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.get("/system-health")
async def get_system_health(current_user = Depends(require_admin)):
    """Obter estado de saúde do sistema do ponto de vista de segurança"""
    try:
        health_status = system_monitor.get_health_status()
        
        # Adicionar informações específicas de segurança
        security_health = {
            "overall_status": health_status.status,
            "components": health_status.components,
            "issues": health_status.issues,
            "uptime_seconds": health_status.uptime_seconds,
            "security_specific": {
                "blocked_ips_count": len(security_manager.blocked_ips),
                "failed_attempts_count": len(security_manager.failed_attempts),
                "rate_limiting_active": True,
                "security_middleware_active": True
            }
        }
        
        # Log da consulta administrativa
        audit_logger.log_admin_action(
            admin_id=current_user.get('user_id', 'unknown'),
            action="check_system_health",
            details={"status": health_status.status}
        )
        
        return security_health
        
    except Exception as e:
        security_logger.error(f"Erro ao obter saúde do sistema: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")