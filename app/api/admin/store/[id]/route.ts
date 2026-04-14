import { NextResponse } from 'next/server'
import { deleteStoreItem, updateStoreItem } from '@/lib/db'
import { requireAdmin } from '@/lib/authz'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const gate = await requireAdmin()
  if (!gate.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: gate.status })
  try {
    const patch = await req.json()
    const item = await updateStoreItem(params.id, patch)
    return NextResponse.json({ item })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const gate = await requireAdmin()
  if (!gate.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: gate.status })
  try {
    await deleteStoreItem(params.id)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
