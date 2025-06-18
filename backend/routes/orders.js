const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all orders or filter by status
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    const whereClause = status ? { status } : undefined;
    const orders = db.order.findMany({ where: whereClause });
    
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = db.order.findUnique({
      where: { id: parseInt(id) }
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
    const { 
      customerName, 
      customerPhone, 
      customerEmail, 
      deliveryAddress, 
      orderType, 
      paymentMethod, 
      notes, 
      items 
    } = req.body;

    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ error: 'Customer name and items are required' });
    }

    // Calculate total amount and prepare order items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = db.menuItem.findUnique({
        where: { id: parseInt(item.menuItemId) }
      });

      if (!menuItem) {
        return res.status(400).json({ error: `Menu item with ID ${item.menuItemId} not found` });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        menuItemId: parseInt(item.menuItemId),
        quantity: parseInt(item.quantity),
        priceAtOrder: menuItem.price,
        itemNameAtOrder: menuItem.name,
        notes: item.notes
      });
    }

    const order = db.order.create({
      data: {
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress,
        orderType: orderType || 'to-go',
        status: 'pending',
        totalAmount,
        paymentMethod: paymentMethod || 'cash',
        notes,
        items: orderItems
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

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['pending', 'accepted', 'rejected', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
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

// Cancel order (customer-facing)
router.patch('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;

    const existingOrder = db.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only allow cancellation if order is still pending or accepted
    if (!['pending', 'accepted'].includes(existingOrder.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled at this stage' });
    }

    const updatedOrder = db.order.update({
      where: { id: parseInt(id) },
      data: { status: 'cancelled' }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;