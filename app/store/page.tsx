export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { listStore } from '@/lib/db'
import { ShoppingBag } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

const SQUARE_URL = 'http://feathered-insights-by-songbirds.square.site/'

export default async function StorePage() {
  const items = await listStore()
  const uniforms = items.filter((i: any) => i.category === 'uniform')
  const merch = items.filter((i: any) => i.category === 'merch')

  function Grid({ data }: { data: any[] }) {
    return data.length ? (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item: any) => (
          <Link key={item.id} href={item.external_url} target="_blank" rel="noopener noreferrer" className="group">
            <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md">
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.image_url || '/images/logo-original.svg'}
                  alt={item.title}
                  fill
                  className="object-cover p-4"
                  unoptimized
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-slate-900 group-hover:text-teal-800">{item.title}</p>
                <p className="text-xs text-slate-600">View on Square</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    ) : (
      <p className="text-sm text-slate-600">Coming soon.</p>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <section className="border-b bg-amber-50/50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Store</h1>
              <p className="mt-2 max-w-prose text-slate-700">
                Uniforms and merch that celebrate creativity. Checkout happens on our Square site.
              </p>
            </div>
            <Button
              asChild
              variant="secondary"
              className="bg-amber-100 text-amber-900 ring-1 ring-amber-200 hover:bg-amber-200"
            >
              <Link href={SQUARE_URL} target="_blank" rel="noopener noreferrer">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Shop on Square
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="uniforms">Uniforms</TabsTrigger>
            <TabsTrigger value="merch">Merch</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Grid data={items} />
          </TabsContent>
          <TabsContent value="uniforms" className="mt-6">
            <Grid data={uniforms} />
          </TabsContent>
          <TabsContent value="merch" className="mt-6">
            <Grid data={merch} />
          </TabsContent>
        </Tabs>
      </section>

      <SiteFooter />
    </main>
  )
}
