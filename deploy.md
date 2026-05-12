# Deploy PrepRoom на VPS (Рег.ру / Timeweb / DigitalOcean)

## Что понадобится

- VPS с Ubuntu 22.04 LTS (минимум 2 RAM, 1 CPU)
- Домен (например `preproom.ru`) с A-записью на IP сервера
- SSH-доступ к серверу
- GitHub-репозиторий с проектом

---

## Шаг 1: Подготовка сервера

Подключись по SSH (в PowerShell / Terminal):

```bash
ssh root@<IP_СЕРВЕРА>
```

Обнови систему:

```bash
apt update && apt upgrade -y
```

Установи необходимое ПО:

```bash
apt install -y curl git nginx certbot python3-certbot-nginx postgresql postgresql-contrib build-essential
```

---

## Шаг 2: Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v   # должно быть v20.x
npm -v
```

Установи PM2 (менеджер процессов):

```bash
npm install -g pm2
```

---

## Шаг 3: PostgreSQL

```bash
# Зайди в консоль PostgreSQL
sudo -u postgres psql
```

Внутри psql выполни:

```sql
CREATE DATABASE interview_platform;
CREATE USER preproom WITH ENCRYPTED PASSWORD 'придумай_сложный_пароль_здесь';
GRANT ALL PRIVILEGES ON DATABASE interview_platform TO preproom;
\q
```

---

## Шаг 4: Клонирование проекта

```bash
cd /var/www
git clone <URL_ТВОЕГО_РЕПОЗИТОРИЯ> preproom
cd preproom
```

---

## Шаг 5: Переменные окружения

```bash
cp .env.example .env
nano .env
```

Заполни обязательные поля:

```
DATABASE_URL=postgresql://preproom:придумай_сложный_пароль_здесь@localhost:5432/interview_platform
PORT=4000
CORS_ORIGIN=https://preproom.ru

# LLM (Groq) — вставь свой ключ
GROQ_API_KEY=gsk_...

# OpenRouter — вставь свой ключ
OPENROUTER_API_KEY=sk-or-v1-...

# Обязательно! Придумай длинную случайную строку
MOCK_SIGN_SECRET=придумай_очень_длинную_случайную_строку_минимум_32_символа
MOCK_MAX_PER_WEEK=1
```

Сохрани: `Ctrl+O`, `Enter`, `Ctrl+X`

---

## Шаг 6: База данных

```bash
cd /var/www/preproom/server
npx prisma migrate deploy
npx prisma generate
```

Если нужно засидить данные:

```bash
npx prisma db seed
```

---

## Шаг 7: Сборка проекта

### Сервер

```bash
cd /var/www/preproom/server
npm install
npm run build
```

### Клиент

```bash
cd /var/www/preproom/client
npm install
npm run build
```

---

## Шаг 8: PM2 (запуск сервера)

```bash
cd /var/www/preproom
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd
```

Последняя команда выведет команду — выполни её (она автоматически добавит PM2 в автозапуск).

Проверь что сервер работает:

```bash
curl http://localhost:4000/api/health
```

Должно вывести `{"status":"ok"}`

---

## Шаг 9: Nginx

Скопируй конфиг:

```bash
cp /var/www/preproom/nginx.conf /etc/nginx/sites-available/preproom
ln -s /etc/nginx/sites-available/preproom /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

**Важно:** в `nginx.conf` замени `preproom.ru` на свой домен.

---

## Шаг 10: SSL (HTTPS)

```bash
certbot --nginx -d preproom.ru -d www.preproom.ru
```

Следуй инструкциям. Certbot автоматически:
- Получит сертификат Let's Encrypt
- Настроит nginx
- Добавит автообновление

Проверь что сайт открывается по `https://preproom.ru`

---

## Шаг 11: Обновление (когда вносишь изменения)

```bash
cd /var/www/preproom
git pull origin main

# Сервер
cd server
npm install
npm run build

# Клиент
cd ../client
npm install
npm run build

# Перезапуск
pm2 reload preproom-server
```

---

## Полезные команды

```bash
# Статус сервера
pm2 status
pm2 logs preproom-server

# Перезапуск
pm2 restart preproom-server

# Остановить
pm2 stop preproom-server

# Логи nginx
journalctl -u nginx -f

# Логи сервера
pm2 logs preproom-server --lines 50

# Свободное место
df -h
```

---

## Если что-то не работает

1. **Сайт не открывается** — проверь `ufw` (firewall) и A-запись домена
2. **500 ошибка** — смотри `pm2 logs`
3. **База не подключается** — проверь `DATABASE_URL` в `.env`
4. **CORS ошибки** — проверь `CORS_ORIGIN=https://твой-домен.ru` (без слэша в конце)

---

## Безопасность (обязательно)

### Firewall (UFW)

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

### .env права

```bash
chmod 600 /var/www/preproom/.env
```

### Fail2ban (защита от брутфорса)

```bash
apt install fail2ban -y
systemctl enable fail2ban
```
