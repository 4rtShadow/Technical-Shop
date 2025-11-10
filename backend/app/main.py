from fastapi import FastAPI, Request, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.openapi.utils import get_openapi
from app.core.config import settings
from app.api.v1.api import api_router
from app.core.database import engine
from app.models import Base
from app.core.docs_auth import verify_admin_token
from app.core.dependencies import get_current_admin_user

app = FastAPI(
    title="TechStore API",
    description="REST API for Electronics Store",
    version="1.0.0",
    docs_url=None,  # Отключаем стандартную документацию
    redoc_url=None  # Отключаем стандартную документацию
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    # Create tables
    Base.metadata.create_all(bind=engine)
    # Initialize admin user
    from app.core.init_db import init_db
    init_db()

@app.get("/")
async def root():
    return {"message": "TechStore API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Защищенная документация Swagger
@app.get("/api/docs", include_in_schema=False)
async def swagger_ui_html(request: Request):
    """Доступ к Swagger UI только для администраторов"""
    # Проверяем токен из заголовка Authorization или query параметра
    token = request.headers.get("authorization") or request.query_params.get("token")
    
    if not token or not verify_admin_token(token):
        # Если токена нет или он невалиден, возвращаем 404 (будет обработан frontend)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not Found"
        )
    
    # Очищаем токен от Bearer префикса
    clean_token = token.replace('Bearer ', '') if token.startswith('Bearer ') else token
    
    # Получаем HTML документацию
    html_response = get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="TechStore API - Admin Only",
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
        swagger_ui_parameters={
            "persistAuthorization": True
        }
    )
    
    # Извлекаем тело ответа
    html_body = html_response.body.decode('utf-8') if isinstance(html_response.body, bytes) else html_response.body
    
    # Инжектируем скрипт для авторизации в Swagger UI
    auth_script = f"""
    <script>
        (function() {{
            const token = "{clean_token}";
            function initSwagger() {{
                if (window.ui && window.ui.preauthorizeApiKey) {{
                    window.ui.preauthorizeApiKey("bearerAuth", token);
                }} else {{
                    setTimeout(initSwagger, 100);
                }}
            }}
            if (document.readyState === 'loading') {{
                document.addEventListener('DOMContentLoaded', initSwagger);
            }} else {{
                initSwagger();
            }}
            // Сохраняем токен для использования в запросах
            if (token) {{
                localStorage.setItem('swagger_auth_token', token);
            }}
        }})();
    </script>
    """
    
    # Вставляем скрипт перед закрывающим тегом body
    if '</body>' in html_body:
        html_body = html_body.replace('</body>', auth_script + '</body>')
    else:
        html_body += auth_script
    
    return HTMLResponse(content=html_body)

# Защищенная документация ReDoc
@app.get("/api/redoc", include_in_schema=False)
async def redoc_html(request: Request):
    """Доступ к ReDoc только для администраторов"""
    # Проверяем токен из заголовка Authorization
    token = request.headers.get("authorization")
    
    if not token or not verify_admin_token(token):
        # Если токена нет или он невалиден, возвращаем 404
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not Found"
        )
    
    return get_redoc_html(
        openapi_url="/openapi.json",
        title="TechStore API - Admin Only",
        redoc_js_url="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js",
    )

# OpenAPI schema доступен всем (для frontend интеграции)
@app.get("/openapi.json", include_in_schema=False)
async def get_openapi_schema():
    """OpenAPI схема доступна всем"""
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    # Добавляем версию OpenAPI
    openapi_schema["openapi"] = "3.0.2"
    # Добавляем security схемы
    if "components" not in openapi_schema:
        openapi_schema["components"] = {}
    openapi_schema["components"]["securitySchemes"] = {
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

