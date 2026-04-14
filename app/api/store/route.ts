import { listStore } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const all = await listStore()
  const filtered = category ? all.filter((i: any) => i.category === category) : all
  return new Response(JSON.stringify({ items: filtered }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
  })
}
