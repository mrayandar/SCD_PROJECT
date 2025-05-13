require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');
const Category = require('./models/Category');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  }
];

const categories = [
  {
    name: 'Fiction',
    description: 'Novels, short stories, and other fictional works',
    icon: '📚'
  },
  {
    name: 'Science Fiction',
    description: 'Books about space, time travel, and futuristic concepts',
    icon: '🚀'
  },
  {
    name: 'Mystery',
    description: 'Detective stories and mysteries',
    icon: '🔍'
  },
  {
    name: 'Biography',
    description: 'Life stories of real people',
    icon: '👤'
  },
  {
    name: 'History',
    description: 'Books about historical events and periods',
    icon: '🏛️'
  },
  {
    name: 'Technology',
    description: 'Books about computers, programming, and technology',
    icon: '💻'
  }
];

// Function to seed database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Category.deleteMany({});
    
    console.log('Previous data cleared');
    
    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories created`);
    
    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    
    // Create sample books
    const adminUser = createdUsers[0];
    
    const books = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
        isbn: '9780743273565',
        publishedDate: new Date('1925-04-10'),
        category: 'Fiction',
        coverImage: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg',
        addedBy: adminUser._id
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'The story of racial injustice and the loss of innocence in the American South during the Great Depression.',
        isbn: '9780061120084',
        publishedDate: new Date('1960-07-11'),
        category: 'Fiction',
        coverImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg',
        addedBy: adminUser._id
      },
      {
        title: '1984',
        author: 'George Orwell',
        description: 'A dystopian novel set in a totalitarian regime where critical thought is suppressed.',
        isbn: '9780451524935',
        publishedDate: new Date('1949-06-08'),
        category: 'Science Fiction',
        coverImage: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/1984first.jpg',
        addedBy: adminUser._id
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        description: 'The adventure of Bilbo Baggins as he journeys to the Lonely Mountain with a group of dwarves.',
        isbn: '9780547928227',
        publishedDate: new Date('1937-09-21'),
        category: 'Fiction',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/4/4a/TheHobbit_FirstEdition.jpg',
        addedBy: adminUser._id
      },
      {
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        description: 'The biography of Apple co-founder Steve Jobs.',
        isbn: '9781451648539',
        publishedDate: new Date('2011-10-24'),
        category: 'Biography',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/e/e4/Steve_Jobs_by_Walter_Isaacson.jpg',
        addedBy: adminUser._id
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        description: 'A handbook of agile software craftsmanship.',
        isbn: '9780132350884',
        publishedDate: new Date('2008-08-01'),
        category: 'Technology',
        coverImage: 'https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg',
        addedBy: adminUser._id
      }
    ];
    
    const createdBooks = await Book.insertMany(books);
    console.log(`${createdBooks.length} books created`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();