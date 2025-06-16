import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { MenuCategory } from '@/types'
import { Grid3X3, Plus, Edit, Trash2, Save, X, ArrowUp, ArrowDown } from 'lucide-react'

const MenuCategoriesPage = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([
    { id: 1, name: "Appetizers", sortOrder: 1 },
    { id: 2, name: "Entrees", sortOrder: 2 },
    { id: 3, name: "Desserts", sortOrder: 3 },
    { id: 4, name: "Beverages", sortOrder: 4 }
  ])
  
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategory, setNewCategory] = useState<MenuCategory>({ name: '', sortOrder: categories.length + 1 })
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required')
      return
    }

    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newId = Math.max(...categories.map(c => c.id || 0)) + 1
      const categoryToAdd = { ...newCategory, id: newId }
      
      setCategories([...categories, categoryToAdd])
      setNewCategory({ name: '', sortOrder: categories.length + 2 })
      setShowAddForm(false)
      toast.success('Category added successfully!')
    } catch (error) {
      toast.error('Failed to add category')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category: MenuCategory) => {
    setEditingCategory({ ...category })
  }

  const handleSave = async () => {
    if (!editingCategory?.name.trim()) {
      toast.error('Category name is required')
      return
    }

    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      ))
      setEditingCategory(null)
      toast.success('Category updated successfully!')
    } catch (error) {
      toast.error('Failed to update category')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }

    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setCategories(categories.filter(cat => cat.id !== id))
      toast.success('Category deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete category')
    } finally {
      setLoading(false)
    }
  }

  const handleReorder = (id: number, direction: 'up' | 'down') => {
    const categoryIndex = categories.findIndex(cat => cat.id === id)
    if ((direction === 'up' && categoryIndex === 0) || 
        (direction === 'down' && categoryIndex === categories.length - 1)) {
      return
    }

    const newCategories = [...categories]
    const targetIndex = direction === 'up' ? categoryIndex - 1 : categoryIndex + 1
    
    // Swap sort orders
    const temp = newCategories[categoryIndex].sortOrder
    newCategories[categoryIndex].sortOrder = newCategories[targetIndex].sortOrder
    newCategories[targetIndex].sortOrder = temp
    
    // Swap positions
    ;[newCategories[categoryIndex], newCategories[targetIndex]] = 
     [newCategories[targetIndex], newCategories[categoryIndex]]
    
    setCategories(newCategories)
    toast.success('Category order updated!')
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Grid3X3 className="h-8 w-8 mr-3" />
            Menu Categories
          </h1>
          <p className="text-gray-600 mt-2">
            Organize your menu into categories like appetizers, entrees, etc.
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Category Name</Label>
              <Input
                id="new-name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAdd} disabled={loading}>
                {loading ? 'Adding...' : 'Add Category'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category, index) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              {editingCategory?.id === category.id ? (
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      value={editingCategory?.name || ''}
                      onChange={(e) => setEditingCategory(editingCategory ? { 
                        ...editingCategory, 
                        name: e.target.value 
                      } : null)}
                      placeholder="Category name"
                    />
                  </div>
                  <Button onClick={handleSave} disabled={loading} size="sm">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingCategory(null)} 
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-600">Sort Order: {category.sortOrder}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(category.id!, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(category.id!, 'down')}
                      disabled={index === categories.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(category.id!)}
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
    </div>
  )
}

export default MenuCategoriesPage