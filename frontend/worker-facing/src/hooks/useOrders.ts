import { useState, useEffect } from 'react';
import { Order, UpdateOrderStatusData } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (status?: string) => {
    try {
      setLoading(true);
      const response = await api.get('/orders', { 
        params: status ? { status } : {} 
      });
      setOrders(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: number, status: UpdateOrderStatusData['status']) => {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(order => 
        order.id === id ? response.data : order
      ));
      toast.success(`Order ${status} successfully!`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update order status';
      toast.error(message);
      throw error;
    }
  };

  const acceptOrder = (id: number) => updateOrderStatus(id, 'accepted');
  const rejectOrder = (id: number) => updateOrderStatus(id, 'rejected');
  const markOrderReady = (id: number) => updateOrderStatus(id, 'ready');
  const completeOrder = (id: number) => updateOrderStatus(id, 'completed');

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    fetchOrders,
    updateOrderStatus,
    acceptOrder,
    rejectOrder,
    markOrderReady,
    completeOrder,
  };
};