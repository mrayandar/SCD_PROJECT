import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const BookDetail = () => {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/books/${id}`)
        setBook(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch book details')
        setLoading(false)
      }
    }

    fetchBook()
  }, [id])

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>
  if (!book) return <div className="text-center p-4">Book not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {book.coverImage && (
            <div className="md:flex-shrink-0">
              <img
                className="h-48 w-full object-cover md:w-48"
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
              />
            </div>
          )}
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-gray-600 text-xl mb-4">By {book.author}</p>
            <div className="mb-4">
              <p className="text-gray-700">{book.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">ISBN:</p>
                <p className="font-semibold">{book.isbn || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Published:</p>
                <p className="font-semibold">{book.publishedDate || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Genre:</p>
                <p className="font-semibold">{book.genre || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Available Copies:</p>
                <p className="font-semibold">{book.availableCopies || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail 