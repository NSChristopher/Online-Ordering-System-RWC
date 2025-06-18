import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MenuCategory, MenuItem } from '@/types';
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

  // Helper function to get items by category
  const getItemsByCategory = (categoryId: number): MenuItem[] => {
    return items.filter(item => item.menuCategoryId === categoryId && item.visible);
  };

  // Helper function to get item by id
  const getItemById = (itemId: number): MenuItem | undefined => {
    return items.find(item => item.id === itemId);
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
    getItemsByCategory,
    getItemById,
    refreshData: () => Promise.all([fetchCategories(), fetchItems()]),
  };
};