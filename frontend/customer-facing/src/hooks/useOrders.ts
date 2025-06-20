import { useState, useEffect } from 'react';
import { Order, CreateOrderData } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Create new order
  const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
    try {
      const response = await api.post('/orders', orderData);
      const newOrder = response.data;
      setOrders(prev => [newOrder, ...prev]);
      toast.success('Order placed successfully!');
      return newOrder;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to place order';
      toast.error(message);
      throw error;
    }
  };

  // Get order by ID
  const getOrderById = async (id: number): Promise<Order | null> => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error('Order not found');
        return null;
      }
      const message = error.response?.data?.error || 'Failed to fetch order';
      toast.error(message);
      throw error;
    }
  };

  // Cancel order
  const cancelOrder = async (id: number): Promise<Order> => {
    try {
      const response = await api.patch(`/orders/${id}/cancel`);
      const updatedOrder = response.data;
      setOrders(prev => prev.map(order => 
        order.id === id ? updatedOrder : order
      ));
      toast.success('Order cancelled successfully');
      return updatedOrder;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to cancel order';
      toast.error(message);
      throw error;
    }
  };

  return {
    orders,
    loading,
    createOrder,
    getOrderById,
    cancelOrder,
  };
};