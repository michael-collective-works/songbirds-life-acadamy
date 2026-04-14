'use client'

import { Card, CardContent } from '@/components/ui/card'

export function AuthBanner() {
  return (
    <Card className="border-amber-300 bg-amber-50">
      <CardContent className="p-4 text-sm text-amber-900">
        You are viewing demo data. Sign in with Google to add or edit content.
      </CardContent>
    </Card>
  )
}
