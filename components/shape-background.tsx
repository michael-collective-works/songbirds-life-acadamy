import { cn } from '@/lib/utils'

export function ShapeBackground({ className }: { className?: string }) {
  // Decorative blobs inspired by brand colors (teal, navy, gold)
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="absolute -left-20 -top-24 h-64 w-64 rounded-[40%_60%_65%_35%/45%_30%_70%_55%] bg-teal-300/30 blur-2xl" />
      <div className="absolute -right-10 top-10 h-40 w-40 rounded-[61%_39%_73%_27%/45%_67%_33%_55%] bg-amber-300/30 blur-2xl" />
      <div className="absolute bottom-[-3rem] left-10 h-60 w-60 rounded-[39%_61%_38%_62%/58%_29%_71%_42%] bg-sky-300/30 blur-2xl" />
    </div>
  )
}
