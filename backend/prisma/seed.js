// Prisma seed script for the Online Ordering System
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Clear old data in proper order (respecting foreign key constraints)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.businessInfo.deleteMany();

  // Seed business information
  const businessInfo = await prisma.businessInfo.create({
    data: {
      name: "Rosa's Cafe",
      address: "123 Main Street, Anytown, State 12345",
      phone: "(555) 123-4567",
      hours: "Mon-Thu: 7AM-9PM, Fri-Sat: 7AM-10PM, Sun: 8AM-8PM",
      logoUrl: "/images/rosas-logo.png",
    },
  });

  // Seed menu categories
  const appetizers = await prisma.menuCategory.create({
    data: {
      name: "Appetizers",
      sortOrder: 1,
    },
  });

  const entrees = await prisma.menuCategory.create({
    data: {
      name: "Entrees",
      sortOrder: 2,
    },
  });

  const desserts = await prisma.menuCategory.create({
    data: {
      name: "Desserts",
      sortOrder: 3,
    },
  });

  const beverages = await prisma.menuCategory.create({
    data: {
      name: "Beverages",
      sortOrder: 4,
    },
  });

  // Seed menu items
  // Appetizers
  await prisma.menuItem.createMany({
    data: [
      {
        menuCategoryId: appetizers.id,
        name: "Queso Dip",
        description: "Creamy white cheese dip served with fresh tortilla chips",
        price: 8.99,
        imageUrl: "/images/queso-dip.jpg",
        visible: true,
        sortOrder: 1,
      },
      {
        menuCategoryId: appetizers.id,
        name: "Guacamole",
        description: "Fresh avocado dip made daily with lime, cilantro, and jalapeños",
        price: 9.99,
        imageUrl: "/images/guacamole.jpg",
        visible: true,
        sortOrder: 2,
      },
      {
        menuCategoryId: appetizers.id,
        name: "Nachos Supreme",
        description: "Crispy tortilla chips topped with cheese, jalapeños, sour cream, and your choice of meat",
        price: 12.99,
        imageUrl: "/images/nachos-supreme.jpg",
        visible: true,
        sortOrder: 3,
      },
    ],
  });

  // Entrees
  await prisma.menuItem.createMany({
    data: [
      {
        menuCategoryId: entrees.id,
        name: "Chicken Enchiladas",
        description: "Three chicken enchiladas topped with red sauce and cheese, served with rice and beans",
        price: 14.99,
        imageUrl: "/images/chicken-enchiladas.jpg",
        visible: true,
        sortOrder: 1,
      },
      {
        menuCategoryId: entrees.id,
        name: "Beef Fajitas",
        description: "Sizzling beef fajitas with grilled onions and peppers, served with tortillas and sides",
        price: 18.99,
        imageUrl: "/images/beef-fajitas.jpg",
        visible: true,
        sortOrder: 2,
      },
      {
        menuCategoryId: entrees.id,
        name: "Fish Tacos",
        description: "Three grilled fish tacos with cabbage slaw and chipotle mayo",
        price: 13.99,
        imageUrl: "/images/fish-tacos.jpg",
        visible: true,
        sortOrder: 3,
      },
      {
        menuCategoryId: entrees.id,
        name: "Carnitas Burrito",
        description: "Large flour tortilla filled with slow-cooked pork, rice, beans, cheese, and salsa",
        price: 11.99,
        imageUrl: "/images/carnitas-burrito.jpg",
        visible: true,
        sortOrder: 4,
      },
    ],
  });

  // Desserts
  await prisma.menuItem.createMany({
    data: [
      {
        menuCategoryId: desserts.id,
        name: "Churros",
        description: "Traditional fried pastry sticks rolled in cinnamon sugar, served with chocolate sauce",
        price: 6.99,
        imageUrl: "/images/churros.jpg",
        visible: true,
        sortOrder: 1,
      },
      {
        menuCategoryId: desserts.id,
        name: "Flan",
        description: "Classic Mexican custard dessert with caramel sauce",
        price: 5.99,
        imageUrl: "/images/flan.jpg",
        visible: true,
        sortOrder: 2,
      },
    ],
  });

  // Beverages
  await prisma.menuItem.createMany({
    data: [
      {
        menuCategoryId: beverages.id,
        name: "Horchata",
        description: "Traditional Mexican rice drink with cinnamon",
        price: 3.99,
        imageUrl: "/images/horchata.jpg",
        visible: true,
        sortOrder: 1,
      },
      {
        menuCategoryId: beverages.id,
        name: "Aguas Frescas",
        description: "Fresh fruit water - ask about today's flavors",
        price: 3.49,
        imageUrl: "/images/aguas-frescas.jpg",
        visible: true,
        sortOrder: 2,
      },
      {
        menuCategoryId: beverages.id,
        name: "Soft Drinks",
        description: "Coca-Cola, Sprite, Orange, Dr Pepper",
        price: 2.99,
        visible: true,
        sortOrder: 3,
      },
    ],
  });

  // Create a sample order for testing
  const sampleOrder = await prisma.order.create({
    data: {
      customerName: "John Doe",
      customerPhone: "(555) 987-6543",
      customerEmail: "john.doe@example.com",
      deliveryAddress: "456 Oak Street, Anytown, State 12345",
      orderType: "delivery",
      total: 28.97,
      status: "new",
      paymentMethod: "credit_card",
    },
  });

  // Get some menu items for the sample order
  const queso = await prisma.menuItem.findFirst({
    where: { name: "Queso Dip" },
  });
  const enchiladas = await prisma.menuItem.findFirst({
    where: { name: "Chicken Enchiladas" },
  });
  const horchata = await prisma.menuItem.findFirst({
    where: { name: "Horchata" },
  });

  // Create order items for the sample order
  if (queso && enchiladas && horchata) {
    await prisma.orderItem.createMany({
      data: [
        {
          orderId: sampleOrder.id,
          menuItemId: queso.id,
          quantity: 1,
          priceAtOrder: queso.price,
          itemNameAtOrder: queso.name,
        },
        {
          orderId: sampleOrder.id,
          menuItemId: enchiladas.id,
          quantity: 1,
          priceAtOrder: enchiladas.price,
          itemNameAtOrder: enchiladas.name,
        },
        {
          orderId: sampleOrder.id,
          menuItemId: horchata.id,
          quantity: 2,
          priceAtOrder: horchata.price,
          itemNameAtOrder: horchata.name,
        },
      ],
    });
  }

  console.log("Seeded online ordering system data!");
  console.log(`Business: ${businessInfo.name}`);
  console.log(`Menu categories: 4`);
  console.log(`Menu items: 12`);
  console.log(`Sample orders: 1`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
