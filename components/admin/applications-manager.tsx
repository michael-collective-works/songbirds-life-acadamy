"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type AppStatus = 'new' | 'reviewed' | 'archived'

type AppItem = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  kind: 'employment' | 'volunteer'
  status: AppStatus
  created_at?: string
}

const POLL_MS = 15000 // 15s polling for new applications

export default function ApplicationsManager() {
  const [items, setItems] = useState<AppItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const isRefreshingRef = useRef(false)

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      // Only refresh when the tab is visible
      if (document.visibilityState === 'visible') {
        void refresh()
      }
    }, POLL_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === 'visible') {
        void refresh()
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  async function safeParse(res: Response) {
    // Try JSON first, then fall back to text to avoid throwing on non-JSON bodies
    try {
      return await res.json()
    } catch {
      const text = await res.text().catch(() => '')
      return { __text: text }
    }
  }

  async function refresh() {
    if (isRefreshingRef.current) return
    isRefreshingRef.current = true
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/applications', { cache: 'no-store' })
      const data = await safeParse(res)

      if (!res.ok) {
        const msg =
          (data && typeof data === 'object' && 'error' in data && (data as any).error) ||
          (data && typeof data === 'object' && '__text' in data && (data as any).__text) ||
          `Request failed (${res.status})`

        if (res.status === 401) {
          setError('Please sign in as an admin to view applications.')
        } else {
          setError(typeof msg === 'string' ? msg : 'Unable to load applications.')
        }
        setItems([])
        return
      }

      const arr = (data as any)?.items
      setItems(Array.isArray(arr) ? arr : [])
    } catch (e: any) {
      setError(e?.message || 'Unable to load applications.')
      setItems([])
    } finally {
      setLoading(false)
      isRefreshingRef.current = false
    }
  }

  async function setStatus(id: string, status: AppStatus) {
    setError(null)
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await safeParse(res)
      if (!res.ok) {
        const msg =
          (data && typeof data === 'object' && 'error' in data && (data as any).error) ||
          (data && typeof data === 'object' && '__text' in data && (data as any).__text) ||
          `Request failed (${res.status})`
        setError(typeof msg === 'string' ? msg : 'Could not update status.')
        return
      }
      await refresh()
    } catch (e: any) {
      setError(e?.message || 'Could not update status.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Applications</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Unable to load</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Separator />

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((a) => (
          <Card key={a.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {a.first_name} {a.last_name}{' '}
                  <Badge variant="secondary" className="ml-2 capitalize">
                    {a.kind}
                  </Badge>
                </span>
                <Badge className="capitalize">{a.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-700 space-y-1">
                <div>Email: {a.email}</div>
                <div>Phone: {a.phone}</div>
                <div>Submitted: {a.created_at ? new Date(a.created_at).toLocaleString() : '—'}</div>
              </div>
              <div className="mt-3 flex gap-2">
                {a.status !== 'reviewed' && (
                  <Button variant="outline" onClick={() => setStatus(a.id, 'reviewed')}>
                    Mark reviewed
                  </Button>
                )}
                {a.status !== 'archived' && (
                  <Button variant="destructive" onClick={() => setStatus(a.id, 'archived')}>
                    Archive
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {!loading && !error && items.length === 0 ? (
          <p className="text-sm text-slate-600">No applications yet.</p>
        ) : null}
      </div>
    </div>
  )
}
