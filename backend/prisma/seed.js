const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a business
  const business = await prisma.businessInfo.create({
    data: {
      name: 'Demo Restaurant',
      address: '123 Main St',
      phone: '555-1234',
      hours: '9am-9pm',
      logoUrl: 'https://placehold.co/100x100',
    },
  });

  // Create a menu category
  const category = await prisma.menuCategory.create({
    data: {
      name: 'Appetizers',
      sortOrder: 1,
    },
  });

  // Create a menu item
  await prisma.menuItem.create({
    data: {
      menuCategoryId: category.id,
      name: 'Spring Rolls',
      description: 'Crispy vegetarian spring rolls',
      price: 5.99,
      imageUrl: 'https://placehold.co/60x60',
      visible: true,
      sortOrder: 1,
    },
  });

  console.log('Seed data created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
