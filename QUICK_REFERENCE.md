# Quick Reference: Backend-Driven System

## 🎯 What Changed?

### Before
- Games and categories were **dynamically generated** from products
- Users could create **any category** they wanted
- Data was **inconsistent** across the platform

### After
- Games and categories come from **database tables**
- Users **select from predefined options**
- Data is **centralized and consistent**

## 📊 Database Tables

### `games`
```sql
id, name, slug, icon, is_active, sort_order
```
**Example:** `1, "World of Warcraft", "world-of-warcraft", "⚔️", true, 1`

### `categories`
```sql
id, name, slug, icon, is_active, sort_order
```
**Example:** `1, "Валюта", "currency", "💰", true, 1`

### `products` (updated)
```sql
-- New columns:
game_id → references games(id)
category_id → references categories(id)
```

## 🔌 API Changes

### `/api/games` (NEW)
**GET** - Returns all active games and categories
```json
{
  "ok": true,
  "games": [...],
  "categories": [...]
}
```

### `/api/products` (UPDATED)
**GET** - Now includes joined game and category data
```json
{
  "products": [
    {
      "id": 1,
      "game_id": 1,
      "category_id": 1,
      "game": { "name": "World of Warcraft", "icon": "⚔️" },
      "category": { "name": "Валюта", "icon": "💰" }
    }
  ]
}
```

### `/api/seller` (UPDATED)
**POST** - Now accepts `game_id` and `category_id` instead of strings
```javascript
// OLD
{ game: "World of Warcraft", category: "Валюта" }

// NEW
{ game_id: 1, category_id: 1 }
```

## 💻 Frontend Changes

### `index.html`
```javascript
// OLD - Dynamic generation
buildGamesAndCategories(); // Removed
normalizeGameId(gameName); // Removed

// NEW - Backend-driven
await fetch('/api/games'); // Load from backend
game.id // Use numeric IDs
product.game.name // Use joined data
```

### `add-product.html`
```javascript
// OLD - Hardcoded options
<option value="World of Warcraft">World of Warcraft</option>

// NEW - Dynamic from backend
loadGamesAndCategories(); // Populates dropdowns
game_id: parseInt(gameSelect.value) // Submit numeric ID
```

## 🚀 Quick Start

### 1. Run Migration
```sql
-- Execute migration-games-categories.sql in Supabase
```

### 2. Deploy Files
```bash
# Deploy updated files:
- index.html
- add-product.html
- api/seller.js
```

### 3. Test
```
1. Open homepage → Games should load from backend
2. Click game → Categories should appear
3. Open add-product → Dropdowns should populate
4. Create product → Should save with game_id/category_id
```

## 🔍 Troubleshooting

### Games not loading?
- Check `/api/games` endpoint is deployed
- Verify `games` and `categories` tables exist
- Check browser console for errors

### Products not filtering?
- Verify products have `game_id` and `category_id` set
- Check `/api/products` returns joined data
- Verify foreign key relationships exist

### Add product form empty?
- Check `loadGamesAndCategories()` is called
- Verify `/api/games` returns data
- Check browser console for fetch errors

## 📝 Common Tasks

### Add a new game
```sql
INSERT INTO games (name, slug, icon, sort_order) 
VALUES ('New Game', 'new-game', '🎮', 21);
```

### Add a new category
```sql
INSERT INTO categories (name, slug, icon, sort_order) 
VALUES ('New Category', 'new-category', '📦', 12);
```

### Deactivate a game
```sql
UPDATE games SET is_active = false WHERE id = 1;
```

### Check product counts
```sql
SELECT g.name, COUNT(p.id) as product_count
FROM games g
LEFT JOIN products p ON p.game_id = g.id AND p.is_active = true
GROUP BY g.id, g.name
ORDER BY product_count DESC;
```

## 📚 Documentation

- **BACKEND_DRIVEN_SYSTEM.md** - Full system documentation
- **UPDATE_BACKEND_DRIVEN.md** - Detailed change log
- **migration-games-categories.sql** - Database schema
- **QUICK_REFERENCE.md** - This file

## ✅ Checklist

- [ ] Database migration executed
- [ ] API endpoints deployed
- [ ] Frontend files deployed
- [ ] Games catalog working
- [ ] Add product form working
- [ ] Filtering working
- [ ] Search working
- [ ] Existing products display correctly

## 🎉 Done!

The system is now backend-driven. Games and categories are centrally managed, and users can only select from predefined options. This ensures data consistency and makes the platform easier to manage and scale.
