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

export type OrderStatus = Order['status'];

export interface OrderStatusUpdate {
  id: number;
  status: OrderStatus;
  message: string;
}