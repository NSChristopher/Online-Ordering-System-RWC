// Mock data service for menu items and business info
// Based on backend/prisma/seed.js data structure

const API_BASE_URL = 'http://localhost:5000/api';

export interface BusinessInfo {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  logoUrl?: string;
}

export interface MenuCategory {
  id: number;
  name: string;
  sortOrder: number;
}

export interface MenuItem {
  id: number;
  menuCategoryId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  visible: boolean;
  sortOrder: number;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id?: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  orderType: 'delivery' | 'to-go';
  total: number;
  status: string;
  paymentMethod?: string;
  items: OrderItem[];
  createdAt?: Date;
}

// Mock business information
export const mockBusinessInfo: BusinessInfo = {
  id: 1,
  name: "Rosa's Cafe",
  address: "123 Main Street, Anytown, State 12345",
  phone: "(555) 123-4567",
  hours: "Mon-Thu: 7AM-9PM, Fri-Sat: 7AM-10PM, Sun: 8AM-8PM",
  logoUrl: "/images/rosas-logo.png",
};

// Mock menu categories
export const mockMenuCategories: MenuCategory[] = [
  { id: 1, name: "Appetizers", sortOrder: 1 },
  { id: 2, name: "Entrees", sortOrder: 2 },
  { id: 3, name: "Desserts", sortOrder: 3 },
  { id: 4, name: "Beverages", sortOrder: 4 },
];

// Mock menu items based on seed data
export const mockMenuItems: MenuItem[] = [
  // Appetizers
  {
    id: 1,
    menuCategoryId: 1,
    name: "Queso Dip",
    description: "Creamy white cheese dip served with fresh tortilla chips",
    price: 8.99,
    imageUrl: "/images/queso-dip.jpg",
    visible: true,
    sortOrder: 1,
  },
  {
    id: 2,
    menuCategoryId: 1,
    name: "Guacamole",
    description: "Fresh avocado dip made daily with tomatoes, onions, and cilantro",
    price: 9.99,
    imageUrl: "/images/guacamole.jpg",
    visible: true,
    sortOrder: 2,
  },
  {
    id: 3,
    menuCategoryId: 1,
    name: "Jalapeño Poppers",
    description: "Fresh jalapeños stuffed with cream cheese and wrapped in bacon",
    price: 10.99,
    imageUrl: "/images/jalapeno-poppers.jpg",
    visible: true,
    sortOrder: 3,
  },
  
  // Entrees
  {
    id: 4,
    menuCategoryId: 2,
    name: "Chicken Enchiladas",
    description: "Three chicken enchiladas topped with our signature red sauce and cheese",
    price: 15.99,
    imageUrl: "/images/chicken-enchiladas.jpg",
    visible: true,
    sortOrder: 1,
  },
  {
    id: 5,
    menuCategoryId: 2,
    name: "Beef Fajitas",
    description: "Sizzling beef fajitas with grilled onions and peppers, served with tortillas and sides",
    price: 18.99,
    imageUrl: "/images/beef-fajitas.jpg",
    visible: true,
    sortOrder: 2,
  },
  {
    id: 6,
    menuCategoryId: 2,
    name: "Fish Tacos",
    description: "Three grilled fish tacos with cabbage slaw and chipotle mayo",
    price: 13.99,
    imageUrl: "/images/fish-tacos.jpg",
    visible: true,
    sortOrder: 3,
  },
  {
    id: 7,
    menuCategoryId: 2,
    name: "Carnitas Burrito",
    description: "Large flour tortilla filled with slow-cooked pork, rice, beans, cheese, and salsa",
    price: 11.99,
    imageUrl: "/images/carnitas-burrito.jpg",
    visible: true,
    sortOrder: 4,
  },
  
  // Desserts
  {
    id: 8,
    menuCategoryId: 3,
    name: "Tres Leches Cake",
    description: "Traditional three-milk cake topped with cinnamon",
    price: 6.99,
    imageUrl: "/images/tres-leches.jpg",
    visible: true,
    sortOrder: 1,
  },
  {
    id: 9,
    menuCategoryId: 3,
    name: "Churros",
    description: "Fresh fried churros dusted with cinnamon sugar, served with caramel sauce",
    price: 5.99,
    imageUrl: "/images/churros.jpg",
    visible: true,
    sortOrder: 2,
  },
  
  // Beverages
  {
    id: 10,
    menuCategoryId: 4,
    name: "Horchata",
    description: "Traditional Mexican rice drink with cinnamon",
    price: 3.99,
    imageUrl: "/images/horchata.jpg",
    visible: true,
    sortOrder: 1,
  },
  {
    id: 11,
    menuCategoryId: 4,
    name: "Aguas Frescas",
    description: "Fresh fruit water - ask about today's flavors",
    price: 3.49,
    imageUrl: "/images/aguas-frescas.jpg",
    visible: true,
    sortOrder: 2,
  },
  {
    id: 12,
    menuCategoryId: 4,
    name: "Soft Drinks",
    description: "Coca-Cola, Sprite, Orange, Dr Pepper",
    price: 2.99,
    visible: true,
    sortOrder: 3,
  },
];

// Service functions
export const getBusinessInfo = async (): Promise<BusinessInfo> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockBusinessInfo;
};

export const getMenuCategories = async (): Promise<MenuCategory[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockMenuCategories.sort((a, b) => a.sortOrder - b.sortOrder);
};

export const getMenuItems = async (): Promise<MenuItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockMenuItems.filter(item => item.visible);
};

export const getMenuItemsByCategory = async (categoryId: number): Promise<MenuItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockMenuItems
    .filter(item => item.visible && item.menuCategoryId === categoryId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

export const submitOrder = async (order: Order): Promise<{ id: number; status: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error('Failed to submit order');
    }

    const result = await response.json();
    return {
      id: result.id,
      status: result.status
    };
  } catch (error) {
    console.error('Error submitting order:', error);
    throw error;
  }
};

export const getOrderStatus = async (orderId: number): Promise<{ id: number; status: string; estimatedTime?: number }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`);
    
    if (!response.ok) {
      throw new Error('Failed to get order status');
    }

    const result = await response.json();
    return {
      id: result.id,
      status: result.status,
      estimatedTime: result.estimatedTime
    };
  } catch (error) {
    console.error('Error getting order status:', error);
    throw error;
  }
};

export const cancelOrder = async (orderId: number): Promise<{ id: number; status: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to cancel order');
    }

    const result = await response.json();
    return {
      id: result.id,
      status: result.status
    };
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};