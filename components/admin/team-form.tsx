'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { TeamMemberInput } from '@/lib/schemas'
import { ImageIcon, Loader2, Trash2 } from 'lucide-react'

export default function TeamForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<TeamMemberInput>
  onSubmit: (values: Partial<TeamMemberInput>) => Promise<void> | void
  onCancel?: () => void
}) {
  const [values, setValues] = useState<Partial<TeamMemberInput>>({
    name: '',
    title: '',
    headshot_url: '',
    bio: '',
    is_active: true,
    ...initial,
  })
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function set<K extends keyof TeamMemberInput>(key: K, val: any) {
    setValues((v) => ({ ...v, [key]: val }))
  }

  async function uploadImage(file: File) {
    const form = new FormData()
    form.append('file', file)
    form.append('kind', 'team')
    setUploading(true)
    try {
      const res = await fetch('/api/uploads', { method: 'POST', body: form })
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      const url: string = json.url
      const abs = url.startsWith('http') ? url : `${window.location.origin}${url}`
      set('headshot_url', abs)
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
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={values.name || ''} onChange={(e) => set('name', e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={values.title || ''} onChange={(e) => set('title', e.target.value)} required />
        </div>
      </div>

      <div>
        <Label htmlFor="headshot_url">Headshot URL</Label>
        <Input
          id="headshot_url"
          value={values.headshot_url || ''}
          onChange={(e) => set('headshot_url', e.target.value)}
          placeholder="/images/..."
        />
        <div className="mt-2 flex items-center gap-2">
          <input
            ref={fileInputRef}
            id="team-headshot"
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
            {uploading ? 'Uploading...' : 'Upload headshot'}
          </Button>
          {values.headshot_url ? (
            <Button
              type="button"
              variant="ghost"
              className="text-red-600 hover:text-red-700"
              onClick={() => set('headshot_url', '')}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          ) : null}
          {values.headshot_url ? (
            <div className="ml-2 rounded-full border p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={values.headshot_url || '/placeholder.svg?height=96&width=96&query=headshot%20preview'}
                alt="Headshot preview"
                className="h-20 w-20 rounded-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" value={values.bio || ''} onChange={(e) => set('bio', e.target.value)} rows={5} required />
      </div>

      <div className="flex items-center gap-2">
        <Switch id="is_active" checked={!!values.is_active} onCheckedChange={(c) => set('is_active', c)} />
        <Label htmlFor="is_active">Active</Label>
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
