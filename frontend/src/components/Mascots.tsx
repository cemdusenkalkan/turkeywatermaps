import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

function clampLen(dx: number, dy: number, maxLen: number) {
  const len = Math.hypot(dx, dy) || 1
  const k = Math.min(1, maxLen / len)
  return { x: dx * k, y: dy * k }
}

interface MascotState {
  blinkSun: boolean
  blinkCloud: boolean
  breath: number
  weatherMood: 'sunny' | 'rainy' | 'storm'
  mapLean: number
  showTooltip: string
  isLoading: boolean
}

function useMascotEffects(
  containerRef: React.RefObject<HTMLDivElement>,
  state: MascotState,
  maxPupil = 5
) {
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let raf = 0

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const tick = () => {
      raf = 0

      // Parallax drift (opposite to mouse)
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const driftX = ((centerX - mouse.x) / centerX) * 8
      const driftY = ((centerY - mouse.y) / centerY) * 8
      el.style.transform = `translate(${driftX}px, ${driftY}px) rotate(${state.mapLean}deg)`

      // Eye tracking
      const pupils = el.querySelectorAll('[data-pupil]')
      pupils.forEach((pupil) => {
        const eyeId = pupil.getAttribute('data-eye')
        const eye = el.querySelector(`[data-eye-center="${eyeId}"]`)
        if (!eye) return

        const r = eye.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2

        const dx = mouse.x - cx
        const dy = mouse.y - cy

        const v = clampLen(dx, dy, maxPupil)
        ;(pupil as HTMLElement).style.transform = `translate(${v.x}px, ${v.y}px)`
      })
    }

    window.addEventListener('pointermove', onMove, { passive: true } as AddEventListenerOptions)
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [containerRef, maxPupil, state.mapLean])
}

export function Mascots() {
  const ref = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [state, setState] = useState<MascotState>({
    blinkSun: false,
    blinkCloud: false,
    breath: 1,
    weatherMood: 'sunny',
    mapLean: 0,
    showTooltip: '',
    isLoading: false,
  })

  // Check if we're on an academic page (Methodology, About, Categories)
  const isAcademicPage = typeof window !== 'undefined' && 
    (window.location.pathname.includes('/methodology') || 
     window.location.pathname.includes('/about') ||
     window.location.pathname.includes('/categories'))

  useMascotEffects(ref, state, 6)

  // Breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setState(s => ({ ...s, breath: 1 + Math.sin(Date.now() / 1500) * 0.03 }))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Random blinking
  useEffect(() => {
    const blinkSun = () => {
      setState(s => ({ ...s, blinkSun: true }))
      setTimeout(() => setState(s => ({ ...s, blinkSun: false })), 150)
    }
    const blinkCloud = () => {
      setState(s => ({ ...s, blinkCloud: true }))
      setTimeout(() => setState(s => ({ ...s, blinkCloud: false })), 150)
    }

    const sunInterval = setInterval(blinkSun, 3000 + Math.random() * 4000)
    const cloudInterval = setInterval(blinkCloud, 4000 + Math.random() * 3000)

    return () => {
      clearInterval(sunInterval)
      clearInterval(cloudInterval)
    }
  }, [])

  const isDark = theme === 'dark'

  return (
    <div 
      ref={ref} 
      className="fixed right-6 top-32 z-[9999] flex gap-4 items-center pointer-events-auto transition-all duration-300"
      style={{ 
        color: '#2563eb',
        filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.12))',
        transform: `scale(1.15)`,
        opacity: isAcademicPage ? 0.25 : 1
      }}
      aria-hidden="true"
    >
      <div 
        className="animate-bob relative group"
        style={{ transform: `scale(${state.breath})` }}
        onMouseEnter={() => setState(s => ({ ...s, showTooltip: 'sun' }))}
        onMouseLeave={() => setState(s => ({ ...s, showTooltip: '' }))}
      >
        <SunFace blink={state.blinkSun} isDark={isDark} />
        {state.showTooltip === 'sun' && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
            Baseline 1960–2019
          </div>
        )}
      </div>
      <div 
        className="animate-bob relative group" 
        style={{ 
          animationDelay: '0.6s',
          transform: `scale(${state.breath})` 
        }}
        onMouseEnter={() => setState(s => ({ ...s, showTooltip: 'cloud' }))}
        onMouseLeave={() => setState(s => ({ ...s, showTooltip: '' }))}
      >
        <CloudFace blink={state.blinkCloud} mood={state.weatherMood} isLoading={state.isLoading} />
        {state.showTooltip === 'cloud' && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
            Risk = weighted mean
          </div>
        )}
      </div>
    </div>
  )
}

