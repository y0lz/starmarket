# 🔄 Динамическая система StarMarket

## 📋 Обзор

Система теперь **полностью динамическая** - игры и категории автоматически создаются из товаров в базе данных. Никакого хардкода!

---

## ✨ Что изменилось

### ❌ Было (хардкод):
```javascript
const games = [
    { id: 'wow', name: 'World of Warcraft', icon: '⚔️' },
    { id: 'genshin', name: 'Genshin Impact', icon: '🌸' },
    // ... еще 7 игр
];

const gameCategories = [
    { id: 'currency', name: '💰 Валюта', key: 'Валюта' },
    { id: 'items', name: '⚔️ Предметы', key: 'Предметы' },
    // ... еще 4 категории
];
```

### ✅ Стало (динамика):
```javascript
let games = []; // Создается автоматически из товаров
let gameCategories = []; // Создается автоматически из товаров

function buildGamesAndCategories() {
    // Анализирует все товары
    // Создает список игр
    // Создает список категорий
    // Сортирует по популярности
}
```

---

## 🎮 Как работает динамическая система

### 1. Загрузка товаров
```javascript
async function loadProducts() {
    // Загружаем товары из API
    const res = await fetch('/api/products');
    allProducts = await res.json();
    
    // Динамически создаем игры и категории
    buildGamesAndCategories();
    
    // Отрисовываем каталог
    renderGames();
}
```

### 2. Создание списка игр
```javascript
function buildGamesAndCategories() {
    const gamesMap = new Map();
    
    allProducts.forEach(product => {
        const gameName = product.game;
        const gameId = normalizeGameId(gameName);
        
        if (!gamesMap.has(gameId)) {
            gamesMap.set(gameId, {
                id: gameId,
                name: gameName,
                icon: gameIcons[gameName] || '🎮',
                fullName: gameName
            });
        }
    });
    
    // Сортируем по количеству товаров
    games = Array.from(gamesMap.values()).sort((a, b) => {
        const countA = allProducts.filter(p => 
            normalizeGameId(p.game) === a.id
        ).length;
        const countB = allProducts.filter(p => 
            normalizeGameId(p.game) === b.id
        ).length;
        return countB - countA;
    });
}
```

### 3. Создание списка категорий
```javascript
const categoriesSet = new Set();

allProducts.forEach(product => {
    if (product.category) {
        categoriesSet.add(product.category);
    }
});

gameCategories = Array.from(categoriesSet).map(cat => ({
    id: normalizeGameId(cat),
    name: `${categoryIcons[cat] || '📦'} ${cat}`,
    key: cat
}));
```

---

## 🎯 Преимущества динамической системы

### 1. ✅ Автоматическое добавление игр
Продавец добавляет товар с новой игрой → игра автоматически появляется в каталоге

**Пример:**
```javascript
// Продавец добавляет товар
{
    game: "Apex Legends",  // Новая игра!
    category: "Валюта",
    title: "Apex Coins 1000"
}

// Система автоматически:
// 1. Создает карточку игры "Apex Legends"
// 2. Добавляет иконку 🎮 (или из gameIcons)
// 3. Показывает в каталоге
```

### 2. ✅ Автоматическое добавление категорий
Продавец использует новую категорию → она автоматически появляется

**Пример:**
```javascript
// Продавец добавляет товар
{
    game: "World of Warcraft",
    category: "Питомцы",  // Новая категория!
    title: "Редкий питомец"
}

// Система автоматически:
// 1. Добавляет категорию "Питомцы"
// 2. Добавляет иконку 📦 (или из categoryIcons)
// 3. Показывает в фильтрах
```

### 3. ✅ Сортировка по популярности
Игры автоматически сортируются по количеству товаров

```javascript
// Игры с большим количеством товаров показываются первыми
games.sort((a, b) => {
    const countA = getProductCount(a.id);
    const countB = getProductCount(b.id);
    return countB - countA; // От большего к меньшему
});
```

### 4. ✅ Скрытие пустых игр
Игры без товаров не показываются

```javascript
if (count === 0) return ''; // Не показываем
```

---

## 🎨 Иконки

### Иконки игр (gameIcons)
```javascript
const gameIcons = {
    'World of Warcraft': '⚔️',
    'Genshin Impact': '🌸',
    'Fortnite': '🎯',
    'Roblox': '🎮',
    'Counter-Strike 2': '🔫',
    'Mobile Legends': '🗡️',
    'Valorant': '💥',
    'League of Legends': '⚡',
    'Dota 2': '🛡️',
    'Minecraft': '⛏️',
    'PUBG': '🎯',
    'Apex Legends': '🎮',
    // ... можно добавлять новые
};
```

**Если игры нет в списке:**
```javascript
icon: gameIcons[gameName] || '🎮' // Используется 🎮 по умолчанию
```

