import type { ReactNode } from 'react'
import { ProtectedRoute } from './ProtectedRoute'
import { SneatLayout } from '@/components/layout/SneatLayout'

interface ProtectedLayoutProps {
  children: ReactNode
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <ProtectedRoute>
      <SneatLayout>
        {children}
      </SneatLayout>
    </ProtectedRoute>
  )
}
