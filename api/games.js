// API для получения списка игр и категорий
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            // Получаем список игр
            const { data: games, error: gamesError } = await supabase
                .from('games')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (gamesError) throw gamesError;

            // Получаем список категорий
            const { data: categories, error: categoriesError } = await supabase
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (categoriesError) throw categoriesError;

            // Получаем количество товаров для каждой игры
            const { data: productCounts, error: countsError } = await supabase
                .from('products')
                .select('game_id')
                .eq('is_active', true);

            if (countsError) throw countsError;

            // Подсчитываем товары для каждой игры
            const gameCounts = {};
            productCounts.forEach(p => {
                gameCounts[p.game_id] = (gameCounts[p.game_id] || 0) + 1;
            });

            // Добавляем счетчики к играм
            const gamesWithCounts = games.map(game => ({
                ...game,
                product_count: gameCounts[game.id] || 0
            }));

            return res.status(200).json({
                ok: true,
                games: gamesWithCounts,
                categories: categories
            });

        } catch (error) {
            console.error('Games API error:', error);
            return res.status(500).json({
                ok: false,
                error: error.message
            });
        }
    }

    // POST - добавление новой игры (только для админов)
    if (req.method === 'POST') {
        try {
            const { name, icon, slug, is_active = true, sort_order = 999 } = req.body;

            if (!name || !slug) {
                return res.status(400).json({
                    ok: false,
                    error: 'Name and slug are required'
                });
            }

            const { data, error } = await supabase
                .from('games')
                .insert([{
                    name,
                    icon: icon || '🎮',
                    slug,
                    is_active,
                    sort_order
                }])
                .select()
                .single();

            if (error) throw error;

            return res.status(201).json({
                ok: true,
                game: data
            });

        } catch (error) {
            console.error('Add game error:', error);
            return res.status(500).json({
                ok: false,
                error: error.message
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
