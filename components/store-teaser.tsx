import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'

const SQUARE_URL = 'http://feathered-insights-by-songbirds.square.site/'

const items = [
  {
    title: 'Uniform T-Shirt (Teal)',
    image: '/placeholder-8f0gr.png',
    external: SQUARE_URL,
  },
  {
    title: 'Logo Cap',
    image: '/teal-cap-with-logo.png',
    external: SQUARE_URL,
  },
  {
    title: 'Music Tote',
    image: '/cream-music-tote.png',
    external: SQUARE_URL,
  },
]

export function StoreTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Uniforms & Merch</h2>
          <p className="mt-1 text-sm text-slate-600">
            Grab gear that celebrates creativity. All purchases happen on our Square site.
          </p>
        </div>
        <Button asChild variant="secondary" className="bg-amber-100 text-amber-900 hover:bg-amber-200">
          <a href={SQUARE_URL} target="_blank" rel="noopener noreferrer">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Shop Square
          </a>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.title} href={item.external} target="_blank" rel="noopener noreferrer" className="group">
            <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md">
              <div className="relative aspect-[4/3]">
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-slate-900 group-hover:text-teal-800">{item.title}</p>
                <p className="text-xs text-slate-600">Opens Square in new tab</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
