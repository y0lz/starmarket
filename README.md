# 🌟 StarMarket — P2P Маркетплейс игровых товаров

> Telegram Mini App для покупки и продажи игровых товаров с оплатой через Telegram Stars

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![Telegram Bot API](https://img.shields.io/badge/Telegram%20Bot%20API-7.0-blue)](https://core.telegram.org/bots/api)

## 📋 Содержание

- [Возможности](#-возможности)
- [Технологии](#-технологии)
- [Быстрый старт](#-быстрый-старт)
- [Установка](#-установка)
- [Конфигурация](#-конфигурация)
- [Деплой](#-деплой)
- [Структура проекта](#-структура-проекта)
- [Документация](#-документация)
- [Безопасность](#-безопасность)
- [Лицензия](#-лицензия)

## ✨ Возможности

### Для покупателей:
- 🎮 **Каталог игр** — 20+ популярных игр (WoW, Genshin Impact, Fortnite, CS2, и др.)
- 🔍 **Умный поиск** — поиск по названию и описанию
- 📊 **Фильтры** — по игре, категории, цене
- 💫 **Оплата через Telegram Stars** — быстро и безопасно
- ⭐ **Рейтинг продавцов** — проверенные продавцы

### Для продавцов:
- ➕ **Добавление товаров** — простая форма с валидацией
- 📦 **Управление товарами** — редактирование, удаление
- 💰 **Лимиты** — Free: 10 товаров, Premium: неограниченно
- 📈 **Статистика** — продажи, рейтинг, отзывы
- 👤 **Профиль продавца** — настройка никнейма, био, контактов

### Система:
- 🗄️ **Backend-driven** — игры и категории из базы данных
- 🔒 **Безопасность** — валидация данных, защита от SQL injection
- 🚀 **Производительность** — оптимизированные запросы с JOIN
- 📱 **Адаптивный дизайн** — работает на всех устройствах

## 🛠 Технологии

### Frontend:
- HTML5, CSS3, JavaScript (ES6+)
- Telegram Web App API
- Responsive Design

### Backend:
- Node.js 16+
- Vercel Serverless Functions
- Supabase (PostgreSQL)
- node-telegram-bot-api

### База данных:
- PostgreSQL (через Supabase)
- Row Level Security (RLS)
- Foreign Keys & Indexes
- Triggers & Functions

## 🚀 Быстрый старт

### Предварительные требования:
- Node.js 16+ и npm
- Telegram Bot Token (от @BotFather)
- Supabase аккаунт
- Vercel аккаунт (для деплоя)

### Установка за 5 минут:

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/yourusername/starmarket.git
cd starmarket

# 2. Установите зависимости
npm install

# 3. Создайте .env файл
cp .env.example .env

# 4. Заполните .env своими данными
# TELEGRAM_BOT_TOKEN=ваш_токен
# SUPABASE_URL=ваш_url
# SUPABASE_ANON_KEY=ваш_ключ
# MINI_APP_URL=https://ваш-домен.vercel.app

# 5. Запустите миграцию базы данных
# Откройте Supabase SQL Editor и выполните:
# - supabase-schema.sql
# - migration-seller-system.sql
# - migration-games-categories.sql

# 6. Запустите бота
npm start
```

## 📦 Установка

### 1. Получите Telegram Bot Token

```bash
# Откройте Telegram и найдите @BotFather
# Отправьте команду:
/newbot

# Следуйте инструкциям и получите токен
# Формат: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

### 2. Создайте Supabase проект

1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Скопируйте Project URL и anon public key
4. Выполните SQL миграции (см. раздел [Миграции](#миграции))

### 3. Настройте переменные окружения

Создайте файл `.env` в корне проекта:

```env
TELEGRAM_BOT_TOKEN=ваш_токен_бота
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=ваш_anon_ключ
MINI_APP_URL=https://ваш-домен.vercel.app
```

⚠️ **ВАЖНО:** Никогда не коммитьте файл `.env` в Git!

## ⚙️ Конфигурация

### Миграции базы данных

Выполните SQL файлы в Supabase SQL Editor в следующем порядке:

1. **supabase-schema.sql** — основная схема (users, products)
2. **migration-seller-system.sql** — система продавцов
3. **migration-games-categories.sql** — игры и категории

```sql
-- Проверьте, что таблицы созданы:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Должны быть: users, products, games, categories
```

### Настройка Telegram Bot

```bash
# Установите webhook (для production)
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook" \
  -d "url=https://ваш-домен.vercel.app/api/webhook"

# Или используйте polling (для development)
npm start
```

## 🚀 Деплой

### Vercel (рекомендуется)

1. **Установите Vercel CLI:**
```bash
npm install -g vercel
```

2. **Залогиньтесь:**
```bash
vercel login
```

3. **Деплой:**
```bash
vercel --prod
```

4. **Настройте переменные окружения в Vercel Dashboard:**
   - Settings → Environment Variables
   - Добавьте все переменные из `.env`

### Альтернативные платформы:

- **Heroku** — см. `deploy.sh`
- **Railway** — поддерживается
- **Render** — поддерживается

## 📁 Структура проекта

```
starmarket/
├── api/                          # Serverless функции
│   ├── auth.js                   # Аутентификация Telegram
│   ├── games.js                  # Игры и категории
│   ├── products.js               # Товары (с JOIN)
│   ├── seller.js                 # Управление товарами
│   ├── profile.js                # Профили пользователей
│   └── webhook.js                # Telegram webhook
├── css/                          # Стили
│   ├── main.css                  # Главная страница
│   ├── add-product.css           # Форма добавления
│   ├── my-products.css           # Мои товары
│   └── profile.css               # Профиль
├── bot.js                        # Telegram бот
├── index.html                    # Главная страница (каталог игр)
├── add-product.html              # Добавление товара
├── my-products.html              # Управление товарами
├── profile.html                  # Профиль пользователя
├── supabase-schema.sql           # Основная схема БД
├── migration-seller-system.sql   # Миграция продавцов
├── migration-games-categories.sql # Миграция игр/категорий
├── package.json                  # Зависимости
├── .env.example                  # Пример конфигурации
└── README.md                     # Этот файл
```

## 📚 Документация

### Основная документация:
- **[FEATURES.md](FEATURES.md)** — Полный список возможностей
- **[STRUCTURE.md](STRUCTURE.md)** — Архитектура проекта
- **[NAVIGATION.md](NAVIGATION.md)** — Навигация и роутинг

### Backend-driven система:
- **[BACKEND_DRIVEN_SYSTEM.md](BACKEND_DRIVEN_SYSTEM.md)** — Архитектура системы
- **[UPDATE_BACKEND_DRIVEN.md](UPDATE_BACKEND_DRIVEN.md)** — Changelog
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** — Быстрый справочник

### Безопасность:
- **[SECURITY_FIXES.md](SECURITY_FIXES.md)** — Исправления безопасности
- **[SETUP_AFTER_SECURITY_FIX.md](SETUP_AFTER_SECURITY_FIX.md)** — Настройка после обновления

### Миграции:
- **[MIGRATION_INSTRUCTIONS.md](MIGRATION_INSTRUCTIONS.md)** — Инструкции по миграции
- **[SELLER_SYSTEM_DONE.md](SELLER_SYSTEM_DONE.md)** — Система продавцов

### Тестирование:
- **[TESTING.md](TESTING.md)** — Руководство по тестированию
- **[QUICK_START.md](QUICK_START.md)** — Быстрый старт

## 🔒 Безопасность

### Реализованные меры безопасности:

✅ **Защита данных:**
- Все секреты в переменных окружения
- Нет захардкоженных токенов в коде
- .env в .gitignore

✅ **Валидация данных:**
- Проверка длины строк (3-100, 10-1000 символов)
- Проверка диапазона цен (1-1,000,000 stars)
- Валидация URL изображений
- Проверка типов данных

✅ **Защита от атак:**
- Параметризованные запросы (защита от SQL injection)
- Валидация game_id и category_id
- Проверка прав доступа (пользователь может редактировать только свои товары)
- Правильная обработка ошибок (не раскрываем внутреннюю структуру)

### Что еще нужно добавить:

⚠️ **Высокий приоритет:**
- Rate limiting (защита от спама)
- Аутентификация через Telegram initData
- CORS настройка (не `*`)
- Логирование и мониторинг

⚠️ **Средний приоритет:**
- Система отзывов и рейтингов
- Модерация товаров
- Система споров
- Уведомления о покупках

### Сообщить о проблеме безопасности:

Если вы нашли уязвимость, пожалуйста, **НЕ создавайте публичный issue**. Напишите напрямую: [security@example.com]

## 🤝 Вклад в проект

Мы приветствуем вклад в проект! Вот как вы можете помочь:

1. Fork репозитория
2. Создайте ветку для вашей фичи (`git checkout -b feature/AmazingFeature`)
3. Закоммитьте изменения (`git commit -m 'Add some AmazingFeature'`)
4. Запушьте в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

### Правила:
- Следуйте существующему стилю кода
- Добавляйте комментарии к сложной логике
- Обновляйте документацию при необходимости
- Тестируйте изменения перед PR

## 📝 Changelog

### v2.0.0 (2024-01) - Backend-Driven System
- ✅ Игры и категории из базы данных
- ✅ Foreign keys (game_id, category_id)
- ✅ Оптимизированные запросы с JOIN
- ✅ 20 предустановленных игр
- ✅ 11 предустановленных категорий

### v1.5.0 (2024-01) - Security Fixes
- ✅ Удалены захардкоженные секреты
- ✅ Добавлена валидация данных
- ✅ Улучшена обработка ошибок
- ✅ Обновлена документация

### v1.0.0 (2024-01) - Initial Release
- ✅ Базовый функционал маркетплейса
- ✅ Telegram Mini App
- ✅ Оплата через Stars
- ✅ Система продавцов

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🙏 Благодарности

- [Telegram](https://telegram.org/) за Bot API и Mini Apps
- [Supabase](https://supabase.com/) за отличную БД
- [Vercel](https://vercel.com/) за хостинг
- Всем контрибьюторам проекта

## 📞 Контакты

- Telegram: [@yourusername](https://t.me/yourusername)
- GitHub: [@yourusername](https://github.com/yourusername)

---

Сделано с ❤️ для игрового сообщества
