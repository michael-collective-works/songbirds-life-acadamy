import { uploadStore } from '@/lib/uploads-memory'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const file = uploadStore.get(params.id)
  if (!file) return new Response('Not found', { status: 404 })
  return new Response(file.data, {
    headers: {
      'content-type': file.contentType,
      'cache-control': 'public, max-age=31536000, immutable',
    },
  })
}
