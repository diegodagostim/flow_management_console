import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function AuthRedirect() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="text-muted">Loading...</div>
        </div>
      </div>
    )
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  // If no user, redirect to login
  return <Navigate to="/login" replace />
}
