import { useTimeRegion } from '@/hooks/useTimeRegion'
import { useUserLocation } from '@/hooks/useUserLocation'
import { Clock, Calendar, MapPin, Globe, Wifi } from 'lucide-react'

export function DateTimeDisplay() {
  const { currentDateTime } = useTimeRegion()
  const { ip, city, region, country, loading, error } = useUserLocation()

  return (
    <div className="menu-footer mt-auto p-3 border-top">
      <div className="text-center">
        {/* Time Display */}
        <div className="fw-semibold text-primary mb-1 d-flex align-items-center justify-content-center">
          <Clock className="h-1 w-1 me-1" />
          {currentDateTime.time}
        </div>
        
        {/* Date Display */}
        <div className="small text-muted d-flex align-items-center justify-content-center mb-2">
          <Calendar className="h-0.5 w-0.5 me-1" />
          {currentDateTime.date}
        </div>

        {/* IP Address and Location */}
        <div className="border-top pt-2">
          {loading ? (
            <div className="small text-muted">
              <div className="spinner-border spinner-border-sm me-1" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Loading location...
            </div>
          ) : error ? (
            <div className="small text-muted">
              <Globe className="h-0.5 w-0.5 me-1" />
              Location unavailable
            </div>
          ) : (
            <>
              {/* IP Address */}
              <div className="small text-muted d-flex align-items-center justify-content-center mb-1">
                <Wifi className="h-0.5 w-0.5 me-1" />
                {ip}
              </div>
              
              {/* Location */}
              <div className="small text-muted d-flex align-items-center justify-content-center">
                <MapPin className="h-0.5 w-0.5 me-1" />
                {city && region && country ? `${city}, ${region}, ${country}` : 'Location unknown'}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
