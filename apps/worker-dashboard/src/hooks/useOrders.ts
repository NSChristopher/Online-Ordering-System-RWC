import { useState, useEffect, useCallback } from 'react';
import { orderApi, Order } from '../lib/api';
import { OrderStatus } from '../types';
import { toast } from 'sonner';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersData = await orderApi.getAll();
      setOrders(ordersData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId: number, status: OrderStatus) => {
    try {
      await orderApi.updateStatus(orderId, status);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status, updatedAt: new Date().toISOString() }
            : order
        )
      );
      
      const statusMessages = {
        accepted: 'Order accepted',
        rejected: 'Order rejected',
        preparing: 'Order is being prepared',
        ready: 'Order is ready for pickup/delivery',
        completed: 'Order completed'
      };
      
      const message = statusMessages[status as keyof typeof statusMessages] || `Order status updated to ${status}`;
      toast.success(message);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order status';
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Accept order
  const acceptOrder = useCallback(async (orderId: number) => {
    await updateOrderStatus(orderId, 'accepted');
  }, [updateOrderStatus]);

  // Reject order
  const rejectOrder = useCallback(async (orderId: number) => {
    await updateOrderStatus(orderId, 'rejected');
  }, [updateOrderStatus]);

  // Mark order as ready
  const markOrderReady = useCallback(async (orderId: number) => {
    await updateOrderStatus(orderId, 'ready');
  }, [updateOrderStatus]);

  // Mark order as preparing
  const markOrderPreparing = useCallback(async (orderId: number) => {
    await updateOrderStatus(orderId, 'preparing');
  }, [updateOrderStatus]);

  // Get orders by status
  const getOrdersByStatus = useCallback((status: OrderStatus) => {
    return orders.filter(order => order.status === status);
  }, [orders]);

  // Initialize orders on mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Refresh orders periodically (every 30 seconds for live updates)
  useEffect(() => {
    const interval = setInterval(fetchOrders, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus,
    acceptOrder,
    rejectOrder,
    markOrderReady,
    markOrderPreparing,
    getOrdersByStatus,
  };
}