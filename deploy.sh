#!/bin/bash
# Создаем архив проекта
tar -czf deployment.tar.gz index.html api/ .vercel/

echo "Файлы готовы к деплою:"
ls -lh deployment.tar.gz

echo ""
echo "Проект обновлен локально. Для деплоя на Vercel:"
echo "1. Откройте https://vercel.com/dashboard"
echo "2. Найдите проект 'mini-app'"
echo "3. Нажмите 'Redeploy' или загрузите файлы вручную"
echo ""
echo "Или используйте Vercel CLI после авторизации:"
echo "vercel --prod"
