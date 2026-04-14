"use client"

import { useEffect, useState } from "react"
import EventsForm from "./events-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { EventInput } from "@/lib/schemas"

export default function EventsManager() {
  const [items, setItems] = useState<EventInput[]>([])
  const [editing, setEditing] = useState<EventInput | null>(null)
  const [creating, setCreating] = useState(false)

  async function refresh() {
    const res = await fetch("/api/admin/events", { cache: "no-store" })
    const json = await res.json()
    setItems(json.items || [])
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleCreate(values: Partial<EventInput>) {
    await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    setCreating(false)
    await refresh()
  }

  async function handleUpdate(id: string, values: Partial<EventInput>) {
    await fetch(`/api/admin/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    setEditing(null)
    await refresh()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" })
    await refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Events</h2>
        <Button onClick={() => setCreating(true)}>Add Event</Button>
      </div>

      {creating && (
        <Card>
          <CardHeader>
            <CardTitle>New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <EventsForm onSubmit={handleCreate} onCancel={() => setCreating(false)} />
          </CardContent>
        </Card>
      )}

      <Separator />

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((e) => (
          <Card key={e.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{e.title}</span>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditing(e)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(e.id!)}>
                    Delete
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <div>Date: {e.date}</div>
                {e.start_time ? (
                  <div>
                    Time: {e.start_time}
                    {e.end_time ? `–${e.end_time}` : ""}
                  </div>
                ) : null}
                <div>Published: {e.is_published ? "Yes" : "No"}</div>
              </div>
              <p className="mt-2 text-gray-800">{e.description}</p>
              {editing?.id === e.id ? (
                <div className="mt-4">
                  <EventsForm initial={e} onSubmit={(v) => handleUpdate(e.id!, v)} onCancel={() => setEditing(null)} />
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
