const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const orders = db.order.findMany({ 
      where: status ? { status } : undefined,
      include: { orderItems: true }
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = db.order.findUnique({
      where: { id: parseInt(id) },
      include: { orderItems: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { customerName, customerPhone, orderItems, notes } = req.body;

    if (!customerName || !orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: 'Customer name and order items are required' });
    }

    // Calculate total amount
    let totalAmount = 0;
    const validatedItems = [];
    
    for (const item of orderItems) {
      const menuItem = db.menuItem.findUnique({ where: { id: item.menuItemId } });
      if (!menuItem) {
        return res.status(400).json({ error: `Menu item with id ${item.menuItemId} not found` });
      }
      
      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;
      
      validatedItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
        notes: item.notes
      });
    }

    const order = db.order.create({
      data: {
        customerName,
        customerPhone,
        notes,
        totalAmount,
        orderItems: validatedItems
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'accepted', 'rejected', 'ready', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const existingOrder = db.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = db.order.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;