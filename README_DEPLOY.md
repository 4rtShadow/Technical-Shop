# Инструкция по деплою на Selectel

## Подготовка

1. **Создайте VPS сервер в Selectel:**
   - Минимум: 2GB RAM, 2 CPU, 20GB SSD
   - ОС: Ubuntu 20.04 или 22.04

2. **Подключитесь к серверу:**
```bash
ssh root@your-server-ip
```

## Установка Docker

```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установка Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Проверка установки
docker --version
docker-compose --version
```

## Настройка проекта

1. **Клонируйте репозиторий:**
```bash
git clone <your-repo-url> /opt/techstore
cd /opt/techstore
```

2. **Создайте файл `.env`:**
```bash
nano .env
```

Добавьте:
```env
POSTGRES_USER=techstore
POSTGRES_PASSWORD=your_strong_password_here
POSTGRES_DB=techstore
SECRET_KEY=your_secret_key_min_32_characters
CORS_ORIGINS=["https://yourdomain.com"]
ALLOWED_HOSTS=["yourdomain.com", "www.yourdomain.com"]
```

3. **Настройте SSL сертификаты:**
```bash
# Установите Certbot
apt install certbot -y

# Получите сертификат (замените yourdomain.com на ваш домен)
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Создайте директорию для сертификатов
mkdir -p nginx/ssl

# Скопируйте сертификаты
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem

# Установите права
chmod 600 nginx/ssl/*
```

4. **Используйте production конфигурацию:**
```bash
cp nginx/nginx.prod.conf nginx/nginx.conf
```

## Запуск приложения

```bash
# Запустите приложение
docker-compose -f docker-compose.prod.yml up -d --build

# Проверьте статус
docker-compose -f docker-compose.prod.yml ps

# Просмотрите логи
docker-compose -f docker-compose.prod.yml logs -f
```

## Настройка домена

1. В панели управления Selectel перейдите в раздел "Домены"
2. Добавьте A-запись:
   - Имя: `@`
   - Тип: `A`
   - Значение: IP адрес вашего VPS
   - TTL: `3600`

3. Добавьте A-запись для www:
   - Имя: `www`
   - Тип: `A`
   - Значение: IP адрес вашего VPS
   - TTL: `3600`

## Настройка файрвола

```bash
# Установите UFW
apt install ufw -y

# Разрешите порты
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS

# Включите файрвол
ufw enable
```

## Автозапуск

Создайте systemd service:

```bash
cat > /etc/systemd/system/techstore.service << EOF
[Unit]
Description=TechStore Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/techstore
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Включите автозапуск
systemctl enable techstore
systemctl start techstore
```

## Обновление приложения

```bash
cd /opt/techstore
git pull
docker-compose -f docker-compose.prod.yml up -d --build
```

## Резервное копирование БД

### Создание бэкапа:
```bash
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U techstore techstore > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Восстановление:
```bash
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U techstore techstore < backup_file.sql
```

## Обновление SSL сертификатов

```bash
# Обновите сертификаты
certbot renew

# Скопируйте новые сертификаты
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem

# Перезапустите nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

## Мониторинг

### Просмотр логов:
```bash
# Все сервисы
docker-compose -f docker-compose.prod.yml logs -f

# Конкретный сервис
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Проверка статуса:
```bash
docker-compose -f docker-compose.prod.yml ps
```

## Troubleshooting

### Проблемы с подключением к БД:
```bash
docker-compose -f docker-compose.prod.yml exec backend python -c "from app.core.database import engine; engine.connect()"
```

### Пересоздание контейнеров:
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### Очистка неиспользуемых образов:
```bash
docker system prune -a
```

## Безопасность

1. **Измените все пароли по умолчанию**
2. **Используйте сильный SECRET_KEY (минимум 32 символа)**
3. **Регулярно обновляйте систему:**
```bash
apt update && apt upgrade -y
```

4. **Настройте регулярные бэкапы БД**
5. **Мониторьте логи на предмет подозрительной активности**

