import { NextResponse } from 'next/server'
import { listApplications } from '@/lib/db'
import { requireAdmin } from '@/lib/authz'

export async function GET() {
  const gate = await requireAdmin()
  if (!gate.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: gate.status })
  try {
    const items = await listApplications()
    return NextResponse.json({ items })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
