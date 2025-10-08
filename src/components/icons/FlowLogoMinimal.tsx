import React from 'react'

interface FlowLogoMinimalProps {
  className?: string
  size?: number
  showText?: boolean
}

export function FlowLogoMinimal({ className = "h-8 w-8", size = 32, showText = true }: FlowLogoMinimalProps) {
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
        {/* Background Square */}
        <rect x="4" y="4" width="32" height="32" rx="6" fill="#2563eb" opacity="0.1" />
        
        {/* Minimalist "F" */}
        <rect x="12" y="10" width="16" height="3" fill="#2563eb" rx="1" />
        <rect x="12" y="16" width="12" height="3" fill="#2563eb" rx="1" />
        <rect x="12" y="22" width="12" height="3" fill="#2563eb" rx="1" />
        <rect x="12" y="28" width="16" height="3" fill="#2563eb" rx="1" />
        
        {/* Flow Indicators */}
        <circle cx="30" cy="14" r="2" fill="#2563eb" opacity="0.7" />
        <circle cx="30" cy="20" r="2" fill="#2563eb" opacity="0.7" />
        <circle cx="30" cy="26" r="2" fill="#2563eb" opacity="0.7" />
        
        {/* Connecting Lines */}
        <path 
          d="M28 14 L30 14 M28 20 L30 20 M28 26 L30 26" 
          stroke="#2563eb" 
          strokeWidth="1" 
          opacity="0.5"
        />
      </svg>
      
      {showText && (
        <span className="app-brand-text fw-bold ms-2 text-primary">
          Flow Management Console
        </span>
      )}
    </div>
  )
}
