import Image from 'next/image'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { listTeam } from '@/lib/db'
import { Button } from '@/components/ui/button'

export default async function AboutPage() {
  const team = await listTeam()

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <section className="border-b bg-amber-50/40">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Learning through play, immersed in music
            </h1>
            <p className="mt-3 max-w-prose text-pretty text-slate-700">
              We nurture infants and toddlers in a warm, creative environment. Our educators pair research-based
              practice with everyday moments of joy—supporting each child’s growth at their own pace.
            </p>
            <div className="mt-6">
              <Button asChild className="bg-teal-700 hover:bg-teal-800">
                <Link href="/join">Join our team</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-xl ring-1 ring-slate-900/5">
              <Image
                src="/images/stock/daycare-teachers-kids.png"
                alt="Teachers and children enjoying activities in a bright daycare classroom"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold text-slate-900">Our Story</h2>
        <div className="mt-3 max-w-3xl space-y-4 text-slate-700">
          <p>
            Songbirds Life Academy began with a simple idea: children thrive when they feel loved, safe, and inspired.
            Music is part of our daily rhythm—supporting bonding, language, social growth, and motor skills.
          </p>
          <p>
            We use The Creative Curriculum® to turn routines into meaningful learning moments. Through responsive care
            and play, we build foundations for a lifelong love of learning.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Our Team</h2>
          <Link href="/join" className="text-sm font-medium text-teal-700 hover:underline">
            Join our team
          </Link>
        </div>

        {Array.isArray(team) && team.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m: any) => (
              <li key={m.id} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-amber-100 ring-1 ring-amber-200">
                    {m.headshot_url ? (
                      <Image
                        src={m.headshot_url || '/placeholder.svg?height=80&width=80&query=team%20member%20headshot'}
                        alt={`${m.name} headshot`}
                        width={80}
                        height={80}
                        className="h-20 w-20 object-cover"
                        unoptimized
                      />
                    ) : (
                      <Image
                        src="/images/logo-original.svg"
                        alt=""
                        width={80}
                        height={80}
                        className="h-20 w-20 p-3 opacity-70"
                      />
                    )}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-slate-900">{m.name}</div>
                    <div className="text-sm text-slate-600">{m.title}</div>
                    {m.bio && <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-700">{m.bio}</p>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-600">Team profiles coming soon.</p>
        )}
      </section>

      <SiteFooter />
    </main>
  )
}
