import { createClient } from '@supabase/supabase-js';

// Supabase configuration - ONLY from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(request, response) {
  const { method } = request;

  try {
    if (method === 'POST') {
      // Добавить новый товар
      const { 
        userId, 
        title, 
        description, 
        price_stars, 
        game_id, 
        category_id, 
        subcategory, 
        image, 
        type, 
        stock 
      } = request.body;

      if (!userId || !title || !description || !price_stars || !game_id || !category_id || !type) {
        return response.status(400).json({ error: 'Missing required fields' });
      }

      // Валидация данных
      if (title.length < 3 || title.length > 100) {
        return response.status(400).json({ error: 'Title must be between 3 and 100 characters' });
      }

      if (description.length < 10 || description.length > 1000) {
        return response.status(400).json({ error: 'Description must be between 10 and 1000 characters' });
      }

      const priceNum = parseInt(price_stars);
      if (isNaN(priceNum) || priceNum < 1 || priceNum > 1000000) {
        return response.status(400).json({ error: 'Price must be between 1 and 1,000,000 stars' });
      }

      const gameIdNum = parseInt(game_id);
      const categoryIdNum = parseInt(category_id);
      if (isNaN(gameIdNum) || isNaN(categoryIdNum) || gameIdNum < 1 || categoryIdNum < 1) {
        return response.status(400).json({ error: 'Invalid game_id or category_id' });
      }

      if (!['single', 'multi'].includes(type)) {
        return response.status(400).json({ error: 'Type must be "single" or "multi"' });
      }

      const stockNum = parseInt(stock) || (type === 'single' ? 1 : 0);
      if (type === 'multi' && (isNaN(stockNum) || stockNum < 1 || stockNum > 10000)) {
        return response.status(400).json({ error: 'Stock must be between 1 and 10,000 for multi-type products' });
      }

      // Валидация URL изображения (если указан)
      if (image && image.length > 0) {
        try {
          const url = new URL(image);
          if (!['http:', 'https:'].includes(url.protocol)) {
            return response.status(400).json({ error: 'Image URL must use HTTP or HTTPS protocol' });
          }
          if (image.length > 500) {
            return response.status(400).json({ error: 'Image URL is too long (max 500 characters)' });
          }
        } catch (e) {
          return response.status(400).json({ error: 'Invalid image URL format' });
        }
      }

      // Проверяем пользователя и его лимиты
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, nickname, is_premium, active_products_count')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        return response.status(404).json({ error: 'User not found. Please set up your profile first.' });
      }

      if (!user.nickname) {
        return response.status(400).json({ error: 'Please set up your nickname in profile first' });
      }

      // Проверяем лимит товаров
      const maxProducts = user.is_premium ? 999 : 10;
      
      if (user.active_products_count >= maxProducts) {
        return response.status(403).json({ 
          error: 'Product limit reached',
          message: user.is_premium 
            ? 'You have reached the maximum number of products' 
            : 'Free users can have maximum 10 active products. Upgrade to Premium for unlimited products.',
          current: user.active_products_count,
          max: maxProducts,
          is_premium: user.is_premium
        });
      }

      // Создаем товар
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([{
          title: title.trim(),
          description: description.trim(),
          price_stars: priceNum,
          game_id: gameIdNum,
          category_id: categoryIdNum,
          subcategory: subcategory ? subcategory.trim().substring(0, 100) : '',
          image: image && image.trim().length > 0 
            ? image.trim() 
            : `https://via.placeholder.com/300x200/667eea/FFFFFF?text=${encodeURIComponent(title.substring(0, 20))}`,
          type,
          stock: stockNum,
          seller_id: userId,
          is_active: true,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (productError) {
        console.error('Create product error:', productError);
        return response.status(500).json({ error: 'Failed to create product' });
      }

      // Увеличиваем счетчик активных товаров
      await supabase
        .from('users')
        .update({ 
          active_products_count: user.active_products_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      return response.status(201).json({
        success: true,
        product: product,
        remaining_slots: maxProducts - (user.active_products_count + 1)
      });

    } else if (method === 'GET') {
      // Получить товары продавца
      const { userId } = request.query;

      if (!userId) {
        return response.status(400).json({ error: 'userId required' });
      }

      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          game:games(id, name, slug, icon),
          category:categories(id, name, slug, icon)
        `)
        .eq('seller_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get products error:', error);
        return response.status(500).json({ error: 'Failed to fetch products' });
      }

      return response.status(200).json({ products: products || [] });

    } else if (method === 'PUT') {
      // Обновить товар
      const { productId, userId, ...updateData } = request.body;

      if (!productId || !userId) {
        return response.status(400).json({ error: 'productId and userId required' });
      }

      // Проверяем, что товар принадлежит пользователю
      const { data: product, error: checkError } = await supabase
        .from('products')
        .select('seller_id')
        .eq('id', productId)
        .single();

      if (checkError || !product) {
        return response.status(404).json({ error: 'Product not found' });
      }

      if (product.seller_id !== parseInt(userId)) {
        return response.status(403).json({ error: 'You can only edit your own products' });
      }

      // Обновляем товар
      const { data: updated, error: updateError } = await supabase
        .from('products')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single();

      if (updateError) {
        console.error('Update product error:', updateError);
        return response.status(500).json({ error: 'Failed to update product' });
      }

      return response.status(200).json({ success: true, product: updated });

    } else if (method === 'DELETE') {
      // Удалить/деактивировать товар
      const { productId, userId } = request.body;

      if (!productId || !userId) {
        return response.status(400).json({ error: 'productId and userId required' });
      }

      // Проверяем владельца
      const { data: product, error: checkError } = await supabase
        .from('products')
        .select('seller_id, is_active')
        .eq('id', productId)
        .single();

      if (checkError || !product) {
        return response.status(404).json({ error: 'Product not found' });
      }

      if (product.seller_id !== parseInt(userId)) {
        return response.status(403).json({ error: 'You can only delete your own products' });
      }

      // Деактивируем товар (не удаляем физически)
      const { error: deleteError } = await supabase
        .from('products')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (deleteError) {
        console.error('Delete product error:', deleteError);
        return response.status(500).json({ error: 'Failed to delete product' });
      }

      // Уменьшаем счетчик активных товаров, если товар был активен
      if (product.is_active) {
        const { data: user } = await supabase
          .from('users')
          .select('active_products_count')
          .eq('id', userId)
          .single();

        if (user) {
          await supabase
            .from('users')
            .update({ 
              active_products_count: Math.max(0, user.active_products_count - 1),
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
        }
      }

      return response.status(200).json({ success: true });

    } else {
      return response.status(405).json({ error: 'Method not allowed' });
    }

  } catch (e) {
    console.error('Seller API error:', e);
    return response.status(500).json({ error: 'Internal server error' });
  }
}
