"use client"

import { useEffect, useState } from "react"
import StoreForm from "./store-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { StoreItemInput } from "@/lib/schemas"

export default function StoreManager() {
  const [items, setItems] = useState<StoreItemInput[]>([])
  const [editing, setEditing] = useState<StoreItemInput | null>(null)
  const [creating, setCreating] = useState(false)

  async function refresh() {
    const res = await fetch("/api/admin/store", { cache: "no-store" })
    const json = await res.json()
    setItems(json.items || [])
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleCreate(values: Partial<StoreItemInput>) {
    await fetch("/api/admin/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    setCreating(false)
    await refresh()
  }

  async function handleUpdate(id: string, values: Partial<StoreItemInput>) {
    await fetch(`/api/admin/store/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    setEditing(null)
    await refresh()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/store/${id}`, { method: "DELETE" })
    await refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Store</h2>
        <Button onClick={() => setCreating(true)}>Add Store Item</Button>
      </div>

      {creating && (
        <Card>
          <CardHeader>
            <CardTitle>New Store Item</CardTitle>
          </CardHeader>
          <CardContent>
            <StoreForm onSubmit={handleCreate} onCancel={() => setCreating(false)} />
          </CardContent>
        </Card>
      )}

      <Separator />

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{s.title}</span>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditing(s)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(s.id!)}>
                    Delete
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <div>Category: {s.category}</div>
                <div>Active: {s.is_active ? "Yes" : "No"}</div>
              </div>
              <a className="text-emerald-700 underline" href={s.external_url} target="_blank" rel="noreferrer">
                View on Square
              </a>
              {editing?.id === s.id ? (
                <div className="mt-4">
                  <StoreForm initial={s} onSubmit={(v) => handleUpdate(s.id!, v)} onCancel={() => setEditing(null)} />
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
