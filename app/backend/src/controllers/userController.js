const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.name = req.body.name || user.name;
    
    // Only update email if provided and different
    if (req.body.email && req.body.email !== user.email) {
      // Check if email is already taken
      const emailExists = await User.findOne({ email: req.body.email });
      
      if (emailExists) {
        res.status(400);
        throw new Error('Email already in use');
      }
      
      user.email = req.body.email;
    }
    
    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user's borrowed books
// @route   GET /api/users/books
// @access  Private
const getUserBooks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'borrowedBooks.book',
      select: 'title author coverImage category'
    });
  
  if (user) {
    // Split into current and past borrowings
    const currentBorrowings = user.borrowedBooks.filter(item => !item.returnedAt);
    const pastBorrowings = user.borrowedBooks.filter(item => item.returnedAt);
    
    res.json({
      current: currentBorrowings,
      past: pastBorrowings
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserBooks,
  getUsers
};