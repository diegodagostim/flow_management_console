import { useTimeRegion } from '@/hooks/useTimeRegion'
import { Clock, Calendar } from 'lucide-react'

export function TopbarDateTime() {
  const { currentDateTime } = useTimeRegion()

  return (
    <div className="d-flex align-items-center me-3">
      {/* Time Display */}
      <div className="d-flex align-items-center me-3">
        <Clock className="h-4 w-4 text-muted me-1" />
        <span className="fw-medium text-dark small">{currentDateTime.time}</span>
      </div>
      
      {/* Date Display */}
      <div className="d-flex align-items-center">
        <Calendar className="h-4 w-4 text-muted me-1" />
        <span className="text-muted small">{currentDateTime.date}</span>
      </div>
    </div>
  )
}
