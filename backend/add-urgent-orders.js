const db = require('./db');
const Database = require('better-sqlite3');
const path = require('path');

// Direct database access for timestamp manipulation
const dbFile = new Database(path.join(__dirname, 'prisma', 'dev.db'));

// Add some older orders to test urgent notifications
async function addUrgentTestOrders() {
  console.log('Adding urgent test orders...');

  // Create order that's 20 minutes old (should be urgent)
  const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000).toISOString();
  
  try {
    // First, manually insert an older order to test urgent notifications
    const createOldOrder = dbFile.prepare(`
      INSERT INTO "Order" (customerName, customerPhone, status, totalAmount, notes, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = createOldOrder.run(
      'Sarah Wilson',
      '555-0111',
      'pending',
      18.97,
      'Rush order - needs to be ready ASAP',
      twentyMinutesAgo,
      twentyMinutesAgo
    );
    
    const orderId = result.lastInsertRowid;
    
    // Add order items
    const createOrderItem = dbFile.prepare(`
      INSERT INTO OrderItem (orderId, menuItemId, quantity, price, notes, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Add a burger and fries to this old order
    createOrderItem.run(orderId, 3, 1, 10.99, 'Extra spicy', twentyMinutesAgo, twentyMinutesAgo);
    createOrderItem.run(orderId, 6, 1, 4.99, '', twentyMinutesAgo, twentyMinutesAgo);
    createOrderItem.run(orderId, 8, 1, 2.99, '', twentyMinutesAgo, twentyMinutesAgo);
    
    console.log(`Created urgent order for Sarah Wilson (20 minutes old)`);
    
    // Create another old order that's accepted but taking too long
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const result2 = createOldOrder.run(
      'Mike Davis',
      '555-0222',
      'accepted',
      25.96,
      'Customer waiting in car',
      tenMinutesAgo,
      tenMinutesAgo
    );
    
    const orderId2 = result2.lastInsertRowid;
    createOrderItem.run(orderId2, 1, 2, 12.99, '', tenMinutesAgo, tenMinutesAgo);
    
    console.log(`Created in-progress order for Mike Davis (10 minutes old)`);
    
  } catch (error) {
    console.error('Error creating urgent test orders:', error);
  } finally {
    dbFile.close();
  }
  
  console.log('Urgent test orders added successfully!');
}

// Run if called directly
if (require.main === module) {
  addUrgentTestOrders()
    .catch(console.error)
    .finally(() => process.exit(0));
}

module.exports = { addUrgentTestOrders };