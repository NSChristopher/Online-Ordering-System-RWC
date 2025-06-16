import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, X, Truck, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5000/api';

interface OrderItem {
  id: number;
  menuItemId: number;
  quantity: number;
  priceAtOrder: number;
  itemNameAtOrder: string;
  currentMenuItemName?: string;
}

interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  orderType: 'delivery' | 'to-go';
  total: number;
  status: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
}

const OrderDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: number, status: string) => {
    setUpdating(orderId);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh orders after update
      await fetchOrders();
      toast.success(`Order ${status === 'accepted' ? 'accepted' : status === 'rejected' ? 'rejected' : 'updated'} successfully`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdating(null);
    }
  };

  // Load orders on component mount and set up polling
  useEffect(() => {
    fetchOrders();
    
    // Poll for new orders every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">New</Badge>;
      case 'accepted':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Accepted</Badge>;
      case 'preparing':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Preparing</Badge>;
      case 'ready':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Ready</Badge>;
      case 'out_for_delivery':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Out for Delivery</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getOrderActions = (order: Order) => {
    const isUpdating = updating === order.id;
    
    switch (order.status) {
      case 'new':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => updateOrderStatus(order.id, 'accepted')}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => updateOrderStatus(order.id, 'rejected')}
              disabled={isUpdating}
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        );
      case 'accepted':
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, 'preparing')}
            disabled={isUpdating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Clock className="h-4 w-4 mr-1" />
            Start Preparing
          </Button>
        );
      case 'preparing':
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, 'ready')}
            disabled={isUpdating}
            className="bg-green-600 hover:bg-green-700"
          >
            <Package className="h-4 w-4 mr-1" />
            Mark Ready
          </Button>
        );
      case 'ready':
        if (order.orderType === 'delivery') {
          return (
            <Button
              size="sm"
              onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
              disabled={isUpdating}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Truck className="h-4 w-4 mr-1" />
              Out for Delivery
            </Button>
          );
        } else {
          return (
            <Button
              size="sm"
              onClick={() => updateOrderStatus(order.id, 'completed')}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark Picked Up
            </Button>
          );
        }
      case 'out_for_delivery':
        return (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, 'completed')}
            disabled={isUpdating}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Mark Delivered
          </Button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600">Loading orders...</div>
      </div>
    );
  }

  const pendingOrders = orders.filter(order => 
    ['new', 'accepted', 'preparing', 'ready', 'out_for_delivery'].includes(order.status)
  );
  const completedOrders = orders.filter(order => 
    ['completed', 'rejected', 'cancelled'].includes(order.status)
  );

  return (
    <div className="space-y-6">
      {/* Pending Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Pending Orders ({pendingOrders.length})</h2>
        {pendingOrders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No pending orders at the moment
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingOrders.map((order) => (
              <Card key={order.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-sm text-gray-600">{order.customerPhone}</div>
                    <div className="text-sm text-gray-600 capitalize">{order.orderType}</div>
                    {order.deliveryAddress && (
                      <div className="text-sm text-gray-600">{order.deliveryAddress}</div>
                    )}
                  </div>
                  
                  {order.orderItems && (
                    <div>
                      <div className="font-medium text-sm mb-2">Items:</div>
                      <div className="space-y-1">
                        {order.orderItems.map((item) => (
                          <div key={item.id} className="text-sm flex justify-between">
                            <span>{item.quantity}x {item.itemNameAtOrder}</span>
                            <span className="font-medium">${item.priceAtOrder.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="font-bold">Total: ${order.total.toFixed(2)}</div>
                  </div>
                  
                  <div className="pt-2">
                    {getOrderActions(order)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Completed Orders ({completedOrders.length})</h2>
        {completedOrders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No completed orders yet today
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedOrders.slice(0, 6).map((order) => (
              <Card key={order.id} className="border-l-4 border-l-gray-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="font-medium">{order.customerName}</div>
                  <div className="text-sm text-gray-600 capitalize">{order.orderType}</div>
                  <div className="font-bold mt-2">Total: ${order.total.toFixed(2)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDashboard;