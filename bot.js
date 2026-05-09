const TelegramBot = require('node-telegram-bot-api');

// Токен бота @PodiumTaskBot
const token = process.env.TELEGRAM_BOT_TOKEN || '8325504889:YOUR_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

const MINI_APP_URL = 'https://mini-app-pi-ivory.vercel.app';

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'друг';

  bot.sendMessage(chatId, `👋 Привет, ${firstName}!\n\nДобро пожаловать в **StarMarket** — P2P маркетплейс игровых товаров!\n\n🎮 Покупай и продавай:\n• Игровую валюту\n• Редкие предметы\n• Прокачанные аккаунты\n• Скины и косметику\n\n💫 Оплата через Telegram Stars\n🔒 Безопасные сделки\n⚡ Моментальная доставка`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🛍️ Открыть магазин',
            web_app: { url: MINI_APP_URL }
          }
        ],
        [
          { text: '❓ Помощь', callback_data: 'help' },
          { text: '📊 Мои покупки', callback_data: 'orders' }
        ]
      ]
    }
  });
});

// Команда /shop
bot.onText(/\/shop/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, '🛍️ Открывайте магазин через кнопку ниже:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🛍️ Открыть StarMarket',
            web_app: { url: MINI_APP_URL }
          }
        ]
      ]
    }
  });
});

// Обработка callback кнопок
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'help') {
    bot.sendMessage(chatId, `📖 **Помощь**\n\n**Как купить товар:**\n1. Откройте магазин через кнопку\n2. Выберите категорию и товар\n3. Нажмите "Купить"\n4. Оплатите через Telegram Stars\n5. Получите товар моментально\n\n**Категории товаров:**\n• Валюта (золото, кристаллы, V-Bucks)\n• Предметы (оружие, экипировка)\n• Аккаунты (прокачанные)\n• Персонажи (редкие герои)\n• Косметика (скины)\n\n**Поддержка:** @support`, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🛍️ Открыть магазин',
              web_app: { url: MINI_APP_URL }
            }
          ]
        ]
      }
    });
  } else if (data === 'orders') {
    bot.sendMessage(chatId, '📊 **Мои покупки**\n\nУ вас пока нет покупок.\n\nПосле первой покупки здесь появится история заказов.', {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🛍️ Открыть магазин',
              web_app: { url: MINI_APP_URL }
            }
          ]
        ]
      }
    });
  }

  bot.answerCallbackQuery(query.id);
});

// Обработка текстовых сообщений
bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '👋 Используйте /start для открытия магазина или /shop для быстрого доступа.');
  }
});

console.log('🤖 StarMarket бот запущен!');
console.log('📱 Mini App URL:', MINI_APP_URL);
