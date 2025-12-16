/**
 * Weather Icon Component - Professional SVG Icons
 * Replaces emoji icons with proper SVG weather icons
 */

interface WeatherIconProps {
  code: number
  isDay?: boolean
  size?: number
  className?: string
}

export function WeatherIcon({ code, isDay = true, size = 48, className = '' }: WeatherIconProps) {
  const getIconPath = () => {
    // Clear sky
    if (code === 0) {
      if (isDay) {
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="12" r="5" fill="#FDB813" stroke="#F59E0B" strokeWidth="1.5"/>
            <path d="M12 2v2M12 20v2M20 12h2M2 12h2M17.657 6.343l1.414-1.414M4.929 19.071l1.414-1.414M17.657 17.657l1.414 1.414M4.929 4.929l1.414 1.414" 
              stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      } else {
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5"/>
          </svg>
        )
      }
    }
    
    // Mainly clear
    if (code === 1) {
      if (isDay) {
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="10" r="4" fill="#FDB813" stroke="#F59E0B" strokeWidth="1.5"/>
            <path d="M12 2v1.5M19 9l-1-1M5 9l1-1M20 10h-1.5M3.5 10H2" 
              stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"/>
            <ellipse cx="16" cy="17" rx="5" ry="4" fill="white" stroke="#94A3B8" strokeWidth="1.5"/>
          </svg>
        )
      } else {
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5"/>
            <ellipse cx="14" cy="18" rx="4" ry="3" fill="white" stroke="#94A3B8" strokeWidth="1.5"/>
          </svg>
        )
      }
    }
    
    // Partly cloudy
    if (code === 2) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="11" cy="10" r="3.5" fill="#FDB813" stroke="#F59E0B" strokeWidth="1.3"/>
          <path d="M11 4v1M17 8.5l-.8-.8M4 10.5h1M18 10.5h1" 
            stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
          <ellipse cx="14" cy="16" rx="6" ry="4.5" fill="white" stroke="#94A3B8" strokeWidth="1.5"/>
          <ellipse cx="10" cy="17" rx="4" ry="3" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5"/>
        </svg>
      )
    }
    
    // Overcast
    if (code === 3) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <ellipse cx="12" cy="11" rx="7" ry="5" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1.5"/>
          <ellipse cx="15" cy="13" rx="6" ry="4.5" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5"/>
          <ellipse cx="9" cy="13" rx="5" ry="4" fill="white" stroke="#9CA3AF" strokeWidth="1.5"/>
        </svg>
      )
    }
    
    // Fog
    if (code === 45 || code === 48) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M6 12h12M4 15h16M7 18h10" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
          <ellipse cx="12" cy="8" rx="6" ry="4" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5" opacity="0.8"/>
        </svg>
      )
    }
    
    // Drizzle
    if (code >= 51 && code <= 55) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <ellipse cx="12" cy="9" rx="6" ry="4.5" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5"/>
          <circle cx="8" cy="16" r="0.8" fill="#60A5FA"/>
          <circle cx="12" cy="17" r="0.8" fill="#60A5FA"/>
          <circle cx="16" cy="16" r="0.8" fill="#60A5FA"/>
          <circle cx="10" cy="19" r="0.8" fill="#60A5FA"/>
          <circle cx="14" cy="19" r="0.8" fill="#60A5FA"/>
        </svg>
      )
    }
    
    // Rain
    if (code >= 61 && code <= 67 || code >= 80 && code <= 82) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <ellipse cx="12" cy="9" rx="6" ry="4.5" fill="#9CA3AF" stroke="#6B7280" strokeWidth="1.5"/>
          <path d="M8 14v4M12 15v5M16 14v4M10 16v3M14 17v3" 
            stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      )
    }
    
    // Snow
    if (code >= 71 && code <= 77 || code >= 85 && code <= 86) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <ellipse cx="12" cy="9" rx="6" ry="4.5" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1.5"/>
          <path d="M8 15l1 1m-1 0l1-1M8 19l1 1m-1 0l1-1M12 16l1 1m-1 0l1-1M12 20l1 1m-1 0l1-1M16 15l1 1m-1 0l1-1M16 19l1 1m-1 0l1-1" 
            stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    }
    
    // Thunderstorm
    if (code >= 95 && code <= 99) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <ellipse cx="12" cy="8" rx="6" ry="4.5" fill="#6B7280" stroke="#4B5563" strokeWidth="1.5"/>
          <path d="M13 12l-3 5h2l-2 4 4-6h-2l3-3z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" strokeLinejoin="round"/>
        </svg>
      )
    }
    
    // Default cloud
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <ellipse cx="12" cy="12" rx="6" ry="4.5" fill="white" stroke="#94A3B8" strokeWidth="1.5"/>
      </svg>
    )
  }

  return <div className="inline-flex items-center justify-center">{getIconPath()}</div>
}
