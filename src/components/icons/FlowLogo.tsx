import React from 'react'

interface FlowLogoProps {
  className?: string
  size?: number
  showText?: boolean
}

export function FlowLogo({ className = "h-8 w-8", size = 32, showText = true }: FlowLogoProps) {
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
        <circle cx="20" cy="20" r="18" fill="#2563eb" opacity="0.1" />
        
        {/* Flow Symbol - Stylized "F" */}
        <path 
          d="M12 8 L28 8 L28 12 L16 12 L16 18 L26 18 L26 22 L16 22 L16 32 L12 32 Z" 
          fill="#2563eb"
        />
        
        {/* Flow Lines */}
        <path 
          d="M30 14 Q32 16 30 18 Q28 20 30 22 Q32 24 30 26" 
          stroke="#2563eb" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Small dots representing flow */}
        <circle cx="31" cy="15" r="1" fill="#2563eb" />
        <circle cx="29" cy="19" r="1" fill="#2563eb" />
        <circle cx="31" cy="23" r="1" fill="#2563eb" />
        <circle cx="29" cy="27" r="1" fill="#2563eb" />
      </svg>
      
      {showText && (
        <span className="app-brand-text fw-bold ms-2 text-primary">
          Flow Management Console
        </span>
      )}
    </div>
  )
}
