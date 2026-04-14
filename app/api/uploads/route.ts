import { NextResponse } from 'next/server'
import { uploadStore } from '@/lib/uploads-memory'

// Prefer Vercel Blob if available; fallback to in-memory preview store.
async function tryVercelBlobUpload(path: string, file: File) {
  try {
    const { put } = await import('@vercel/blob')
    const res = await put(path, file, { access: 'public' })
    return res.url
  } catch {
    return null
  }
}

function ext(type: string) {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'image/avif': '.avif',
  }
  return map[type] ?? '.bin'
}

export async function POST(req: Request) {
  try {
    const ct = req.headers.get('content-type') || ''
    if (!ct.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 })
    }
    const form = await req.formData()
    const file = form.get('file')
    const kind = String(form.get('kind') || 'misc')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    }

    const filename = `${kind}/${Date.now()}-${crypto.randomUUID()}${ext(file.type || 'application/octet-stream')}`

    // Try Vercel Blob first
    const blobUrl = await tryVercelBlobUpload(filename, file)
    if (blobUrl) {
      return NextResponse.json({ url: blobUrl, path: filename, storage: 'blob' })
    }

    // Memory fallback for previews
    const bytes = new Uint8Array(await file.arrayBuffer())
    const id = filename.replace(/\//g, '_')
    uploadStore.set(id, { data: bytes, contentType: file.type || 'application/octet-stream', createdAt: Date.now() })
    return NextResponse.json({ url: `/api/uploads/${id}`, id, storage: 'memory' })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 })
  }
}
