import { listEventsPaged } from '@/lib/db'

// Public events endpoint with pagination and basic filtering.
// Query params: ?page=1&pageSize=9&when=upcoming|past|all&q=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') || '1')
  const pageSize = Number(searchParams.get('pageSize') || '9')
  const when = (searchParams.get('when') || 'upcoming') as 'upcoming' | 'past' | 'all'
  const q = searchParams.get('q') || undefined

  const { events, total } = await listEventsPaged({ when, page, pageSize, q })
  const hasNext = page * pageSize < total
  return new Response(JSON.stringify({ events, total, page, pageSize, hasNext, when }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60',
    },
  })
}