function SunFace({ blink, isDark }: { blink: boolean; isDark: boolean }) {
  // Pastel yellow colors
  const sunColor = isDark ? '#B8B8D4' : '#FFE082' // Moon in dark mode, pastel yellow in light
  const rayColor = isDark ? '#9CA3AF' : '#FDD835' // Gray rays for moon, yellow for sun

  return (
    <svg width="84" height="84" viewBox="0 0 84 84" className="block transition-colors duration-300">
      <defs>
        <clipPath id="sunClip">
          <circle cx="42" cy="42" r="26" />
        </clipPath>
      </defs>

      {/* rays */}
      <g opacity={isDark ? '0.5' : '0.85'}>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6
          const x1 = 42 + Math.cos(a) * 34
          const y1 = 42 + Math.sin(a) * 34
          const x2 = 42 + Math.cos(a) * 40
          const y2 = 42 + Math.sin(a) * 40
          return (
            <line 
              key={i} 
              x1={x1} 
              y1={y1} 
              x2={x2} 
              y2={y2} 
              stroke={rayColor} 
              strokeWidth="3" 
              strokeLinecap="round"
              className="transition-colors duration-300"
            />
          )
        })}
      </g>

      {/* face */}
      <circle cx="42" cy="42" r="28" fill={sunColor} opacity="0.3" className="transition-colors duration-300" />
      <circle cx="42" cy="42" r="26" fill={sunColor} opacity="0.95" className="transition-colors duration-300" />

      {/* eyes whites */}
      <g clipPath="url(#sunClip)">
        <g data-eye-center="sunL">
          <ellipse cx="33" cy="40" rx="7.5" ry={blink ? '0.5' : '8'} fill="#111827" opacity="0.08" className="transition-all duration-150" />
          <ellipse cx="33" cy="40" rx="7" ry={blink ? '0.5' : '7.5'} fill="white" className="transition-all duration-150" />
        </g>
        <g data-eye-center="sunR">
          <ellipse cx="51" cy="40" rx="7.5" ry={blink ? '0.5' : '8'} fill="#111827" opacity="0.08" className="transition-all duration-150" />
          <ellipse cx="51" cy="40" rx="7" ry={blink ? '0.5' : '7.5'} fill="white" className="transition-all duration-150" />
        </g>

        {/* pupils (moved by JS) */}
        {!blink && (
          <>
            <circle data-pupil data-eye="sunL" cx="33" cy="41" r="3.2" fill="#111827" />
            <circle data-pupil data-eye="sunR" cx="51" cy="41" r="3.2" fill="#111827" />
          </>
        )}

        {/* smile */}
        <path 
          d="M34 52 C 38 58, 46 58, 50 52" 
          fill="none" 
          stroke="#111827" 
          strokeWidth="3" 
          strokeLinecap="round" 
          opacity="0.75" 
        />
      </g>
    </svg>
  )
}

