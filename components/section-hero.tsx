import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShapeBackground } from './shape-background'
import { GraduationCap, ShoppingBag, Phone } from 'lucide-react'

const BRIGHTWHEEL_URL =
  'https://schools.mybrightwheel.com/sign-in?redirect_path=forms/4fbd9563-d5f6-4bc3-acb2-ef00f0aeaf59/self-service'
const SQUARE_URL = 'http://feathered-insights-by-songbirds.square.site/'

export function SectionHero() {
  return (
    <section className="relative overflow-hidden bg-amber-50">
      <ShapeBackground />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-20">
        {/* Text + CTAs */}
        <div className="order-2 md:order-1">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            A joyful start for every child
          </h1>
          <p className="mt-3 max-w-prose text-pretty text-slate-700">
            Learning through play, immersed in music. Songbirds Life Academy nurtures infants, toddlers, and young
            learners in a warm, creative environment.
          </p>

          {/* CTA group: stacked on mobile, aligned and even-sized */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="bg-teal-700 hover:bg-teal-800 sm:min-w-[230px]">
              <a href={BRIGHTWHEEL_URL} target="_blank" rel="noopener noreferrer">
                <GraduationCap className="mr-2 h-5 w-5" />
                Enrollment Inquiry
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-amber-100 text-amber-900 ring-1 ring-amber-200 hover:bg-amber-200 sm:min-w-[230px]"
            >
              <a href={SQUARE_URL} target="_blank" rel="noopener noreferrer">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Store (Square)
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-teal-600 text-teal-700 hover:bg-teal-50 sm:min-w-[230px]"
            >
              <a href="tel:12256357973">
                <Phone className="mr-2 h-5 w-5" />
                Call 225.635.7973
              </a>
            </Button>
          </div>

          <p className="mt-3 text-sm text-slate-600">
            Hours: 6:30AM–5:30PM · <span className="text-slate-500">Extended hours available upon request</span>
          </p>
        </div>

        {/* Visual (hidden on mobile) */}
        <div className="order-1 hidden justify-center md:order-2 sm:flex">
          <div className="relative">
            <div className="absolute -left-6 -top-6 -z-10 h-16 w-16 rotate-6 rounded-xl bg-amber-200/60" />
            <Image
              src="/images/logo-ios-full.jpg"
              alt="S.L.A.Y. artwork on cream"
              width={560}
              height={1000}
              className="h-auto w-72 rounded-xl shadow-sm ring-1 ring-slate-900/5 sm:w-80 md:w-96"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
