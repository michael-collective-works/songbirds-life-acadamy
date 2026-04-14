import { listTeam } from '@/lib/db'

export async function GET() {
  const data = await listTeam()
  return new Response(JSON.stringify({ team: data }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
  })
}
