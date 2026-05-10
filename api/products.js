import { createClient } from '@supabase/supabase-js';

// Supabase configuration - ONLY from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(request, response) {
  try {
    // Получаем параметры фильтрации
    const { game_id, category_id, minPrice, maxPrice, sort, search } = request.query;
    
    // Базовый запрос с JOIN к играм и категориям
    let query = supabase
      .from('products')
      .select(`
        *,
        game:games(id, name, slug, icon),
        category:categories(id, name, slug, icon)
      `)
      .eq('is_active', true);
    
    // Фильтры
    if (game_id && game_id !== 'all') {
      query = query.eq('game_id', game_id);
    }
    
    if (category_id && category_id !== 'all') {
      query = query.eq('category_id', category_id);
    }
    
    if (minPrice) {
      const minPriceNum = parseInt(minPrice);
      if (!isNaN(minPriceNum)) {
        query = query.gte('price_stars', minPriceNum);
      }
    }
    
    if (maxPrice) {
      const maxPriceNum = parseInt(maxPrice);
      if (!isNaN(maxPriceNum)) {
        query = query.lte('price_stars', maxPriceNum);
      }
    }
    
    // Поиск
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    // Сортировка
    if (sort) {
      switch (sort) {
        case 'price_asc':
          query = query.order('price_stars', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price_stars', { ascending: false });
          break;
        case 'name':
          query = query.order('title', { ascending: true });
          break;
        case 'popular':
          query = query.order('sales_count', { ascending: false });
          break;
        case 'rating':
          query = query.order('seller_rating', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    // Выполняем запрос
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase error:', error);
      return response.status(503).json({ 
        error: 'Database temporarily unavailable',
        products: [] 
      });
    }
    
    response.status(200).json({ products: data || [] });
    
  } catch (e) {
    console.error('API error:', e);
    return response.status(500).json({ 
      error: 'Internal server error',
      products: [] 
    });
  }
}
