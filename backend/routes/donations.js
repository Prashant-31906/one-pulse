const express = require('express');
const {
  createOrder,
  verifyPayment,
  getDonationHistory,
} = require('../controllers/donationController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

// Protected routes
router.get('/history', authMiddleware, getDonationHistory);

module.exports = router;
