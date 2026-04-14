"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { StoreItemInput } from "@/lib/schemas"

export default function StoreForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<StoreItemInput>
  onSubmit: (values: Partial<StoreItemInput>) => Promise<void> | void
  onCancel?: () => void
}) {
  const [values, setValues] = useState<Partial<StoreItemInput>>({
    title: "",
    image_url: "",
    external_url: "",
    category: "merch",
    is_active: true,
    ...initial,
  })

  function set<K extends keyof StoreItemInput>(key: K, val: any) {
    setValues((v) => ({ ...v, [key]: val }))
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
          <Input id="title" value={values.title || ""} onChange={(e) => set("title", e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={values.category || "merch"}
            onChange={(e) => set("category", e.target.value)}
          >
            <option value="uniform">Uniform</option>
            <option value="merch">Merch</option>
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input id="image_url" value={values.image_url || ""} onChange={(e) => set("image_url", e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="external_url">Square Link</Label>
        <Input id="external_url" value={values.external_url || ""} onChange={(e) => set("external_url", e.target.value)} required />
      </div>
      <div className="flex items-center gap-2">
        <Switch id="is_active" checked={!!values.is_active} onCheckedChange={(c) => set("is_active", c)} />
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
