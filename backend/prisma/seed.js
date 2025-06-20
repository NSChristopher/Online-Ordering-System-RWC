// Use the mock Prisma client for development
const prisma = require('../db-mock');

async function main() {
  // Create a business with realistic information
  const business = await prisma.businessInfo.create({
    data: {
      name: "Rico's World Cuisine",
      address: "123 Culinary Street, Food City, FC 12345",
      phone: "(555) 123-FOOD",
      hours: "Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 12:00 PM - 8:00 PM",
      logoUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop',
    },
  });

  // Create menu categories
  const appetizersCategory = await prisma.menuCategory.create({
    data: {
      name: 'Appetizers',
      sortOrder: 1,
    },
  });

  const mainCoursesCategory = await prisma.menuCategory.create({
    data: {
      name: 'Main Courses',
      sortOrder: 2,
    },
  });

  const dessertsCategory = await prisma.menuCategory.create({
    data: {
      name: 'Desserts',
      sortOrder: 3,
    },
  });

  const beveragesCategory = await prisma.menuCategory.create({
    data: {
      name: 'Beverages',
      sortOrder: 4,
    },
  });

  // Create appetizer items
  await prisma.menuItem.create({
    data: {
      menuCategoryId: appetizersCategory.id,
      name: 'Crispy Spring Rolls',
      description: 'Fresh vegetables wrapped in crispy pastry, served with sweet and sour sauce',
      price: 8.99,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
      visible: true,
      sortOrder: 1,
    },
  });

  await prisma.menuItem.create({
    data: {
      menuCategoryId: appetizersCategory.id,
      name: 'Coconut Shrimp',
      description: 'Jumbo shrimp coated in coconut flakes, served with pineapple dipping sauce',
      price: 12.99,
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      visible: true,
      sortOrder: 2,
    },
  });

  await prisma.menuItem.create({
    data: {
      menuCategoryId: appetizersCategory.id,
      name: 'Stuffed Mushrooms',
      description: 'Button mushrooms stuffed with herbs, cheese and breadcrumbs',
      price: 9.99,
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      visible: true,
      sortOrder: 3,
    },
  });

  // Create main course items
  await prisma.menuItem.create({
    data: {
      menuCategoryId: mainCoursesCategory.id,
      name: 'Grilled Salmon',
      description: 'Atlantic salmon grilled to perfection, served with lemon herb butter and seasonal vegetables',
      price: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
      visible: true,
      sortOrder: 1,
    },
  });

  await prisma.menuItem.create({
    data: {
      menuCategoryId: mainCoursesCategory.id,
      name: 'Chicken Teriyaki',
      description: 'Grilled chicken breast glazed with house-made teriyaki sauce, served with jasmine rice',
      price: 19.99,
      imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop',
      visible: true,
      sortOrder: 2,
    },
  });

  await prisma.menuItem.create({
    data: {
      menuCategoryId: mainCoursesCategory.id,
      name: 'Beef Stir Fry',
      description: 'Wok-seared beef with fresh vegetables in a savory brown sauce',
      price: 21.99,
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
      visible: true,
      sortOrder: 3,
    },
  });

  await prisma.menuItem.create({
    data: {
      menuCategoryId: mainCoursesCategory.id,
      name: 'Vegetarian Pasta',
      description: 'Penne pasta with roasted vegetables, fresh basil, and parmesan cheese',
      price: 16.99,
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
      visible: true,
      sortOrder: 4,
    },
  });

  // Create dessert items
  await prisma.menuItem.create({
    data: {
      menuCategoryId: dessertsCategory.id,
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
      price: 7.99,
      imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=300&fit=crop',
      visible: true,
      sortOrder: 1,
    },
  });

  await prisma.menuItem.create({
    data: {
      menuCategoryId: dessertsCategory.id,
      name: 'Cheesecake',
      description: 'New York style cheesecake with berry compote',
      price: 6.99,
      imageUrl: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=300&fit=crop',
      visible: true,
      sortOrder: 2,
    },
  });

  await prisma.menuItem.create({
    data: {
      menuCategoryId: dessertsCategory.id,
      name: 'Tiramisu',
      description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone',
      price: 8.99,
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
      visible: true,
      sortOrder: 3,
    },
  });

  // Create beverage items
  await prisma.menuItem.create({
    data: {
      menuCategoryId: beveragesCategory.id,
      name: 'Fresh Lemonade',
      description: 'House-made lemonade with fresh lemons',
      price: 3.99,
      imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop',
      visible: true,
      sortOrder: 1,
    },
  });

  await prisma.menuItem.create({
    data: {
      menuCategoryId: beveragesCategory.id,
      name: 'Iced Tea',
      description: 'Refreshing black tea served over ice',
      price: 2.99,
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
      visible: true,
      sortOrder: 2,
    },
  });

  await prisma.menuItem.create({
    data: {
      menuCategoryId: beveragesCategory.id,
      name: 'Sparkling Water',
      description: 'Premium sparkling water with natural minerals',
      price: 2.49,
      imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
      visible: true,
      sortOrder: 3,
    },
  });

  await prisma.menuItem.create({
    data: {
      menuCategoryId: beveragesCategory.id,
      name: 'Coffee',
      description: 'Freshly brewed premium coffee',
      price: 2.99,
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
      visible: true,
      sortOrder: 4,
    },
  });

  console.log('Beautified seed data created successfully!');
  console.log(`Created business: ${business.name}`);
  console.log('Created 4 menu categories: Appetizers, Main Courses, Desserts, Beverages');
  console.log('Created 14 menu items with realistic images and descriptions');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
