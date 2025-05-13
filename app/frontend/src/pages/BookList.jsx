import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const BookList = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/books`)
        setBooks(response.data?.books || [])
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch books')
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <Link
            to={`/books/${book.id}`}
            key={book.id}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
              <p className="text-gray-600 mb-2">By {book.author}</p>
              {book.coverImage && (
                <img
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
              )}
              <p className="text-gray-500 line-clamp-2">{book.description}</p>
            </div>
          </Link>
        ))}
      </div>
      {books.length === 0 && (
        <p className="text-center text-gray-500">No books available.</p>
      )}
    </div>
  )
}

export default BookList 