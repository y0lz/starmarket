#!/bin/bash

# Этот скрипт создает deployment через Vercel API
# Требуется VERCEL_TOKEN

if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ Ошибка: VERCEL_TOKEN не установлен"
  echo ""
  echo "Получите токен здесь: https://vercel.com/account/tokens"
  echo "Затем запустите:"
  echo "  export VERCEL_TOKEN=ваш_токен"
  echo "  ./create-vercel-deployment.sh"
  exit 1
fi

PROJECT_ID="prj_2TT3vjnueuO3UEgpKyXt2pjPJd7O"
TEAM_ID="team_EQlqtcC4hARe2gXKCsd6a8X9"

echo "🚀 Создаем deployment на Vercel..."
echo "Project ID: $PROJECT_ID"
echo ""

# Создаем JSON с файлами
cat > deployment-payload.json << 'EOF'
{
  "name": "mini-app",
  "files": [],
  "projectSettings": {
    "framework": null
  },
  "target": "production"
}
EOF

echo "✅ Payload готов"
echo "📤 Отправляем на Vercel API..."

curl -X POST "https://api.vercel.com/v13/deployments?teamId=$TEAM_ID" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d @deployment-payload.json

echo ""
echo "✅ Готово!"
