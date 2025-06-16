import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingCart, Truck, Store } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeItem, setOrderType } = useCart();

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: number) => {
    removeItem(itemId);
  };

  const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Your Cart
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
            <p className="text-gray-400 text-sm mb-4">Add some delicious items to get started!</p>
            <Button onClick={onClose}>Continue Shopping</Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Your Cart ({cartItemCount} item{cartItemCount !== 1 ? 's' : ''})
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {cart.items.map((item) => (
            <div key={item.menuItem.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              {item.menuItem.imageUrl && (
                <img
                  src={item.menuItem.imageUrl}
                  alt={item.menuItem.name}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {item.menuItem.name}
                </h4>
                <p className="text-sm text-gray-500">
                  ${item.menuItem.price.toFixed(2)} each
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.menuItem.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="font-medium text-sm w-8 text-center">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.menuItem.id, item.quantity + 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.menuItem.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 ml-2"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary">
                  ${(item.menuItem.price * item.quantity).toFixed(2)}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Order Type Selection */}
        <div className="border-t pt-4 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Order Type</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={cart.orderType === 'to-go' ? 'default' : 'outline'}
                onClick={() => setOrderType('to-go')}
                className="flex items-center justify-center space-x-2"
              >
                <Store className="h-4 w-4" />
                <span>Pickup</span>
              </Button>
              <Button
                variant={cart.orderType === 'delivery' ? 'default' : 'outline'}
                onClick={() => setOrderType('delivery')}
                className="flex items-center justify-center space-x-2"
              >
                <Truck className="h-4 w-4" />
                <span>Delivery</span>
              </Button>
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2 py-3 border-t">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Link to="/checkout" onClick={onClose}>
            <Button className="w-full h-12 text-lg" size="lg">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;