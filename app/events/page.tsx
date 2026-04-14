import Image from 'next/image'
import Link from 'next/link'
import { listEventsPaged } from '@/lib/db'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'

type Search = { page?: string; when?: 'upcoming' | 'past' | 'all'; q?: string }

function formatPretty(d: string) {
  const parsed = new Date(d + 'T00:00:00')
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function EventsPage({ searchParams }: { searchParams?: Search }) {
  const page = Math.max(1, Number(searchParams?.page ?? 1))
  const when = (searchParams?.when ?? 'upcoming') as 'upcoming' | 'past' | 'all'
  const pageSize = 9
  const q = searchParams?.q

  const { events, total } = await listEventsPaged({ when, page, pageSize, q })
  const hasPrev = page > 1
  const hasNext = page * pageSize < total

  function tabHref(val: 'upcoming' | 'past' | 'all') {
    const params = new URLSearchParams()
    params.set('when', val)
    params.set('page', '1')
    if (q) params.set('q', q)
    return `/events?${params.toString()}`
  }

  function pageHref(nextPage: number) {
    const params = new URLSearchParams()
    params.set('when', when)
    params.set('page', String(nextPage))
    if (q) params.set('q', q)
    return `/events?${params.toString()}`
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <section className="border-b bg-amber-50/40">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl font-semibold text-slate-900">Events</h1>
          <p className="mt-2 max-w-prose text-slate-700">
            Join us for music mornings, open houses, and seasonal gatherings.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Link
            href={tabHref('upcoming')}
            className={`rounded-md px-3 py-1.5 text-sm ${
              when === 'upcoming' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Upcoming
          </Link>
          <Link
            href={tabHref('past')}
            className={`rounded-md px-3 py-1.5 text-sm ${
              when === 'past' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Past
          </Link>
          <Link
            href={tabHref('all')}
            className={`rounded-md px-3 py-1.5 text-sm ${
              when === 'all' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All
          </Link>
          <span className="ml-auto text-xs text-slate-500">
            {total} {total === 1 ? 'event' : 'events'}
          </span>
        </div>

        {events.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((ev) => (
              <article key={ev.id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
                {ev.hero_image_url ? (
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={ev.hero_image_url || '/placeholder.svg?height=400&width=700&query=daycare%20event%20photo'}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : null}
                <div className="p-4">
                  <div className="text-xs font-medium uppercase tracking-wide text-teal-700">
                    {formatPretty(ev.date)}
                    {ev.time ? ` • ${ev.time}` : ''}
                  </div>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">{ev.title}</h3>
                  {ev.description && <p className="mt-2 line-clamp-4 text-sm text-slate-700">{ev.description}</p>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-slate-600">No events found.</p>
        )}

        <div className="mt-6 flex items-center justify-between">
          <Button asChild variant="outline" disabled={!hasPrev}>
            <Link href={hasPrev ? pageHref(page - 1) : '#'} aria-disabled={!hasPrev}>
              ← Previous
            </Link>
          </Button>
          <div className="text-xs text-slate-500">
            Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
          </div>
          <Button asChild variant="outline" disabled={!hasNext}>
            <Link href={hasNext ? pageHref(page + 1) : '#'} aria-disabled={!hasNext}>
              Next →
            </Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
