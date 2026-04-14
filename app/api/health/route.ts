import { dbStatus } from '@/lib/db'

export async function GET() {
  const db = dbStatus()
  const kvConfigured = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  const captchaConfigured = Boolean(process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY)

  const body = {
    ok: true,
    uptime: Math.round(process.uptime?.() ?? 0),
    db,
    kvConfigured,
    captchaConfigured,
    timestamp: new Date().toISOString(),
  }

  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    status: 200,
  })
}
