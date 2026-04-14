/**
 * Optional origin allow-listing for POST endpoints.
 * If ALLOWED_ORIGINS is set (comma-separated), only those origins are allowed.
 * Otherwise, the check is a no-op and returns true.
 */

const allowed = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export function isAllowedOrigin(req: Request): boolean {
  if (!allowed.length) return true
  const origin = req.headers.get('origin')
  if (!origin) return true // allow server-to-server
  try {
    const u = new URL(origin)
    return allowed.includes(u.origin)
  } catch {
    return false
  }
}
