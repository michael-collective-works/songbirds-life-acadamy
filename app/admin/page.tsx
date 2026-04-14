import Link from "next/link"

export default function AdminHome() {
  const cards = [
    { href: "/admin/events", title: "Manage Events", desc: "Create, edit, publish events." },
    { href: "/admin/team", title: "Manage Team", desc: "Update staff bios and visibility." },
    { href: "/admin/store", title: "Manage Store", desc: "Maintain items that link to Square." },
    { href: "/admin/applications", title: "Review Applications", desc: "Mark reviewed and archive." },
  ]
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Welcome</h1>
      <p className="text-gray-700">
        Use the sections below to manage your site content.
      </p>
      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-lg border bg-white p-4 hover:shadow-sm">
            <h2 className="font-medium">{c.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
