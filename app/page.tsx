import { SectionHero } from '@/components/section-hero'
import { HomeInfantToddler } from '@/components/home-infant-toddler'
import { EventsTeaser } from '@/components/events-teaser'
import { StoreTeaser } from '@/components/store-teaser'
import { CtaBanner } from '@/components/cta-banner'
import { ContactStrip } from '@/components/contact-strip'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <SectionHero />
      <HomeInfantToddler />
      <EventsTeaser />
      <StoreTeaser />
      <CtaBanner />
      <ContactStrip />
      <SiteFooter />
    </main>
  )
}
