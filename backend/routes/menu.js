const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all categories with items
router.get('/categories', async (req, res) => {
  try {
    const categories = db.menuCategory.findMany();
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get category by ID
router.get('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = db.menuCategory.findUnique({
      where: { id: parseInt(id) }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
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
      return res.status(400).json({ error: 'Category name is required' });
    }

    const category = db.menuCategory.create({
      data: { name, sortOrder }
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

    const existingCategory = db.menuCategory.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updatedCategory = db.menuCategory.update({
      where: { id: parseInt(id) },
      data: { name, sortOrder }
    });

    res.json(updatedCategory);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete category
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingCategory = db.menuCategory.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    db.menuCategory.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all items
router.get('/items', async (req, res) => {
  try {
    const items = db.menuItem.findMany();
    res.json(items);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get item by ID
router.get('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = db.menuItem.findUnique({
      where: { id: parseInt(id) }
    });

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

    if (!menuCategoryId || !name || price === undefined) {
      return res.status(400).json({ error: 'Category ID, name, and price are required' });
    }

    // Verify category exists
    const category = db.menuCategory.findUnique({
      where: { id: parseInt(menuCategoryId) }
    });

    if (!category) {
      return res.status(400).json({ error: 'Category not found' });
    }

    const item = db.menuItem.create({
      data: {
        menuCategoryId: parseInt(menuCategoryId),
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        visible: visible !== false,
        sortOrder
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

    const existingItem = db.menuItem.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // If category is being changed, verify it exists
    if (menuCategoryId && menuCategoryId !== existingItem.menuCategoryId) {
      const category = db.menuCategory.findUnique({
        where: { id: parseInt(menuCategoryId) }
      });

      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }
    }

    const updateData = {};
    if (menuCategoryId !== undefined) updateData.menuCategoryId = parseInt(menuCategoryId);
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (visible !== undefined) updateData.visible = visible;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const updatedItem = db.menuItem.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete item
router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingItem = db.menuItem.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    db.menuItem.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;