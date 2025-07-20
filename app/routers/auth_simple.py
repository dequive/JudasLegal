"""
Router de autenticação simplificado para demonstração
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import jwt
import bcrypt
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/auth", tags=["authentication"])

# Configuração JWT simples
SECRET_KEY = "muzaia_demo_secret_key_2025"
ALGORITHM = "HS256"

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 28800  # 8 horas
    user_role: str

# Utilizadores demo simplificados
DEMO_USERS = {
    "admin": {
        "password_hash": bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "role": "admin"
    },
    "superadmin": {
        "password_hash": bcrypt.hashpw("super123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "role": "superadmin"
    }
}

def create_access_token(data: dict) -> str:
    """Criar token JWT"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=8)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar password"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

@router.post("/login", response_model=LoginResponse)
async def login_simple(login_data: LoginRequest):
    """Login simplificado para demonstração"""
    try:
        # Verificar utilizador
        if login_data.username not in DEMO_USERS:
            raise HTTPException(status_code=401, detail="Credenciais inválidas")
        
        user_data = DEMO_USERS[login_data.username]
        
        # Verificar password
        if not verify_password(login_data.password, user_data["password_hash"]):
            raise HTTPException(status_code=401, detail="Credenciais inválidas")
        
        # Criar token
        token_data = {
            "user_id": login_data.username,
            "username": login_data.username,
            "role": user_data["role"]
        }
        
        access_token = create_access_token(token_data)
        
        return LoginResponse(
            access_token=access_token,
            user_role=user_data["role"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no servidor: {str(e)}")

@router.get("/verify")
async def verify_token_simple():
    """Verificação simplificada"""
    return {"message": "Token verification endpoint - implementar com Authorization header"}

@router.post("/logout")
async def logout_simple():
    """Logout simplificado"""
    return {"message": "Logout realizado com sucesso"}