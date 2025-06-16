const express = require("express");
const db = require("../db");

const router = express.Router();

// Get all orders (for worker dashboard)
router.get("/", async (req, res) => {
  try {
    const orders = db.order.findMany({
      include: { orderItems: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get a specific order by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = db.order.findUnique({
      where: { id: parseInt(id) },
      include: { orderItems: true }
    });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Submit a new order (from customer app)
router.post("/", async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, deliveryAddress, orderType, paymentMethod, items } = req.body;
    
    // Calculate total from items
    const total = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
    
    // Create the order
    const order = db.order.create({
      data: {
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress,
        orderType,
        total,
        status: 'new',
        paymentMethod
      }
    });
    
    // Create order items
    const orderItems = items.map(item => {
      return db.orderItem.create({
        data: {
          orderId: order.id,
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          priceAtOrder: item.menuItem.price,
          itemNameAtOrder: item.menuItem.name
        }
      });
    });
    
    res.status(201).json({
      id: order.id,
      status: order.status,
      total: order.total,
      items: orderItems
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Update order status (for worker dashboard)
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const allowedStatuses = ['new', 'accepted', 'rejected', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    
    const updatedOrder = db.order.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Cancel an order (from customer app - only if status is 'new' or 'accepted')
router.put("/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = db.order.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    if (!['new', 'accepted'].includes(order.status)) {
      return res.status(400).json({ error: "Order cannot be cancelled at this stage" });
    }
    
    const updatedOrder = db.order.update({
      where: { id: parseInt(id) },
      data: { status: 'cancelled' }
    });
    
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

// Get order status (for customer status tracking)
router.get("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const order = db.order.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    // Add estimated time logic
    let estimatedTime = null;
    if (order.status === 'accepted' || order.status === 'preparing') {
      estimatedTime = 25; // 25 minutes default
    } else if (order.status === 'ready') {
      estimatedTime = 5; // 5 minutes for pickup
    }
    
    res.json({
      id: order.id,
      status: order.status,
      estimatedTime,
      total: order.total,
      orderType: order.orderType,
      createdAt: order.createdAt
    });
  } catch (error) {
    console.error("Error fetching order status:", error);
    res.status(500).json({ error: "Failed to fetch order status" });
  }
});

module.exports = router;