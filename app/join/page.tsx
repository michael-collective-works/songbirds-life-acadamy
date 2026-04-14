import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { JoinForm } from '@/components/join-form'
import { Music, Sparkles, Heart, CheckCircle2, HelpCircle } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function JoinPage() {
  const siteKey = process.env.TURNSTILE_SITE_KEY
  const secret = process.env.TURNSTILE_SECRET_KEY
  const captchaEnabled = Boolean(siteKey && secret)

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <section className="border-b bg-amber-50/50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl font-semibold text-slate-900">Join the Songbirds Team</h1>
          <p className="mt-2 max-w-prose text-slate-700">
            Help us build a warm, creative community where children learn through play and music.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-xl border bg-gradient-to-br from-amber-50 to-teal-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Why Songbirds?</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <Music className="mt-0.5 h-4 w-4 text-teal-700" />
                  Music-infused learning environment
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 text-teal-700" />
                  Creative curriculum and low ratios
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="mt-0.5 h-4 w-4 text-teal-700" />
                  Caring, family-centered culture
                </li>
              </ul>
              <p className="mt-4 text-xs text-slate-600">
                Hours: Mon–Fri 6:30am–5:30pm · Extended hours available upon request
              </p>
            </div>

            <div className="rounded-xl border p-6">
              <h3 className="text-base font-semibold text-slate-900">How it works</h3>
              <ol className="mt-3 space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-teal-700" />
                  Submit your info using the form
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-teal-700" />
                  We review and reach out via email or phone
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-teal-700" />
                  Quick conversation and next steps
                </li>
              </ol>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Send your info</h2>
            <JoinForm turnstileSiteKey={siteKey} captchaEnabled={captchaEnabled} />
          </div>
        </div>

        <div className="mt-10 rounded-xl border p-6">
          <div className="mb-3 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-teal-700" />
            <h3 className="text-base font-semibold text-slate-900">FAQ</h3>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="resume">
              <AccordionTrigger>Do I need a resume to get started?</AccordionTrigger>
              <AccordionContent className="text-sm text-slate-700">
                Not required. Share your contact information and a short message—if you have a resume, you can include a link in your message.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="hours">
              <AccordionTrigger>What are the typical hours?</AccordionTrigger>
              <AccordionContent className="text-sm text-slate-700">
                Our center is open Monday–Friday 6:30am–5:30pm. Extended hours can be arranged depending on family and staff needs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="volunteer">
              <AccordionTrigger>Can I volunteer instead of applying for employment?</AccordionTrigger>
              <AccordionContent className="text-sm text-slate-700">
                Yes—choose “Volunteer” on the form and we’ll follow up with opportunities and next steps.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
