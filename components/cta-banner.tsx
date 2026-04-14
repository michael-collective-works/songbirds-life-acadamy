import { Button } from '@/components/ui/button'
import { GraduationCap } from 'lucide-react'

const BRIGHTWHEEL_URL =
  'https://schools.mybrightwheel.com/sign-in?redirect_path=forms/4fbd9563-d5f6-4bc3-acb2-ef00f0aeaf59/self-service'

export function CtaBanner() {
  return (
    <section className="relative mx-4 my-12 overflow-hidden rounded-xl border bg-gradient-to-br from-amber-50 to-teal-50 px-6 py-8">
      <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-amber-200/60 blur-xl" aria-hidden="true" />
      <div className="absolute -right-10 -bottom-12 h-40 w-40 rounded-full bg-teal-200/60 blur-xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl">
        <h3 className="text-balance text-xl font-semibold text-slate-900">
          {'Partner with us to give your child a joyful beginning where learning and love go hand in hand.'}
        </h3>
        <div className="mt-4">
          <Button asChild className="bg-teal-700 hover:bg-teal-800">
            <a href={BRIGHTWHEEL_URL} target="_blank" rel="noopener noreferrer">
              <GraduationCap className="mr-2 h-4 w-4" />
              Enrollment Inquiry
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
