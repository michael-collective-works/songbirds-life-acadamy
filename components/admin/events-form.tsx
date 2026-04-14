'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { EventInput } from '@/lib/schemas'
import { ImageIcon, Loader2, Trash2 } from 'lucide-react'

export default function EventsForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<EventInput>
  onSubmit: (values: Partial<EventInput>) => Promise<void> | void
  onCancel?: () => void
}) {
  const [values, setValues] = useState<Partial<EventInput>>({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    hero_image_url: '',
    is_published: true,
    ...initial,
  })
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function set<K extends keyof EventInput>(key: K, val: any) {
    setValues((v) => ({ ...v, [key]: val }))
  }

  async function uploadImage(file: File) {
    const form = new FormData()
    form.append('file', file)
    form.append('kind', 'events')
    setUploading(true)
    try {
      const res = await fetch('/api/uploads', { method: 'POST', body: form })
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      const url: string = json.url
      // ensure absolute URL for validators
      const abs = url.startsWith('http') ? url : `${window.location.origin}${url}`
      set('hero_image_url', abs)
    } catch (e: any) {
      alert(e?.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        await onSubmit(values)
      }}
      className="space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={values.title || ''} onChange={(e) => set('title', e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={values.date || ''} onChange={(e) => set('date', e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="start_time">Start time</Label>
          <Input id="start_time" type="time" value={values.start_time || ''} onChange={(e) => set('start_time', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="end_time">End time</Label>
          <Input id="end_time" type="time" value={values.end_time || ''} onChange={(e) => set('end_time', e.target.value)} />
        </div>
      </div>

      <div>
        <Label htmlFor="hero_image_url">Hero image URL</Label>
        <Input
          id="hero_image_url"
          value={values.hero_image_url || ''}
          onChange={(e) => set('hero_image_url', e.target.value)}
          placeholder="/images/..."
        />
        <div className="mt-2 flex items-center gap-2">
          <input
            ref={fileInputRef}
            id="event-image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif,image/gif,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) uploadImage(f)
            }}
          />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
            {uploading ? 'Uploading...' : 'Upload image'}
          </Button>
          {values.hero_image_url ? (
            <Button
              type="button"
              variant="ghost"
              className="text-red-600 hover:text-red-700"
              onClick={() => set('hero_image_url', '')}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          ) : null}
          {values.hero_image_url ? (
            <div className="ml-2 rounded border p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={values.hero_image_url || '/placeholder.svg?height=120&width=180&query=event%20image%20preview'}
                alt="Event image preview"
                className="h-20 w-28 object-cover"
              />
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={values.description || ''} onChange={(e) => set('description', e.target.value)} rows={5} required />
      </div>

      <div className="flex items-center gap-2">
        <Switch id="is_published" checked={!!values.is_published} onCheckedChange={(c) => set('is_published', c)} />
        <Label htmlFor="is_published">Published</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  )
}
