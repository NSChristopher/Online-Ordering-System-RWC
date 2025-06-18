import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MenuCategory, MenuItem, CreateMenuCategoryData, UpdateMenuCategoryData, CreateMenuItemData, UpdateMenuItemData } from '@/types';
import api from '@/lib/api';

export const useMenu = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all categories with their items
  const fetchCategories = async () => {
    try {
      const response = await api.get('/menu/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  // Fetch all items
  const fetchItems = async () => {
    try {
      const response = await api.get('/menu/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load menu items');
    }
  };

  // Create category
  const createCategory = async (data: CreateMenuCategoryData) => {
    try {
      const response = await api.post('/menu/categories', data);
      await fetchCategories(); // Refresh categories
      toast.success('Category created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
      throw error;
    }
  };

  // Update category
  const updateCategory = async (id: number, data: UpdateMenuCategoryData) => {
    try {
      const response = await api.put(`/menu/categories/${id}`, data);
      await fetchCategories(); // Refresh categories
      toast.success('Category updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
      throw error;
    }
  };

  // Delete category
  const deleteCategory = async (id: number) => {
    try {
      await api.delete(`/menu/categories/${id}`);
      await fetchCategories(); // Refresh categories
      toast.success('Category deleted successfully');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      if (error.response?.status === 400) {
        toast.error('Cannot delete category with menu items');
      } else {
        toast.error('Failed to delete category');
      }
      throw error;
    }
  };

  // Create item
  const createItem = async (data: CreateMenuItemData) => {
    try {
      const response = await api.post('/menu/items', data);
      await fetchCategories(); // Refresh categories to update items
      await fetchItems(); // Refresh items
      toast.success('Menu item created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error('Failed to create menu item');
      throw error;
    }
  };

  // Update item
  const updateItem = async (id: number, data: UpdateMenuItemData) => {
    try {
      const response = await api.put(`/menu/items/${id}`, data);
      await fetchCategories(); // Refresh categories to update items
      await fetchItems(); // Refresh items
      toast.success('Menu item updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update menu item');
      throw error;
    }
  };

  // Delete item
  const deleteItem = async (id: number) => {
    try {
      await api.delete(`/menu/items/${id}`);
      await fetchCategories(); // Refresh categories to update items
      await fetchItems(); // Refresh items
      toast.success('Menu item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete menu item');
      throw error;
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchCategories(), fetchItems()]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    categories,
    items,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    createItem,
    updateItem,
    deleteItem,
    refreshData: () => Promise.all([fetchCategories(), fetchItems()]),
  };
};