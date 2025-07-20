"""
Sistema de autenticação e segurança para Muzaia
Implementa JWT tokens, validação de permissões e segurança de API
"""

import jwt
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, List
from fastapi import HTTPException, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
import logging

logger = logging.getLogger(__name__)

# Configuração de criptografia
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Chave secreta para JWT (em produção deve vir de variável de ambiente)
SECRET_KEY = "muzaia_secret_key_change_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 8

class SecurityManager:
    """Gestor de segurança centralizado"""
    
    def __init__(self):
        self.failed_attempts = {}  # IP -> {count, last_attempt}
        self.blocked_ips = set()
        self.max_attempts = 5
        self.block_duration = 3600  # 1 hora
    
    def hash_password(self, password: str) -> str:
        """Hash de password com salt"""
        return pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verificar password"""
        return pwd_context.verify(plain_password, hashed_password)
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        """Criar token JWT"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Optional[Dict]:
        """Verificar e descodificar token JWT"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expirado")
        except jwt.JWTError:
            raise HTTPException(status_code=401, detail="Token inválido")
    
    def generate_api_key(self) -> str:
        """Gerar chave API única"""
        return f"muzaia_{secrets.token_urlsafe(32)}"
    
    def hash_api_key(self, api_key: str) -> str:
        """Hash de chave API"""
        return hashlib.sha256(api_key.encode()).hexdigest()
    
    def is_ip_blocked(self, ip_address: str) -> bool:
        """Verificar se IP está bloqueado"""
        if ip_address in self.blocked_ips:
            return True
        
        if ip_address in self.failed_attempts:
            attempt_data = self.failed_attempts[ip_address]
            if attempt_data["count"] >= self.max_attempts:
                time_since_last = datetime.utcnow() - attempt_data["last_attempt"]
                if time_since_last.total_seconds() < self.block_duration:
                    return True
                else:
                    # Remover do bloqueio após expirar
                    del self.failed_attempts[ip_address]
        
        return False
    
    def record_failed_attempt(self, ip_address: str):
        """Registar tentativa falhada"""
        if ip_address not in self.failed_attempts:
            self.failed_attempts[ip_address] = {"count": 0, "last_attempt": datetime.utcnow()}
        
        self.failed_attempts[ip_address]["count"] += 1
        self.failed_attempts[ip_address]["last_attempt"] = datetime.utcnow()
        
        if self.failed_attempts[ip_address]["count"] >= self.max_attempts:
            self.blocked_ips.add(ip_address)
            logger.warning(f"IP {ip_address} bloqueado por excesso de tentativas")
    
    def clear_failed_attempts(self, ip_address: str):
        """Limpar tentativas falhadas após sucesso"""
        if ip_address in self.failed_attempts:
            del self.failed_attempts[ip_address]

# Instância global
security_manager = SecurityManager()

class RoleChecker:
    """Verificador de roles e permissões"""
    
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles
    
    def __call__(self, credentials: HTTPAuthorizationCredentials = Security(security)):
        token = credentials.credentials
        payload = security_manager.verify_token(token)
        
        user_role = payload.get("role", "user")
        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=403, 
                detail="Permissões insuficientes"
            )
        
        return payload

# Verificadores de role
require_admin = RoleChecker(["admin", "superadmin"])
require_user = RoleChecker(["user", "admin", "superadmin"])

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Obter utilizador actual do token"""
    token = credentials.credentials
    payload = security_manager.verify_token(token)
    return payload

class InputValidator:
    """Validador de inputs para prevenir ataques"""
    
    @staticmethod
    def sanitize_string(input_str: str, max_length: int = 1000) -> str:
        """Sanitizar string de input"""
        if not isinstance(input_str, str):
            raise HTTPException(status_code=400, detail="Input deve ser string")
        
        if len(input_str) > max_length:
            raise HTTPException(status_code=400, detail=f"Input excede {max_length} caracteres")
        
        # Remover caracteres potencialmente perigosos
        dangerous_chars = ['<', '>', '"', "'", '&', '\x00']
        for char in dangerous_chars:
            input_str = input_str.replace(char, '')
        
        return input_str.strip()
    
    @staticmethod
    def validate_email(email: str) -> str:
        """Validar formato de email"""
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            raise HTTPException(status_code=400, detail="Formato de email inválido")
        return email.lower()
    
    @staticmethod
    def validate_password_strength(password: str) -> str:
        """Validar força da password"""
        if len(password) < 8:
            raise HTTPException(status_code=400, detail="Password deve ter pelo menos 8 caracteres")
        
        if not any(c.isupper() for c in password):
            raise HTTPException(status_code=400, detail="Password deve ter pelo menos uma letra maiúscula")
        
        if not any(c.islower() for c in password):
            raise HTTPException(status_code=400, detail="Password deve ter pelo menos uma letra minúscula")
        
        if not any(c.isdigit() for c in password):
            raise HTTPException(status_code=400, detail="Password deve ter pelo menos um número")
        
        return password

# Instância global
input_validator = InputValidator()