const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook
} = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getBooks);
router.get('/:id', getBookById);

// Private routes
router.post('/', protect, admin, createBook);
router.put('/:id', protect, admin, updateBook);
router.delete('/:id', protect, admin, deleteBook);

// Borrowing routes
router.post('/:id/borrow', protect, borrowBook);
router.post('/:id/return', protect, returnBook);

module.exports = router;