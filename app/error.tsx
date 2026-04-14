'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <main className="flex min-h-screen flex-col bg-white">
          <SiteHeader />
          <section className="mx-auto max-w-3xl px-4 py-16 text-center">
            <h1 className="text-3xl font-semibold text-slate-900">Something went wrong</h1>
            <p className="mt-2 text-slate-700">Please try again or return to the homepage.</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={reset}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Try again
              </button>
              <Link href="/" className="text-teal-700 underline hover:text-teal-800">
                Go home
              </Link>
            </div>
            {error?.digest ? <p className="mt-6 text-xs text-slate-500">Error ID: {error.digest}</p> : null}
          </section>
          <SiteFooter />
        </main>
      </body>
    </html>
  )
}
