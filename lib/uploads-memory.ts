export type MemoryUpload = {
  data: Uint8Array
  contentType: string
  createdAt: number
}

// In-memory upload store (preview/dev only).
export const uploadStore: Map<string, MemoryUpload> =
  (globalThis as any).__UPLOAD_STORE__ ?? new Map<string, MemoryUpload>()

if (!(globalThis as any).__UPLOAD_STORE__) {
  ;(globalThis as any).__UPLOAD_STORE__ = uploadStore
}
