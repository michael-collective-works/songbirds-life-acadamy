export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 h-4 w-80 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
    </div>
  )
}
