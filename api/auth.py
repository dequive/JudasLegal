from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Optional

from database.connection import get_database
from models import User, UserRole
from middleware.auth_middleware import (
    authenticate_user, 
    create_access_token, 
    verify_token,
    verify_superadmin_token,
    get_password_hash,
    get_current_user
)

router = APIRouter(prefix="/auth", tags=["auth"])

# get_database já importado de database.connection

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str
    expires_in: int

class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str
    role: str = "USER"

@router.post("/login", response_model=LoginResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_database)
):
    """
    Autenticação de administrador:
    - Valida credenciais
    - Gera JWT token
    - Retorna token de acesso
    """
    
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Credenciais inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if user.role == UserRole.USER:
        raise HTTPException(
            status_code=403, 
            detail="Sem permissões administrativas. Apenas administradores podem acessar."
        )
        
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Usuário inativo")
    
    # Atualizar último login
    user.last_login = datetime.utcnow()
    db.commit()
        
    access_token_expires = timedelta(minutes=480)  # 8 horas
    access_token = create_access_token(
        data={
            "sub": user.username,
            "user_id": user.id,
            "role": user.role.value,
            "email": user.email
        },
        expires_delta=access_token_expires
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        role=user.role.value,
        username=user.username,
        expires_in=480 * 60  # segundos
    )

@router.post("/create-admin")
async def create_admin_user(
    user_request: CreateUserRequest,
    current_user: dict = Depends(verify_superadmin_token),
    db: Session = Depends(get_database)
):
    """Criar novo usuário admin (apenas superadmin)"""
    
    # Verificar se username já existe
    existing_user = db.query(User).filter(User.username == user_request.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Nome de usuário já existe")
    
    # Verificar se email já existe
    existing_email = db.query(User).filter(User.email == user_request.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email já está em uso")
    
    # Validar role
    try:
        role = UserRole(user_request.role)
    except ValueError:
        raise HTTPException(status_code=400, detail="Role inválido")
    
    # Criar novo usuário
    hashed_password = get_password_hash(user_request.password)
    new_user = User(
        username=user_request.username,
        email=user_request.email,
        hashed_password=hashed_password,
        role=role,
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "message": f"Usuário {user_request.username} criado com sucesso",
        "user_id": new_user.id,
        "role": new_user.role.value
    }

@router.get("/me")
async def get_current_user_info(
    token_data: dict = Depends(verify_token),
    db: Session = Depends(get_database)
):
    """Obtém informações do usuário atual"""
    user = get_current_user(db, token_data)
    
    return {
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role.value,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "last_login": user.last_login
    }

@router.post("/logout")
async def logout(token_data: dict = Depends(verify_token)):
    """
    Logout (por enquanto apenas confirma token válido)
    Em implementação futura, pode invalidar token
    """
    return {"message": "Logout realizado com sucesso"}

@router.get("/verify")
async def verify_auth(token_data: dict = Depends(verify_token)):
    """Verifica se o token é válido"""
    return {
        "valid": True,
        "user_id": token_data.get("user_id"),
        "username": token_data.get("sub"),
        "role": token_data.get("role")
    }