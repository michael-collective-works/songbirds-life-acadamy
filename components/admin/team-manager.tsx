"use client"

import { useEffect, useState } from "react"
import TeamForm from "./team-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { TeamMemberInput } from "@/lib/schemas"

export default function TeamManager() {
  const [items, setItems] = useState<TeamMemberInput[]>([])
  const [editing, setEditing] = useState<TeamMemberInput | null>(null)
  const [creating, setCreating] = useState(false)

  async function refresh() {
    const res = await fetch("/api/admin/team", { cache: "no-store" })
    const json = await res.json()
    setItems(json.items || [])
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleCreate(values: Partial<TeamMemberInput>) {
    await fetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    setCreating(false)
    await refresh()
  }

  async function handleUpdate(id: string, values: Partial<TeamMemberInput>) {
    await fetch(`/api/admin/team/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    setEditing(null)
    await refresh()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/team/${id}`, { method: "DELETE" })
    await refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Team</h2>
        <Button onClick={() => setCreating(true)}>Add Team Member</Button>
      </div>

      {creating && (
        <Card>
          <CardHeader>
            <CardTitle>New Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamForm onSubmit={handleCreate} onCancel={() => setCreating(false)} />
          </CardContent>
        </Card>
      )}

      <Separator />

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t.name}</span>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditing(t)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(t.id!)}>
                    Delete
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <div>Title: {t.title}</div>
                <div>Active: {t.is_active ? "Yes" : "No"}</div>
              </div>
              <p className="mt-2 text-gray-800">{t.bio}</p>
              {editing?.id === t.id ? (
                <div className="mt-4">
                  <TeamForm initial={t} onSubmit={(v) => handleUpdate(t.id!, v)} onCancel={() => setEditing(null)} />
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
