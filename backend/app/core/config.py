from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://techstore:techstore123@postgres:5432/techstore"
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # JWT
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost", "http://frontend"]
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Admin credentials
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "qwertyasdfghjkl1234567890"
    ADMIN_EMAIL: str = "admin@techstore.com"
    
    # Email settings
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = "noreply@techstore.com"
    EMAILS_FROM_NAME: str = "TechStore"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

