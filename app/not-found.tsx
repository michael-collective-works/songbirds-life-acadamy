import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-700">The page you are looking for doesn’t exist or was moved.</p>
        <div className="mt-6">
          <Link href="/" className="text-teal-700 underline hover:text-teal-800">
            Go back home
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
