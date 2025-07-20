"""
Router de autenticação para gerar tokens JWT
"""

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from app.security.authentication import security_manager, input_validator
from app.logging.structured_logger import audit_logger, security_logger

router = APIRouter(prefix="/api/auth", tags=["authentication"])

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    user_role: str

# Utilizadores de demonstração (em produção viria da base de dados)
DEMO_USERS = {
    "admin": {
        "password_hash": security_manager.hash_password("admin123"),
        "role": "admin"
    },
    "superadmin": {
        "password_hash": security_manager.hash_password("super123"),
        "role": "superadmin"
    }
}

@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest, request: Request):
    """Fazer login e obter token JWT"""
    try:
        client_ip = getattr(request.client, 'host', 'unknown') if request.client else 'unknown'
        
        # Verificar se IP está bloqueado
        if security_manager.is_ip_blocked(client_ip):
            security_logger.log_security_event(
                "blocked_login_attempt",
                ip_address=client_ip,
                details={"username": login_data.username}
            )
            raise HTTPException(status_code=403, detail="IP bloqueado por excesso de tentativas")
        
        # Validar inputs
        username = input_validator.sanitize_string(login_data.username, 50)
        password = login_data.password
        
        # Verificar utilizador
        if username not in DEMO_USERS:
            security_manager.record_failed_attempt(client_ip)
            security_logger.log_security_event(
                "invalid_username",
                ip_address=client_ip,
                details={"username": username}
            )
            raise HTTPException(status_code=401, detail="Credenciais inválidas")
        
        user_data = DEMO_USERS[username]
        
        # Verificar password
        if not security_manager.verify_password(password, user_data["password_hash"]):
            security_manager.record_failed_attempt(client_ip)
            security_logger.log_security_event(
                "invalid_password",
                ip_address=client_ip,
                details={"username": username}
            )
            raise HTTPException(status_code=401, detail="Credenciais inválidas")
        
        # Login bem-sucedido - limpar tentativas falhadas
        security_manager.clear_failed_attempts(client_ip)
        
        # Criar token JWT
        token_data = {
            "user_id": username,
            "username": username,
            "role": user_data["role"]
        }
        
        access_token = security_manager.create_access_token(token_data)
        
        # Log de sucesso
        audit_logger.log_user_action(
            user_id=username,
            action="login",
            details={"ip_address": client_ip, "role": user_data["role"]}
        )
        
        security_logger.log_security_event(
            "successful_login",
            ip_address=client_ip,
            user_id=username,
            details={"role": user_data["role"]}
        )
        
        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=8 * 3600,  # 8 horas
            user_role=user_data["role"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        security_logger.error(f"Erro no login: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.get("/verify")
async def verify_token(request: Request):
    """Verificar se token é válido"""
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Token não fornecido")
        
        token = auth_header.split(" ")[1]
        payload = security_manager.verify_token(token)
        
        return {
            "valid": True,
            "user_id": payload.get("user_id"),
            "username": payload.get("username"),
            "role": payload.get("role"),
            "expires": payload.get("exp")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        security_logger.error(f"Erro na verificação de token: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@router.post("/logout")
async def logout(request: Request):
    """Logout (invalidar token - em implementação completa seria blacklist)"""
    try:
        # Em implementação completa, adicionaríamos o token a uma blacklist
        # Por agora, apenas log da acção
        
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = security_manager.verify_token(token)
                user_id = payload.get("user_id", "unknown")
                
                audit_logger.log_user_action(
                    user_id=user_id,
                    action="logout",
                    details={"method": "api"}
                )
            except:
                pass
        
        return {"message": "Logout realizado com sucesso"}
        
    except Exception as e:
        security_logger.error(f"Erro no logout: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")