const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Get all books with pagination and filters
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Build query
  const query = {};
  
  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }
  
  // Search by text
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }
  
  // Filter by availability
  if (req.query.available) {
    query.available = req.query.available === 'true';
  }
  
  // Execute query with pagination
  const books = await Book.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('addedBy', 'name');
  
  // Get total count for pagination
  const total = await Book.countDocuments(query);
  
  res.json({
    books,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    }
  });
});

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id)
    .populate('addedBy', 'name');
  
  if (book) {
    res.json(book);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Create a new book
// @route   POST /api/books
// @access  Private/Admin
const createBook = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    description,
    isbn,
    publishedDate,
    category,
    coverImage,
    totalCopies
  } = req.body;
  
  // Validate required fields
  if (!title || !author || !description || !category) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }
  
  // Create book
  const book = await Book.create({
    title,
    author,
    description,
    isbn,
    publishedDate,
    category,
    coverImage,
    totalCopies: totalCopies || 1,
    availableCopies: totalCopies || 1,
    addedBy: req.user._id
  });
  
  if (book) {
    res.status(201).json(book);
  } else {
    res.status(400);
    throw new Error('Invalid book data');
  }
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  
  if (book) {
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.description = req.body.description || book.description;
    book.isbn = req.body.isbn || book.isbn;
    book.publishedDate = req.body.publishedDate || book.publishedDate;
    book.category = req.body.category || book.category;
    book.coverImage = req.body.coverImage || book.coverImage;
    
    if (req.body.totalCopies) {
      book.totalCopies = req.body.totalCopies;
      // Adjust available copies
      book.availableCopies = book.availableCopies + (req.body.totalCopies - book.totalCopies);
    }
    
    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  
  if (book) {
    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Borrow a book
// @route   POST /api/books/:id/borrow
// @access  Private
const borrowBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  
  if (!book.available || book.availableCopies <= 0) {
    res.status(400);
    throw new Error('Book is not available for borrowing');
  }
  
  // Check if user already has this book
  const user = await User.findById(req.user._id);
  
  const alreadyBorrowed = user.borrowedBooks.find(
    item => item.book.toString() === book._id.toString() && !item.returnedAt
  );
  
  if (alreadyBorrowed) {
    res.status(400);
    throw new Error('You have already borrowed this book');
  }
  
  // Update book availability
  book.availableCopies -= 1;
  if (book.availableCopies <= 0) {
    book.available = false;
  }
  
  // Add book to user's borrowed books
  user.borrowedBooks.push({
    book: book._id,
    borrowedAt: new Date()
  });
  
  // Save changes
  await book.save();
  await user.save();
  
  res.json({ message: 'Book borrowed successfully' });
});

// @desc    Return a book
// @route   POST /api/books/:id/return
// @access  Private
const returnBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  
  // Find the borrowed book in user's list
  const user = await User.findById(req.user._id);
  
  const borrowedBookIndex = user.borrowedBooks.findIndex(
    item => item.book.toString() === book._id.toString() && !item.returnedAt
  );
  
  if (borrowedBookIndex === -1) {
    res.status(400);
    throw new Error('You have not borrowed this book');
  }
  
  // Update book availability
  book.availableCopies += 1;
  book.available = true;
  
  // Mark book as returned
  user.borrowedBooks[borrowedBookIndex].returnedAt = new Date();
  
  // Save changes
  await book.save();
  await user.save();
  
  res.json({ message: 'Book returned successfully' });
});

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook
};