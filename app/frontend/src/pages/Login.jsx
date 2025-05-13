import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FaSignInAlt, FaSpinner } from 'react-icons/fa'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
})

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState(null)
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitError(null)
      const success = await login(values.email, values.password)
      
      if (success) {
        navigate('/')
      }
    } catch (error) {
      setSubmitError('An error occurred. Please try again.')
      console.error('Login error:', error)
    } finally {
      setSubmitting(false)
    }
  }
  
  return (
    <div>
      <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
        Sign in to your account
      </h2>
      
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`form-input ${errors.email && touched.email ? 'border-red-500' : ''}`}
                />
                <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <Field
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className={`form-input ${errors.password && touched.password ? 'border-red-500' : ''}`}
                />
                <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            
            {submitError && (
              <div className="text-red-600 text-sm">
                {submitError}
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center btn btn-primary py-2"
              >
                {isSubmitting ? (
                  <FaSpinner className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <FaSignInAlt className="h-5 w-5 mr-2" />
                    Sign in
                  </>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      
      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login