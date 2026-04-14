import { ApplicationSchema } from '@/lib/schemas'
import { createApplication } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { isAllowedOrigin } from '@/lib/security'
import { log } from '@/lib/log'

/**
 * Spam protection:
 * - Honeypot field "company" must be empty
 * - Rate limiting: 5 submissions per hour
 * - Optional Origin allow-list via ALLOWED_ORIGINS
 * - Optional Cloudflare Turnstile verification when TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY are set
 */

const windowSec = 60 * 60 // 1 hour
const maxPerWindow = 5

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY
const HAS_TURNSTILE = Boolean(process.env.TURNSTILE_SITE_KEY && TURNSTILE_SECRET)

function getIp(req: Request) {
  const xff = req.headers.get('x-forwarded-for') || ''
  const ip = xff.split(',')[0]?.trim() || '0.0.0.0'
  return ip
}

async function verifyTurnstile(response: string, ip: string) {
  const body = new URLSearchParams()
  body.append('secret', TURNSTILE_SECRET as string)
  body.append('response', response)
  if (ip) body.append('remoteip', ip)

  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  })
  if (!r.ok) return false
  const data = await r.json()
  return !!data?.success
}

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) {
    return new Response('Forbidden', { status: 403 })
  }

  const ip = getIp(req)
  const key = `join:${ip}`

  const rl = await rateLimit(key, windowSec, maxPerWindow)
  if (!rl.ok) {
    log('warn', 'join_rate_limited', { ip })
    return new Response('Too many submissions. Try later.', {
      status: 429,
      headers: {
        'Retry-After': String(Math.max(1, rl.reset - Math.floor(Date.now() / 1000))),
        'X-RateLimit-Limit': String(maxPerWindow),
        'X-RateLimit-Remaining': String(0),
        'X-RateLimit-Reset': String(rl.reset),
      },
    })
  }

  const contentType = req.headers.get('content-type') || ''
  let data: any
  if (contentType.includes('application/json')) {
    data = await req.json()
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    const form = await req.formData()
    data = Object.fromEntries(form.entries())
  } else {
    return new Response('Unsupported content type', { status: 400 })
  }

  // Honeypot must be empty
  if (data.company) {
    log('info', 'join_honeypot', { ip })
    return new Response('OK', {
      status: 200,
      headers: {
        'X-RateLimit-Limit': String(maxPerWindow),
        'X-RateLimit-Remaining': String(rl.remaining),
        'X-RateLimit-Reset': String(rl.reset),
      },
    })
  }

  // Optional Turnstile verification
  if (HAS_TURNSTILE) {
    const token = typeof data['cf-turnstile-response'] === 'string' ? data['cf-turnstile-response'] : ''
    if (!token) {
      return new Response('Captcha required', { status: 400 })
    }
    const ok = await verifyTurnstile(token, ip)
    if (!ok) {
      log('warn', 'join_captcha_failed', { ip })
      return new Response('Captcha verification failed', { status: 400 })
    }
  }

  const parsed = ApplicationSchema.safeParse({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    kind: data.kind,
  })
  if (!parsed.success) {
    return new Response(JSON.stringify(parsed.error.flatten()), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': String(maxPerWindow),
        'X-RateLimit-Remaining': String(rl.remaining),
        'X-RateLimit-Reset': String(rl.reset),
      },
    })
  }

  const result = await createApplication({
    ...parsed.data,
    ip,
    user_agent: req.headers.get('user-agent') || undefined,
  })

  log('info', 'join_created', { id: result.id, ip })

  return new Response(JSON.stringify({ ok: true, id: result.id }), {
    headers: {
      'Content-Type': 'application/json',
      'X-RateLimit-Limit': String(maxPerWindow),
      'X-RateLimit-Remaining': String(rl.remaining),
      'X-RateLimit-Reset': String(rl.reset),
    },
    status: 201,
  })
}
