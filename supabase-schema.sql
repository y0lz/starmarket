-- StarMarket Database Schema for Supabase

-- Таблица пользователей
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица товаров
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_stars INTEGER NOT NULL,
  game TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  image TEXT,
  type TEXT NOT NULL CHECK (type IN ('single', 'multi')),
  stock INTEGER DEFAULT 0,
  seller_id BIGINT REFERENCES users(id),
  seller_rating DECIMAL(3,2) DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица заказов
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  buyer_id BIGINT REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  amount INTEGER NOT NULL,
  price_stars INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'completed', 'cancelled', 'disputed')),
  telegram_payment_charge_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица отзывов
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  buyer_id BIGINT REFERENCES users(id),
  seller_id BIGINT REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX idx_products_game ON products(game);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_subcategory ON products(subcategory);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_reviews_product ON reviews(product_id);

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для автообновления updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Вставка тестовых товаров
INSERT INTO products (title, description, price_stars, game, category, subcategory, image, type, stock, seller_rating, sales_count) VALUES
('Золото 1000 шт', 'Игровое золото для быстрого старта. Доставка моментальная после оплаты. Передача через внутриигровую почту. Безопасная сделка с гарантией.', 150, 'World of Warcraft', 'Валюта', 'Золото', 'https://via.placeholder.com/300x200/FFD700/000000?text=Gold', 'multi', 50, 4.9, 234),
('Легендарный меч', 'Уникальный меч с уроном 500-750. Редкий дроп из рейда Ulduar. Только один экземпляр в наличии. Передача через внутриигровую почту после оплаты.', 500, 'World of Warcraft', 'Предметы', 'Оружие', 'https://via.placeholder.com/300x200/8B0000/FFD700?text=Sword', 'single', 1, 5.0, 12),
('Аккаунт 80 lvl', 'Прокачанный аккаунт с максимальным уровнем. Полный набор эпической экипировки T10. Все профессии прокачаны до максимума. Репутация с основными фракциями на Exalted. Включает 5000 золота и редкие маунты.', 2000, 'World of Warcraft', 'Аккаунты', 'Прокачанные', 'https://via.placeholder.com/300x200/4169E1/FFFFFF?text=Account', 'single', 1, 4.8, 8),
('Кристаллы 5000 шт', 'Премиум валюта для покупки эксклюзивных предметов в магазине. Моментальная доставка на аккаунт в течение 5 минут. Безопасная сделка через официальный API.', 300, 'Genshin Impact', 'Валюта', 'Кристаллы', 'https://via.placeholder.com/300x200/9370DB/FFFFFF?text=Crystals', 'multi', 100, 4.9, 456),
('5★ персонаж', 'Случайный 5-звездочный персонаж из текущего баннера. Гарантированный дроп в течение 90 молитв. Передача через привязку аккаунта. Полная безопасность сделки.', 1500, 'Genshin Impact', 'Персонажи', '5 звезд', 'https://via.placeholder.com/300x200/FF69B4/FFFFFF?text=5★+Hero', 'single', 3, 4.7, 23),
('Примогемы 3000 шт', 'Игровая валюта для молитв и получения персонажей. Быстрая доставка в течение 5 минут после оплаты. Безопасная передача через официальный метод.', 250, 'Genshin Impact', 'Валюта', 'Примогемы', 'https://via.placeholder.com/300x200/00CED1/FFFFFF?text=Primogems', 'multi', 75, 4.8, 189),
('V-Bucks 13500', 'Премиум валюта Fortnite. Подходит для покупки Battle Pass и скинов в магазине. Код активации отправляется сразу после оплаты. Работает на всех платформах.', 800, 'Fortnite', 'Валюта', 'V-Bucks', 'https://via.placeholder.com/300x200/7B68EE/FFFFFF?text=V-Bucks', 'multi', 30, 4.9, 312),
('Редкий скин Renegade Raider', 'Эксклюзивный скин из первого сезона Fortnite. Больше не доступен в магазине. Уникальная возможность получить легендарный скин. Передача через аккаунт Epic Games.', 1200, 'Fortnite', 'Косметика', 'Скины', 'https://via.placeholder.com/300x200/FF4500/FFFFFF?text=Rare+Skin', 'single', 1, 5.0, 5),
('Battle Pass Season 5', 'Боевой пропуск текущего сезона Fortnite. Включает доступ ко всем наградам сезона. Автоматическая активация на вашем аккаунте Epic Games.', 950, 'Fortnite', 'Боевые пропуски', 'Сезонные', 'https://via.placeholder.com/300x200/32CD32/FFFFFF?text=Battle+Pass', 'single', 20, 4.8, 145),
('Робуксы 10000', 'Игровая валюта Roblox. Можно потратить на игры, предметы и апгрейды. Доставка кодом активации в течение 5 минут. Работает на всех платформах.', 600, 'Roblox', 'Валюта', 'Робуксы', 'https://via.placeholder.com/300x200/E60012/FFFFFF?text=Robux', 'multi', 40, 4.7, 267),
('Премиум аккаунт 6 месяцев', 'Аккаунт с активной подпиской Roblox Premium на 6 месяцев. Доступ ко всем преимуществам Premium. Ежемесячная выплата Robux. Скидки в магазине.', 900, 'Roblox', 'Аккаунты', 'Премиум', 'https://via.placeholder.com/300x200/FFD700/000000?text=Premium', 'single', 2, 4.9, 34),
('Алмазы 5000 шт', 'Премиум валюта для покупки героев и скинов в Mobile Legends. Моментальная доставка после оплаты. Безопасная передача через официальный метод.', 400, 'Mobile Legends', 'Валюта', 'Алмазы', 'https://via.placeholder.com/300x200/00BFFF/FFFFFF?text=Diamonds', 'multi', 60, 4.8, 178),
('Эпический скин героя', 'Редкий скин с уникальными эффектами и анимацией. Доступен только через событие. Передача через привязку аккаунта. Включает эксклюзивные эффекты умений.', 700, 'Mobile Legends', 'Косметика', 'Скины героев', 'https://via.placeholder.com/300x200/FF1493/FFFFFF?text=Epic+Skin', 'single', 5, 4.9, 67),
('AK-47 Redline FT', 'Популярный скин AK-47 в состоянии Field-Tested. Чистый вид без царапин. Мгновенная передача через Steam трейд. Безопасная сделка с гарантией.', 450, 'CS2', 'Оружие', 'Автоматы', 'https://via.placeholder.com/300x200/DC143C/FFFFFF?text=AK-47', 'single', 3, 5.0, 89),
('AWP Dragon Lore MW', 'Легендарный скин AWP Dragon Lore в состоянии Minimal Wear. Один из самых редких скинов в игре. Сертифицирован StatTrak™. Передача через Steam трейд.', 5000, 'CS2', 'Оружие', 'Снайперские винтовки', 'https://via.placeholder.com/300x200/FFD700/8B0000?text=Dragon+Lore', 'single', 1, 5.0, 3);
