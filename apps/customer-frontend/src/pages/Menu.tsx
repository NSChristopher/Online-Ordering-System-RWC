import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Phone, Clock, MapPin, User, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useCart } from '../contexts/CartContext';
import {
  BusinessInfo,
  MenuCategory,
  MenuItem,
  getBusinessInfo,
  getMenuCategories,
  getMenuItems,
} from '../services/menuService';

const Menu: React.FC = () => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  
  const { state: cartState, addItem, updateQuantity } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [businessData, categoriesData, itemsData] = await Promise.all([
          getBusinessInfo(),
          getMenuCategories(),
          getMenuItems(),
        ]);
        
        setBusinessInfo(businessData);
        setCategories(categoriesData);
        setMenuItems(itemsData);
        setActiveCategory(categoriesData[0]?.id || null);
      } catch (error) {
        console.error('Error loading menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getItemsForCategory = (categoryId: number) => {
    return menuItems.filter(item => item.menuCategoryId === categoryId);
  };

  const getItemQuantityInCart = (itemId: number) => {
    const cartItem = cartState.items.find(item => item.menuItem.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {businessInfo?.name || "Rosa's Cafe"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {businessInfo?.phone}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Open Now
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link to="/order-history">
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    <Package className="h-4 w-4 mr-1" />
                    Orders
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    <User className="h-4 w-4 mr-1" />
                    Profile
                  </Button>
                </Link>
                <Link to="/cart">
                  <Button className="relative bg-orange-500 hover:bg-orange-600">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart
                    {cartState.itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                        {cartState.itemCount}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Business Info */}
      {businessInfo && (
        <div className="bg-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Welcome to {businessInfo.name}</h2>
                <div className="flex items-center text-orange-100">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{businessInfo.address}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-orange-100 text-sm">
                  <div className="flex items-center md:justify-end">
                    <Clock className="h-4 w-4 mr-1" />
                    {businessInfo.hours}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className={activeCategory === category.id ? 'block' : 'hidden'}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{category.name}</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getItemsForCategory(category.id).map((item) => {
                  const quantityInCart = getItemQuantityInCart(item.id);
                  return (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {item.imageUrl && (
                        <div className="aspect-video bg-gray-200">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            <CardDescription className="mt-1 text-sm">
                              {item.description}
                            </CardDescription>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-lg font-bold text-green-600">
                              ${item.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          {quantityInCart > 0 ? (
                            <div className="flex items-center space-x-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateQuantity(item.id, quantityInCart - 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-medium">{quantityInCart}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateQuantity(item.id, quantityInCart + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleAddToCart(item)}
                              className="bg-orange-500 hover:bg-orange-600"
                              size="sm"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {cartState.itemCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 md:hidden">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{cartState.itemCount} items</div>
                <div className="text-lg font-bold text-green-600">
                  ${cartState.total.toFixed(2)}
                </div>
              </div>
              <Link to="/cart">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;