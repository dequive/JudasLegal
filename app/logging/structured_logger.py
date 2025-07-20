"""
Sistema de logging estruturado para Muzaia
Implementa logs em JSON com contexto e correlação de requests
"""

import logging
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional
from contextvars import ContextVar
import uuid
import traceback

# Context variables para rastreamento de requests
request_id_var: ContextVar[Optional[str]] = ContextVar('request_id', default=None)
user_id_var: ContextVar[Optional[str]] = ContextVar('user_id', default=None)

class StructuredFormatter(logging.Formatter):
    """Formatter para logs estruturados em JSON"""
    
    def format(self, record: logging.LogRecord) -> str:
        """Formatar log record como JSON estruturado"""
        
        # Dados base do log
        log_data = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno
        }
        
        # Adicionar contexto de request se disponível
        request_id = request_id_var.get()
        if request_id:
            log_data["request_id"] = request_id
        
        user_id = user_id_var.get()
        if user_id:
            log_data["user_id"] = user_id
        
        # Adicionar informações de exceção se presente
        if record.exc_info:
            log_data["exception"] = {
                "type": record.exc_info[0].__name__,
                "message": str(record.exc_info[1]),
                "traceback": traceback.format_exception(*record.exc_info)
            }
        
        # Adicionar campos extras do record
        extra_fields = {
            key: value for key, value in record.__dict__.items()
            if key not in ['name', 'msg', 'args', 'levelname', 'levelno', 
                          'pathname', 'filename', 'module', 'lineno', 
                          'funcName', 'created', 'msecs', 'relativeCreated',
                          'thread', 'threadName', 'processName', 'process',
                          'getMessage', 'exc_info', 'exc_text', 'stack_info']
        }
        
        if extra_fields:
            log_data["extra"] = extra_fields
        
        return json.dumps(log_data, ensure_ascii=False, default=str)

class StructuredLogger:
    """Logger estruturado com contexto"""
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
        self._setup_handler()
    
    def _setup_handler(self):
        """Configurar handler com formatter estruturado"""
        if not self.logger.handlers:
            handler = logging.StreamHandler(sys.stdout)
            handler.setFormatter(StructuredFormatter())
            self.logger.addHandler(handler)
            self.logger.setLevel(logging.INFO)
    
    def with_context(self, request_id: str = None, user_id: str = None):
        """Criar contexto para logging"""
        return LoggingContext(request_id=request_id, user_id=user_id)
    
    def info(self, message: str, **kwargs):
        """Log de informação"""
        self.logger.info(message, extra=kwargs)
    
    def warning(self, message: str, **kwargs):
        """Log de aviso"""
        self.logger.warning(message, extra=kwargs)
    
    def error(self, message: str, **kwargs):
        """Log de erro"""
        self.logger.error(message, extra=kwargs)
    
    def debug(self, message: str, **kwargs):
        """Log de debug"""
        self.logger.debug(message, extra=kwargs)
    
    def critical(self, message: str, **kwargs):
        """Log crítico"""
        self.logger.critical(message, extra=kwargs)
    
    def log_api_request(self, method: str, path: str, status_code: int, 
                       response_time: float, user_id: str = None):
        """Log específico para requests da API"""
        self.info("API Request", 
                 api_method=method,
                 api_path=path,
                 api_status_code=status_code,
                 api_response_time=response_time,
                 api_user_id=user_id)
    
    def log_ai_interaction(self, provider: str, prompt_length: int, 
                          response_length: int, processing_time: float):
        """Log específico para interacções com IA"""
        self.info("AI Interaction",
                 ai_provider=provider,
                 ai_prompt_length=prompt_length,
                 ai_response_length=response_length,
                 ai_processing_time=processing_time)
    
    def log_database_query(self, query_type: str, table: str, 
                          execution_time: float, affected_rows: int = None):
        """Log específico para queries de base de dados"""
        self.info("Database Query",
                 db_query_type=query_type,
                 db_table=table,
                 db_execution_time=execution_time,
                 db_affected_rows=affected_rows)
    
    def log_cache_operation(self, operation: str, key: str, hit: bool = None):
        """Log específico para operações de cache"""
        self.info("Cache Operation",
                 cache_operation=operation,
                 cache_key=key,
                 cache_hit=hit)
    
    def log_security_event(self, event_type: str, ip_address: str = None, 
                          user_id: str = None, details: Dict = None):
        """Log específico para eventos de segurança"""
        self.warning("Security Event",
                    security_event_type=event_type,
                    security_ip_address=ip_address,
                    security_user_id=user_id,
                    security_details=details or {})

class LoggingContext:
    """Context manager para logging com contexto"""
    
    def __init__(self, request_id: str = None, user_id: str = None):
        self.request_id = request_id or str(uuid.uuid4())
        self.user_id = user_id
        self.tokens = []
    
    def __enter__(self):
        # Definir context variables
        token1 = request_id_var.set(self.request_id)
        self.tokens.append(token1)
        
        if self.user_id:
            token2 = user_id_var.set(self.user_id)
            self.tokens.append(token2)
        
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        # Limpar context variables
        for token in self.tokens:
            try:
                if hasattr(token, 'var'):
                    token.var.set(token.old_value)
                else:
                    # Para compatibilidade com diferentes versões
                    pass
            except:
                pass

class AuditLogger:
    """Logger específico para auditoria"""
    
    def __init__(self):
        self.logger = StructuredLogger("muzaia.audit")
    
    def log_user_action(self, user_id: str, action: str, resource: str = None, 
                       details: Dict = None):
        """Log de acção do utilizador"""
        self.logger.info("User Action",
                        audit_user_id=user_id,
                        audit_action=action,
                        audit_resource=resource,
                        audit_details=details or {})
    
    def log_admin_action(self, admin_id: str, action: str, target: str = None,
                        details: Dict = None):
        """Log de acção administrativa"""
        self.logger.info("Admin Action",
                        audit_admin_id=admin_id,
                        audit_action=action,
                        audit_target=target,
                        audit_details=details or {})
    
    def log_data_access(self, user_id: str, table: str, operation: str,
                       record_count: int = None):
        """Log de acesso a dados"""
        self.logger.info("Data Access",
                        audit_user_id=user_id,
                        audit_table=table,
                        audit_operation=operation,
                        audit_record_count=record_count)
    
    def log_configuration_change(self, admin_id: str, setting: str, 
                                old_value: Any, new_value: Any):
        """Log de mudança de configuração"""
        self.logger.info("Configuration Change",
                        audit_admin_id=admin_id,
                        audit_setting=setting,
                        audit_old_value=str(old_value),
                        audit_new_value=str(new_value))

# Instâncias globais
main_logger = StructuredLogger("muzaia.main")
api_logger = StructuredLogger("muzaia.api")
ai_logger = StructuredLogger("muzaia.ai")
db_logger = StructuredLogger("muzaia.database")
cache_logger = StructuredLogger("muzaia.cache")
security_logger = StructuredLogger("muzaia.security")
audit_logger = AuditLogger()

def get_logger(name: str) -> StructuredLogger:
    """Obter logger estruturado por nome"""
    return StructuredLogger(f"muzaia.{name}")