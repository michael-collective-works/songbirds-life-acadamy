// Neon-first data layer with memory fallback.
// Set DATABASE_URL for Neon (Postgres). If not set, uses in-memory store.

import { neon } from '@neondatabase/serverless'
import {
  ApplicationSchema,
  EventSchema,
  StoreItemSchema,
  TeamMemberSchema,
  type ApplicationInput,
  type EventInput,
  type StoreItemInput,
  type TeamMemberInput,
} from './schemas'

type UUID = string
const nowIso = () => new Date().toISOString()

function hasNeon() {
  return Boolean(process.env.DATABASE_URL)
}
function sqlClient() {
  if (!hasNeon()) return null
  return neon(process.env.DATABASE_URL as string)
}

// In-memory fallback stores and seed
const mem = {
  events: [] as EventInput[],
  team: [] as TeamMemberInput[],
  store: [] as StoreItemInput[],
  applications: [] as ApplicationInput[],
}
function seedMemoryIfEmpty() {
  if (!mem.events.length) {
    mem.events.push(
      {
        id: crypto.randomUUID(),
        title: 'Back-to-School Open House',
        description: 'Meet our teachers and tour classrooms. Light snacks provided.',
        date: '2025-09-05',
        start_time: '16:00',
        end_time: '18:00',
        hero_image_url: '/back-to-school-open-house.png',
        is_published: true,
        created_at: nowIso(),
        updated_at: nowIso(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Family Music Day',
        description: 'A morning of rhythm and play. Parents and siblings welcome!',
        date: '2025-10-12',
        start_time: '10:00',
        end_time: '12:00',
        hero_image_url: '/family-music-day.png',
        is_published: true,
        created_at: nowIso(),
        updated_at: nowIso(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Teacher In-Service',
        description: 'School closed for staff training. We appreciate your support!',
        date: '2025-10-25',
        start_time: null,
        end_time: null,
        hero_image_url: '/teacher-training-session.png',
        is_published: false,
        created_at: nowIso(),
        updated_at: nowIso(),
      },
    )
  }
  if (!mem.team.length) {
    mem.team.push(
      {
        id: crypto.randomUUID(),
        name: 'Avery Johnson',
        title: 'Director',
        headshot_url: '/director-headshot.png',
        bio: 'Early childhood educator with 12+ years of experience in play-based learning.',
        is_active: true,
        created_at: nowIso(),
        updated_at: nowIso(),
      },
      {
        id: crypto.randomUUID(),
        name: 'Jordan Lee',
        title: 'Lead Teacher',
        headshot_url: '/placeholder-6lbi0.png',
        bio: 'Specializes in music and movement for early learners.',
        is_active: true,
        created_at: nowIso(),
        updated_at: nowIso(),
      },
      {
        id: crypto.randomUUID(),
        name: 'Sam Patel',
        title: 'Assistant Teacher',
        headshot_url: '/assistant-teacher-headshot.png',
        bio: 'Passionate about outdoor exploration and sensory play.',
        is_active: true,
        created_at: nowIso(),
        updated_at: nowIso(),
      },
    )
  }
  if (!mem.store.length) {
    mem.store.push(
      {
        id: crypto.randomUUID(),
        title: 'Teal Uniform T-shirt',
        image_url: '/teal-uniform-shirt.png',
        external_url: 'https://squareup.com/store/songbirds',
        category: 'uniform',
        is_active: true,
        created_at: nowIso(),
        updated_at: nowIso(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Logo Cap',
        image_url: '/teal-cap-with-logo.png',
        external_url: 'https://squareup.com/store/songbirds',
        category: 'merch',
        is_active: true,
        created_at: nowIso(),
        updated_at: nowIso(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Music Tote',
        image_url: '/cream-music-tote.png',
        external_url: 'https://squareup.com/store/songbirds',
        category: 'merch',
        is_active: true,
        created_at: nowIso(),
        updated_at: nowIso(),
      },
    )
  }
  if (!mem.applications.length) {
    mem.applications.push(
      {
        id: crypto.randomUUID(),
        first_name: 'Taylor',
        last_name: 'Morgan',
        email: 'taylor@example.com',
        phone: '555-123-4567',
        kind: 'employment',
        status: 'new',
        created_at: nowIso(),
      },
      {
        id: crypto.randomUUID(),
        first_name: 'Riley',
        last_name: 'Chen',
        email: 'riley@example.com',
        phone: '555-222-3344',
        kind: 'volunteer',
        status: 'reviewed',
        created_at: nowIso(),
      },
    )
  }
}
seedMemoryIfEmpty()

// Status for /admin and /api/health
export function dbStatus(): { driver: string; connected: boolean } {
  const connected = hasNeon()
  return { driver: connected ? 'neon' : 'memory', connected }
}

// Helpers
function toISODate(d: any): string {
  if (!d) return ''
  if (typeof d === 'string') return d // assume YYYY-MM-DD from SQL or memory
  if (d instanceof Date) {
    const y = d.getUTCFullYear()
    const m = String(d.getUTCMonth() + 1).padStart(2, '0')
    const day = String(d.getUTCDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }
  return String(d)
}

// EVENTS
export async function listEvents(): Promise<EventInput[]> {
  const sql = sqlClient()
  if (sql) {
    const rows = await sql<any[]>`select id, title, description, date, start_time, end_time, hero_image_url, is_published, created_at, updated_at from events order by date asc`
    return rows.map((r) => ({ ...r, date: toISODate(r.date) }))
  }
  return mem.events
}

export async function listEventsPaged({
  when,
  page,
  pageSize,
  q,
}: {
  when: 'upcoming' | 'past' | 'all'
  page: number
  pageSize: number
  q?: string
}): Promise<{ events: EventInput[]; total: number }> {
  const all = await listEvents()
  const today = new Date().toISOString().slice(0, 10)

  let items = all.slice()
  if (when === 'upcoming') items = items.filter((e) => (e.date || '') >= today)
  if (when === 'past') items = items.filter((e) => (e.date || '') < today)
  if (q) {
    const needle = q.toLowerCase()
    items = items.filter(
      (e) => e.title.toLowerCase().includes(needle) || e.description.toLowerCase().includes(needle)
    )
  }
  items.sort((a, b) => (a.date || '').localeCompare(b.date || ''))

  const total = items.length
  const start = (page - 1) * pageSize
  const paged = items.slice(start, start + pageSize)
  return { events: paged, total }
}

export async function createEvent(input: EventInput): Promise<EventInput> {
  const validated = EventSchema.omit({ id: true, created_at: true, updated_at: true }).parse(input)
  const sql = sqlClient()
  if (sql) {
    const rows = await sql<any[]>`
      insert into events (title, description, date, start_time, end_time, hero_image_url, is_published, created_at, updated_at)
      values (${validated.title}, ${validated.description}, ${validated.date}, ${validated.start_time || null}, ${validated.end_time || null}, ${validated.hero_image_url || null}, ${validated.is_published ?? true}, now(), now())
      returning id, title, description, date, start_time, end_time, hero_image_url, is_published, created_at, updated_at
    `
    const r = rows[0]
    return { ...r, date: toISODate(r.date) }
  }
  const payload: EventInput = {
    ...validated,
    id: crypto.randomUUID(),
    created_at: nowIso(),
    updated_at: nowIso(),
  }
  mem.events.unshift(payload)
  return payload
}

export async function updateEvent(id: UUID, patch: Partial<EventInput>): Promise<EventInput> {
  const sql = sqlClient()
  if (sql) {
    const rows = await sql<any[]>`
      update events
      set
        title = coalesce(${patch.title || null}, title),
        description = coalesce(${patch.description || null}, description),
        date = coalesce(${patch.date || null}::date, date),
        start_time = coalesce(${patch.start_time ?? null}, start_time),
        end_time = coalesce(${patch.end_time ?? null}, end_time),
        hero_image_url = coalesce(${patch.hero_image_url ?? null}, hero_image_url),
        is_published = coalesce(${typeof patch.is_published === 'boolean' ? patch.is_published : null}, is_published),
        updated_at = now()
      where id = ${id}
      returning id, title, description, date, start_time, end_time, hero_image_url, is_published, created_at, updated_at
    `
    if (!rows.length) throw new Error('Event not found')
    const r = rows[0]
    return { ...r, date: toISODate(r.date) }
  }
  const idx = mem.events.findIndex((e) => e.id === id)
  if (idx === -1) throw new Error('Event not found')
  mem.events[idx] = { ...mem.events[idx], ...patch, updated_at: nowIso() }
  return mem.events[idx]
}

export async function deleteEvent(id: UUID): Promise<void> {
  const sql = sqlClient()
  if (sql) {
    await sql`delete from events where id = ${id}`
    return
  }
  const idx = mem.events.findIndex((e) => e.id === id)
  if (idx !== -1) mem.events.splice(idx, 1)
}

// TEAM
export async function listTeam(): Promise<TeamMemberInput[]> {
  const sql = sqlClient()
  if (sql) {
    const rows = await sql<any[]>`select id, name, title, headshot_url, bio, is_active, created_at, updated_at from team_members order by name asc`
    return rows
  }
  return mem.team
}

export async function createTeamMember(input: TeamMemberInput): Promise<TeamMemberInput> {
  const validated = TeamMemberSchema.omit({ id: true, created_at: true, updated_at: true }).parse(input)
  const sql = sqlClient()
  if (sql) {
    const rows = await sql<any[]>`
      insert into team_members (name, title, headshot_url, bio, is_active, created_at, updated_at)
      values (${validated.name}, ${validated.title}, ${validated.headshot_url || null}, ${validated.bio}, ${validated.is_active ?? true}, now(), now())
      returning id, name, title, headshot_url, bio, is_active, created_at, updated_at
    `
    return rows[0]
  }
  const payload: TeamMemberInput = {
    ...validated,
    id: crypto.randomUUID(),
    created_at: nowIso(),
    updated_at: nowIso(),
  }
  mem.team.unshift(payload)
  return payload
}

export async function updateTeamMember(id: UUID, patch: Partial<TeamMemberInput>): Promise<TeamMemberInput> {
  const sql = sqlClient()
  if (sql) {
    const rows = await sql<any[]>`
      update team_members
      set
        name = coalesce(${patch.name || null}, name),
        title = coalesce(${patch.title || null}, title),
        headshot_url = coalesce(${patch.headshot_url ?? null}, headshot_url),
        bio = coalesce(${patch.bio || null}, bio),
        is_active = coalesce(${typeof patch.is_active === 'boolean' ? patch.is_active : null}, is_active),
        updated_at = now()
      where id = ${id}
      returning id, name, title, headshot_url, bio, is_active, created_at, updated_at
    `
    if (!rows.length) throw new Error('Team member not found')
    return rows[0]
  }
  const idx = mem.team.findIndex((t) => t.id === id)
  if (idx === -1) throw new Error('Team member not found')
  mem.team[idx] = { ...mem.team[idx], ...patch, updated_at: nowIso() }
  return mem.team[idx]
}

export async function deleteTeamMember(id: UUID): Promise<void> {
  const sql = sqlClient()
  if (sql) {
    await sql`delete from team_members where id = ${id}`
    return
  }
  const idx = mem.team.findIndex((t) => t.id === id)
  if (idx !== -1) mem.team.splice(idx, 1)
}

// STORE
export async function listStore(): Promise<StoreItemInput[]> {
  const sql = sqlClient()
  if (sql) {
    const rows = await sql<any[]>`select id, title, image_url, external_url, category, is_active, created_at, updated_at from store_items order by created_at desc`
    return rows
  }
  return mem.store
}

export async function createStoreItem(input: StoreItemInput): Promise<StoreItemInput> {
  const validated = StoreItemSchema.omit({ id: true, created_at: true, updated_at: true }).parse(input)
  const sql = sqlClient()
  if (sql) {
    const rows = await sql<any[]>`
      insert into store_items (title, image_url, external_url, category, is_active, created_at, updated_at)
      values (${validated.title}, ${validated.image_url}, ${validated.external_url}, ${validated.category}, ${validated.is_active ?? true}, now(), now())
      returning id, title, image_url, external_url, category, is_active, created_at, updated_at
    `
    return rows[0]
  }
  const payload: StoreItemInput = {
    ...validated,
    id: crypto.randomUUID(),
    created_at: nowIso(),
    updated_at: nowIso(),
  }
  mem.store.unshift(payload)
  return payload
}

export async function updateStoreItem(id: UUID, patch: Partial<StoreItemInput>): Promise<StoreItemInput> {
  const sql = sqlClient()
  if (sql) {
    const rows = await sql<any[]>`
      update store_items
      set
        title = coalesce(${patch.title || null}, title),
        image_url = coalesce(${patch.image_url || null}, image_url),
        external_url = coalesce(${patch.external_url || null}, external_url),
        category = coalesce(${patch.category || null}, category),
        is_active = coalesce(${typeof patch.is_active === 'boolean' ? patch.is_active : null}, is_active),
        updated_at = now()
      where id = ${id}
      returning id, title, image_url, external_url, category, is_active, created_at, updated_at
    `
    if (!rows.length) throw new Error('Store item not found')
    return rows[0]
  }
  const idx = mem.store.findIndex((s) => s.id === id)
  if (idx === -1) throw new Error('Store item not found')
  mem.store[idx] = { ...mem.store[idx], ...patch, updated_at: nowIso() }
  return mem.store[idx]
}

export async function deleteStoreItem(id: UUID): Promise<void> {
  const sql = sqlClient()
  if (sql) {
    await sql`delete from store_items where id = ${id}`
    return
  }
  const idx = mem.store.findIndex((s) => s.id === id)
  if (idx !== -1) mem.store.splice(idx, 1)
}

// APPLICATIONS
export async function listApplications(): Promise<ApplicationInput[]> {
  const sql = sqlClient()
  if (sql) {
    const rows = await sql<any[]>`select id, first_name, last_name, email, phone, kind, status, created_at from applications order by created_at desc`
    return rows
  }
  return mem.applications.slice().sort((a, b) => (a.created_at || '').localeCompare(b.created_at || '')).reverse()
}

export async function setApplicationStatus(id: UUID, status: ApplicationInput['status']): Promise<ApplicationInput> {
  const sql = sqlClient()
  if (sql) {
    const rows = await sql<any[]>`
      update applications set status = ${status} where id = ${id}
      returning id, first_name, last_name, email, phone, kind, status, created_at
    `
    if (!rows.length) throw new Error('Application not found')
    return rows[0]
  }
  const idx = mem.applications.findIndex((a) => a.id === id)
  if (idx === -1) throw new Error('Application not found')
  mem.applications[idx] = { ...mem.applications[idx], status }
  return mem.applications[idx]
}

export async function createApplication(
  input: ApplicationInput & { ip?: string; user_agent?: string }
): Promise<ApplicationInput> {
  // Validate required fields only (status/id/created_at are set by us)
  const validated = ApplicationSchema.pick({
    first_name: true,
    last_name: true,
    email: true,
    phone: true,
    kind: true,
  }).parse(input)

  const sql = (typeof process !== 'undefined' && process.env?.DATABASE_URL) ? (await import('@neondatabase/serverless')).neon(process.env.DATABASE_URL as string) : null

  if (sql) {
    const rows = await sql<any[]>`
      insert into applications (first_name, last_name, email, phone, kind, status, created_at)
      values (${validated.first_name}, ${validated.last_name}, ${validated.email}, ${validated.phone}, ${validated.kind}, 'new', now())
      returning id, first_name, last_name, email, phone, kind, status, created_at
    `
    return rows[0]
  }

  // Memory fallback
  const payload: ApplicationInput = {
    ...validated,
    id: crypto.randomUUID(),
    status: 'new',
    created_at: new Date().toISOString(),
  }
  // @ts-ignore - internal memory store may exist in this module
  mem.applications.unshift(payload)
  return payload
}
