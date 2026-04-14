import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://songbirdslifeacademy.com'),
  title: {
    default: 'Songbirds Life Academy (S.L.A.Y.)',
    template: '%s · S.L.A.Y.',
  },
  description:
    'Songbirds Life Academy (S.L.A.Y.) offers infant-toddler care, preschool, and after-school programs in a warm, music-infused environment in St. Francisville, LA.',
  keywords: [
    'daycare',
    'infant care',
    'toddler care',
    'preschool',
    'after school',
    'early childhood education',
    'St. Francisville',
    'Louisiana',
    'music education',
    'S.L.A.Y.',
    'Songbirds Life Academy',
  ],
  openGraph: {
    title: 'Songbirds Life Academy (S.L.A.Y.)',
    description:
      'A joyful start for every child—learning through play, immersed in music. Infant–Toddler, Preschool, and After-School programs.',
    url: 'https://songbirdslifeacademy.com',
    siteName: 'Songbirds Life Academy',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/images/logo-ios-full.jpg',
        width: 1080,
        height: 1920,
        alt: 'S.L.A.Y. artwork and logotype on cream background',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Songbirds Life Academy (S.L.A.Y.)',
    description:
      'A joyful start for every child—learning through play, immersed in music. Infant–Toddler, Preschool, and After-School programs.',
    images: ['/images/logo-ios-full.jpg'],
  },
  alternates: { canonical: 'https://songbirdslifeacademy.com' },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f766e' },
    { media: '(prefers-color-scheme: dark)', color: '#0f766e' },
  ],
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-slate-900 focus:shadow"
        >
          Skip to content
        </a>
        <div id="main" />
        {children}
      </body>
    </html>
  )
}
