"""
Middleware de segurança para protecção de APIs
Implementa protecção CORS, validação de headers, e detecção de ameaças
"""

from fastapi import Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
import time
import re
from typing import Set, Dict, List
import ipaddress
from app.logging.structured_logger import security_logger
from app.security.authentication import security_manager

class SecurityMiddleware(BaseHTTPMiddleware):
    """Middleware principal de segurança"""
    
    def __init__(self, app, 
                 trusted_hosts: List[str] = None,
                 allowed_methods: List[str] = None,
                 max_request_size: int = 50 * 1024 * 1024):  # 50MB
        super().__init__(app)
        self.trusted_hosts = set(trusted_hosts or ["localhost", "127.0.0.1", "0.0.0.0"])
        self.allowed_methods = set(allowed_methods or ["GET", "POST", "PUT", "DELETE", "OPTIONS"])
        self.max_request_size = max_request_size
        
        # Padrões de ameaças comuns
        self.threat_patterns = {
            'sql_injection': [
                r"(?i)(union\s+select|drop\s+table|delete\s+from|insert\s+into)",
                r"(?i)(\b(or|and)\s+\d+\s*=\s*\d+)",
                r"(?i)(exec\s*\(|execute\s*\()"
            ],
            'xss': [
                r"(?i)(<script|<iframe|<object|<embed)",
                r"(?i)(javascript:|vbscript:|data:)",
                r"(?i)(onload|onerror|onclick|onmouseover)\s*="
            ],
            'path_traversal': [
                r"\.\.[\\/]",
                r"[\\/]etc[\\/]passwd",
                r"[\\/]proc[\\/]self"
            ]
        }
        
        # IPs suspeitos (exemplo)
        self.blocked_ips = set()
        self.suspicious_ips = set()
    
    async def dispatch(self, request: Request, call_next):
        """Processar request através dos filtros de segurança"""
        start_time = time.time()
        
        try:
            # 1. Verificar tamanho do request
            if hasattr(request, 'content_length') and request.content_length:
                if request.content_length > self.max_request_size:
                    security_logger.log_security_event(
                        "request_too_large",
                        ip_address=self.get_client_ip(request),
                        details={"size": request.content_length}
                    )
                    raise HTTPException(status_code=413, detail="Request demasiado grande")
            
            # 2. Verificar IP bloqueado
            client_ip = self.get_client_ip(request)
            if self.is_ip_blocked(client_ip):
                security_logger.log_security_event(
                    "blocked_ip_attempt",
                    ip_address=client_ip
                )
                raise HTTPException(status_code=403, detail="IP bloqueado")
            
            # 3. Verificar rate limiting global
            if security_manager.is_ip_blocked(client_ip):
                security_logger.log_security_event(
                    "rate_limit_exceeded",
                    ip_address=client_ip
                )
                raise HTTPException(status_code=429, detail="Demasiados pedidos")
            
            # 4. Validar método HTTP
            if request.method not in self.allowed_methods:
                security_logger.log_security_event(
                    "invalid_method",
                    ip_address=client_ip,
                    details={"method": request.method}
                )
                raise HTTPException(status_code=405, detail="Método não permitido")
            
            # 5. Verificar headers suspeitos
            await self.check_suspicious_headers(request, client_ip)
            
            # 6. Verificar padrões de ameaças na URL e parâmetros
            await self.check_threat_patterns(request, client_ip)
            
            # 7. Processar request
            response = await call_next(request)
            
            # 8. Adicionar headers de segurança na resposta
            response = self.add_security_headers(response)
            
            # 9. Log da request
            processing_time = time.time() - start_time
            security_logger.log_api_request(
                method=request.method,
                path=str(request.url.path),
                status_code=response.status_code,
                response_time=processing_time,
                user_id=getattr(request.state, 'user_id', None)
            )
            
            return response
            
        except HTTPException as e:
            # Log de excepções de segurança
            security_logger.log_security_event(
                "security_exception",
                ip_address=self.get_client_ip(request),
                details={"status_code": e.status_code, "detail": e.detail}
            )
            raise
        
        except Exception as e:
            # Log de erros inesperados
            security_logger.error(f"Erro no middleware de segurança: {str(e)}")
            raise HTTPException(status_code=500, detail="Erro interno do servidor")
    
    def get_client_ip(self, request: Request) -> str:
        """Obter IP real do cliente considerando proxies"""
        # Verificar headers de proxy comuns
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            # Primeiro IP na lista é o cliente original
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip.strip()
        
        # Fallback para IP directo
        if hasattr(request.client, 'host'):
            return request.client.host
        
        return "unknown"
    
    def is_ip_blocked(self, ip_address: str) -> bool:
        """Verificar se IP está na lista de bloqueados"""
        if ip_address in self.blocked_ips:
            return True
        
        # Verificar se é um IP privado suspeito
        try:
            ip_obj = ipaddress.ip_address(ip_address)
            if ip_obj.is_private and ip_address not in self.trusted_hosts:
                # IPs privados não confiáveis podem ser suspeitos
                return False
        except:
            pass
        
        return False
    
    async def check_suspicious_headers(self, request: Request, client_ip: str):
        """Verificar headers suspeitos"""
        suspicious_patterns = [
            r"(?i)nikto",
            r"(?i)sqlmap",
            r"(?i)nmap",
            r"(?i)masscan",
            r"(?i)dirb",
            r"(?i)gobuster"
        ]
        
        user_agent = request.headers.get("User-Agent", "")
        for pattern in suspicious_patterns:
            if re.search(pattern, user_agent):
                security_logger.log_security_event(
                    "suspicious_user_agent",
                    ip_address=client_ip,
                    details={"user_agent": user_agent}
                )
                raise HTTPException(status_code=403, detail="User-Agent suspeito")
    
    async def check_threat_patterns(self, request: Request, client_ip: str):
        """Verificar padrões de ameaças na request"""
        # Verificar URL
        url_path = str(request.url.path)
        query_params = str(request.url.query)
        
        # Verificar body se existir
        body_content = ""
        if request.method in ["POST", "PUT", "PATCH"]:
            try:
                # Ler uma amostra do body (primeiros 1KB)
                body_bytes = await request.receive()
                if body_bytes.get("body"):
                    body_content = body_bytes["body"][:1024].decode("utf-8", errors="ignore")
            except:
                pass
        
        # Combinar todos os conteúdos para análise
        content_to_check = f"{url_path} {query_params} {body_content}"
        
        # Verificar cada tipo de ameaça
        for threat_type, patterns in self.threat_patterns.items():
            for pattern in patterns:
                if re.search(pattern, content_to_check):
                    security_logger.log_security_event(
                        f"threat_detected_{threat_type}",
                        ip_address=client_ip,
                        details={
                            "pattern": pattern,
                            "content_sample": content_to_check[:200]
                        }
                    )
                    raise HTTPException(
                        status_code=400, 
                        detail=f"Conteúdo suspeito detectado: {threat_type}"
                    )
    
    def add_security_headers(self, response: Response) -> Response:
        """Adicionar headers de segurança à resposta"""
        security_headers = {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
        }
        
        for header, value in security_headers.items():
            response.headers[header] = value
        
        return response

