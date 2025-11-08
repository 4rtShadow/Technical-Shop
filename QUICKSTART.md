# Быстрый старт TechStore

## Запуск проекта

1. Убедитесь, что у вас установлены Docker и Docker Compose

2. Клонируйте репозиторий и перейдите в директорию проекта

3. Запустите проект:
```bash
docker-compose up --build
```

4. Откройте браузер:
   - Frontend (через nginx): http://localhost
   - Frontend (прямой доступ): http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/api/docs

## Доступы администратора

- **Имя пользователя**: `admin`
- **Пароль**: `qwertyasdfghjkl1234567890`

## Первые шаги

1. Войдите как администратор
2. Перейдите в админ панель
3. Добавьте товары в каталог
4. Создайте тестового пользователя (опционально)
5. Начните делать покупки!

## Остановка проекта

```bash
docker-compose down
```

Для полной очистки (включая данные БД):
```bash
docker-compose down -v
```

## Разработка

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Структура проекта

- `backend/` - FastAPI приложение
- `frontend/` - React приложение
- `nginx/` - Конфигурация nginx
- `docker-compose.yml` - Docker Compose конфигурация

