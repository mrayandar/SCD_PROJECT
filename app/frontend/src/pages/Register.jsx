import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FaUserPlus, FaSpinner } from 'react-icons/fa'

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
})

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState(null)
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitError(null)
      const success = await register(values.name, values.email, values.password)
      
      if (success) {
        navigate('/login')
      }
    } catch (error) {
      setSubmitError('An error occurred. Please try again.')
      console.error('Registration error:', error)
    } finally {
      setSubmitting(false)
    }
  }
  
  return (
    <div>
      <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
        Create a new account
      </h2>
      
      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <Field
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className={`form-input ${errors.name && touched.name ? 'border-red-500' : ''}`}
                />
                <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            
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
                  autoComplete="new-password"
                  className={`form-input ${errors.password && touched.password ? 'border-red-500' : ''}`}
                />
                <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className={`form-input ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}`}
                />
                <ErrorMessage name="confirmPassword" component="p" className="mt-1 text-sm text-red-600" />
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
                    <FaUserPlus className="h-5 w-5 mr-2" />
                    Sign up
                  </>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      
      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register