'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CheckCircle2 } from 'lucide-react'
import { TurnstileWidget } from './turnstile-widget'

type JoinFormProps = {
  turnstileSiteKey?: string // passed from server; do not read env in client
  captchaEnabled?: boolean
}

export function JoinForm({ turnstileSiteKey, captchaEnabled = false }: JoinFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const hasCaptcha = Boolean(captchaEnabled && turnstileSiteKey)

  async function onSubmit(form: FormData) {
    setStatus('submitting')
    setError(null)

    const payload = Object.fromEntries(form.entries())

    if (hasCaptcha && !payload['cf-turnstile-response']) {
      setError('Please complete the CAPTCHA.')
      setStatus('error')
      return
    }

    try {
      const res = await fetch('/api/join-us', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Request failed')
      }
      setStatus('success')
    } catch {
      setError('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-teal-200 bg-teal-50 p-6 text-teal-900">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5" />
          <div>
            <h3 className="font-semibold">Thanks for reaching out!</h3>
            <p className="text-sm">We received your submission and will contact you soon.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form className="grid gap-6" action={(fd: FormData) => onSubmit(fd)}>
      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="first_name">First name</Label>
          <Input id="first_name" name="first_name" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="last_name">Last name</Label>
          <Input id="last_name" name="last_name" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" inputMode="tel" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>I’m interested in</Label>
        <RadioGroup name="kind" defaultValue="employment" className="grid grid-cols-2 gap-2 sm:max-w-sm">
          <div className="flex items-center gap-2 rounded-md border p-2">
            <RadioGroupItem id="employment" value="employment" />
            <Label htmlFor="employment" className="cursor-pointer">Employment</Label>
          </div>
          <div className="flex items-center gap-2 rounded-md border p-2">
            <RadioGroupItem id="volunteer" value="volunteer" />
            <Label htmlFor="volunteer" className="cursor-pointer">Volunteer</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea id="message" name="message" rows={3} placeholder="Tell us a little about yourself" />
      </div>

      {hasCaptcha && (
        <TurnstileWidget
          siteKey={turnstileSiteKey}
          className="sm:max-w-sm"
          onToken={(t) => setCaptchaToken(t)}
        />
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={status === 'submitting' || (hasCaptcha && !captchaToken)}>
          {status === 'submitting' ? 'Submitting…' : 'Submit'}
        </Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <p className="text-xs text-slate-500">
        We’ll never share your contact information. Protected by rate limiting and spam checks.
      </p>
    </form>
  )
}
