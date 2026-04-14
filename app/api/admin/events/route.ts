import { NextResponse } from 'next/server'
import { createEvent, listEvents } from '@/lib/db'
import { EventSchema } from '@/lib/schemas'
import { requireAdmin } from '@/lib/authz'

export async function GET() {
  try {
    const items = await listEvents()
    return NextResponse.json({ items })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const gate = await requireAdmin()
  if (!gate.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: gate.status })
  try {
    const body = await req.json()
    const parsed = EventSchema.omit({ id: true, created_at: true, updated_at: true }).parse(body)
    const item = await createEvent(parsed)
    return NextResponse.json({ item }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
