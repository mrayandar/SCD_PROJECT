import { Outlet, Link } from 'react-router-dom'
import { FaBook } from 'react-icons/fa'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center">
            <FaBook className="h-10 w-10 text-primary-500" />
            <span className="ml-2 text-2xl font-bold text-gray-900">BookLibrary</span>
          </Link>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <Link to="/" className="text-primary-600 hover:text-primary-500">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default AuthLayout