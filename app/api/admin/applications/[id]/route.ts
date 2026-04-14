import { NextResponse } from 'next/server'
import { setApplicationStatus } from '@/lib/db'
import { requireAdmin } from '@/lib/authz'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const gate = await requireAdmin()
  if (!gate.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: gate.status })
  try {
    const { status } = await req.json()
    if (!['new', 'reviewed', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    const item = await setApplicationStatus(params.id, status)
    return NextResponse.json({ item })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
