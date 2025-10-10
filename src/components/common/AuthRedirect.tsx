import { Navigate } from 'react-router-dom'

export function AuthRedirect() {
  // Always redirect to dashboard, bypassing authentication
  return <Navigate to="/dashboard" replace />
}
