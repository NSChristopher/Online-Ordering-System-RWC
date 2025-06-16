import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/useCart';
import { Order } from '@/types';
import { ArrowLeft, CreditCard, Banknote, Truck, Store } from 'lucide-react';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    paymentMethod: 'card' as 'card' | 'cash'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    }

    if (cart.orderType === 'delivery' && !formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Mock order creation - in real app this would call an API
      const orderId = Date.now(); // Generate a single timestamp for the order
      const order: Order = {
        id: orderId, // Use the stored timestamp
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        deliveryAddress: cart.orderType === 'delivery' ? formData.deliveryAddress : undefined,
        orderType: cart.orderType,
        total: cart.total,
        status: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: formData.paymentMethod,
        items: cart.items.map(item => ({
          id: Date.now() + Math.random(), // Mock ID
          orderId: Date.now(),
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          priceAtOrder: item.menuItem.price,
          itemNameAtOrder: item.menuItem.name
        }))
      };

      // Store order in sessionStorage for order confirmation page
      sessionStorage.setItem('currentOrder', JSON.stringify(order));
      
      // Clear cart and navigate to confirmation
      clearCart();
      navigate('/order-confirmation');
      
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Your cart is empty</CardTitle>
            <CardDescription>
              Add some items to your cart before checking out.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
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
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Type */}
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  {cart.orderType === 'delivery' ? (
                    <Truck className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Store className="h-5 w-5 text-green-600" />
                  )}
                  <span className="font-medium">
                    {cart.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.menuItem.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.menuItem.name}</p>
                        <p className="text-sm text-gray-500">
                          ${item.menuItem.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      className={errors.customerName ? 'border-red-500' : ''}
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      className={errors.customerPhone ? 'border-red-500' : ''}
                    />
                    {errors.customerPhone && (
                      <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="customerEmail">Email (Optional)</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              {cart.orderType === 'delivery' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="deliveryAddress">Address *</Label>
                      <Input
                        id="deliveryAddress"
                        type="text"
                        placeholder="123 Main St, City, State 12345"
                        value={formData.deliveryAddress}
                        onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                        className={errors.deliveryAddress ? 'border-red-500' : ''}
                      />
                      {errors.deliveryAddress && (
                        <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>
                    Payment is processed at pickup/delivery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={formData.paymentMethod === 'card' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('paymentMethod', 'card')}
                      className="flex items-center justify-center space-x-2 h-16"
                    >
                      <CreditCard className="h-5 w-5" />
                      <span>Card</span>
                    </Button>
                    <Button
                      type="button"
                      variant={formData.paymentMethod === 'cash' ? 'default' : 'outline'}
                      onClick={() => handleInputChange('paymentMethod', 'cash')}
                      className="flex items-center justify-center space-x-2 h-16"
                    >
                      <Banknote className="h-5 w-5" />
                      <span>Cash</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-lg"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Place Order • $${cart.total.toFixed(2)}`}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;