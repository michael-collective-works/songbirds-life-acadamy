import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Event = {
  title: string
  date: string
  time?: string
  description: string
}

const sampleEvents: Event[] = [
  {
    title: 'Family Music Morning',
    date: 'Sep 14, 2025',
    time: '9:00–10:30 AM',
    description: 'Sing-alongs, movement, and classroom tours for families considering enrollment.',
  },
  {
    title: 'Open House',
    date: 'Oct 5, 2025',
    time: '5:30–7:00 PM',
    description: 'Meet our staff, see classrooms, and learn about our program and curriculum.',
  },
  {
    title: 'Harvest Fest',
    date: 'Nov 2, 2025',
    description: 'A playful community evening with music, crafts, and fall activities.',
  },
]

export function EventsTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Upcoming Events</h2>
        <Link href="/events" className="text-sm font-medium text-teal-700 hover:underline">
          View all events
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sampleEvents.map((ev) => (
          <Card key={ev.title} className="border-amber-100">
            <CardHeader>
              <CardTitle className="text-slate-900">{ev.title}</CardTitle>
              <p className="text-sm text-slate-600">
                {ev.date}
                {ev.time ? ` • ${ev.time}` : ''}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">{ev.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
