import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  className?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fallbackPath?: string
}

export function BackButton({ 
  className = '', 
  variant = 'outline',
  size = 'md',
  text = 'Back',
  fallbackPath = '/'
}: BackButtonProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      // Fallback to specified path or home
      navigate(fallbackPath)
    }
  }

  const getButtonClasses = () => {
    const baseClasses = 'btn d-flex align-items-center'
    const sizeClasses = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg'
    }
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline-secondary'
    }
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim()
  }

  return (
    <button 
      onClick={handleBack}
      className={getButtonClasses()}
      type="button"
      title="Go back to previous page"
    >
      <ArrowLeft className="h-4 w-4 me-1" />
      {text}
    </button>
  )
}
