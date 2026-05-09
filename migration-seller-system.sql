-- Добавляем индексы для оптимизации запросов продавцов
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_seller_active ON products(seller_id, is_active);
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);

-- Триггер для автоматического обновления счетчика активных товаров
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
