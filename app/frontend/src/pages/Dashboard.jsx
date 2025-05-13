import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const Dashboard = () => {
  const { user } = useAuth()
  const [borrowedBooks, setBorrowedBooks] = useState([])
  const [statistics, setStatistics] = useState({
    totalBorrowed: 0,
    currentlyBorrowed: 0,
    overdue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [booksResponse, statsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/users/borrowed-books`, {
            headers: { Authorization: `Bearer ${user.token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/users/statistics`, {
            headers: { Authorization: `Bearer ${user.token}` }
          })
        ])
        
        setBorrowedBooks(booksResponse.data)
        setStatistics(statsResponse.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch dashboard data')
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  const handleReturn = async (bookId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/books/${bookId}/return`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      )
      
      // Update the borrowed books list
      setBorrowedBooks(books => books.filter(book => book.id !== bookId))
      
      // Update statistics
      setStatistics(stats => ({
        ...stats,
        currentlyBorrowed: stats.currentlyBorrowed - 1
      }))
    } catch (err) {
      setError('Failed to return book')
    }
  }

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Borrowed</h3>
          <p className="text-3xl font-bold text-blue-600">{statistics.totalBorrowed}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700">Currently Borrowed</h3>
          <p className="text-3xl font-bold text-green-600">{statistics.currentlyBorrowed}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700">Overdue Books</h3>
          <p className="text-3xl font-bold text-red-600">{statistics.overdue}</p>
        </div>
      </div>

      {/* Borrowed Books List */}
      <div className="bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold p-6 border-b">Currently Borrowed Books</h2>
        {borrowedBooks.length > 0 ? (
          <div className="divide-y">
            {borrowedBooks.map((book) => (
              <div key={book.id} className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <p className="text-gray-600">By {book.author}</p>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(book.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleReturn(book.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Return Book
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 p-6">No books currently borrowed</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard 