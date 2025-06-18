import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Order } from '@/types';
import { useOrders } from '@/hooks/useOrders';
import { CheckCircle, Clock, Edit, X, Truck, Store, Loader2 } from 'lucide-react';

const GRACE_PERIOD_MINUTES = 5;

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { getOrderById, cancelOrder } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(GRACE_PERIOD_MINUTES * 60);
  const [gracePeriodExpired, setGracePeriodExpired] = useState(false);

  useEffect(() => {
    // Get order ID from sessionStorage
    const orderIdStr = sessionStorage.getItem('currentOrderId');
    if (!orderIdStr) {
      navigate('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        const orderId = parseInt(orderIdStr);
        const fetchedOrder = await getOrderById(orderId);
        if (fetchedOrder) {
          setOrder(fetchedOrder);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [navigate, getOrderById]);

  useEffect(() => {
    // Grace period countdown
    if (timeRemaining <= 0) {
      setGracePeriodExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setGracePeriodExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEditOrder = () => {
    if (gracePeriodExpired) return;
    
    // In a real app, you'd restore the cart from the order
    // For now, just navigate back to menu
    navigate('/');
  };

  const handleCancelOrder = async () => {
    if (gracePeriodExpired || !order) return;
    
    setCancelling(true);
    try {
      const cancelledOrder = await cancelOrder(order.id);
      setOrder(cancelledOrder);
    } catch (error) {
      console.error('Error cancelling order:', error);
    } finally {
      setCancelling(false);
    }
  };

  const handleTrackOrder = () => {
    if (order) {
      navigate(`/order-status/${order.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {order.status === 'cancelled' ? 'Order Cancelled' : 'Order Placed Successfully!'}
          </h1>
          <p className="text-gray-600">
            {order.status === 'cancelled' 
              ? 'Your order has been cancelled.'
              : 'Thank you for your order. We\'ll start preparing it soon.'}
          </p>
        </div>

        {/* Grace Period Timer */}
        {!gracePeriodExpired && order.status !== 'cancelled' && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold text-orange-900">
                    Grace Period: {formatTime(timeRemaining)}
                  </span>
                </div>
                <p className="text-sm text-orange-700 mb-4">
                  You have {GRACE_PERIOD_MINUTES} minutes to edit or cancel your order.
                </p>
                <div className="flex space-x-3 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditOrder}
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Order
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    {cancelling ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <X className="h-4 w-4 mr-2" />
                    )}
                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                  </Button>
                </div>
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
            {/* Customer Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Name:</strong> {order.customerName}</p>
                <p><strong>Phone:</strong> {order.customerPhone}</p>
                {order.customerEmail && (
                  <p><strong>Email:</strong> {order.customerEmail}</p>
                )}
                {order.deliveryAddress && (
                  <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
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
            </div>

            {/* Payment & Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Payment Method:</span>
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {order.status !== 'cancelled' && (
            <Button
              onClick={handleTrackOrder}
              className="w-full h-12 text-lg"
              size="lg"
            >
              Track Your Order
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full"
          >
            {order.status === 'cancelled' ? 'Back to Menu' : 'Order More'}
          </Button>
        </div>

        {/* Order Status Info */}
        {!gracePeriodExpired && order.status !== 'cancelled' && (
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <p className="text-blue-900 font-medium mb-2">What happens next?</p>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• We'll review and confirm your order</p>
                <p>• You'll receive updates on your order status</p>
                <p>• {order.orderType === 'delivery' 
                    ? 'We\'ll deliver to your address' 
                    : 'We\'ll prepare your order for pickup'}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default OrderConfirmation;