// /root/mini-app/api/auth.js
// Валидация Telegram initData (правильная реализация)

import crypto from 'crypto';

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { initData } = req.body;
    
    if (!initData) {
      return res.status(400).json({ ok: false, error: 'initData is missing' });
    }

    const botToken = process.env.BOT_TOKEN || "8325504889:AAHry7Yi4FNjgd0WG_ANcJeeZQpBmwFZhr8";
    
    // Парсим строку initData (формат key=value&key=value)
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    
    if (!hash) {
      return res.status(400).json({ ok: false, error: 'Hash is missing in initData' });
    }
    
    params.delete('hash');

    // Сортируем параметры
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Создаем секретный ключ
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    
    // Вычисляем хэш
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    console.log('Auth check:', {
      receivedHash: hash?.substring(0, 10) + '...',
      calculatedHash: calculatedHash?.substring(0, 10) + '...',
      dataCheckString: dataCheckString?.substring(0, 50) + '...'
    });

    if (calculatedHash === hash) {
      // Данные валидны, получаем user
      const userStr = params.get('user');
      let user = {};
      
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          return res.status(400).json({ ok: false, error: 'Invalid user JSON' });
        }
      }
      
      return res.status(200).json({ 
        ok: true, 
        user: { 
          id: user.id, 
          username: user.username, 
          first_name: user.first_name,
          photo_url: user.photo_url
        } 
      });
    } else {
      console.error('Hash mismatch!');
      return res.status(403).json({ ok: false, error: 'Invalid signature' });
    }

  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ ok: false, error: 'Internal server error: ' + error.message });
  }
}
