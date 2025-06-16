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

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  price: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  menuItemName: string;
  menuItemDescription?: string;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'ready' | 'completed';
  totalAmount: number;
  notes?: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  customerName: string;
  customerPhone?: string;
  notes?: string;
  orderItems: {
    menuItemId: number;
    quantity: number;
    notes?: string;
  }[];
}

export interface UpdateOrderStatusData {
  status: 'pending' | 'accepted' | 'rejected' | 'ready' | 'completed';
}