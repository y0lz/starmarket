const TelegramBot = require('node-telegram-bot-api');

// Токен бота @PodiumTaskBot
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set in environment variables!');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Vercel deployment URL
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://mini-app-pi-ivory.vercel.app';

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
          { text: '🏠 Мой кабинет', web_app: { url: `${MINI_APP_URL}/profile.html` } },
          { text: '📦 Мои товары', callback_data: 'my_products' }
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
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const userId = query.from.id;

  if (data === 'profile') {
    try {
      const response = await fetch(`${MINI_APP_URL}/api/profile?userId=${userId}`);
      const result = await response.json();

      if (response.ok && result.user) {
        const user = result.user;
        const premiumStatus = user.is_premium ? '⭐ Premium' : '🆓 Free';
        const nickname = user.nickname || 'Не установлен';
        
        bot.sendMessage(chatId, `👤 **Ваш профиль**\n\n**Никнейм:** ${nickname}\n**Статус:** ${premiumStatus}\n**Активных товаров:** ${user.active_products_count}/${user.max_products}\n**Всего продаж:** ${user.total_sales}\n**Рейтинг продавца:** ${user.seller_rating || 'Нет оценок'}\n\n${user.bio || 'Описание не заполнено'}`, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '✏️ Редактировать профиль',
                  web_app: { url: `${MINI_APP_URL}?page=profile` }
                }
              ],
              [
                { text: '📦 Добавить товар', callback_data: 'add_product' }
              ]
            ]
          }
        });
      } else {
        bot.sendMessage(chatId, `👤 **Настройте профиль**\n\nЧтобы продавать товары, нужно настроить профиль и выбрать никнейм.`, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '✏️ Настроить профиль',
                  web_app: { url: `${MINI_APP_URL}?page=profile` }
                }
              ]
            ]
          }
        });
      }
    } catch (e) {
      console.error('Profile fetch error:', e);
      bot.sendMessage(chatId, '❌ Ошибка загрузки профиля. Попробуйте позже.');
    }
  } else if (data === 'my_products') {
    try {
      const response = await fetch(`${MINI_APP_URL}/api/seller?userId=${userId}`);
      const result = await response.json();

      if (response.ok && result.products) {
        const products = result.products.filter(p => p.is_active);
        
        if (products.length === 0) {
          bot.sendMessage(chatId, `📦 **Мои товары**\n\nУ вас пока нет активных товаров.\n\nДобавьте свой первый товар и начните продавать!`, {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '➕ Добавить товар',
                    web_app: { url: `${MINI_APP_URL}?page=add-product` }
                  }
                ]
              ]
            }
          });
        } else {
          const productList = products.slice(0, 5).map(p => 
            `• **${p.title}** - ⭐${p.price_stars} (продано: ${p.sales_count || 0})`
          ).join('\n');
          
          bot.sendMessage(chatId, `📦 **Мои товары** (${products.length})\n\n${productList}\n\n${products.length > 5 ? '...и еще ' + (products.length - 5) + ' товаров' : ''}`, {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '📋 Управление товарами',
                    web_app: { url: `${MINI_APP_URL}?page=my-products` }
                  }
                ],
                [
                  {
                    text: '➕ Добавить товар',
                    web_app: { url: `${MINI_APP_URL}?page=add-product` }
                  }
                ]
              ]
            }
          });
        }
      }
    } catch (e) {
      console.error('Products fetch error:', e);
      bot.sendMessage(chatId, '❌ Ошибка загрузки товаров. Попробуйте позже.');
    }
  } else if (data === 'add_product') {
    bot.sendMessage(chatId, `➕ **Добавить товар**\n\nОткройте форму добавления товара через кнопку ниже.\n\n**Бесплатно:** до 10 активных товаров\n**Premium:** неограниченно`, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '➕ Добавить товар',
              web_app: { url: `${MINI_APP_URL}?page=add-product` }
            }
          ]
        ]
      }
    });
  } else if (data === 'help') {
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
