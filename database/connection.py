import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/judas_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_database():
    """Dependency para obter sessão de base de dados"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()