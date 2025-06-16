import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Order types
export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  priceAtOrder: number;
  itemNameAtOrder: string;
  menuItemName?: string;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  orderType: 'delivery' | 'to-go';
  total: number;
  status: 'new' | 'accepted' | 'rejected' | 'preparing' | 'ready' | 'completed';
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
}

// Order API functions
export const orderApi = {
  // Get all orders
  getAll: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Get orders by status
  getByStatus: async (status: string): Promise<Order[]> => {
    const response = await api.get(`/orders/status/${status}`);
    return response.data;
  },

  // Get single order
  getById: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Update order status
  updateStatus: async (id: number, status: string): Promise<any> => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Create new order (for testing)
  create: async (orderData: Partial<Order>): Promise<Order> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
};

export default api;