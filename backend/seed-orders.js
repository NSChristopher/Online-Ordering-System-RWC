const db = require('./db');

// Seed data for the ordering system
async function seedOrderingSystem() {
  console.log('Seeding ordering system...');

  // Create menu items
  const menuItems = [
    { name: 'Classic Burger', description: 'Beef patty with lettuce, tomato, cheese', price: 12.99, category: 'Burgers' },
    { name: 'Chicken Burger', description: 'Grilled chicken breast with mayo', price: 11.99, category: 'Burgers' },
    { name: 'Veggie Burger', description: 'Plant-based patty with fresh vegetables', price: 10.99, category: 'Burgers' },
    { name: 'Caesar Salad', description: 'Romaine lettuce, croutons, parmesan', price: 8.99, category: 'Salads' },
    { name: 'Greek Salad', description: 'Mixed greens, feta, olives, tomatoes', price: 9.99, category: 'Salads' },
    { name: 'French Fries', description: 'Crispy golden fries', price: 4.99, category: 'Sides' },
    { name: 'Onion Rings', description: 'Battered and fried onion rings', price: 5.99, category: 'Sides' },
    { name: 'Coca Cola', description: 'Classic cola drink', price: 2.99, category: 'Beverages' },
    { name: 'Lemonade', description: 'Fresh squeezed lemonade', price: 3.99, category: 'Beverages' },
    { name: 'Chocolate Cake', description: 'Rich chocolate layer cake', price: 6.99, category: 'Desserts' }
  ];

  const createdMenuItems = [];
  for (const item of menuItems) {
    try {
      const created = db.menuItem.create({ data: item });
      createdMenuItems.push(created);
      console.log(`Created menu item: ${created.name}`);
    } catch (error) {
      console.log(`Menu item ${item.name} already exists or error:`, error.message);
    }
  }

  // Create sample orders
  const sampleOrders = [
    {
      customerName: 'John Doe',
      customerPhone: '555-0123',
      status: 'pending',
      notes: 'No pickles please',
      orderItems: [
        { menuItemId: 1, quantity: 1, notes: 'Medium rare' },
        { menuItemId: 6, quantity: 1, notes: 'Extra crispy' },
        { menuItemId: 8, quantity: 1, notes: '' }
      ]
    },
    {
      customerName: 'Jane Smith',
      customerPhone: '555-0456',
      status: 'accepted',
      notes: 'Allergic to nuts',
      orderItems: [
        { menuItemId: 4, quantity: 1, notes: 'Dressing on the side' },
        { menuItemId: 9, quantity: 1, notes: 'Extra ice' }
      ]
    },
    {
      customerName: 'Bob Johnson',
      customerPhone: '555-0789',
      status: 'ready',
      notes: '',
      orderItems: [
        { menuItemId: 2, quantity: 2, notes: '' },
        { menuItemId: 7, quantity: 1, notes: '' },
        { menuItemId: 10, quantity: 1, notes: '' }
      ]
    }
  ];

  for (const order of sampleOrders) {
    try {
      // Calculate total amount
      let totalAmount = 0;
      const validatedItems = [];
      
      for (const item of order.orderItems) {
        const menuItem = db.menuItem.findUnique({ where: { id: item.menuItemId } });
        if (menuItem) {
          const itemTotal = menuItem.price * item.quantity;
          totalAmount += itemTotal;
          
          validatedItems.push({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: menuItem.price,
            notes: item.notes
          });
        }
      }

      if (validatedItems.length > 0) {
        const created = db.order.create({
          data: {
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            status: order.status,
            notes: order.notes,
            totalAmount,
            orderItems: validatedItems
          }
        });
        console.log(`Created order for: ${created.customerName}`);
      }
    } catch (error) {
      console.log(`Error creating order for ${order.customerName}:`, error.message);
    }
  }

  console.log('Ordering system seeded successfully!');
}

// Run if called directly
if (require.main === module) {
  seedOrderingSystem()
    .catch(console.error)
    .finally(() => process.exit(0));
}

module.exports = { seedOrderingSystem };