from fastapi import Request, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from app.core.security import decode_access_token
from app.core.database import SessionLocal
from app.models.user import User, UserRole

def verify_admin_token(token: str) -> bool:
    """Проверяет, является ли токен валидным и принадлежит ли он администратору"""
    if not token:
        return False
    
    # Удаляем префикс "Bearer " если есть
    if token.startswith("Bearer "):
        token = token[7:]
    
    payload = decode_access_token(token)
    if not payload:
        return False
    
    username = payload.get("sub")
    role = payload.get("role")
    
    if not username or role != UserRole.ADMIN.value:
        return False
    
    # Дополнительная проверка в БД
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        if not user or user.role != UserRole.ADMIN or not user.is_active:
            return False
        return True
    except Exception:
        return False
    finally:
        db.close()

async def check_admin_access(request: Request):
    """Проверяет доступ администратора для документации"""
    # Проверяем токен из cookie или заголовка
    token = request.cookies.get("access_token") or request.headers.get("authorization")
    
    if not token:
        # Если токена нет, показываем страницу логина
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется авторизация администратора"
        )
    
    if not verify_admin_token(token):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступ запрещен. Требуются права администратора."
        )

