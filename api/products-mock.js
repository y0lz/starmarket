export default function handler(request, response) {
  const products = [
    {
      id: 1,
      title: "Золото 1000 шт",
      description: "Игровое золото для быстрого старта. Доставка моментальная после оплаты. Передача через внутриигровую почту. Безопасная сделка с гарантией.",
      price_stars: 150,
      game: "World of Warcraft",
      category: "Валюта",
      subcategory: "Золото",
      image: "https://via.placeholder.com/300x200/FFD700/000000?text=Gold",
      type: "multi",
      stock: 50,
      seller_rating: 4.9,
      sales_count: 234
    },
    {
      id: 2,
      title: "Легендарный меч",
      description: "Уникальный меч с уроном 500-750. Редкий дроп из рейда Ulduar. Только один экземпляр в наличии. Передача через внутриигровую почту после оплаты.",
      price_stars: 500,
      game: "World of Warcraft",
      category: "Предметы",
      subcategory: "Оружие",
      image: "https://via.placeholder.com/300x200/8B0000/FFD700?text=Sword",
      type: "single",
      stock: 1,
      seller_rating: 5.0,
      sales_count: 12
    },
    {
      id: 3,
      title: "Аккаунт 80 lvl",
      description: "Прокачанный аккаунт с максимальным уровнем. Полный набор эпической экипировки T10. Все профессии прокачаны до максимума. Репутация с основными фракциями на Exalted. Включает 5000 золота и редкие маунты.",
      price_stars: 2000,
      game: "World of Warcraft",
      category: "Аккаунты",
      subcategory: "Прокачанные",
      image: "https://via.placeholder.com/300x200/4169E1/FFFFFF?text=Account",
      type: "single",
      stock: 1,
      seller_rating: 4.8,
      sales_count: 8
    },
    {
      id: 4,
      title: "Кристаллы 5000 шт",
      description: "Премиум валюта для покупки эксклюзивных предметов в магазине. Моментальная доставка на аккаунт в течение 5 минут. Безопасная сделка через официальный API.",
      price_stars: 300,
      game: "Genshin Impact",
      category: "Валюта",
      subcategory: "Кристаллы",
      image: "https://via.placeholder.com/300x200/9370DB/FFFFFF?text=Crystals",
      type: "multi",
      stock: 100,
      seller_rating: 4.9,
      sales_count: 456
    },
    {
      id: 5,
      title: "5★ персонаж",
      description: "Случайный 5-звездочный персонаж из текущего баннера. Гарантированный дроп в течение 90 молитв. Передача через привязку аккаунта. Полная безопасность сделки.",
      price_stars: 1500,
      game: "Genshin Impact",
      category: "Персонажи",
      subcategory: "5 звезд",
      image: "https://via.placeholder.com/300x200/FF69B4/FFFFFF?text=5★+Hero",
      type: "single",
      stock: 3,
      seller_rating: 4.7,
      sales_count: 23
    },
    {
      id: 6,
      title: "Примогемы 3000 шт",
      description: "Игровая валюта для молитв и получения персонажей. Быстрая доставка в течение 5 минут после оплаты. Безопасная передача через официальный метод.",
      price_stars: 250,
      game: "Genshin Impact",
      category: "Валюта",
      subcategory: "Примогемы",
      image: "https://via.placeholder.com/300x200/00CED1/FFFFFF?text=Primogems",
      type: "multi",
      stock: 75,
      seller_rating: 4.8,
      sales_count: 189
    },
    {
      id: 7,
      title: "V-Bucks 13500",
      description: "Премиум валюта Fortnite. Подходит для покупки Battle Pass и скинов в магазине. Код активации отправляется сразу после оплаты. Работает на всех платформах.",
      price_stars: 800,
      game: "Fortnite",
      category: "Валюта",
      subcategory: "V-Bucks",
      image: "https://via.placeholder.com/300x200/7B68EE/FFFFFF?text=V-Bucks",
      type: "multi",
      stock: 30,
      seller_rating: 4.9,
      sales_count: 312
    },
    {
      id: 8,
      title: "Редкий скин Renegade Raider",
      description: "Эксклюзивный скин из первого сезона Fortnite. Больше не доступен в магазине. Уникальная возможность получить легендарный скин. Передача через аккаунт Epic Games.",
      price_stars: 1200,
      game: "Fortnite",
      category: "Косметика",
      subcategory: "Скины",
      image: "https://via.placeholder.com/300x200/FF4500/FFFFFF?text=Rare+Skin",
      type: "single",
      stock: 1,
      seller_rating: 5.0,
      sales_count: 5
    },
    {
      id: 9,
      title: "Battle Pass Season 5",
      description: "Боевой пропуск текущего сезона Fortnite. Включает доступ ко всем наградам сезона. Автоматическая активация на вашем аккаунте Epic Games.",
      price_stars: 950,
      game: "Fortnite",
      category: "Боевые пропуски",
      subcategory: "Сезонные",
      image: "https://via.placeholder.com/300x200/32CD32/FFFFFF?text=Battle+Pass",
      type: "single",
      stock: 20,
      seller_rating: 4.8,
      sales_count: 145
    },
    {
      id: 10,
      title: "Робуксы 10000",
      description: "Игровая валюта Roblox. Можно потратить на игры, предметы и апгрейды. Доставка кодом активации в течение 5 минут. Работает на всех платформах.",
      price_stars: 600,
      game: "Roblox",
      category: "Валюта",
      subcategory: "Робуксы",
      image: "https://via.placeholder.com/300x200/E60012/FFFFFF?text=Robux",
      type: "multi",
      stock: 40,
      seller_rating: 4.7,
      sales_count: 267
    },
    {
      id: 11,
      title: "Премиум аккаунт 6 месяцев",
      description: "Аккаунт с активной подпиской Roblox Premium на 6 месяцев. Доступ ко всем преимуществам Premium. Ежемесячная выплата Robux. Скидки в магазине.",
      price_stars: 900,
      game: "Roblox",
      category: "Аккаунты",
      subcategory: "Премиум",
      image: "https://via.placeholder.com/300x200/FFD700/000000?text=Premium",
      type: "single",
      stock: 2,
      seller_rating: 4.9,
      sales_count: 34
    },
    {
      id: 12,
      title: "Алмазы 5000 шт",
      description: "Премиум валюта для покупки героев и скинов в Mobile Legends. Моментальная доставка после оплаты. Безопасная передача через официальный метод.",
      price_stars: 400,
      game: "Mobile Legends",
      category: "Валюта",
      subcategory: "Алмазы",
      image: "https://via.placeholder.com/300x200/00BFFF/FFFFFF?text=Diamonds",
      type: "multi",
      stock: 60,
      seller_rating: 4.8,
      sales_count: 178
    },
    {
      id: 13,
      title: "Эпический скин героя",
      description: "Редкий скин с уникальными эффектами и анимацией. Доступен только через событие. Передача через привязку аккаунта. Включает эксклюзивные эффекты умений.",
      price_stars: 700,
      game: "Mobile Legends",
      category: "Косметика",
      subcategory: "Скины героев",
      image: "https://via.placeholder.com/300x200/FF1493/FFFFFF?text=Epic+Skin",
      type: "single",
      stock: 5,
      seller_rating: 4.9,
      sales_count: 67
    },
    {
      id: 14,
      title: "AK-47 Redline FT",
      description: "Популярный скин AK-47 в состоянии Field-Tested. Чистый вид без царапин. Мгновенная передача через Steam трейд. Безопасная сделка с гарантией.",
      price_stars: 450,
      game: "CS2",
      category: "Оружие",
      subcategory: "Автоматы",
      image: "https://via.placeholder.com/300x200/DC143C/FFFFFF?text=AK-47",
      type: "single",
      stock: 3,
      seller_rating: 5.0,
      sales_count: 89
    },
    {
      id: 15,
      title: "AWP Dragon Lore MW",
      description: "Легендарный скин AWP Dragon Lore в состоянии Minimal Wear. Один из самых редких скинов в игре. Сертифицирован StatTrak™. Передача через Steam трейд.",
      price_stars: 5000,
      game: "CS2",
      category: "Оружие",
      subcategory: "Снайперские винтовки",
      image: "https://via.placeholder.com/300x200/FFD700/8B0000?text=Dragon+Lore",
      type: "single",
      stock: 1,
      seller_rating: 5.0,
      sales_count: 3
    }
  ];

  // Фильтрация и сортировка
  const { game, category, subcategory, minPrice, maxPrice, sort, search } = request.query;
  let filtered = products;

  if (game && game !== 'all') {
    filtered = filtered.filter(p => p.game === game);
  }
  
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (subcategory && subcategory !== 'all') {
    filtered = filtered.filter(p => p.subcategory === subcategory);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.game.toLowerCase().includes(searchLower)
    );
  }

  if (minPrice) {
    const minPriceNum = parseInt(minPrice);
    if (!isNaN(minPriceNum)) {
      filtered = filtered.filter(p => p.price_stars >= minPriceNum);
    }
  }

  if (maxPrice) {
    const maxPriceNum = parseInt(maxPrice);
    if (!isNaN(maxPriceNum)) {
      filtered = filtered.filter(p => p.price_stars <= maxPriceNum);
    }
  }

  // Сортировка
  if (sort) {
    switch (sort) {
      case 'price_asc':
        filtered = [...filtered].sort((a, b) => a.price_stars - b.price_stars);
        break;
      case 'price_desc':
        filtered = [...filtered].sort((a, b) => b.price_stars - a.price_stars);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'popular':
        filtered = [...filtered].sort((a, b) => b.sales_count - a.sales_count);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.seller_rating - a.seller_rating);
        break;
      default:
        // По умолчанию по популярности
        filtered = [...filtered].sort((a, b) => b.sales_count - a.sales_count);
    }
  } else {
    filtered = [...filtered].sort((a, b) => b.sales_count - a.sales_count);
  }

  response.status(200).json({ products: filtered });
}
