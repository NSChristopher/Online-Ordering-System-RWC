import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Truck, Package, AlertCircle, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { getOrderStatus } from '../services/menuService';
import { toast } from 'sonner';

interface OrderStatus {
  id: number;
  status: string;
  estimatedTime?: number;
  canCancel?: boolean;
  gracePeriodEnd?: Date;
}

const OrderStatusPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [gracePeriodTimeLeft, setGracePeriodTimeLeft] = useState<number>(0);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    const loadOrderStatus = async () => {
      try {
        const status = await getOrderStatus(parseInt(orderId));
        
        // Add grace period logic (5 minutes from order placement)
        const gracePeriodEnd = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
        const canCancel = status.status === 'new' || status.status === 'accepted';
        
        setOrderStatus({
          ...status,
          canCancel,
          gracePeriodEnd,
        });
      } catch (error) {
        console.error('Error loading order status:', error);
        toast.error('Failed to load order status');
      } finally {
        setLoading(false);
      }
    };

    loadOrderStatus();

    // Set up periodic status updates
    const interval = setInterval(loadOrderStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [orderId, navigate]);

  useEffect(() => {
    if (!orderStatus?.gracePeriodEnd) return;

    const updateGracePeriod = () => {
      const now = new Date();
      const timeLeft = Math.max(0, orderStatus.gracePeriodEnd!.getTime() - now.getTime());
      setGracePeriodTimeLeft(timeLeft);
    };

    updateGracePeriod();
    const interval = setInterval(updateGracePeriod, 1000);
    return () => clearInterval(interval);
  }, [orderStatus?.gracePeriodEnd]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'new':
        return {
          icon: <Clock className="h-8 w-8 text-yellow-500" />,
          title: 'Order Received',
          description: 'Your order has been received and is waiting for confirmation.',
          color: 'bg-yellow-50 border-yellow-200',
        };
      case 'accepted':
        return {
          icon: <CheckCircle className="h-8 w-8 text-blue-500" />,
          title: 'Order Confirmed',
          description: 'Your order has been confirmed and is being prepared.',
          color: 'bg-blue-50 border-blue-200',
        };
      case 'ready':
        return {
          icon: <Package className="h-8 w-8 text-green-500" />,
          title: 'Order Ready',
          description: 'Your order is ready for pickup!',
          color: 'bg-green-50 border-green-200',
        };
      case 'out_for_delivery':
        return {
          icon: <Truck className="h-8 w-8 text-orange-500" />,
          title: 'Out for Delivery',
          description: 'Your order is on its way to you.',
          color: 'bg-orange-50 border-orange-200',
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-8 w-8 text-green-500" />,
          title: 'Order Completed',
          description: 'Your order has been delivered/picked up. Thank you!',
          color: 'bg-green-50 border-green-200',
        };
      case 'cancelled':
        return {
          icon: <AlertCircle className="h-8 w-8 text-red-500" />,
          title: 'Order Cancelled',
          description: 'Your order has been cancelled.',
          color: 'bg-red-50 border-red-200',
        };
      default:
        return {
          icon: <Clock className="h-8 w-8 text-gray-500" />,
          title: 'Processing',
          description: 'Your order is being processed.',
          color: 'bg-gray-50 border-gray-200',
        };
    }
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      // Mock cancellation - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrderStatus(prev => prev ? { ...prev, status: 'cancelled', canCancel: false } : null);
      toast.success('Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order status...</p>
        </div>
      </div>
    );
  }

  if (!orderStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-24 w-24 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-8">
            We couldn't find the order you're looking for.
          </p>
          <Button onClick={() => navigate('/')} className="bg-orange-500 hover:bg-orange-600">
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(orderStatus.status);
  const canCancelOrder = orderStatus.canCancel && gracePeriodTimeLeft > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold text-gray-900">Order Status</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">Order #</span>
                <span className="ml-1">{orderStatus.id}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Status Card */}
        <Card className={`mb-6 ${statusInfo.color}`}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {statusInfo.icon}
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-xl font-bold text-gray-900">{statusInfo.title}</h2>
                <p className="text-gray-600 mt-1">{statusInfo.description}</p>
                {orderStatus.estimatedTime && orderStatus.status !== 'completed' && (
                  <p className="text-sm text-gray-500 mt-2">
                    Estimated time: {orderStatus.estimatedTime} minutes
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grace Period Warning */}
        {canCancelOrder && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      You can still cancel your order
                    </p>
                    <p className="text-xs text-yellow-600">
                      Time remaining: {formatTime(gracePeriodTimeLeft)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { key: 'new', label: 'Order Received', time: '2 min ago' },
                { key: 'accepted', label: 'Order Confirmed', time: orderStatus.status === 'new' ? 'Pending' : '1 min ago' },
                { key: 'ready', label: 'Order Ready', time: ['new', 'accepted'].includes(orderStatus.status) ? 'Pending' : 'Now' },
                { key: 'completed', label: 'Order Completed', time: orderStatus.status !== 'completed' ? 'Pending' : 'Complete' },
              ].map((step, index) => (
                <div key={step.key} className="flex items-center">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    step.key === orderStatus.status
                      ? 'bg-orange-500 text-white'
                      : step.time !== 'Pending'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.time !== 'Pending' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-medium text-gray-900">{step.label}</p>
                    <p className="text-sm text-gray-500">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Call us at</span>
                <a href="tel:(555) 123-4567" className="text-orange-600 font-medium ml-1">
                  (555) 123-4567
                </a>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Our team is available to help with any questions about your order.
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Order Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;