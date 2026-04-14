'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, Phone, ShoppingBag, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const BRIGHTWHEEL_URL =
  'https://schools.mybrightwheel.com/sign-in?redirect_path=forms/4fbd9563-d5f6-4bc3-acb2-ef00f0aeaf59/self-service'
const SQUARE_URL = 'http://feathered-insights-by-songbirds.square.site/'

export function SiteHeader({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/store', label: 'Store' },
    { href: '/join', label: 'Join Us' },
  ]

  return (
    <header className={cn('w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60', className)}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2" aria-label="Songbirds Life Academy home">
          <Image src="/images/logo-original.svg" alt="S.L.A.Y. logo" width={40} height={40} className="h-10 w-10" />
          <span className="font-semibold tracking-wide text-slate-800">S.L.A.Y.</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-700 hover:text-slate-900">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="outline" className="border-teal-600 text-teal-700 hover:bg-teal-50">
            <a href="tel:12256357973" aria-label="Call us">
              <Phone className="mr-2 h-4 w-4" />
              Call
            </a>
          </Button>
          <Button asChild className="bg-teal-700 hover:bg-teal-800">
            <a href={BRIGHTWHEEL_URL} rel="noopener noreferrer" target="_blank">
              <GraduationCap className="mr-2 h-4 w-4" />
              Enrollment Inquiry
            </a>
          </Button>
          <Button asChild variant="secondary" className="bg-amber-100 text-amber-900 hover:bg-amber-200">
            <a href={SQUARE_URL} rel="noopener noreferrer" target="_blank">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Shop
            </a>
          </Button>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-2 text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button asChild variant="outline" className="w-full border-teal-600 text-teal-700 hover:bg-teal-50">
                <a href="tel:12256357973" aria-label="Call us" onClick={() => setOpen(false)}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </a>
              </Button>
              <Button asChild className="w-full bg-teal-700 hover:bg-teal-800">
                <a href={BRIGHTWHEEL_URL} rel="noopener noreferrer" target="_blank" onClick={() => setOpen(false)}>
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Enroll
                </a>
              </Button>
              <Button asChild variant="secondary" className="col-span-2 w-full bg-amber-100 text-amber-900 hover:bg-amber-200">
                <a href={SQUARE_URL} rel="noopener noreferrer" target="_blank" onClick={() => setOpen(false)}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Shop Store (Square)
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
