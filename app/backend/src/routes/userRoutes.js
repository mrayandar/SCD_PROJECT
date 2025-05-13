const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserBooks,
  getUsers
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Private routes
router.get('/me', protect, getUserProfile);
router.put('/me', protect, updateUserProfile);
router.get('/books', protect, getUserBooks);

// Admin routes
router.get('/', protect, admin, getUsers);

module.exports = router;