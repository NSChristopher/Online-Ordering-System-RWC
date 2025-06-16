import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMenu } from '@/hooks/useMenu';
import { useBusiness } from '@/hooks/useBusiness';
import { MenuCategory, MenuItem, UpdateBusinessInfoData } from '@/types';
import { Plus, Edit, Trash2, Settings, Menu, Store } from 'lucide-react';

const Admin = () => {
  const { categories, loading: menuLoading, createCategory, updateCategory, deleteCategory, createItem, updateItem, deleteItem } = useMenu();
  const { businessInfo, loading: businessLoading, updateBusinessInfo } = useBusiness();
  
  const [activeTab, setActiveTab] = useState<'menu' | 'business'>('menu');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    sortOrder: 0,
  });
  
  const [itemFormData, setItemFormData] = useState({
    menuCategoryId: 0,
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    visible: true,
    sortOrder: 0,
  });
  
  const [businessFormData, setBusinessFormData] = useState<UpdateBusinessInfoData>({
    name: businessInfo?.name || '',
    address: businessInfo?.address || '',
    phone: businessInfo?.phone || '',
    hours: businessInfo?.hours || '',
    logoUrl: businessInfo?.logoUrl || '',
  });

  // Update business form data when businessInfo changes
  React.useEffect(() => {
    if (businessInfo) {
      setBusinessFormData({
        name: businessInfo.name,
        address: businessInfo.address || '',
        phone: businessInfo.phone || '',
        hours: businessInfo.hours || '',
        logoUrl: businessInfo.logoUrl || '',
      });
    }
  }, [businessInfo]);

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name) return;

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryFormData);
        setEditingCategory(null);
      } else {
        await createCategory(categoryFormData);
      }
      setShowCategoryForm(false);
      setCategoryFormData({ name: '', sortOrder: 0 });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemFormData.name || !itemFormData.price || !itemFormData.menuCategoryId) return;

    try {
      if (editingItem) {
        await updateItem(editingItem.id, itemFormData);
        setEditingItem(null);
      } else {
        await createItem(itemFormData);
      }
      setShowItemForm(false);
      setItemFormData({
        menuCategoryId: 0,
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        visible: true,
        sortOrder: 0,
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessFormData.name) return;

    try {
      await updateBusinessInfo(businessFormData);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      sortOrder: category.sortOrder,
    });
    setShowCategoryForm(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemFormData({
      menuCategoryId: item.menuCategoryId,
      name: item.name,
      description: item.description || '',
      price: item.price,
      imageUrl: item.imageUrl || '',
      visible: item.visible,
      sortOrder: item.sortOrder,
    });
    setShowItemForm(true);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditingItem(null);
    setShowCategoryForm(false);
    setShowItemForm(false);
    setCategoryFormData({ name: '', sortOrder: 0 });
    setItemFormData({
      menuCategoryId: 0,
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      visible: true,
      sortOrder: 0,
    });
  };

  const handleDeleteCategory = async (category: MenuCategory) => {
    if (confirm(`Are you sure you want to delete "${category.name}"? This cannot be undone.`)) {
      try {
        await deleteCategory(category.id);
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  const handleDeleteItem = async (item: MenuItem) => {
    if (confirm(`Are you sure you want to delete "${item.name}"? This cannot be undone.`)) {
      try {
        await deleteItem(item.id);
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  if (menuLoading || businessLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">Loading Admin Portal...</div>
          <div className="text-gray-600 mt-2">Please wait while we load your data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
            </div>
            <div className="text-sm text-gray-600">
              Restaurant Management System
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'menu'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Menu className="h-4 w-4 inline mr-2" />
              Menu Management
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'business'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Store className="h-4 w-4 inline mr-2" />
              Business Information
            </button>
          </nav>
        </div>

        {/* Menu Management Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-8">
            {/* Categories Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Menu Categories</h2>
                <Button
                  onClick={() => setShowCategoryForm(true)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Category</span>
                </Button>
              </div>

              {/* Category Form */}
              {showCategoryForm && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="categoryName">Category Name</Label>
                          <Input
                            id="categoryName"
                            type="text"
                            value={categoryFormData.name}
                            onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="categorySortOrder">Sort Order</Label>
                          <Input
                            id="categorySortOrder"
                            type="number"
                            value={categoryFormData.sortOrder}
                            onChange={(e) => setCategoryFormData({ ...categoryFormData, sortOrder: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button type="submit">
                          {editingCategory ? 'Update Category' : 'Create Category'}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Categories List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <CardDescription>
                            {category.items?.length || 0} items • Sort: {category.sortOrder}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(category)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {category.items && category.items.length > 0 && (
                      <CardContent>
                        <div className="space-y-2">
                          {category.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="text-sm text-gray-600">
                              {item.name} - ${item.price.toFixed(2)}
                            </div>
                          ))}
                          {category.items.length > 3 && (
                            <div className="text-sm text-gray-500">
                              and {category.items.length - 3} more items...
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Menu Items Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Menu Items</h2>
                <Button
                  onClick={() => setShowItemForm(true)}
                  className="flex items-center space-x-2"
                  disabled={categories.length === 0}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </Button>
              </div>

              {categories.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">Create a category first before adding menu items.</p>
                  </CardContent>
                </Card>
              )}

              {/* Item Form */}
              {showItemForm && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>{editingItem ? 'Edit Menu Item' : 'Create New Menu Item'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleItemSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="itemCategory">Category</Label>
                          <select
                            id="itemCategory"
                            value={itemFormData.menuCategoryId}
                            onChange={(e) => setItemFormData({ ...itemFormData, menuCategoryId: parseInt(e.target.value) })}
                            required
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value={0}>Select a category</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="itemName">Item Name</Label>
                          <Input
                            id="itemName"
                            type="text"
                            value={itemFormData.name}
                            onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="itemPrice">Price ($)</Label>
                          <Input
                            id="itemPrice"
                            type="number"
                            step="0.01"
                            min="0"
                            value={itemFormData.price}
                            onChange={(e) => setItemFormData({ ...itemFormData, price: parseFloat(e.target.value) || 0 })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="itemSortOrder">Sort Order</Label>
                          <Input
                            id="itemSortOrder"
                            type="number"
                            value={itemFormData.sortOrder}
                            onChange={(e) => setItemFormData({ ...itemFormData, sortOrder: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="itemDescription">Description</Label>
                        <textarea
                          id="itemDescription"
                          className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={itemFormData.description}
                          onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="itemImageUrl">Image URL (optional)</Label>
                        <Input
                          id="itemImageUrl"
                          type="url"
                          value={itemFormData.imageUrl}
                          onChange={(e) => setItemFormData({ ...itemFormData, imageUrl: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="itemVisible"
                          checked={itemFormData.visible}
                          onChange={(e) => setItemFormData({ ...itemFormData, visible: e.target.checked })}
                        />
                        <Label htmlFor="itemVisible">Visible to customers</Label>
                      </div>
                      <div className="flex space-x-2">
                        <Button type="submit">
                          {editingItem ? 'Update Item' : 'Create Item'}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Items List */}
              <div className="space-y-6">
                {categories.map((category) => 
                  category.items && category.items.length > 0 ? (
                    <div key={category.id}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.items.map((item) => (
                          <Card key={item.id}>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <CardTitle className="text-base">{item.name}</CardTitle>
                                  <CardDescription>${item.price.toFixed(2)}</CardDescription>
                                  {item.description && (
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex space-x-1 ml-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEditItem(item)}>
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleDeleteItem(item)}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex justify-between text-sm text-gray-500">
                                <span>Sort: {item.sortOrder}</span>
                                <span className={item.visible ? 'text-green-600' : 'text-red-600'}>
                                  {item.visible ? 'Visible' : 'Hidden'}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        )}

        {/* Business Information Tab */}
        {activeTab === 'business' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Business Information</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Details</CardTitle>
                <CardDescription>
                  Update your restaurant's basic information that customers will see
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBusinessSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="businessName">Restaurant Name</Label>
                      <Input
                        id="businessName"
                        type="text"
                        value={businessFormData.name}
                        onChange={(e) => setBusinessFormData({ ...businessFormData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessPhone">Phone Number</Label>
                      <Input
                        id="businessPhone"
                        type="tel"
                        value={businessFormData.phone}
                        onChange={(e) => setBusinessFormData({ ...businessFormData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="businessAddress">Address</Label>
                    <Input
                      id="businessAddress"
                      type="text"
                      value={businessFormData.address}
                      onChange={(e) => setBusinessFormData({ ...businessFormData, address: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="businessHours">Operating Hours</Label>
                    <textarea
                      id="businessHours"
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={businessFormData.hours}
                      onChange={(e) => setBusinessFormData({ ...businessFormData, hours: e.target.value })}
                      placeholder="e.g., Mon-Thu: 11am-9pm, Fri-Sat: 11am-10pm, Sun: 12pm-8pm"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="businessLogo">Logo URL (optional)</Label>
                    <Input
                      id="businessLogo"
                      type="url"
                      value={businessFormData.logoUrl}
                      onChange={(e) => setBusinessFormData({ ...businessFormData, logoUrl: e.target.value })}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full md:w-auto">
                    Update Business Information
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;