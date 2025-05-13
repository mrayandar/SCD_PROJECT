import React from 'react'
import { Link } from 'react-router-dom'
import { FaBookOpen, FaCalendarAlt, FaUser } from 'react-icons/fa'

const BookCard = ({ book }) => {
  if (!book) return null;

  const {
    _id,
    title = 'Untitled',
    author = 'Unknown Author',
    coverImage,
    category = 'Uncategorized',
    description = 'No description available',
    publishedDate,
    available = true
  } = book;

  const publishedYear = publishedDate ? new Date(publishedDate).getFullYear() : 'N/A';

  return (
    <div className="card group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-t-xl">
        <img 
          src={coverImage || 'https://via.placeholder.com/300x450?text=No+Cover'} 
          alt={title}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-0 right-0 bg-accent-500 text-white px-3 py-1.5 text-xs font-bold rounded-bl-lg shadow-md">
          {category}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-primary-600 transition-colors duration-300">
          {title}
        </h3>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <FaUser className="mr-2 text-primary-500" />
          <span className="font-medium">{author}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <FaCalendarAlt className="mr-2 text-primary-500" />
          <span className="font-medium">{publishedYear}</span>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-[2.5rem]">
          {description}
        </p>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            available 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {available ? 'Available' : 'Borrowed'}
          </span>
          
          <Link 
            to={`/books/${_id}`} 
            className="btn btn-primary text-sm px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors duration-300 shadow-sm hover:shadow-md"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BookCard