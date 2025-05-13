const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Book = require('../models/Book');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ name: 1 });
  
  // Get count of books for each category
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const count = await Book.countDocuments({ category: category.name });
      return {
        _id: category._id,
        name: category.name,
        description: category.description,
        icon: category.icon,
        count
      };
    })
  );
  
  res.json(categoriesWithCount);
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon } = req.body;
  
  if (!name) {
    res.status(400);
    throw new Error('Please provide a category name');
  }
  
  const categoryExists = await Category.findOne({ name });
  
  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }
  
  const category = await Category.create({
    name,
    description: description || '',
    icon: icon || '📚'
  });
  
  if (category) {
    res.status(201).json(category);
  } else {
    res.status(400);
    throw new Error('Invalid category data');
  }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, icon } = req.body;
  
  const category = await Category.findById(req.params.id);
  
  if (category) {
    // If name is changing, check it doesn't conflict
    if (name && name !== category.name) {
      const categoryExists = await Category.findOne({ name });
      
      if (categoryExists) {
        res.status(400);
        throw new Error('Category name already exists');
      }
    }
    
    category.name = name || category.name;
    category.description = description || category.description;
    category.icon = icon || category.icon;
    
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  
  if (category) {
    // Check if there are books with this category
    const booksWithCategory = await Book.countDocuments({ category: category.name });
    
    if (booksWithCategory > 0) {
      res.status(400);
      throw new Error(`Cannot delete category with ${booksWithCategory} associated book(s)`);
    }
    
    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};