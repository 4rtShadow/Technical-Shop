from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import UserRole

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: Optional[UserRole] = UserRole.USER

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None

class UserInDB(UserBase):
    id: int
    is_active: bool
    role: UserRole
    created_at: datetime
    
    class Config:
        from_attributes = True

class User(UserInDB):
    pass

