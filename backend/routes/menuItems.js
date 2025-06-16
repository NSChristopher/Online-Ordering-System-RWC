const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = db.menuItem.findMany();
    res.json(menuItems);
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single menu item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = db.menuItem.findUnique({
      where: { id: parseInt(id) }
    });

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new menu item
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, available = true } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    const menuItem = db.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        available
      }
    });

    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;