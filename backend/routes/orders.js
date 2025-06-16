const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all orders with optional status filter
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    // Get orders with items
    let orders = db.order.findMany({ 
      include: { orderItems: true } 
    });
    
    // Filter by status if provided
    if (status) {
      orders = orders.filter(order => order.status === status);
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single order by ID
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

// Update order status (accept, reject, ready, etc.)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['new', 'accepted', 'rejected', 'preparing', 'ready', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
      });
    }

    // Check if order exists
    const existingOrder = db.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status
    const updatedOrder = db.order.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json({
      id: parseInt(id),
      status,
      message: `Order ${id} status updated to ${status}`,
      order: updatedOrder
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new order (for testing purposes)
router.post('/', async (req, res) => {
  try {
    const { 
      customerName, 
      customerPhone, 
      customerEmail, 
      deliveryAddress, 
      orderType, 
      total, 
      paymentMethod,
      orderItems 
    } = req.body;

    // Validate required fields
    if (!customerName || !customerPhone || !orderType || !total || !orderItems) {
      return res.status(400).json({ 
        error: 'Missing required fields: customerName, customerPhone, orderType, total, orderItems' 
      });
    }

    // Create order
    const order = db.order.create({
      data: {
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress,
        orderType,
        total: parseFloat(total),
        paymentMethod,
        status: 'new'
      }
    });

    // Create order items
    if (orderItems && orderItems.length > 0) {
      const orderItemsData = orderItems.map(item => ({
        orderId: order.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        priceAtOrder: item.priceAtOrder,
        itemNameAtOrder: item.itemNameAtOrder
      }));

      db.orderItem.createMany({
        data: orderItemsData
      });
    }

    // Get the created order with items
    const createdOrder = db.order.findUnique({
      where: { id: order.id },
      include: { orderItems: true }
    });

    res.status(201).json(createdOrder);

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get orders by status for worker dashboard
router.get('/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    
    const orders = db.order.findMany({ 
      include: { orderItems: true } 
    }).filter(order => order.status === status);
    
    res.json(orders);
  } catch (error) {
    console.error('Get orders by status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;