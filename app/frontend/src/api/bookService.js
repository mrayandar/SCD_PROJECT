import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// Create axios instance with authentication
const api = axios.create({
  baseURL: `${API_URL}/api`
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Book service functions
export const getBooks = async (searchParams = {}) => {
  try {
    const { category, search, page = 1, limit = 10 } = searchParams
    let url = `/books?page=${page}&limit=${limit}`
    
    if (category) url += `&category=${category}`
    if (search) url += `&search=${search}`
    
    const response = await api.get(url)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getBookById = async (id) => {
  try {
    const response = await api.get(`/books/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const createBook = async (bookData) => {
  try {
    const response = await api.post('/books', bookData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const updateBook = async (id, bookData) => {
  try {
    const response = await api.put(`/books/${id}`, bookData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const deleteBook = async (id) => {
  try {
    const response = await api.delete(`/books/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getCategories = async () => {
  try {
    const response = await api.get('/categories')
    return response.data
  } catch (error) {
    throw error
  }
}

export const borrowBook = async (bookId) => {
  try {
    const response = await api.post(`/books/${bookId}/borrow`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const returnBook = async (bookId) => {
  try {
    const response = await api.post(`/books/${bookId}/return`)
    return response.data
  } catch (error) {
    throw error
  }
}