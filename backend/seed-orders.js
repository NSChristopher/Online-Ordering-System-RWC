// Seed script for the Online Ordering System using SQLite
const Database = require('better-sqlite3');
const path = require('path');

// Connect to the same database as the main app
const db = new Database(path.join(__dirname, 'prisma', 'dev.db'));

async function seedData() {
  console.log('Seeding Online Ordering System data...');

  try {
    // Seed business information
    const businessStmt = db.prepare(`
      INSERT OR REPLACE INTO business_info (id, name, address, phone, hours, logoUrl) 
      VALUES (1, ?, ?, ?, ?, ?)
    `);
    businessStmt.run(
      "Rosa's Cafe",
      "123 Main Street, Anytown, State 12345",
      "(555) 123-4567",
      "Mon-Thu: 7AM-9PM, Fri-Sat: 7AM-10PM, Sun: 8AM-8PM",
      "/images/rosas-logo.png"
    );

    // Seed menu categories
    const categoryStmt = db.prepare(`
      INSERT OR REPLACE INTO menu_category (id, name, sortOrder) 
      VALUES (?, ?, ?)
    `);
    
    categoryStmt.run(1, "Appetizers", 1);
    categoryStmt.run(2, "Entrees", 2);
    categoryStmt.run(3, "Desserts", 3);
    categoryStmt.run(4, "Beverages", 4);

    // Seed menu items
    const itemStmt = db.prepare(`
      INSERT OR REPLACE INTO menu_item (id, menuCategoryId, name, description, price, imageUrl, visible, sortOrder) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Appetizers
    itemStmt.run(1, 1, "Queso Dip", "Melted cheese dip served with tortilla chips", 8.99, "/images/queso-dip.jpg", 1, 1);
    itemStmt.run(2, 1, "Guacamole", "Fresh avocado dip made daily with lime and cilantro", 7.99, "/images/guacamole.jpg", 1, 2);
    itemStmt.run(3, 1, "Nachos Supreme", "Tortilla chips topped with cheese, jalapeños, sour cream, and salsa", 12.99, "/images/nachos-supreme.jpg", 1, 3);

    // Entrees
    itemStmt.run(4, 2, "Chicken Enchiladas", "Two corn tortillas filled with seasoned chicken, topped with enchilada sauce and cheese", 14.99, "/images/chicken-enchiladas.jpg", 1, 1);
    itemStmt.run(5, 2, "Beef Fajitas", "Sizzling beef fajitas with grilled onions and peppers, served with tortillas and sides", 18.99, "/images/beef-fajitas.jpg", 1, 2);
    itemStmt.run(6, 2, "Fish Tacos", "Three grilled fish tacos with cabbage slaw and chipotle mayo", 13.99, "/images/fish-tacos.jpg", 1, 3);
    itemStmt.run(7, 2, "Carnitas Burrito", "Large flour tortilla filled with slow-cooked pork, rice, beans, cheese, and salsa", 11.99, "/images/carnitas-burrito.jpg", 1, 4);

    // Desserts
    itemStmt.run(8, 3, "Tres Leches Cake", "Traditional three-milk cake with cinnamon", 6.99, "/images/tres-leches.jpg", 1, 1);
    itemStmt.run(9, 3, "Churros", "Fried pastry dusted with cinnamon sugar, served with chocolate sauce", 5.99, "/images/churros.jpg", 1, 2);
    itemStmt.run(10, 3, "Flan", "Classic caramel custard dessert", 5.49, "/images/flan.jpg", 1, 3);

    // Beverages
    itemStmt.run(11, 4, "Horchata", "Traditional Mexican rice drink with cinnamon", 3.99, "/images/horchata.jpg", 1, 1);
    itemStmt.run(12, 4, "Aguas Frescas", "Fresh fruit water - ask about today's flavors", 3.49, "/images/aguas-frescas.jpg", 1, 2);
    itemStmt.run(13, 4, "Soft Drinks", "Coca-Cola, Sprite, Orange, Dr Pepper", 2.99, null, 1, 3);

    // Create a sample order for testing
    const orderStmt = db.prepare(`
      INSERT OR REPLACE INTO "order" (id, customerName, customerPhone, customerEmail, deliveryAddress, orderType, total, status, paymentMethod, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    orderStmt.run(
      1,
      "John Doe",
      "(555) 987-6543",
      "john.doe@example.com",
      "456 Oak Street, Anytown, State 12345",
      "delivery",
      28.97,
      "new",
      "credit_card",
      now,
      now
    );

    // Create order items for the sample order
    const orderItemStmt = db.prepare(`
      INSERT OR REPLACE INTO order_item (id, orderId, menuItemId, quantity, priceAtOrder, itemNameAtOrder) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    orderItemStmt.run(1, 1, 1, 1, 8.99, "Queso Dip");      // Queso Dip
    orderItemStmt.run(2, 1, 4, 1, 14.99, "Chicken Enchiladas"); // Chicken Enchiladas
    orderItemStmt.run(3, 1, 11, 2, 3.99, "Horchata");      // 2x Horchata

    console.log("✅ Seeded online ordering system data!");
    console.log(`Business: Rosa's Cafe`);
    console.log(`Menu categories: 4`);
    console.log(`Menu items: 13`);
    console.log(`Sample orders: 1`);

  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
}

// Run the seed function
if (require.main === module) {
  seedData()
    .then(() => {
      console.log("🎉 Seeding completed successfully!");
      db.close();
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      db.close();
      process.exit(1);
    });
}

module.exports = { seedData };