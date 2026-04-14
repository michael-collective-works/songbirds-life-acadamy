import { auth } from '@/auth'

export async function requireAdmin() {
  const session = await auth()
  const role = (session?.user as any)?.role as string | undefined
  if (!session || !role || !['owner', 'editor'].includes(role)) {
    return { ok: false as const, status: 401 as const }
  }
  return { ok: true as const }
}
