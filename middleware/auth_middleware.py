import os
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from typing import Optional
from models import User, UserRole

security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuração JWT
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "judas-legal-assistant-super-secret-key-2025")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 horas

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha fornecida corresponde ao hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Gera hash da senha"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Cria token JWT de acesso"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """Autentica usuário com username e senha"""
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verifica e decodifica token JWT"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=401,
                detail="Token inválido: usuário não identificado",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Token inválido: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def verify_admin_token(token_data: dict = Depends(verify_token)):
    """Verifica se o token pertence a um administrador"""
    role = token_data.get("role")
    if role not in ["ADMIN", "SUPERADMIN"]:
        raise HTTPException(
            status_code=403,
            detail="Permissões insuficientes: acesso restrito a administradores"
        )
    return token_data

async def verify_superadmin_token(token_data: dict = Depends(verify_token)):
    """Verifica se o token pertence a um superadministrador"""
    role = token_data.get("role")
    if role != "SUPERADMIN":
        raise HTTPException(
            status_code=403,
            detail="Permissões insuficientes: acesso restrito a superadministradores"
        )
    return token_data

def get_current_user(db: Session, token_data: dict) -> User:
    """Obtém dados do usuário atual baseado no token"""
    user_id = token_data.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Usuário não encontrado no token")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Usuário não encontrado na base de dados")
    
    if not user.is_active:
        raise HTTPException(status_code=401, detail="Usuário inativo")
    
    return user