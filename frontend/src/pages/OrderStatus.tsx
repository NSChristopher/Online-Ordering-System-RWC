import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Order, OrderStatus } from '@/types';
import { 
  CheckCircle, 
  Clock, 
  ChefHat, 
  Package, 
  Truck, 
  Store,
  ArrowLeft,
  Phone,
  HelpCircle
} from 'lucide-react';

const OrderStatusPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('new');
  const [estimatedTime, setEstimatedTime] = useState<string>('');

  useEffect(() => {
    // Get order from sessionStorage (in real app, fetch from API)
    const orderData = sessionStorage.getItem('currentOrder');
    if (!orderData) {
      navigate('/');
      return;
    }

    const parsedOrder = JSON.parse(orderData) as Order;
    if (parsedOrder.id.toString() !== orderId) {
      navigate('/');
      return;
    }

    setOrder(parsedOrder);
    setCurrentStatus(parsedOrder.status);
    
    // Set estimated time based on order type and items
    const itemCount = parsedOrder.items.reduce((sum, item) => sum + item.quantity, 0);
    const baseTime = parsedOrder.orderType === 'delivery' ? 45 : 25;
    const additionalTime = Math.max(0, (itemCount - 3) * 5);
    setEstimatedTime(`${baseTime + additionalTime}-${baseTime + additionalTime + 10} minutes`);

    // Mock status updates (in real app, this would be real-time updates)
    const statusProgression: OrderStatus[] = ['accepted', 'preparing', 'ready'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < statusProgression.length && parsedOrder.status !== 'cancelled') {
        setCurrentStatus(statusProgression[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 10000); // Update every 10 seconds for demo

    return () => clearInterval(interval);
  }, [orderId, navigate]);

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return {
          title: 'Order Received',
          description: 'We\'ve received your order and are reviewing it.',
          icon: CheckCircle,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        };
      case 'accepted':
        return {
          title: 'Order Confirmed',
          description: 'Your order has been confirmed and we\'re getting started.',
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        };
      case 'preparing':
        return {
          title: 'Preparing',
          description: 'Our chefs are preparing your delicious meal.',
          icon: ChefHat,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100'
        };
      case 'ready':
        return {
          title: order?.orderType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup',
          description: order?.orderType === 'delivery' 
            ? 'Your order is on the way!' 
            : 'Your order is ready for pickup.',
          icon: order?.orderType === 'delivery' ? Truck : Package,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100'
        };
      case 'completed':
        return {
          title: 'Order Complete',
          description: 'Your order has been delivered/picked up. Enjoy!',
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        };
      case 'cancelled':
        return {
          title: 'Order Cancelled',
          description: 'Your order has been cancelled.',
          icon: CheckCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        };
      case 'rejected':
        return {
          title: 'Order Rejected',
          description: 'Sorry, we couldn\'t fulfill your order at this time.',
          icon: CheckCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        };
      default:
        return {
          title: 'Processing',
          description: 'We\'re working on your order.',
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
    }
  };

  const statusInfo = getStatusInfo(currentStatus);
  const StatusIcon = statusInfo.icon;

  const getProgressSteps = () => {
    const steps = [
      { key: 'new', label: 'Received' },
      { key: 'accepted', label: 'Confirmed' },
      { key: 'preparing', label: 'Preparing' },
      { key: 'ready', label: order?.orderType === 'delivery' ? 'Delivering' : 'Ready' }
    ];

    const statusOrder = ['new', 'accepted', 'preparing', 'ready', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Menu
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Order Status</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Status */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={`w-16 h-16 ${statusInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <StatusIcon className={`h-8 w-8 ${statusInfo.color}`} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {statusInfo.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {statusInfo.description}
              </p>
              {currentStatus === 'preparing' && (
                <p className="text-sm font-medium text-gray-900">
                  Estimated time: {estimatedTime}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        {currentStatus !== 'cancelled' && currentStatus !== 'rejected' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {getProgressSteps().map((step, index) => (
                  <div key={step.key} className="flex-1 flex flex-col items-center relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed
                          ? 'bg-green-500 text-white'
                          : step.active
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <p className={`text-xs mt-2 text-center ${
                      step.completed || step.active ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </p>
                    {index < getProgressSteps().length - 1 && (
                      <div
                        className={`absolute top-4 left-1/2 w-full h-0.5 ${
                          step.completed ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                        style={{ transform: 'translateX(50%)' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Order #{order.id}
              <div className="flex items-center space-x-2">
                {order.orderType === 'delivery' ? (
                  <Truck className="h-5 w-5 text-blue-600" />
                ) : (
                  <Store className="h-5 w-5 text-green-600" />
                )}
                <span className="text-sm font-normal text-gray-600">
                  {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Customer</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{order.customerName}</p>
                  <p>{order.customerPhone}</p>
                </div>
              </div>
              {order.deliveryAddress && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                  <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">{item.itemNameAtOrder}</span>
                      <span className="text-gray-500 ml-2">× {item.quantity}</span>
                    </div>
                    <span className="font-medium">
                      ${(item.priceAtOrder * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 mt-4">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <HelpCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions about your order, feel free to contact us.
              </p>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call Restaurant
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OrderStatusPage;