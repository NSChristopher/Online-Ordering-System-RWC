import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartItem, MenuItem } from '../types';

interface CartContextType {
  cart: Cart;
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  setOrderType: (type: 'delivery' | 'to-go') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialCart: Cart = {
  items: [],
  orderType: 'to-go',
  total: 0
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(initialCart);

  // Calculate total whenever items change
  useEffect(() => {
    const total = cart.items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
    setCart(prevCart => ({ ...prevCart, total }));
  }, [cart.items]);

  const addItem = (item: MenuItem, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(cartItem => cartItem.menuItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex].quantity += quantity;
        return { ...prevCart, items: updatedItems };
      } else {
        // Add new item
        const newItem: CartItem = { menuItem: item, quantity };
        return { ...prevCart, items: [...prevCart.items, newItem] };
      }
    });
  };

  const removeItem = (itemId: number) => {
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.filter(item => item.menuItem.id !== itemId)
    }));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.map(item =>
        item.menuItem.id === itemId ? { ...item, quantity } : item
      )
    }));
  };

  const clearCart = () => {
    setCart(initialCart);
  };

  const setOrderType = (type: 'delivery' | 'to-go') => {
    setCart(prevCart => ({ ...prevCart, orderType: type }));
  };

  const value: CartContextType = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setOrderType
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};