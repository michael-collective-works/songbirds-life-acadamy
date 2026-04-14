import { CheckCircle2, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const BRIGHTWHEEL_URL =
  'https://schools.mybrightwheel.com/sign-in?redirect_path=forms/4fbd9563-d5f6-4bc3-acb2-ef00f0aeaf59/self-service'

export function HomeInfantToddler() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900">Infant-Toddler Care at Songbirds Life Academy</h2>
        <p className="mt-1 text-sm font-medium uppercase tracking-wide text-teal-700">
          A Strong Start, A Lasting Song
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-5">
        {/* Left: flowing copy */}
        <div className="md:col-span-3">
          <p className="text-pretty text-lg leading-relaxed text-slate-800">
            At Songbirds, we believe the earliest years are the most important. Our Infant–Toddler Program (ages 6 weeks to
            3 years) nurtures each child’s development through warm, responsive care and intentional learning experiences in
            a safe, loving environment.
          </p>

          <p className="mt-4 text-pretty text-slate-700">
            Music is at the core of our academy’s philosophy. From soft lullabies that calm to clapping, humming,
            dancing, and instrumentation, music is used daily to support emotional bonding, language development, social
            growth, and motor skills.
          </p>

          <p className="mt-4 text-pretty text-slate-700">
            We proudly use The Creative Curriculum® for Infants, Toddlers &amp; Twos, and Preschool—research-based guidance
            that turns routines into learning moments. Our teachers support growth through play, movement, and meaningful
            interaction, building a strong foundation for lifelong learning.
          </p>

          <p className="mt-6 italic text-slate-700">
            Partner with us to give your child a joyful beginning where learning and love go hand in hand.
          </p>

          <div className="mt-6">
            <Button asChild size="lg" className="bg-teal-700 hover:bg-teal-800">
              <a href={BRIGHTWHEEL_URL} target="_blank" rel="noopener noreferrer">
                <GraduationCap className="mr-2 h-5 w-5" />
                Enrollment Inquiry
              </a>
            </Button>
          </div>
        </div>

        {/* Right: highlights panel */}
        <aside className="md:col-span-2">
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
            <h3 className="text-base font-semibold text-slate-900">Program Highlights</h3>
            <ul className="mt-3 space-y-3">
              {[
                'Low teacher-to-child ratios for personalized care',
                'Music and movement activities every day',
                'Sensory-rich classrooms that promote exploration',
                'Daily communication and photo updates for families',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-700" />
                  <span className="text-sm text-slate-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}
