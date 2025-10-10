import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react'
import { FlowLogo } from '@/components/icons/FlowLogo'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormInputs = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsLoading(true)
    setError(null)
    try {
      await signUp(data.email, data.password)
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to register. Please try again.')
      console.error('Registration error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <FlowLogo className="h-12 w-auto mx-auto text-success" />
                  </div>
                  <h4 className="card-title mb-2">Create Your Account</h4>
                  <p className="text-muted">Get started with Flow Management Console</p>
                  
                  {/* Development Mode Notice */}
                  <div className="alert alert-info">
                    <small>
                      <strong>Development Mode:</strong> Use any email and password to register. 
                      Configure Supabase in Settings for production authentication.
                    </small>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        id="email"
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="you@example.com"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <div className="invalid-feedback d-block">{errors.email.message}</div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="••••••••"
                        {...register('password')}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="invalid-feedback d-block">{errors.password.message}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        placeholder="••••••••"
                        {...register('confirmPassword')}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="invalid-feedback d-block">{errors.confirmPassword.message}</div>
                    )}
                  </div>
                  
                  {error && (
                    <div className="alert alert-danger">
                      <small>{error}</small>
                    </div>
                  )}
                  
                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Registering...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 me-2" />
                          Register
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="text-center">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}