import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MenuItem } from '@/types';
import { Plus, Minus, X } from 'lucide-react';

interface MenuItemModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    onClose();
    setQuantity(1); // Reset quantity for next time
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl font-bold pr-4">{item.name}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {item.imageUrl && (
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              ${item.price.toFixed(2)}
            </Badge>
            {item.category && (
              <Badge variant="outline">
                {item.category.name}
              </Badge>
            )}
          </div>
          
          {item.description && (
            <p className="text-gray-600 leading-relaxed">
              {item.description}
            </p>
          )}
          
          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-4">
            <span className="font-medium text-gray-900">Quantity</span>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium text-lg w-8 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={incrementQuantity}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full h-12 text-lg"
            size="lg"
          >
            Add {quantity} to Cart • ${(item.price * quantity).toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemModal;