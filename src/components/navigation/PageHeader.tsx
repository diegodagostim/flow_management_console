import React from 'react'
import { Breadcrumb } from './Breadcrumb'
import type { BreadcrumbItem } from './types'

interface PageHeaderProps {
  title?: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  className?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  className = '',
  children
}: PageHeaderProps) {
  return (
    <div className={`page-header mb-4 ${className}`}>
      {/* Breadcrumb */}
      <div className="row mb-3">
        <div className="col-12">
          <Breadcrumb items={breadcrumbs} />
        </div>
      </div>

      {/* Header Content */}
      <div className="row align-items-center">
        <div className="col-md-8">
          <div>
            {title && <h4 className="mb-1 text-primary">{title}</h4>}
            {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
          </div>
        </div>
        <div className="col-md-4 text-md-end">
          {children}
        </div>
      </div>
    </div>
  )
}
