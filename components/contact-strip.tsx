import { MapPin, Phone, Globe } from 'lucide-react'
import Link from 'next/link'

export function ContactStrip() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-4 rounded-xl border bg-white p-4 sm:grid-cols-3">
        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-5 w-5 text-teal-700" />
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Call</div>
            <a href="tel:12256357973" className="font-medium text-slate-900 hover:underline">
              225.635.7973
            </a>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Globe className="mt-0.5 h-5 w-5 text-teal-700" />
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Visit</div>
            <a
              href="https://songbirdslifeacademy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-900 hover:underline"
            >
              songbirdslifeacademy.com
            </a>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 text-teal-700" />
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Location</div>
            <a
              href="https://maps.google.com/?q=5915%20N.%20Commerce%20Street,%20St.Francisville,%20LA%2070775"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-900 hover:underline"
            >
              5915 N. Commerce Street, St.Francisville, LA 70775
            </a>
          </div>
        </div>
      </div>
      
    </section>
  )
}
