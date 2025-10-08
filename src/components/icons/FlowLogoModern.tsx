import React from 'react'

interface FlowLogoModernProps {
  className?: string
  size?: number
  showText?: boolean
}

export function FlowLogoModern({ className = "h-8 w-8", size = 32, showText = true }: FlowLogoModernProps) {
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
        {/* Background Circle */}
        <circle cx="20" cy="20" r="18" fill="#2563eb" opacity="0.08" />
        
        {/* Abstract Flow Design */}
        {/* Main Flow Path */}
        <path 
          d="M8 20 Q12 12 20 12 Q28 12 32 20 Q28 28 20 28 Q12 28 8 20" 
          stroke="#2563eb" 
          strokeWidth="2.5" 
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Inner Flow Lines */}
        <path 
          d="M12 20 Q16 16 20 16 Q24 16 28 20 Q24 24 20 24 Q16 24 12 20" 
          stroke="#2563eb" 
          strokeWidth="1.5" 
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
        
        {/* Flow Direction Indicators */}
        <path 
          d="M16 16 L18 14 L20 16 L18 18 Z" 
          fill="#2563eb"
        />
        <path 
          d="M24 16 L26 14 L28 16 L26 18 Z" 
          fill="#2563eb"
        />
        <path 
          d="M16 24 L18 22 L20 24 L18 26 Z" 
          fill="#2563eb"
        />
        <path 
          d="M24 24 L26 22 L28 24 L26 26 Z" 
          fill="#2563eb"
        />
        
        {/* Center Dot */}
        <circle cx="20" cy="20" r="2" fill="#2563eb" />
      </svg>
      
      {showText && (
        <span className="app-brand-text fw-bold ms-2 text-primary">
          Flow Management Console
        </span>
      )}
    </div>
  )
}
