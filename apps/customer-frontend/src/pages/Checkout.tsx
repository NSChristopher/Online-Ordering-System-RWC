import React, { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, MapPin, Truck, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useCart } from '../contexts/CartContext';
import { Order, submitOrder } from '../services/menuService';
import { toast } from 'sonner';

const Checkout: React.FC = () => {
  const { state: cartState, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [orderType, setOrderType] = useState<'delivery' | 'to-go'>('to-go');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartState.total;
  const tax = subtotal * 0.0825;
  const deliveryFee = orderType === 'delivery' ? 3.99 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async () => {
    // Validation
    if (!customerInfo.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    if (!customerInfo.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    if (orderType === 'delivery' && !customerInfo.address.trim()) {
      toast.error('Please enter your delivery address');
      return;
    }

    setIsSubmitting(true);

    try {
      const order: Order = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email || undefined,
        deliveryAddress: orderType === 'delivery' ? customerInfo.address : undefined,
        orderType,
        total,
        status: 'new',
        paymentMethod: 'cash', // For MVP, using cash payment
        items: cartState.items,
      };

      const result = await submitOrder(order);
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/order-status/${result.id}`);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartState.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link to="/cart" className="mr-4">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            {/* Order Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Order Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setOrderType('to-go')}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      orderType === 'to-go'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <Package className="h-5 w-5 mr-2 text-orange-500" />
                      <span className="font-medium">Pickup</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ready in 15-20 minutes
                    </p>
                  </button>
                  
                  <button
                    onClick={() => setOrderType('delivery')}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      orderType === 'delivery'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <Truck className="h-5 w-5 mr-2 text-orange-500" />
                      <span className="font-medium">Delivery</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      30-45 minutes • $3.99 fee
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email (Optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className="mt-1"
                  />
                </div>

                {orderType === 'delivery' && (
                  <div>
                    <Label htmlFor="address" className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Delivery Address *
                    </Label>
                    <Input
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main St, City, State 12345"
                      className="mt-1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Cash payment only</strong> - Pay when you {orderType === 'delivery' ? 'receive your order' : 'pick up your order'}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cartState.items.map((item) => (
                    <div key={item.menuItem.id} className="flex justify-between">
                      <div className="flex-1">
                        <span className="font-medium">{item.menuItem.name}</span>
                        <span className="text-gray-600 ml-2">×{item.quantity}</span>
                      </div>
                      <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Tax (8.25%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    
                    {orderType === 'delivery' && (
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-green-600">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-lg py-3"
                  size="lg"
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </Button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  By placing this order, you agree to pay the total amount shown above.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;