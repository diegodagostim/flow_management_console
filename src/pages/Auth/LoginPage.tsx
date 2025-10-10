import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Database, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { FlowLogo } from '@/components/icons/FlowLogo'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormInputs = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true)
    setError(null)
    try {
      await signIn(data.email, data.password)
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.')
      console.error('Login error:', err)
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
                    <FlowLogo className="h-12 w-auto mx-auto text-primary" />
                  </div>
                  <h4 className="card-title mb-2">Welcome Back</h4>
                  <p className="text-muted">Sign in to your Flow Management Console</p>
                  
                  {/* Development Mode Notice */}
                  <div className="alert alert-info">
                    <small>
                      <strong>Development Mode:</strong> Use any email and password to sign in. 
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
                    <div className="d-flex justify-content-between">
                      <label htmlFor="password" className="form-label">Password</label>
                      <Link to="/forgot-password" className="text-decoration-none">
                        <small className="text-primary">Forgot Password?</small>
                      </Link>
                    </div>
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
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="remember-me" 
                      />
                      <label className="form-check-label" htmlFor="remember-me">
                        Remember Me
                      </label>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="alert alert-danger">
                      <small>{error}</small>
                    </div>
                  )}
                  
                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing in...
                        </>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4 me-2" />
                          Sign In
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary text-decoration-none fw-semibold">
                      Create one here
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