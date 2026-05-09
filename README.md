# StarMarket - Telegram P2P Marketplace

Игровой маркетплейс с оплатой через Telegram Stars (XTR)

## 🚀 Возможности

### 📱 Mini App
- ✅ Категории и подкатегории товаров
- ✅ Поиск по названию, описанию, игре
- ✅ Сортировка (цена, название, популярность)
- ✅ Детальные карточки товаров
- ✅ Модальные окна с полным описанием
- ✅ Оплата через Telegram Stars

### 🤖 Telegram Bot
- Команда `/start` - приветствие и кнопка запуска магазина
- Команда `/shop` - быстрый доступ к магазину
- Кнопки помощи и истории покупок
- Web App интеграция

## 📦 Структура проекта

```
/root/mini-app/
├── index.html          # Mini App интерфейс
├── bot.js              # Telegram бот
├── package.json        # Зависимости
├── api/
│   ├── auth.js         # Авторизация через Telegram
│   ├── products.js     # API товаров (15 товаров)
│   ├── create-invoice.js  # Создание счетов Stars
│   └── webhook.js      # Обработка платежей
└── .env                # Конфигурация
```

## 🛠️ Установка и запуск

### 1. Установить зависимости
```bash
cd /root/mini-app
npm install
```

### 2. Настроить переменные окружения
Создайте файл `.env`:
```bash
TELEGRAM_BOT_TOKEN=8325504889:YOUR_ACTUAL_TOKEN
MINI_APP_URL=https://mini-app-pi-ivory.vercel.app
```

### 3. Запустить бота
```bash
npm start
```

Или в режиме разработки:
```bash
npm run dev
```

## 🌐 Деплой

### Vercel (Mini App)
```bash
vercel --prod
```

### Бот (VPS/Cloud)
Запустите бота на сервере с помощью PM2:
```bash
npm install -g pm2
pm2 start bot.js --name starmarket-bot
pm2 save
pm2 startup
```

## 📊 Товары

**15 товаров из 6 игр:**
- World of Warcraft (золото, оружие, аккаунты)
- Genshin Impact (кристаллы, персонажи, примогемы)
- Fortnite (V-Bucks, скины, Battle Pass)
- Roblox (робуксы, премиум)
- Mobile Legends (алмазы, скины)
- CS2 (скины оружия)

**Категории:**
- Валюта
- Предметы
- Аккаунты
- Персонажи
- Косметика
- Боевые пропуски

## 🔗 Ссылки

- **Bot:** @PodiumTaskBot (ID: 8325504889)
- **Mini App:** https://mini-app-pi-ivory.vercel.app
- **Vercel Project:** mini-app

## 📝 TODO

- [ ] Подключить реальную БД (PostgreSQL/MongoDB)
- [ ] Добавить систему продавцов
- [ ] Реализовать чат между покупателем и продавцом
- [ ] Добавить отзывы и рейтинги
- [ ] Интегрировать систему диспутов
- [ ] Добавить админ-панель
