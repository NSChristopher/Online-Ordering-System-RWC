// Legacy types for existing functionality
export interface User {
  id: number;
  email: string;
  username: string;
  createdAt?: string;
}

export interface Post {
  id: number;
  title: string;
  content?: string;
  published: boolean;
  authorId: number;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface CreatePostData {
  title: string;
  content?: string;
  published?: boolean;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  published?: boolean;
}

// Ordering System Types
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
  category?: MenuCategory;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  orderType: 'delivery' | 'to-go';
  total: number;
}

export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  orderType: 'to-go' | 'delivery';
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: 'cash' | 'card';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  priceAtOrder: number;
  itemNameAtOrder: string;
  notes?: string;
}

export interface CreateOrderData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  orderType: 'to-go' | 'delivery';
  paymentMethod: 'cash' | 'card';
  notes?: string;
  items: {
    menuItemId: number;
    quantity: number;
    notes?: string;
  }[];
}