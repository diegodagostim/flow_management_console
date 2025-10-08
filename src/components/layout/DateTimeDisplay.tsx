import { useState, useEffect } from 'react'
import { Clock, Calendar } from 'lucide-react'

export function DateTimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000) // Update every second

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="menu-footer mt-auto p-3 border-top">
      <div className="text-center">
        <div className="fw-semibold text-primary mb-1 d-flex align-items-center justify-content-center">
          <Clock className="h-1 w-1 me-1" />
          {formatTime(currentTime)}
        </div>
        <div className="small text-muted d-flex align-items-center justify-content-center">
          <Calendar className="h-0.5 w-0.5 me-1" />
          {formatDate(currentTime)}
        </div>
      </div>
    </div>
  )
}
