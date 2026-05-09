// /root/mini-app/api/create-invoice.js
// Создание инвойса для оплаты через Telegram Stars (XTR)

import fetch from 'node-fetch';

const BOT_TOKEN = process.env.BOT_TOKEN || "8325504889:AAHry7Yi4FNjgd0WG_ANcJeeZQpBmwFZhr8";
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, description, amount, userId, productId } = req.body;

    if (!title || !amount || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Создаем инвойс через Telegram Bot API
    const payload = {
      title: title.substring(0, 32), // Telegram лимит 32 символа
      description: description.substring(0, 255), // Лимит 255 символов
      payload: JSON.stringify({ 
        userId: userId.toString(), 
        productId: productId,
        type: 'marketplace_purchase' 
      }), // Уникальная строка для идентификации платежа
      provider_token: '', // Пустой для XTR (Telegram Stars)
      currency: 'XTR', // Валюта Telegram Stars
      prices: [{
        label: title,
        amount: amount // Сумма в звездах (XTR)
      }]
    };

    const response = await fetch(`${API_URL}/createInvoiceLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.ok) {
      // Сохраняем информацию о счете в БД (пока в памяти/файл)
      console.log('Invoice created:', data.result);
      
      return res.status(200).json({
        ok: true,
        invoiceLink: data.result,
        message: 'Инвойс создан. Переходите по ссылке для оплаты.'
      });
    } else {
      console.error('Telegram API error:', data);
      return res.status(500).json({ 
        error: 'Ошибка создания инвойса', 
        details: data.description 
      });
    }

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
