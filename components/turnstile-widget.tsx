'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: any) => string
      reset: (id?: string) => void
      getResponse: (id?: string) => string
    }
  }
}

type Props = {
  siteKey?: string // passed from server; do not read env here
  inputName?: string
  onToken?: (token: string | null) => void
  className?: string
}

export function TurnstileWidget({
  siteKey,
  inputName = 'cf-turnstile-response',
  onToken,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Load Turnstile script once
  useEffect(() => {
    if (!siteKey) return
    const scriptId = 'cf-turnstile-script'
    if (document.getElementById(scriptId)) return

    const s = document.createElement('script')
    s.id = scriptId
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    s.async = true
    s.defer = true
    document.head.appendChild(s)
  }, [siteKey])

  // Render widget when script is ready
  useEffect(() => {
    if (!siteKey) return
    const i = setInterval(() => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (t: string) => {
            setToken(t)
            onToken?.(t)
          },
          'error-callback': () => {
            setToken(null)
            onToken?.(null)
          },
          'expired-callback': () => {
            setToken(null)
            onToken?.(null)
          },
          theme: 'auto',
        })
      }
    }, 100)
    return () => clearInterval(i)
  }, [siteKey, onToken])

  if (!siteKey) return null

  return (
    <div className={className}>
      <div ref={containerRef} className="cf-turnstile" />
      <input type="hidden" name={inputName} value={token ?? ''} />
    </div>
  )
}
