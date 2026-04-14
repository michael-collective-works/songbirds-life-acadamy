import { AdminNav } from '@/components/admin/admin-nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const hasAuthEnv =
    Boolean(process.env.GOOGLE_CLIENT_ID) &&
    Boolean(process.env.GOOGLE_CLIENT_SECRET) &&
    Boolean(process.env.NEXTAUTH_SECRET)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-semibold text-gray-900">
              Admin Portal
            </Link>
            <AdminNav />
          </div>
          <div>
            <Link
              href="/"
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Back to public site (opens in a new tab)"
              className="group inline-flex items-center gap-1 text-sm text-emerald-700 underline hover:text-emerald-800"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
              <span>Back to site</span>
            </Link>
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Admin</h1>
          <div className="flex items-center gap-3">
            {hasAuthEnv ? (
              <>
                <form
                  action={async () => {
                    'use server'
                    const { signIn } = await import('@/auth')
                    await signIn('google', { redirectTo: '/admin' })
                  }}
                >
                  <Button type="submit">Sign in with Google</Button>
                </form>
                <form
                  action={async () => {
                    'use server'
                    const { signOut } = await import('@/auth')
                    await signOut({ redirectTo: '/admin' })
                  }}
                >
                  <Button type="submit" variant="outline">
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <span className="text-xs text-slate-500">Auth disabled in this preview</span>
            )}
          </div>
        </div>

        {!hasAuthEnv && (
          <Card className="mb-6 border-amber-300 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-900">Setup required</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-amber-900">
              <p className="mb-2">
                Environment variables are not configured. You can still explore the admin UI and use a demo in-memory database.
              </p>
              <ul className="list-disc pl-5">
                <li>GOOGLE_CLIENT_ID</li>
                <li>GOOGLE_CLIENT_SECRET</li>
                <li>NEXTAUTH_SECRET</li>
                <li>DATABASE_URL (Neon Postgres) — optional for now</li>
                <li>ADMIN_EMAILS — comma-separated list with owner/editor access</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {children}
      </main>
    </div>
  )
}
