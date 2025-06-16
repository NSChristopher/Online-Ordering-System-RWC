const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Business Info Routes
router.get("/business", async (req, res) => {
  try {
    const businessInfo = await prisma.businessInfo.findFirst();
    res.json(businessInfo);
  } catch (error) {
    console.error("Error fetching business info:", error);
    res.status(500).json({ error: "Failed to fetch business info" });
  }
});

router.put("/business/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, hours, logoUrl } = req.body;
    
    const businessInfo = await prisma.businessInfo.update({
      where: { id: parseInt(id) },
      data: { name, address, phone, hours, logoUrl }
    });
    
    res.json(businessInfo);
  } catch (error) {
    console.error("Error updating business info:", error);
    res.status(500).json({ error: "Failed to update business info" });
  }
});

// Menu Categories Routes
router.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const { name, sortOrder } = req.body;
    
    const category = await prisma.menuCategory.create({
      data: { name, sortOrder }
    });
    
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

router.put("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sortOrder } = req.body;
    
    const category = await prisma.menuCategory.update({
      where: { id: parseInt(id) },
      data: { name, sortOrder }
    });
    
    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.menuCategory.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// Menu Items Routes
router.get("/items", async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({
      include: { menuCategory: true },
      orderBy: [
        { menuCategoryId: 'asc' },
        { sortOrder: 'asc' }
      ]
    });
    res.json(items);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

router.post("/items", async (req, res) => {
  try {
    const { menuCategoryId, name, description, price, imageUrl, visible, sortOrder } = req.body;
    
    const item = await prisma.menuItem.create({
      data: {
        menuCategoryId,
        name,
        description,
        price,
        imageUrl,
        visible,
        sortOrder
      },
      include: { menuCategory: true }
    });
    
    res.status(201).json(item);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

router.put("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { menuCategoryId, name, description, price, imageUrl, visible, sortOrder } = req.body;
    
    const item = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: {
        menuCategoryId,
        name,
        description,
        price,
        imageUrl,
        visible,
        sortOrder
      },
      include: { menuCategory: true }
    });
    
    res.json(item);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

router.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.menuItem.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

module.exports = router;