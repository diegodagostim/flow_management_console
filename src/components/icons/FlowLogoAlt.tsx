import React from 'react'

interface FlowLogoAltProps {
  className?: string
  size?: number
  showText?: boolean
}

export function FlowLogoAlt({ className = "h-8 w-8", size = 32, showText = true }: FlowLogoAltProps) {
  return (
    <div className="d-flex align-items-center">
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle with Gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        
        {/* Background Circle */}
        <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" opacity="0.1" />
        
        {/* Modern "F" Design */}
        <path 
          d="M14 10 L26 10 L26 14 L18 14 L18 18 L24 18 L24 22 L18 22 L18 30 L14 30 Z" 
          fill="url(#logoGradient)"
        />
        
        {/* Flow Arrows */}
        <path 
          d="M28 16 L32 20 L28 24" 
          stroke="url(#logoGradient)" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path 
          d="M30 12 L34 16 L30 20" 
          stroke="url(#logoGradient)" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path 
          d="M30 20 L34 24 L30 28" 
          stroke="url(#logoGradient)" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data Points */}
        <circle cx="32" cy="14" r="1.5" fill="url(#logoGradient)" />
        <circle cx="34" cy="18" r="1.5" fill="url(#logoGradient)" />
        <circle cx="32" cy="22" r="1.5" fill="url(#logoGradient)" />
        <circle cx="34" cy="26" r="1.5" fill="url(#logoGradient)" />
      </svg>
      
      {showText && (
        <span className="app-brand-text fw-bold ms-2 text-primary">
          Flow Management Console
        </span>
      )}
    </div>
  )
}
