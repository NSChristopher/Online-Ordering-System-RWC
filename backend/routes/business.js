const express = require('express');
const db = require('../db');

const router = express.Router();

// Get business info
router.get('/', async (req, res) => {
  try {
    const businessInfo = db.businessInfo.findFirst();
    
    if (!businessInfo) {
      return res.status(404).json({ error: 'Business info not found' });
    }
    
    res.json(businessInfo);
  } catch (error) {
    console.error('Get business info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update business info
router.put('/', async (req, res) => {
  try {
    const { name, address, phone, hours, logoUrl } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Business name is required' });
    }
    
    // Get current business info or create if doesn't exist
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