function CloudFace({ 
  blink, 
  mood, 
  isLoading 
}: { 
  blink: boolean
  mood: 'sunny' | 'rainy' | 'storm'
  isLoading: boolean
}) {
  // Blueish white for cloud
  const cloudColor = '#E3F2FD' // Light blue-white
  const cloudAccent = '#90CAF9' // Slightly more blue

  return (
    <svg width="110" height="70" viewBox="0 0 110 70" className="block">
      <defs>
        <clipPath id="cloudClip">
          <path d="M25 56c-10 0-18-7-18-16 0-8 6-15 14-16 3-12 14-20 27-20 12 0 22 6 27 16 2-1 4-1 6-1 11 0 20 8 20 18s-9 19-20 19H25z" />
        </clipPath>
      </defs>

      {/* cloud body */}
      <path
        d="M25 56c-10 0-18-7-18-16 0-8 6-15 14-16 3-12 14-20 27-20 12 0 22 6 27 16 2-1 4-1 6-1 11 0 20 8 20 18s-9 19-20 19H25z"
        fill={cloudColor}
        opacity="0.98"
        className={isLoading ? 'animate-pulse' : ''}
      />
      <path
        d="M25 56c-10 0-18-7-18-16 0-8 6-15 14-16 3-12 14-20 27-20 12 0 22 6 27 16 2-1 4-1 6-1 11 0 20 8 20 18s-9 19-20 19H25z"
        fill={cloudAccent}
        opacity="0.15"
      />

      {/* Rain drops for rainy mood */}
      {mood === 'rainy' && (
        <g opacity="0.6">
          <line x1="46" y1="58" x2="46" y2="64" stroke="#64B5F6" strokeWidth="2" strokeLinecap="round" />
          <line x1="56" y1="60" x2="56" y2="66" stroke="#64B5F6" strokeWidth="2" strokeLinecap="round" />
          <line x1="66" y1="58" x2="66" y2="64" stroke="#64B5F6" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      <g clipPath="url(#cloudClip)">
        {/* eyes whites */}
        <g data-eye-center="clL">
          <ellipse 
            cx="46" 
            cy="38" 
            rx={mood === 'storm' ? '9' : '8'} 
            ry={blink ? '0.5' : mood === 'storm' ? '9.5' : '8.5'} 
            fill="#111827" 
            opacity="0.08"
            className="transition-all duration-150"
          />
          <ellipse 
            cx="46" 
            cy="38" 
            rx={mood === 'storm' ? '8.5' : '7.5'} 
            ry={blink ? '0.5' : mood === 'storm' ? '9' : '8'} 
            fill="white"
            className="transition-all duration-150"
          />
        </g>
        <g data-eye-center="clR">
          <ellipse 
            cx="66" 
            cy="38" 
            rx={mood === 'storm' ? '9' : '8'} 
            ry={blink ? '0.5' : mood === 'storm' ? '9.5' : '8.5'} 
            fill="#111827" 
            opacity="0.08"
            className="transition-all duration-150"
          />
          <ellipse 
            cx="66" 
            cy="38" 
            rx={mood === 'storm' ? '8.5' : '7.5'} 
            ry={blink ? '0.5' : mood === 'storm' ? '9' : '8'} 
            fill="white"
            className="transition-all duration-150"
          />
        </g>

        {/* pupils */}
        {!blink && (
          <>
            <circle data-pupil data-eye="clL" cx="46" cy="39" r="3.2" fill="#111827" />
            <circle data-pupil data-eye="clR" cx="66" cy="39" r="3.2" fill="#111827" />
          </>
        )}

        {/* smile or worried expression */}
        <path 
          d={mood === 'storm' ? 'M48 52 C 54 48, 58 48, 64 52' : 'M48 50 C 54 56, 58 56, 64 50'} 
          fill="none" 
          stroke="#111827" 
          strokeWidth="3" 
          strokeLinecap="round" 
          opacity="0.7"
          className="transition-all duration-300"
        />

        {/* Loading dots */}
        {isLoading && (
          <g opacity="0.6">
            <circle cx="52" cy="28" r="1.5" fill="#111827" className="animate-bounce" />
            <circle cx="56" cy="28" r="1.5" fill="#111827" className="animate-bounce" style={{ animationDelay: '0.1s' }} />
            <circle cx="60" cy="28" r="1.5" fill="#111827" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
          </g>
        )}
      </g>
    </svg>
  )
}
