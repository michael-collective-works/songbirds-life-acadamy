import Link from 'next/link'
import { Instagram, Facebook, MapPin, Phone, Clock } from 'lucide-react'

export function SiteFooter() {
return (
  <footer className="mt-16 border-t bg-amber-50/50">
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <h3 className="font-semibold text-slate-900">S.L.A.Y.</h3>
        <p className="mt-2 text-sm text-slate-700">{'Learning through play, immersed in music.'}</p>
        <p className="mt-4 text-xs text-slate-500">
          Songbirds Life Academy for the Youth
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-slate-900">Visit</h4>
        <ul className="mt-2 space-y-2 text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4" />
            <a
              className="hover:underline"
              href="https://maps.google.com/?q=5915%20N.%20Commerce%20Street,%20St.Francisville,%20LA%2070775"
              target="_blank"
              rel="noopener noreferrer"
            >
              5915 N. Commerce Street, St.Francisville, LA 70775
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Mon–Fri 6:30am–5:30pm</span>
          </li>
          <li className="ml-6 text-xs text-slate-600">{'*Extended hours available upon request'}</li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-slate-900">Contact</h4>
        <ul className="mt-2 space-y-2 text-sm text-slate-700">
          <li className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <a className="hover:underline" href="tel:12256357973">
              225.635.7973
            </a>
          </li>
          <li>
            <Link className="text-teal-700 hover:underline" href="/join">
              Join our team or volunteer
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-slate-900">Social</h4>
        <ul className="mt-2 space-y-2 text-sm text-slate-700">
          <li className="flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            <a
              className="hover:underline"
              href="https://instagram.com/songbirdslifeacademy"
              target="_blank"
              rel="noopener noreferrer"
            >
              @songbirdslifeacademy
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            <a
              className="hover:underline"
              href="https://facebook.com/songbirdslifeacademy"
              target="_blank"
              rel="noopener noreferrer"
            >
              @songbirdslifeacademy
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t py-4">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:flex-row">
        <p>{'© '}{new Date().getFullYear()}{' Songbirds Life Academy. All rights reserved.'}</p>
        <nav className="flex items-center gap-4">
          <Link className="hover:underline" href="/about">About</Link>
          <Link className="hover:underline" href="/events">Events</Link>
          <Link className="hover:underline" href="/store">Store</Link>
          <Link className="hover:underline" href="/join">Join Us</Link>
          <Link className="hover:underline text-slate-400" href="/admin" aria-label="Admin sign in">
            Admin
          </Link>
        </nav>
      </div>
    </div>
  </footer>
)
}
