-- Миграция для добавления таблиц игр и категорий

-- Таблица игр
CREATE TABLE IF NOT EXISTS games (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(10) DEFAULT '🎮',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 999,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица категорий
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(10) DEFAULT '📦',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 999,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Добавляем колонки в таблицу products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS game_id BIGINT REFERENCES games(id),
ADD COLUMN IF NOT EXISTS category_id BIGINT REFERENCES categories(id);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_games_active ON games(is_active);
CREATE INDEX IF NOT EXISTS idx_games_sort ON games(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_products_game ON products(game_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

-- Вставляем начальные игры
INSERT INTO games (name, slug, icon, sort_order) VALUES
('World of Warcraft', 'world-of-warcraft', '⚔️', 1),
('Genshin Impact', 'genshin-impact', '🌸', 2),
('Fortnite', 'fortnite', '🎯', 3),
('Roblox', 'roblox', '🎮', 4),
('Counter-Strike 2', 'counter-strike-2', '🔫', 5),
('Mobile Legends', 'mobile-legends', '🗡️', 6),
('Valorant', 'valorant', '💥', 7),
('League of Legends', 'league-of-legends', '⚡', 8),
('Dota 2', 'dota-2', '🛡️', 9),
('Minecraft', 'minecraft', '⛏️', 10),
('PUBG', 'pubg', '🎯', 11),
('Apex Legends', 'apex-legends', '🎮', 12),
('Call of Duty', 'call-of-duty', '🔫', 13),
('FIFA', 'fifa', '⚽', 14),
('GTA', 'gta', '🚗', 15),
('Overwatch', 'overwatch', '🎮', 16),
('Hearthstone', 'hearthstone', '🃏', 17),
('Clash of Clans', 'clash-of-clans', '🏰', 18),
('Brawl Stars', 'brawl-stars', '⭐', 19),
('Diablo 4', 'diablo-4', '😈', 20)
ON CONFLICT (slug) DO NOTHING;

-- Вставляем начальные категории
INSERT INTO categories (name, slug, icon, sort_order) VALUES
('Валюта', 'currency', '💰', 1),
('Предметы', 'items', '⚔️', 2),
('Аккаунты', 'accounts', '👤', 3),
('Персонажи', 'characters', '🦸', 4),
('Косметика', 'cosmetics', '✨', 5),
('Услуги', 'services', '🎯', 6),
('Оружие', 'weapons', '🗡️', 7),
('Броня', 'armor', '🛡️', 8),
('Ресурсы', 'resources', '💎', 9),
('Прокачка', 'leveling', '📈', 10),
('Буст', 'boost', '🚀', 11)
ON CONFLICT (slug) DO NOTHING;

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_games_updated_at ON games;
CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Миграция существующих данных (если есть старые поля game и category)
-- Это нужно выполнить после того, как таблицы созданы

-- Обновляем game_id на основе старого поля game
UPDATE products p
SET game_id = g.id
FROM games g
WHERE p.game = g.name
AND p.game_id IS NULL;

-- Обновляем category_id на основе старого поля category
UPDATE products p
SET category_id = c.id
FROM categories c
WHERE p.category = c.name
AND p.category_id IS NULL;

-- Комментарии к таблицам
COMMENT ON TABLE games IS 'Список доступных игр в маркетплейсе';
COMMENT ON TABLE categories IS 'Список категорий товаров';
COMMENT ON COLUMN games.slug IS 'URL-friendly идентификатор игры';
COMMENT ON COLUMN games.sort_order IS 'Порядок сортировки (меньше = выше)';
COMMENT ON COLUMN categories.slug IS 'URL-friendly идентификатор категории';
COMMENT ON COLUMN categories.sort_order IS 'Порядок сортировки (меньше = выше)';
