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
    if (method === 'GET') {
      // Получить профиль пользователя
      const { userId } = request.query;
      
      if (!userId) {
        return response.status(400).json({ error: 'userId required' });
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Get profile error:', error);
        return response.status(404).json({ error: 'User not found' });
      }

      // Проверяем лимит товаров
      const maxProducts = user.is_premium ? 999 : 10;
      const canAddProduct = user.active_products_count < maxProducts;

      return response.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          nickname: user.nickname,
          bio: user.bio,
          is_premium: user.is_premium,
          premium_until: user.premium_until,
          active_products_count: user.active_products_count,
          total_sales: user.total_sales,
          seller_rating: user.seller_rating,
          max_products: maxProducts,
          can_add_product: canAddProduct
        }
      });

    } else if (method === 'POST') {
      // Обновить профиль
      const { userId, nickname, bio } = request.body;

      if (!userId) {
        return response.status(400).json({ error: 'userId required' });
      }

      // Проверяем, существует ли пользователь
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      let result;

      if (!existingUser) {
        // Создаем нового пользователя
        const { data, error } = await supabase
          .from('users')
          .insert([{
            id: userId,
            nickname: nickname,
            bio: bio,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) {
          console.error('Create user error:', error);
          
          // Проверяем, не занят ли nickname
          if (error.code === '23505') {
            return response.status(400).json({ error: 'Nickname already taken' });
          }
          
          return response.status(500).json({ error: 'Failed to create user' });
        }

        result = data;
      } else {
        // Обновляем существующего
        const updateData = {};
        if (nickname !== undefined) updateData.nickname = nickname;
        if (bio !== undefined) updateData.bio = bio;
        updateData.updated_at = new Date().toISOString();

        const { data, error } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', userId)
          .select()
          .single();

        if (error) {
          console.error('Update user error:', error);
          
          if (error.code === '23505') {
            return response.status(400).json({ error: 'Nickname already taken' });
          }
          
          return response.status(500).json({ error: 'Failed to update user' });
        }

        result = data;
      }

      return response.status(200).json({
        success: true,
        user: {
          id: result.id,
          nickname: result.nickname,
          bio: result.bio,
          is_premium: result.is_premium,
          active_products_count: result.active_products_count
        }
      });

    } else {
      return response.status(405).json({ error: 'Method not allowed' });
    }

  } catch (e) {
    console.error('Profile API error:', e);
    return response.status(500).json({ error: 'Internal server error' });
  }
}
