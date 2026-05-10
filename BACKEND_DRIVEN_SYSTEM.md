# Backend-Driven Games and Categories System

## Overview
The system has been updated to use a **backend-driven architecture** for games and categories. Instead of dynamically generating these from products, they are now stored in dedicated database tables and managed centrally.

## Key Changes

### 1. Database Schema
New tables have been added:
- **`games`** - Stores all available games
- **`categories`** - Stores all product categories
- **`products`** - Updated with foreign keys `game_id` and `category_id`

See `migration-games-categories.sql` for the complete schema.

### 2. API Endpoints

#### `/api/games` (NEW)
Returns games and categories from the database:
```json
{
  "ok": true,
  "games": [
    {
      "id": 1,
      "name": "World of Warcraft",
      "slug": "world-of-warcraft",
      "icon": "⚔️",
      "product_count": 15,
      "is_active": true,
      "sort_order": 1
    }
  ],
  "categories": [
    {
      "id": 1,
      "name": "Валюта",
      "slug": "currency",
      "icon": "💰",
      "is_active": true,
      "sort_order": 1
    }
  ]
}
```

#### `/api/products` (UPDATED)
Now uses JOINs to include game and category data:
```json
{
  "products": [
    {
      "id": 1,
      "title": "Золото 1000 шт",
      "game_id": 1,
      "category_id": 1,
      "game": {
        "id": 1,
        "name": "World of Warcraft",
        "slug": "world-of-warcraft",
        "icon": "⚔️"
      },
      "category": {
        "id": 1,
        "name": "Валюта",
        "slug": "currency",
        "icon": "💰"
      }
    }
  ]
}
```

#### `/api/seller` (UPDATED)
Now accepts `game_id` and `category_id` instead of string values:
```javascript
// POST request body
{
  "userId": 123456,
  "title": "Product name",
  "game_id": 1,        // Changed from "game": "World of Warcraft"
  "category_id": 1,    // Changed from "category": "Валюта"
  // ... other fields
}
```

### 3. Frontend Changes

#### `index.html`
**Removed:**
- `buildGamesAndCategories()` function
- `normalizeGameId()` function
- Hardcoded `gameIcons` and `categoryIcons` mappings

**Updated:**
- `loadProducts()` - Now fetches games/categories from `/api/games`
- `renderGames()` - Uses `game.product_count` from backend
- `selectGame()` - Uses numeric `game.id` instead of string slugs
- `renderGameCategories()` - Filters by `category_id` instead of string matching
- `filterProducts()` - Filters by `game_id` and `category_id`
- `renderProducts()` - Displays `product.game.name` and `product.category.name`

#### `add-product.html`
**Added:**
- `loadGamesAndCategories()` function to fetch and populate dropdowns

**Updated:**
- Game and category `<select>` elements now populated dynamically from backend
- Form submission sends `game_id` and `category_id` (integers) instead of strings

### 4. User Experience

#### For Buyers:
- Games catalog shows only games with available products
- Product counts are accurate and updated in real-time
- Categories are filtered per game
- No changes to the UI/UX

#### For Sellers:
- **Cannot create new games or categories** - must select from existing options
- Dropdowns are populated from the backend
- Centralized control ensures consistency

## Benefits

1. **Centralized Control**: Admins can manage games and categories from the database
2. **Consistency**: All users see the same games and categories
3. **Scalability**: Easy to add new games without code changes
4. **Data Integrity**: Foreign key constraints ensure valid references
5. **Performance**: Indexed queries and product counts calculated efficiently
6. **Flexibility**: Games can be activated/deactivated without deleting data

## Migration Path

1. Run `migration-games-categories.sql` on your Supabase database
2. Deploy updated API endpoints (`/api/games`, `/api/products`, `/api/seller`)
3. Deploy updated frontend files (`index.html`, `add-product.html`)
4. Existing products will be migrated automatically (if they have old `game` and `category` string fields)

## Pre-populated Data

The migration includes:
- **20 games**: World of Warcraft, Genshin Impact, Fortnite, CS2, and more
- **11 categories**: Валюта, Предметы, Аккаунты, Персонажи, Косметика, etc.

All with appropriate icons and sort orders.

## Admin Operations

To add a new game:
```sql
INSERT INTO games (name, slug, icon, sort_order) 
VALUES ('New Game', 'new-game', '🎮', 21);
```

To add a new category:
```sql
INSERT INTO categories (name, slug, icon, sort_order) 
VALUES ('New Category', 'new-category', '📦', 12);
```

To deactivate a game:
```sql
UPDATE games SET is_active = false WHERE id = 1;
```

## Testing Checklist

- [ ] Games catalog displays correctly on homepage
- [ ] Clicking a game shows its categories
- [ ] Products filter by game and category
- [ ] Add product form loads games and categories
- [ ] New products save with correct game_id and category_id
- [ ] Product cards display game and category names
- [ ] Search and sort work correctly
- [ ] Empty states show when no products match filters

## Files Modified

- `index.html` - Frontend games/categories logic
- `add-product.html` - Form with dynamic dropdowns
- `api/games.js` - NEW endpoint for games/categories
- `api/products.js` - Updated with JOINs
- `api/seller.js` - Updated to use game_id/category_id
- `migration-games-categories.sql` - Database schema

## Backward Compatibility

The old `game` and `category` string fields are **not removed** from the database to maintain backward compatibility. The migration script attempts to populate `game_id` and `category_id` from these fields.

However, **new products must use game_id and category_id**.
