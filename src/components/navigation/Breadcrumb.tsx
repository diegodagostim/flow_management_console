import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import type { BreadcrumbItem } from './types'

interface BreadcrumbProps {
  className?: string
  items?: BreadcrumbItem[]
  showHome?: boolean
}

export function Breadcrumb({ 
  className = '', 
  items = [],
  showHome = true 
}: BreadcrumbProps) {
  const location = useLocation()

  // Generate breadcrumb items from current path if none provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items.length > 0) return items

    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    // Add home if enabled
    if (showHome) {
      breadcrumbs.push({
        label: 'Home',
        path: '/',
        active: location.pathname === '/'
      })
    }

    // Generate breadcrumbs from path segments
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({
        label,
        path: isLast ? undefined : currentPath,
        active: isLast
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) return null

  return (
    <nav aria-label="breadcrumb" className={`breadcrumb-nav ${className}`}>
      <ol className="breadcrumb mb-0">
        {breadcrumbs.map((item, index) => (
          <li 
            key={index} 
            className={`breadcrumb-item ${item.active ? 'active' : ''}`}
            aria-current={item.active ? 'page' : undefined}
          >
            {item.active ? (
              <span className="d-flex align-items-center">
                {index === 0 && showHome && <Home className="h-3 w-3 me-1" />}
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.path || '#'} 
                className="d-flex align-items-center text-decoration-none"
              >
                {index === 0 && showHome && <Home className="h-3 w-3 me-1" />}
                {item.label}
              </Link>
            )}
            {!item.active && index < breadcrumbs.length - 1 && (
              <ChevronRight className="h-3 w-3 mx-2 text-muted" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
