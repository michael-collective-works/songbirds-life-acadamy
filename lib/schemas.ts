import { z } from "zod"

export const EventSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1), // ISO date (yyyy-mm-dd)
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  hero_image_url: z.string().url().optional().nullable(),
  is_published: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})
export type EventInput = z.infer<typeof EventSchema>

export const TeamMemberSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  title: z.string().min(1),
  headshot_url: z.string().url().optional().nullable(),
  bio: z.string().min(1),
  is_active: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})
export type TeamMemberInput = z.infer<typeof TeamMemberSchema>

export const StoreItemSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  image_url: z.string().url().min(1),
  external_url: z.string().url().min(1),
  category: z.enum(["uniform", "merch"]),
  is_active: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})
export type StoreItemInput = z.infer<typeof StoreItemSchema>

export const ApplicationSchema = z.object({
  id: z.string().uuid().optional(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(3),
  kind: z.enum(["employment", "volunteer"]),
  status: z.enum(["new", "reviewed", "archived"]).default("new"),
  created_at: z.string().optional(),
})
export type ApplicationInput = z.infer<typeof ApplicationSchema>
