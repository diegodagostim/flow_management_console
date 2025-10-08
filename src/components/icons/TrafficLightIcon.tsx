import React from 'react'

interface TrafficLightIconProps {
  className?: string
  size?: number
}

export function TrafficLightIcon({ className = "h-4 w-4", size = 16 }: TrafficLightIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 20" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Traffic light pole */}
      <rect x="7" y="0" width="2" height="20" fill="currentColor" opacity="0.3" />
      
      {/* Traffic light housing */}
      <rect x="2" y="2" width="12" height="16" rx="2" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="0.5" />
      
      {/* Red light */}
      <circle cx="8" cy="6" r="2" fill="#ef4444" />
      
      {/* Amber light */}
      <circle cx="8" cy="10" r="2" fill="#f59e0b" />
      
      {/* Green light */}
      <circle cx="8" cy="14" r="2" fill="#10b981" />
    </svg>
  )
}
