const express = require('express');
const router = express.Router();
const prisma = require('../db');

// Get business information
router.get('/', async (req, res) => {
  try {
    let businessInfo = await prisma.businessInfo.findFirst();
    
    // Create default business info if none exists
    if (!businessInfo) {
      businessInfo = await prisma.businessInfo.create({
        data: {
          name: 'Restaurant',
          address: '',
          phone: '',
          hours: '',
          logoUrl: ''
        }
      });
    }
    
    res.json(businessInfo);
  } catch (error) {
    console.error('Get business info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update business information
router.put('/', async (req, res) => {
  try {
    const { name, address, phone, hours, logoUrl } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Business name is required' });
    }

    let businessInfo = await prisma.businessInfo.findFirst();
    
    if (!businessInfo) {
      // Create new business info
      businessInfo = await prisma.businessInfo.create({
        data: { name, address, phone, hours, logoUrl }
      });
    } else {
      // Update existing business info  
      businessInfo = await prisma.businessInfo.update({
        where: { id: businessInfo.id },
        data: { name, address, phone, hours, logoUrl }
      });
    }

    res.json(businessInfo);
  } catch (error) {
    console.error('Update business info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;