from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_password_hash
from app.core.dependencies import get_current_active_user
from app.core.email import generate_verification_token, send_verification_email
from app.models.user import User
from app.schemas.user import User as UserSchema, UserCreate, UserUpdate

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    # Check if username exists
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    # Check if email exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    verification_token = generate_verification_token()
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role,
        email_verification_token=verification_token
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Send verification email
    send_verification_email(user.email, verification_token)
    
    return {"message": "Пользователь создан. Проверьте email для подтверждения регистрации."}

@router.get("/me", response_model=UserSchema)
async def read_user_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.put("/me", response_model=UserSchema)
async def update_user_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if user_update.username:
        existing_user = db.query(User).filter(User.username == user_update.username).first()
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        current_user.username = user_update.username
    
    if user_update.email:
        existing_user = db.query(User).filter(User.email == user_update.email).first()
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already taken"
            )
        current_user.email = user_update.email
    
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    
    if user_update.password:
        current_user.hashed_password = get_password_hash(user_update.password)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/verify-email")
async def verify_email(
    token: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email_verification_token == token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    
    user.is_email_verified = True
    user.is_active = True
    user.email_verification_token = None
    db.commit()
    
    return {"message": "Email успешно подтвержден"}

@router.post("/resend-verification")
async def resend_verification(
    email: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )
    
    verification_token = generate_verification_token()
    user.email_verification_token = verification_token
    db.commit()
    
    send_verification_email(user.email, verification_token)
    
    return {"message": "Письмо с подтверждением отправлено повторно"}

