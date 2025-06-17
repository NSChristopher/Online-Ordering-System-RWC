import { BusinessInfo, MenuCategory, MenuItem } from '../types';

export const mockBusinessInfo: BusinessInfo = {
  id: 1,
  name: "Rico's World Cuisine",
  address: "123 Culinary Street, Food City, FC 12345",
  phone: "(555) 123-FOOD",
  hours: "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 12:00 PM - 8:00 PM",
  logoUrl: undefined
};

export const mockMenuCategories: MenuCategory[] = [
  { id: 1, name: "Appetizers", sortOrder: 1 },
  { id: 2, name: "Main Courses", sortOrder: 2 },
  { id: 3, name: "Desserts", sortOrder: 3 },
  { id: 4, name: "Beverages", sortOrder: 4 }
];

export const mockMenuItems: MenuItem[] = [
  // Appetizers
  {
    id: 1,
    menuCategoryId: 1,
    name: "Crispy Spring Rolls",
    description: "Fresh vegetables wrapped in crispy pastry, served with sweet and sour sauce",
    price: 8.99,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    visible: true,
    sortOrder: 1,
    category: mockMenuCategories[0]
  },
  {
    id: 2,
    menuCategoryId: 1,
    name: "Coconut Shrimp",
    description: "Jumbo shrimp coated in coconut flakes, served with pineapple dipping sauce",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    visible: true,
    sortOrder: 2,
    category: mockMenuCategories[0]
  },
  {
    id: 3,
    menuCategoryId: 1,
    name: "Stuffed Mushrooms",
    description: "Button mushrooms stuffed with herbs, cheese and breadcrumbs",
    price: 9.99,
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    visible: true,
    sortOrder: 3,
    category: mockMenuCategories[0]
  },

  // Main Courses
  {
    id: 4,
    menuCategoryId: 2,
    name: "Grilled Salmon",
    description: "Atlantic salmon grilled to perfection, served with lemon herb butter and seasonal vegetables",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    visible: true,
    sortOrder: 1,
    category: mockMenuCategories[1]
  },
  {
    id: 5,
    menuCategoryId: 2,
    name: "Chicken Teriyaki",
    description: "Tender chicken breast glazed with house-made teriyaki sauce, served with jasmine rice",
    price: 18.99,
    imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop",
    visible: true,
    sortOrder: 2,
    category: mockMenuCategories[1]
  },
  {
    id: 6,
    menuCategoryId: 2,
    name: "Beef Stir Fry",
    description: "Wok-seared beef with fresh vegetables in a savory brown sauce",
    price: 21.99,
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    visible: true,
    sortOrder: 3,
    category: mockMenuCategories[1]
  },
  {
    id: 7,
    menuCategoryId: 2,
    name: "Vegetarian Pasta",
    description: "Penne pasta with roasted vegetables, fresh basil, and parmesan cheese",
    price: 16.99,
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
    visible: true,
    sortOrder: 4,
    category: mockMenuCategories[1]
  },

  // Desserts
  {
    id: 8,
    menuCategoryId: 3,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 7.99,
    imageUrl: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=300&fit=crop",
    visible: true,
    sortOrder: 1,
    category: mockMenuCategories[2]
  },
  {
    id: 9,
    menuCategoryId: 3,
    name: "Cheesecake",
    description: "New York style cheesecake with berry compote",
    price: 6.99,
    imageUrl: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=300&fit=crop",
    visible: true,
    sortOrder: 2,
    category: mockMenuCategories[2]
  },
  {
    id: 10,
    menuCategoryId: 3,
    name: "Tiramisu",
    description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone",
    price: 8.99,
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    visible: true,
    sortOrder: 3,
    category: mockMenuCategories[2]
  },

  // Beverages
  {
    id: 11,
    menuCategoryId: 4,
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh lemons",
    price: 3.99,
    imageUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop",
    visible: true,
    sortOrder: 1,
    category: mockMenuCategories[3]
  },
  {
    id: 12,
    menuCategoryId: 4,
    name: "Iced Tea",
    description: "Refreshing black tea served over ice",
    price: 2.99,
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
    visible: true,
    sortOrder: 2,
    category: mockMenuCategories[3]
  },
  {
    id: 13,
    menuCategoryId: 4,
    name: "Sparkling Water",
    description: "Premium sparkling water with natural minerals",
    price: 2.49,
    imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    visible: true,
    sortOrder: 3,
    category: mockMenuCategories[3]
  },
  {
    id: 14,
    menuCategoryId: 4,
    name: "Coffee",
    description: "Freshly brewed premium coffee",
    price: 2.99,
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    visible: true,
    sortOrder: 4,
    category: mockMenuCategories[3]
  }
];

// Helper function to get items by category
export const getItemsByCategory = (categoryId: number): MenuItem[] => {
  return mockMenuItems.filter(item => item.menuCategoryId === categoryId && item.visible);
};

// Helper function to get item by id
export const getItemById = (itemId: number): MenuItem | undefined => {
  return mockMenuItems.find(item => item.id === itemId);
};