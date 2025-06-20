import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useBusinessInfo } from '@/hooks/useBusinessInfo';
import { useMenu } from '@/hooks/useMenu';
import { MenuItem } from '@/types';
import { Search, Plus, ShoppingCart, Clock, MapPin, Phone, Loader2 } from 'lucide-react';
import MenuItemModal from '@/components/MenuItemModal';
import CartDrawer from '@/components/CartDrawer';

const Menu = () => {
  const { cart, addItem } = useCart();
  const { businessInfo, loading: businessLoading } = useBusinessInfo();
  const { categories, items, loading: menuLoading, getItemsByCategory } = useMenu();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const loading = businessLoading || menuLoading;

  // Get business hours status
  const isOpen = true; // Mock - always open for demo

  // Filter items based on category and search
  const filteredItems = useMemo(() => {
    let filteredItems = selectedCategory 
      ? getItemsByCategory(selectedCategory)
      : items.filter(item => item.visible);

    if (searchQuery) {
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredItems;
  }, [selectedCategory, searchQuery, items, getItemsByCategory]);

  const handleAddToCart = (item: MenuItem, quantity = 1) => {
    addItem(item, quantity);
  };

  const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (!businessInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Unable to load business information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{businessInfo.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                {businessInfo.address && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">{businessInfo.address}</span>
                  </div>
                )}
                {businessInfo.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    <span>{businessInfo.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="bg-white border-b sticky top-[88px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 py-4 overflow-x-auto">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="whitespace-nowrap"
            >
              All Items
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Menu Items */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div onClick={() => setSelectedItem(item)}>
                  {item.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge variant="secondary" className="ml-2">
                        ${item.price.toFixed(2)}
                      </Badge>
                    </div>
                    {item.description && (
                      <CardDescription className="text-sm line-clamp-2">
                        {item.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                </div>
                <CardContent className="pt-0">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    className="w-full"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-50">
          <Button
            onClick={() => setIsCartOpen(true)}
            className="w-full h-14 text-lg shadow-lg"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {cartItemCount} item{cartItemCount !== 1 ? 's' : ''} • ${cart.total.toFixed(2)}
          </Button>
        </div>
      )}

      {/* Modals */}
      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default Menu;