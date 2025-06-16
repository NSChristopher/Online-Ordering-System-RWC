import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { MenuItem, MenuCategory } from '@/types'
import { Utensils, Plus, Edit, Trash2, Save, X, Eye, EyeOff } from 'lucide-react'

const MenuItemsPage = () => {
  const [categories] = useState<MenuCategory[]>([
    { id: 1, name: "Appetizers", sortOrder: 1 },
    { id: 2, name: "Entrees", sortOrder: 2 },
    { id: 3, name: "Desserts", sortOrder: 3 },
    { id: 4, name: "Beverages", sortOrder: 4 }
  ])

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 1,
      menuCategoryId: 1,
      name: "Queso Dip",
      description: "Creamy white cheese dip served with fresh tortilla chips",
      price: 8.99,
      imageUrl: "/images/queso-dip.jpg",
      visible: true,
      sortOrder: 1
    },
    {
      id: 2,
      menuCategoryId: 1,
      name: "Guacamole",
      description: "Fresh avocado dip made daily with lime and cilantro",
      price: 9.99,
      imageUrl: "/images/guacamole.jpg",
      visible: true,
      sortOrder: 2
    },
    {
      id: 3,
      menuCategoryId: 2,
      name: "Chicken Enchiladas",
      description: "Three cheese enchiladas topped with our signature red sauce",
      price: 16.99,
      imageUrl: "/images/chicken-enchiladas.jpg",
      visible: true,
      sortOrder: 1
    }
  ])

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState<MenuItem>({
    menuCategoryId: 1,
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    visible: true,
    sortOrder: 1
  })
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const filteredItems = selectedCategory 
    ? menuItems.filter(item => item.menuCategoryId === selectedCategory)
    : menuItems

  const getCategoryName = (categoryId: number) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown'
  }

  const handleAdd = async () => {
    if (!newItem.name.trim()) {
      toast.error('Item name is required')
      return
    }

    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newId = Math.max(...menuItems.map(item => item.id || 0)) + 1
      const itemToAdd = { ...newItem, id: newId }
      
      setMenuItems([...menuItems, itemToAdd])
      setNewItem({
        menuCategoryId: 1,
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        visible: true,
        sortOrder: 1
      })
      setShowAddForm(false)
      toast.success('Menu item added successfully!')
    } catch (error) {
      toast.error('Failed to add menu item')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem({ ...item })
  }

  const handleSave = async () => {
    if (!editingItem?.name.trim()) {
      toast.error('Item name is required')
      return
    }

    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setMenuItems(menuItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      ))
      setEditingItem(null)
      toast.success('Menu item updated successfully!')
    } catch (error) {
      toast.error('Failed to update menu item')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return
    }

    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setMenuItems(menuItems.filter(item => item.id !== id))
      toast.success('Menu item deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete menu item')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleVisibility = async (id: number) => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setMenuItems(menuItems.map(item => 
        item.id === id ? { ...item, visible: !item.visible } : item
      ))
      toast.success('Item visibility updated!')
    } catch (error) {
      toast.error('Failed to update visibility')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Utensils className="h-8 w-8 mr-3" />
            Menu Items
          </h1>
          <p className="text-gray-600 mt-2">
            Manage individual menu items, pricing, and availability
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Filter by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id!)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Item Form */}
      {showAddForm && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Add New Menu Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Item Name</Label>
                <Input
                  id="new-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Enter item name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-price">Price</Label>
                <Input
                  id="new-price"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-category">Category</Label>
              <select
                id="new-category"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={newItem.menuCategoryId}
                onChange={(e) => setNewItem({ ...newItem, menuCategoryId: parseInt(e.target.value) })}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-description">Description</Label>
              <textarea
                id="new-description"
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Enter item description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-image">Image URL</Label>
              <Input
                id="new-image"
                value={newItem.imageUrl}
                onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                placeholder="Enter image URL"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="new-visible"
                checked={newItem.visible}
                onChange={(e) => setNewItem({ ...newItem, visible: e.target.checked })}
              />
              <Label htmlFor="new-visible">Visible to customers</Label>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleAdd} disabled={loading}>
                {loading ? 'Adding...' : 'Add Item'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Items List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              {editingItem?.id === item.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Item Name</Label>
                      <Input
                        value={editingItem?.name || ''}
                        onChange={(e) => setEditingItem(editingItem ? { 
                          ...editingItem, 
                          name: e.target.value 
                        } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={editingItem?.price || 0}
                        onChange={(e) => setEditingItem(editingItem ? { 
                          ...editingItem, 
                          price: parseFloat(e.target.value) || 0 
                        } : null)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <textarea
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={editingItem?.description || ''}
                      onChange={(e) => setEditingItem(editingItem ? { 
                        ...editingItem, 
                        description: e.target.value 
                      } : null)}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleSave} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingItem(null)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <span className="text-lg font-bold text-green-600">
                        ${item.price.toFixed(2)}
                      </span>
                      {!item.visible && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    <p className="text-sm text-gray-500">
                      Category: {getCategoryName(item.menuCategoryId)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleVisibility(item.id!)}
                      disabled={loading}
                    >
                      {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(item.id!)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              {selectedCategory 
                ? `No menu items found in ${getCategoryName(selectedCategory)} category`
                : 'No menu items found'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default MenuItemsPage