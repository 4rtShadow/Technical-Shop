#!/bin/bash

# Скрипт для деплоя на Selectel VPS

set -e

echo "🚀 Начинаем деплой TechStore..."

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и повторите попытку."
    exit 1
fi

# Проверка наличия Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose и повторите попытку."
    exit 1
fi

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo "⚠️  Файл .env не найден. Создаю из .env.example..."
    cp .env.example .env
    echo "✏️  Пожалуйста, отредактируйте .env файл и установите правильные значения."
    echo "   Особенно важно установить:"
    echo "   - POSTGRES_PASSWORD"
    echo "   - SECRET_KEY"
    echo "   - CORS_ORIGINS"
    echo "   - ALLOWED_HOSTS"
    exit 1
fi

# Сборка образов
echo "📦 Собираю Docker образы..."
docker-compose -f docker-compose.prod.yml build

# Остановка старых контейнеров
echo "🛑 Останавливаю старые контейнеры..."
docker-compose -f docker-compose.prod.yml down

# Запуск контейнеров
echo "▶️  Запускаю контейнеры..."
docker-compose -f docker-compose.prod.yml up -d

# Ожидание готовности сервисов
echo "⏳ Ожидаю готовности сервисов..."
sleep 10

# Проверка статуса
echo "✅ Проверяю статус сервисов..."
docker-compose -f docker-compose.prod.yml ps

echo "🎉 Деплой завершен!"
echo "📊 Статус сервисов:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "📝 Полезные команды:"
echo "   Просмотр логов: docker-compose -f docker-compose.prod.yml logs -f"
echo "   Остановка: docker-compose -f docker-compose.prod.yml down"
echo "   Перезапуск: docker-compose -f docker-compose.prod.yml restart"

