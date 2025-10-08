import { useTimeRegion } from '@/hooks/useTimeRegion'
import { Clock, Calendar } from 'lucide-react'

export function DateTimeDisplay() {
  const { currentDateTime } = useTimeRegion()

  return (
    <div className="menu-footer mt-auto p-3 border-top">
      <div className="text-center">
        <div className="fw-semibold text-primary mb-1 d-flex align-items-center justify-content-center">
          <Clock className="h-1 w-1 me-1" />
          {currentDateTime.time}
        </div>
        <div className="small text-muted d-flex align-items-center justify-content-center">
          <Calendar className="h-0.5 w-0.5 me-1" />
          {currentDateTime.date}
        </div>
      </div>
    </div>
  )
}
