// /root/mini-app/api/webhook.js
// Обработка webhook от Telegram (команды, платежи)

const BOT_TOKEN = process.env.BOT_TOKEN || "8325504889:AAHry7Yi4FNjgd0WG_ANcJeeZQpBmwFZhr8";
const MINI_APP_URL = "https://mini-app-pi-ivory.vercel.app";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const update = req.body;
    console.log('Webhook received:', JSON.stringify(update));

    // --- ОБРАБОТКА СООБЩЕНИЙ ---
    if (update.message?.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text;
      
      console.log(`Received text: "${text}" from chat: ${chatId}`);

      if (text === '/start') {
        const keyboard = {
          inline_keyboard: [[
            { text: "🛒 Открыть StarMarket", web_app: { url: MINI_APP_URL } }
          ], [
            { text: "⭐ Купить звезды", url: "https://t.me/stars" }
          ]]
        };
        
        try {
          const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: "🎉 *Добро пожаловать в StarMarket!*\n\n🛍️ Здесь вы можете купить внутриигровые товары за Telegram Stars (XTR).\n\nНажмите кнопку ниже, чтобы открыть магазин:",
              parse_mode: "Markdown",
              reply_markup: keyboard
            })
          });
          const result = await resp.json();
          console.log('SendMessage result (start):', result);
        } catch(e) { 
          console.error('SendMessage error (start):', e); 
        }
        return res.status(200).json({ ok: true });
      }

      if (text === '/help') {
        try {
          const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: `📖 *Помощь по StarMarket*\n\n🛒 /start — Открыть магазин\n💳 Оплата через Telegram Stars\n🎮 Товары: Скины, валюта, подписки\n\n🌐 Web App: ${MINI_APP_URL}`,
              parse_mode: "Markdown"
            })
          });
          const result = await resp.json();
          console.log('SendMessage result (help):', result);
        } catch(e) { 
          console.error('SendMessage error (help):', e); 
        }
        return res.status(200).json({ ok: true });
      }
    }

    // --- ОБРАБОТКА ПЛАТЕЖЕЙ ---
    if (update.message?.successful_payment) {
      const payment = update.message.successful_payment;
      const chatId = update.message.chat.id;
      const payload = JSON.parse(payment.invoice_payload || '{}');
      
      console.log('✅ Payment received:', {
        chargeId: payment.telegram_payment_charge_id,
        providerId: payment.provider_payment_charge_id,
        totalAmount: payment.total_amount,
        payload: payload
      });

      return res.status(200).json({ ok: true, message: 'Payment processed' });
    }

    // Обработка pre_checkout_query
    if (update.pre_checkout_query) {
      const checkout = update.pre_checkout_query;
      console.log('Pre-checkout query:', checkout.id);
      
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pre_checkout_query_id: checkout.id,
          ok: true
        })
      });
      
      return res.status(200).json({ ok: true });
    }

    // Просто подтверждаем получение других обновлений
    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
