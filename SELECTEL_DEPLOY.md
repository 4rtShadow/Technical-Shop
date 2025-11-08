# Деплой на Selectel

## Варианты деплоя

### Вариант 1: VPS сервер (рекомендуется)

#### Требования
- VPS сервер с Ubuntu 20.04/22.04
- Минимум 2GB RAM, 2 CPU cores, 20GB SSD
- Установленные Docker и Docker Compose

#### Шаги установки

1. **Подключитесь к серверу по SSH:**
```bash
ssh root@your-server-ip
```

2. **Установите Docker и Docker Compose:**
```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установка Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Добавление пользователя в группу docker
usermod -aG docker $USER
```

3. **Клонируйте репозиторий:**
```bash
git clone <your-repository-url> /opt/techstore
cd /opt/techstore
```

4. **Создайте файл `.env` для production:**
```bash
cat > .env << EOF
POSTGRES_USER=techstore
POSTGRES_PASSWORD=your_strong_password_here
POSTGRES_DB=techstore
SECRET_KEY=your_secret_key_here_min_32_chars
CORS_ORIGINS=["https://yourdomain.com", "https://www.yourdomain.com"]
ALLOWED_HOSTS=["yourdomain.com", "www.yourdomain.com"]
EOF
```

5. **Настройте SSL сертификаты (Let's Encrypt):**
```bash
# Установите Certbot
apt install certbot -y

# Получите сертификат
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Скопируйте сертификаты
mkdir -p nginx/ssl
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
```

6. **Используйте production конфигурацию nginx:**
```bash
cp nginx/nginx.prod.conf nginx/nginx.conf
```

7. **Запустите приложение:**
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

8. **Настройте автозапуск:**
```bash
# Создайте systemd service
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

#### Настройка домена в Selectel

1. Зайдите в панель управления Selectel
2. Перейдите в раздел "Домены"
3. Добавьте A-запись:
   - Имя: `@` (или ваш поддомен)
   - Тип: `A`
   - Значение: IP адрес вашего VPS сервера
   - TTL: `3600`

4. Добавьте A-запись для www:
   - Имя: `www`
   - Тип: `A`
   - Значение: IP адрес вашего VPS сервера
   - TTL: `3600`

### Вариант 2: Selectel Cloud Platform

Если используете Selectel Cloud Platform:

1. **Создайте виртуальную машину:**
   - Выберите Ubuntu 20.04/22.04
   - Минимум 2GB RAM, 2 CPU cores
   - Создайте и подключите внешний IP

2. **Следуйте инструкциям из Варианта 1, начиная с шага 2**

### Вариант 3: Docker на Managed Kubernetes (если доступно)

1. **Создайте Kubernetes кластер в Selectel**
2. **Создайте namespace:**
```bash
kubectl create namespace techstore
```

3. **Создайте секреты:**
```bash
kubectl create secret generic techstore-secrets \
  --from-literal=postgres-user=techstore \
  --from-literal=postgres-password=your_password \
  --from-literal=secret-key=your_secret_key \
  -n techstore
```

4. **Примените конфигурации:**
```bash
kubectl apply -f k8s/ -n techstore
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

### Восстановление из бэкапа:
```bash
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U techstore techstore < backup_20240101_120000.sql
```

## Мониторинг

### Просмотр логов:
```bash
# Все сервисы
docker-compose -f docker-compose.prod.yml logs -f

# Конкретный сервис
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Проверка статуса:
```bash
docker-compose -f docker-compose.prod.yml ps
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

## Безопасность

1. **Измените пароли по умолчанию в `.env`**
2. **Используйте сильный SECRET_KEY (минимум 32 символа)**
3. **Настройте файрвол:**
```bash
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
ufw enable
```

4. **Регулярно обновляйте систему:**
```bash
apt update && apt upgrade -y
```

## Troubleshooting

### Проверка подключения к БД:
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

