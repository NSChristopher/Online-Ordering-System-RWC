import React from 'react';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const { state: cartState, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <Link to="/" className="mr-4">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Menu
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Add some delicious items from our menu to get started!
            </p>
            <Link to="/">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Browse Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Menu
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {cartState.items.map((item) => (
            <Card key={item.menuItem.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {item.menuItem.imageUrl && (
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={item.menuItem.imageUrl}
                        alt={item.menuItem.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {item.menuItem.name}
                    </h3>
                    {item.menuItem.description && (
                      <p className="text-sm text-gray-600 truncate">
                        {item.menuItem.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-lg font-bold text-green-600">
                        ${item.menuItem.price.toFixed(2)} each
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.menuItem.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.menuItem.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.menuItem.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <Card className="mt-8 bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-base">
                <span>Subtotal ({cartState.itemCount} items)</span>
                <span>${cartState.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Tax (8.25%)</span>
                <span>${(cartState.total * 0.0825).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">
                    ${(cartState.total * 1.0825).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-lg py-3"
              size="lg"
            >
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>

        {/* Additional Actions */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;