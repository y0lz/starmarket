# 📤 Инструкция по загрузке на GitHub

## Быстрый способ (через bat файл)

1. Откройте папку проекта в Проводнике
2. Найдите файл `git-push.bat`
3. Дважды кликните по нему
4. Готово! Все изменения загружены на GitHub

## Ручной способ (через командную строку)

### Вариант 1: Через CMD

```cmd
cd /d "c:\Users\mainz\OneDrive\Рабочий стол\starptod\starmarket"
git add .
git commit -m "Security fixes and documentation update - v2.0.0"
git push origin main
```

### Вариант 2: Через Git Bash

```bash
cd "/c/Users/mainz/OneDrive/Рабочий стол/starptod/starmarket"
git add .
git commit -m "Security fixes and documentation update - v2.0.0"
git push origin main
```

### Вариант 3: Через VS Code

1. Откройте папку проекта в VS Code
2. Перейдите в раздел Source Control (Ctrl+Shift+G)
3. Нажмите "+" рядом с "Changes" (добавить все файлы)
4. Введите commit message: "Security fixes and documentation update - v2.0.0"
5. Нажмите ✓ (Commit)
6. Нажмите "..." → Push

## 📋 Что будет загружено

### Измененные файлы:
- ✅ `bot.js` - Удален токен бота
- ✅ `api/products.js` - Удалены Supabase ключи
- ✅ `api/seller.js` - Удалены ключи + валидация
- ✅ `api/profile.js` - Удалены ключи
- ✅ `.env.example` - Обновлен
- ✅ `README.md` - Полностью переписан
- ✅ `index.html` - Backend-driven система
- ✅ `add-product.html` - Backend-driven система

### Новые файлы:
- ✅ `SECURITY_FIXES.md` - Описание исправлений
- ✅ `SETUP_AFTER_SECURITY_FIX.md` - Инструкция по настройке
- ✅ `BACKEND_DRIVEN_SYSTEM.md` - Архитектура
- ✅ `UPDATE_BACKEND_DRIVEN.md` - Changelog
- ✅ `QUICK_REFERENCE.md` - Быстрый справочник
- ✅ `GIT_PUSH_INSTRUCTIONS.md` - Этот файл
- ✅ `git-push.bat` - Скрипт для пуша

## ⚠️ Важно перед пушем

### Проверьте .gitignore

Убедитесь, что `.env` файл НЕ будет загружен:

```bash
# Проверьте содержимое .gitignore
type .gitignore

# Должно быть:
# .env
# .env.local
# node_modules/
```

### Проверьте, что нет секретов

```bash
# Проверьте, что .env не в списке файлов для коммита
git status

# Если видите .env в списке - ОСТАНОВИТЕСЬ!
# Добавьте его в .gitignore:
echo .env >> .gitignore
git add .gitignore
```

## 🔍 Проверка после пуша

1. Откройте GitHub репозиторий в браузере
2. Проверьте, что все файлы загружены
3. Откройте `bot.js` - токена там быть НЕ должно
4. Откройте `api/products.js` - ключей там быть НЕ должно
5. Проверьте, что `.env` файла НЕТ в репозитории

## ❌ Если случайно загрузили секреты

### Немедленно:

1. **Удалите файл из истории:**
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

2. **Замените все скомпрометированные ключи:**
   - Telegram Bot Token (через @BotFather)
   - Supabase Keys (через Supabase Dashboard)

3. **Обновите переменные в Vercel**

## 📊 Commit Message Guidelines

Используйте понятные commit messages:

```bash
# Хорошо:
git commit -m "Security fixes: remove hardcoded secrets"
git commit -m "Add backend-driven games system"
git commit -m "Update documentation"

# Плохо:
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

## 🎯 Следующие шаги после пуша

1. ✅ Проверьте GitHub - все файлы загружены
2. ✅ Замените скомпрометированные ключи (см. SETUP_AFTER_SECURITY_FIX.md)
3. ✅ Настройте переменные в Vercel
4. ✅ Передеплойте проект
5. ✅ Протестируйте бота и Mini App

## 🆘 Проблемы

### "fatal: not a git repository"
**Решение:** Инициализируйте git:
```bash
git init
git remote add origin https://github.com/yourusername/starmarket.git
```

### "Permission denied (publickey)"
**Решение:** Настройте SSH ключ или используйте HTTPS:
```bash
git remote set-url origin https://github.com/yourusername/starmarket.git
```

### "Updates were rejected"
**Решение:** Сначала получите изменения:
```bash
git pull origin main --rebase
git push origin main
```

## ✅ Готово!

После успешного пуша:
- ✅ Все изменения на GitHub
- ✅ Секреты удалены из кода
- ✅ Документация обновлена
- ✅ Проект готов к использованию

Следующий шаг: Прочитайте `SETUP_AFTER_SECURITY_FIX.md` для настройки проекта.
