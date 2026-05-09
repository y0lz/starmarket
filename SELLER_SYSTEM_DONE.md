# Система продавцов StarMarket — Реализовано ✅

## Что сделано

### 1. База данных
- ✅ Добавлены поля в таблицу `users`:
  - `nickname` — уникальный никнейм продавца
  - `bio` — описание профиля
  - `is_premium` — статус Premium
  - `premium_until` — дата окончания Premium
  - `active_products_count` — счетчик активных товаров
  - `total_sales` — общее количество продаж
  - `seller_rating` — рейтинг продавца

- ✅ Таблица `products` уже содержит:
  - `seller_id` — ID продавца
  - `is_active` — статус активности товара
  - `sales_count` — количество продаж

### 2. API Endpoints

#### `/api/profile` (GET, POST)
- **GET** — получить профиль пользователя с лимитами
- **POST** — создать/обновить профиль (nickname, bio)

#### `/api/seller` (GET, POST, PUT, DELETE)
- **GET** — получить все товары продавца
- **POST** — добавить новый товар (с проверкой лимитов)
- **PUT** — обновить товар
- **DELETE** — деактивировать товар

### 3. Лимиты товаров
- 🆓 **Free пользователи**: до 10 активных товаров одновременно
- ⭐ **Premium пользователи**: 999 активных товаров (практически неограниченно)

### 4. Страницы Mini App

#### `/profile.html` — Профиль продавца
- Статистика: активные товары, продажи, рейтинг
- Форма редактирования: nickname, bio
- Счетчики символов
- Валидация уникальности nickname

#### `/add-product.html` — Добавление товара
- Форма с полями:
  - Название (до 100 символов)
  - Описание (до 1000 символов)
  - Цена в Stars
  - Игра (выбор из списка)
  - Категория и подкатегория
  - Тип товара: штучный / мультитовар
  - Количество (для мультитоваров)
  - URL изображения (опционально)
- Проверка лимитов перед добавлением
- Превью изображения

#### `/my-products.html` — Управление товарами
- Статистика продавца
- Табы: Активные / Все / Неактивные
- Карточки товаров с информацией:
  - Изображение, название, цена
  - Игра, категория
  - Количество продаж
  - Статус (активен/неактивен)
- Действия:
  - Редактировать (в разработке)
  - Удалить (деактивировать)
  - Активировать (для неактивных)

### 5. Бот — новые команды
- 👤 **Профиль** — просмотр профиля продавца
- 📦 **Мои товары** — список товаров с управлением
- ➕ **Добавить товар** — открывает форму добавления

### 6. Роутинг
- `/?page=profile` → `/profile.html`
- `/?page=add-product` → `/add-product.html`
- `/?page=my-products` → `/my-products.html`

## Логика работы

### Регистрация продавца
1. Пользователь авторизуется через Telegram (автоматически при /start)
2. Для продажи товаров нужно настроить профиль:
   - Выбрать уникальный nickname
   - Заполнить описание (опционально)
3. После настройки профиля доступно добавление товаров

### Добавление товара
1. Проверка наличия nickname (если нет — редирект на профиль)
2. Проверка лимита товаров:
   - Free: 10 активных товаров
   - Premium: 999 активных товаров
3. Заполнение формы с валидацией
4. Создание товара в БД
5. Автоматическое увеличение счетчика `active_products_count`

### Управление товарами
- **Деактивация** — товар скрывается из каталога, счетчик уменьшается
- **Активация** — товар возвращается в каталог (если есть свободные слоты)
- **Редактирование** — изменение данных товара (в разработке)

## Что нужно сделать вручную

### ⚠️ Применить миграцию БД
Откройте Supabase Dashboard → SQL Editor и выполните SQL из файла `migration-seller-system.sql`:

```sql
-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_seller_active ON products(seller_id, is_active);
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);

-- Триггер для автоматического обновления счетчика
CREATE OR REPLACE FUNCTION update_active_products_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_active = true THEN
    UPDATE users SET active_products_count = active_products_count + 1 WHERE id = NEW.seller_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.is_active = false AND NEW.is_active = true THEN
      UPDATE users SET active_products_count = active_products_count + 1 WHERE id = NEW.seller_id;
    ELSIF OLD.is_active = true AND NEW.is_active = false THEN
      UPDATE users SET active_products_count = GREATEST(0, active_products_count - 1) WHERE id = NEW.seller_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.is_active = true THEN
    UPDATE users SET active_products_count = GREATEST(0, active_products_count - 1) WHERE id = OLD.seller_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_active_products ON products;
CREATE TRIGGER trigger_update_active_products
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION update_active_products_count();
```

## Тестирование

1. Откройте бота @PodiumTaskBot
2. Нажмите /start
3. Нажмите "👤 Профиль"
4. Настройте nickname и описание
5. Нажмите "📦 Добавить товар"
6. Заполните форму и добавьте товар
7. Проверьте "📦 Мои товары"

## Deployment

- ✅ Код задеплоен на Vercel: https://mini-app-pi-ivory.vercel.app
- ✅ Бот перезапущен с новыми командами (PID: 37508)
- ⚠️ Миграция БД требует ручного выполнения через Supabase Dashboard

## Следующие шаги (опционально)

1. Страница редактирования товара
2. Загрузка изображений (не только URL)
3. Система подписки Premium
4. Аналитика продавца (графики продаж)
5. Уведомления о новых заказах
6. Массовые операции с товарами
