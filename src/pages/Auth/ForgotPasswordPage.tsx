import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Mail, ArrowLeft, Send } from 'lucide-react'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    setIsLoading(true)
    setError(null)
    try {
      await resetPassword(data.email)
      setSuccess(true)
    } catch (err) {
      setError('Failed to send reset email. Please try again.')
      console.error('Password reset error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen d-flex align-items-center justify-content-center bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-sm">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <div className="avatar avatar-xl mx-auto mb-3">
                      <span className="avatar-initial rounded bg-success">
                        <Send className="h-8 w-8 text-white" />
                      </span>
                    </div>
                    <h4 className="card-title mb-2">Check Your Email</h4>
                    <p className="text-muted">
                      We've sent password reset instructions to your email address. 
                      Please check your inbox and follow the instructions to reset your password.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Link to="/login" className="btn btn-primary">
                      <ArrowLeft className="h-4 w-4 me-2" />
                      Back to Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
                  <div className="avatar avatar-xl mx-auto mb-3">
                    <span className="avatar-initial rounded bg-warning">
                      <Mail className="h-8 w-8 text-white" />
                    </span>
                  </div>
                  <h4 className="card-title mb-2">Forgot Password?</h4>
                  <p className="text-muted">Enter your email and we'll send you instructions to reset your password</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4">
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
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 me-2" />
                          Send Reset Link
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="text-center">
                  <Link to="/login" className="text-decoration-none">
                    <ArrowLeft className="h-4 w-4 me-1" />
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
