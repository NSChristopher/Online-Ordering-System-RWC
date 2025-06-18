const express = require('express');
const router = express.Router();
const db = require('../db');

// Get business information
router.get('/', async (req, res) => {
  try {
    let businessInfo = db.businessInfo.findFirst();
    
    // Create default business info if none exists
    if (!businessInfo) {
      businessInfo = db.businessInfo.create({
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

    let businessInfo = db.businessInfo.findFirst();
    
    if (!businessInfo) {
      // Create new business info
      businessInfo = db.businessInfo.create({
        data: { name, address, phone, hours, logoUrl }
      });
    } else {
      // Update existing business info
      businessInfo = db.businessInfo.update({
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