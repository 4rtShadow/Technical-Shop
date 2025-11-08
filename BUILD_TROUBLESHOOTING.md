# Решение проблем со сборкой

## Проблема: Ошибка при сборке Docker образа frontend

### Решение 1: Очистка и пересборка

```bash
# Остановите все контейнеры
docker-compose down

# Удалите старые образы
docker rmi techstore_frontend

# Очистите кэш Docker
docker system prune -a

# Пересоберите образы
docker-compose up --build
```

### Решение 2: Проверка локальной сборки

Перед сборкой в Docker проверьте, что проект собирается локально:

```bash
cd frontend
npm install
npm run build
```

Если локальная сборка не работает, проверьте:
1. Версию Node.js (должна быть 18+)
2. Наличие всех файлов конфигурации
3. Ошибки в консоли

### Решение 3: Установка зависимостей вручную

Если проблема в зависимостях, попробуйте:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### Решение 4: Использование другой версии Node

Если проблема продолжается, попробуйте изменить версию Node в Dockerfile:

```dockerfile
FROM node:18-alpine as build
```

На:

```dockerfile
FROM node:20-alpine as build
```

### Решение 5: Проверка использования window и localStorage

Убедитесь, что все использования `window` и `localStorage` защищены проверками:

```javascript
if (typeof window !== 'undefined') {
  // код с window или localStorage
}
```

### Решение 6: Увеличение памяти для сборки

Если проблема в нехватке памяти, добавьте в Dockerfile:

```dockerfile
ENV NODE_OPTIONS="--max-old-space-size=4096"
```

### Решение 7: Пошаговая сборка

Соберите образ с промежуточными шагами:

```bash
docker build -t techstore-frontend:debug --progress=plain frontend/
```

Это покажет детальный вывод всех шагов сборки.

## Типичные ошибки

### Ошибка: "Cannot find module"

Решение: Убедитесь, что все зависимости установлены:
```bash
cd frontend
npm install
```

### Ошибка: "Module not found: Can't resolve"

Решение: Проверьте импорты в коде. Убедитесь, что все пути корректны.

### Ошибка: "window is not defined"

Решение: Добавьте проверки `typeof window !== 'undefined'` перед использованием window.

### Ошибка: "localStorage is not defined"

Решение: Добавьте проверки `typeof window !== 'undefined'` перед использованием localStorage.

## Проверка после сборки

После успешной сборки проверьте:

```bash
# Проверка наличия dist директории
ls -la frontend/dist

# Проверка содержимого
ls -la frontend/dist/assets
```

## Получение логов ошибок

Для получения детальных логов ошибок:

```bash
docker-compose build frontend 2>&1 | tee build.log
```

Затем просмотрите файл `build.log` для деталей ошибки.

