#!/bin/bash
# Использование: deploy [full|front|back]
# full  — пересобрать всё (по умолчанию)
# front — только фронтенд
# back  — только сервер

MODE=${1:-full}
cd /root/preproom

echo "⬇️  git pull..."
git pull origin main --quiet

if [ "$MODE" = "front" ]; then
  echo "🔨 Сборка фронтенда..."
  cd client && VITE_API_URL=https://preproom.ru npm run build && chmod -R 755 /root/preproom/client/dist
  echo "✅ Фронтенд обновлён"

elif [ "$MODE" = "back" ]; then
  echo "🔨 Компиляция сервера..."
  cd server && rm -rf dist && npx tsc
  pm2 restart all
  echo "✅ Сервер перезапущен"

else
  echo "🔨 Компиляция сервера..."
  cd server && rm -rf dist && npx tsc
  pm2 restart all

  echo "🔨 Сборка фронтенда..."
  cd /root/preproom/client && VITE_API_URL=https://preproom.ru npm run build && chmod -R 755 /root/preproom/client/dist

  echo "✅ Полный деплой завершён"
fi