### Иконки категорий (categoryIcons)
```javascript
const categoryIcons = {
    'Валюта': '💰',
    'Предметы': '⚔️',
    'Аккаунты': '👤',
    'Персонажи': '🦸',
    'Косметика': '✨',
    'Услуги': '🎯',
    'Оружие': '🗡️',
    'Броня': '🛡️',
    'Ресурсы': '💎',
    'Прокачка': '📈',
    'Буст': '🚀'
    // ... можно добавлять новые
};
```

**Если категории нет в списке:**
```javascript
icon: categoryIcons[cat] || '📦' // Используется 📦 по умолчанию
```

---

## 🔧 Нормализация ID

### Функция normalizeGameId
```javascript
function normalizeGameId(gameName) {
    if (!gameName) return 'unknown';
    return gameName
        .toLowerCase()              // В нижний регистр
        .replace(/[^a-z0-9]/g, '')  // Только буквы и цифры
        .substring(0, 20);          // Максимум 20 символов
}
```

**Примеры:**
```javascript
normalizeGameId('World of Warcraft')    // → 'worldofwarcraft'
normalizeGameId('Counter-Strike 2')     // → 'counterstrike2'
normalizeGameId('League of Legends')    // → 'leagueoflegends'
normalizeGameId('Mobile Legends: Bang') // → 'mobilelegendsbang'
```

---

## 📊 Примеры использования

### Добавление новой игры

**Продавец:**
1. Открывает "Добавить товар"
2. Вводит название игры: "Diablo 4"
3. Выбирает категорию: "Валюта"
4. Сохраняет товар

**Система автоматически:**
1. Создает ID: `normalizeGameId('Diablo 4')` → `'diablo4'`
2. Добавляет в список игр:
   ```javascript
   {
       id: 'diablo4',
       name: 'Diablo 4',
       icon: '🎮', // По умолчанию
       fullName: 'Diablo 4'
   }
   ```
3. Показывает в каталоге с счетчиком товаров

### Добавление новой категории

**Продавец:**
1. Добавляет товар с категорией "Питомцы"

**Система автоматически:**
1. Добавляет в список категорий:
   ```javascript
   {
       id: 'питомцы',
       name: '📦 Питомцы', // Иконка по умолчанию
       key: 'Питомцы'
   }
   ```
2. Показывает в фильтрах игры

---

## 🎯 Расширение системы

### Добавление новой иконки игры

**В коде (index.html):**
```javascript
const gameIcons = {
    // ... существующие иконки
    'Diablo 4': '😈',
    'Starfield': '🚀',
    'Baldur\'s Gate 3': '🐉'
};
```

### Добавление новой иконки категории

**В коде (index.html):**
```javascript
const categoryIcons = {
    // ... существующие иконки
    'Питомцы': '🐾',
    'Маунты': '🐴',
    'Эмоции': '😊'
};
```

---

## 🔍 Отладка

### Проверка созданных игр
```javascript
console.log('Игры:', games);
// Выведет массив всех игр из товаров
```

### Проверка созданных категорий
```javascript
console.log('Категории:', gameCategories);
// Выведет массив всех категорий из товаров
```

### Проверка товаров игры
```javascript
const gameId = 'wow';
const products = allProducts.filter(p => 
    normalizeGameId(p.game) === gameId
);
console.log(`Товары WoW:`, products);
```

---

## ⚡ Производительность

### Оптимизация
- Игры создаются **один раз** при загрузке товаров
- Используется `Map` для быстрого поиска
- Сортировка выполняется **один раз**
- Фильтрация работает на клиенте (быстро)

### Кэширование
```javascript
// Товары загружаются один раз
allProducts = await loadProducts();

// Игры создаются один раз
buildGamesAndCategories();

// Дальше работа только с массивами в памяти
```

---

## 📝 Требования к данным

### Формат товара
```javascript
{
    id: 1,
    title: "Название товара",
    game: "Название игры",        // ОБЯЗАТЕЛЬНО
    category: "Название категории", // ОБЯЗАТЕЛЬНО
    price_stars: 100,
    // ... другие поля
}
```

### Важно:
- ✅ `game` должен быть строкой
- ✅ `category` должен быть строкой
- ✅ Регистр не важен (нормализуется)
- ✅ Пробелы и спецсимволы обрабатываются

---

## 🎉 Итог

### Что получили:
1. ✅ **Полностью динамическая система**
2. ✅ **Автоматическое добавление игр**
3. ✅ **Автоматическое добавление категорий**
4. ✅ **Сортировка по популярности**
5. ✅ **Расширяемая система иконок**
6. ✅ **Нет хардкода**

### Что нужно делать продавцам:
1. Просто добавлять товары
2. Указывать название игры
3. Указывать категорию
4. Всё остальное - автоматически!

---

**Версия:** 2.1.0  
**Статус:** ✅ Динамическая система активна  
**Хардкод:** ❌ Удален
