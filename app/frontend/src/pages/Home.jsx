import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBooks, getCategories } from '../api/bookService'
import BookCard from '../components/BookCard'
import { FaSearch, FaSpinner, FaBook, FaUsers, FaBookOpen, FaArrowRight } from 'react-icons/fa'

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const booksData = await getBooks({ limit: 6 })
        setFeaturedBooks(Array.isArray(booksData?.books) ? booksData.books : [])
        
        const categoriesData = await getCategories()
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load data. Please try again later.')
        setFeaturedBooks([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              Welcome to <span className="text-accent-400">BookLibrary</span>
            </h1>
            <p className="text-xl mb-8 text-gray-100 leading-relaxed">
              Discover and manage your books with our modern library management system.
              Your gateway to endless reading possibilities.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/books" 
                className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Browse Books
              </Link>
              <Link 
                to="/register" 
                className="btn bg-accent-500 text-white hover:bg-accent-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-primary-500 text-4xl mb-4">
                <FaBook />
              </div>
              <h3 className="text-xl font-bold mb-2">Extensive Collection</h3>
              <p className="text-gray-600">Access thousands of books across various genres and categories.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-primary-500 text-4xl mb-4">
                <FaUsers />
              </div>
              <h3 className="text-xl font-bold mb-2">Community Driven</h3>
              <p className="text-gray-600">Join a community of readers and share your reading experiences.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-primary-500 text-4xl mb-4">
                <FaBookOpen />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Management</h3>
              <p className="text-gray-600">Simple and intuitive interface for managing your reading journey.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Books */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Books</h2>
            <p className="text-xl text-gray-600">Explore our latest collection of handpicked books</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <FaSpinner className="animate-spin h-12 w-12 text-primary-500" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 text-lg">{error}</div>
          ) : featuredBooks.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">No books available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBooks.map(book => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to="/books" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-primary-500 hover:bg-primary-600 transition-colors duration-300"
            >
              View All Books
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600">Find books in your favorite genre</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <FaSpinner className="animate-spin h-12 w-12 text-primary-500" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 text-lg">{error}</div>
          ) : categories.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">No categories available at the moment.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categories.map(category => (
                <Link 
                  key={category._id} 
                  to={`/books?category=${category.name}`}
                  className="bg-white hover:bg-primary-50 hover:border-primary-500 border-2 border-transparent rounded-xl p-6 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="text-primary-500 text-3xl mb-3">{category.icon || '📚'}</div>
                  <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-500 mt-2">{category.count || 0} books</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Looking for something specific?</h2>
            <p className="text-xl text-gray-300">Search our extensive collection of books</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for books, authors, or genres..."
                className="w-full py-4 px-6 pl-14 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg transition-all duration-300"
              />
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-xl" />
              </div>
            </div>
            
            <div className="text-center mt-6">
              <Link 
                to="/books" 
                className="text-primary-300 hover:text-primary-200 font-medium text-lg inline-flex items-center"
              >
                Advanced Search Options
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home