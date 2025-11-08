FROM node:18-alpine as build

WORKDIR /app

# Установка дополнительных зависимостей для сборки
RUN apk add --no-cache python3 make g++

# Установка переменных окружения
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL

# Копирование package.json
COPY package.json ./

# Установка зависимостей
RUN npm install --no-audit --no-fund

# Копирование всех файлов проекта
COPY . .

# Проверка наличия важных файлов
RUN test -f vite.config.js && echo "vite.config.js exists" || echo "vite.config.js NOT FOUND"
RUN test -f index.html && echo "index.html exists" || echo "index.html NOT FOUND"
RUN test -f tailwind.config.js && echo "tailwind.config.js exists" || echo "tailwind.config.js NOT FOUND"
RUN test -f postcss.config.js && echo "postcss.config.js exists" || echo "postcss.config.js NOT FOUND"

# Сборка приложения
RUN npm run build

# Проверка результата сборки
RUN test -d dist && echo "Build successful, dist directory exists" || (echo "Build failed, dist directory not found" && exit 1)

FROM nginx:alpine

# Копирование собранного приложения
COPY --from=build /app/dist /usr/share/nginx/html

# Копирование конфигурации nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