class IPWhitelistMiddleware(BaseHTTPMiddleware):
    """Middleware para whitelist de IPs em endpoints críticos"""
    
    def __init__(self, app, protected_paths: List[str] = None, whitelist: List[str] = None):
        super().__init__(app)
        self.protected_paths = protected_paths or ["/admin", "/api/admin"]
        self.whitelist = set(whitelist or ["127.0.0.1", "localhost"])
    
    async def dispatch(self, request: Request, call_next):
        """Verificar whitelist para paths protegidos"""
        path = request.url.path
        
        # Verificar se o path está protegido
        if any(path.startswith(protected) for protected in self.protected_paths):
            client_ip = self.get_client_ip(request)
            
            if client_ip not in self.whitelist:
                security_logger.log_security_event(
                    "unauthorized_admin_access",
                    ip_address=client_ip,
                    details={"path": path}
                )
                raise HTTPException(
                    status_code=403, 
                    detail="Acesso não autorizado a área administrativa"
                )
        
        response = await call_next(request)
        return response
    
    def get_client_ip(self, request: Request) -> str:
        """Obter IP do cliente"""
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        if hasattr(request.client, 'host'):
            return request.client.host
        
        return "unknown"

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware para logging detalhado de requests"""
    
    def __init__(self, app, log_body: bool = False, max_body_size: int = 1024):
        super().__init__(app)
        self.log_body = log_body
        self.max_body_size = max_body_size
    
    async def dispatch(self, request: Request, call_next):
        """Log detalhado da request"""
        start_time = time.time()
        
        # Capturar dados da request
        request_data = {
            "method": request.method,
            "url": str(request.url),
            "headers": dict(request.headers),
            "client_ip": self.get_client_ip(request),
            "timestamp": start_time
        }
        
        # Capturar body se habilitado
        if self.log_body and request.method in ["POST", "PUT", "PATCH"]:
            try:
                body = await request.receive()
                if body.get("body"):
                    body_text = body["body"][:self.max_body_size].decode("utf-8", errors="ignore")
                    request_data["body_sample"] = body_text
            except:
                request_data["body_sample"] = "Error reading body"
        
        # Processar request
        response = await call_next(request)
        
        # Calcular tempo de processamento
        processing_time = time.time() - start_time
        
        # Log completo
        security_logger.info("Request processed",
                           request_data=request_data,
                           response_status=response.status_code,
                           processing_time=processing_time)
        
        return response
    
    def get_client_ip(self, request: Request) -> str:
        """Obter IP do cliente"""
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        if hasattr(request.client, 'host'):
            return request.client.host
        
        return "unknown"