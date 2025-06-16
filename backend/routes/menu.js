const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all menu categories with their items
router.get('/categories', async (req, res) => {
  try {
    const categories = db.menuCategory.findMany();
    const categoriesWithItems = categories.map(category => ({
      ...category,
      items: db.menuItem.findMany({ where: { menuCategoryId: category.id } })
    }));
    
    res.json(categoriesWithItems);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single category
router.get('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = db.menuCategory.findUnique({ where: { id: parseInt(id) } });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const items = db.menuItem.findMany({ where: { menuCategoryId: category.id } });
    res.json({ ...category, items });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new category
router.post('/categories', async (req, res) => {
  try {
    const { name, sortOrder } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const category = db.menuCategory.create({
      data: { name, sortOrder: sortOrder || 0 }
    });
    
    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update category
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sortOrder } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const category = db.menuCategory.update({
      where: { id: parseInt(id) },
      data: { name, sortOrder }
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete category
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category has items
    const items = db.menuItem.findMany({ where: { menuCategoryId: parseInt(id) } });
    if (items.length > 0) {
      return res.status(400).json({ error: 'Cannot delete category with items' });
    }
    
    db.menuCategory.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all menu items
router.get('/items', async (req, res) => {
  try {
    const items = db.menuItem.findMany();
    res.json(items);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single item
router.get('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = db.menuItem.findUnique({ where: { id: parseInt(id) } });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new item
router.post('/items', async (req, res) => {
  try {
    const { menuCategoryId, name, description, price, imageUrl, visible, sortOrder } = req.body;
    
    if (!name || !price || !menuCategoryId) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    
    const item = db.menuItem.create({
      data: {
        menuCategoryId: parseInt(menuCategoryId),
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        visible: visible !== undefined ? visible : true,
        sortOrder: sortOrder || 0
      }
    });
    
    res.status(201).json(item);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update item
router.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { menuCategoryId, name, description, price, imageUrl, visible, sortOrder } = req.body;
    
    if (!name || !price || !menuCategoryId) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    
    const item = db.menuItem.update({
      where: { id: parseInt(id) },
      data: {
        menuCategoryId: parseInt(menuCategoryId),
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        visible,
        sortOrder
      }
    });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete item
router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    db.menuItem.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;