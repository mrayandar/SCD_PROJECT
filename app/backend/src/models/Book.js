const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true, // Allow null/undefined values
    trim: true
  },
  publishedDate: {
    type: Date,
    default: null
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  available: {
    type: Boolean,
    default: true
  },
  totalCopies: {
    type: Number,
    default: 1
  },
  availableCopies: {
    type: Number,
    default: 1
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create index for search
bookSchema.index({ 
  title: 'text', 
  author: 'text', 
  description: 'text',
  category: 'text'
});

module.exports = mongoose.model('Book', bookSchema);