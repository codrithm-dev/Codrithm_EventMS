import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <div>Home Page</div>

      {/* TEMP: Testing navigation only — remove before production */}
      <div className="mt-8 p-4 border-2 border-dashed border-yellow-400 rounded-lg">
        <h2 className="text-lg font-bold text-yellow-700 mb-6">
          🚧 Testing Navigation (Remove Before Production)
        </h2>

        {/* Public */}
        <section className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Public</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Home (/)", href: "/" },
              { label: "Event Details", href: "/events/test-event" },
              { label: "Event Register", href: "/events/test-event/register" },
              { label: "Login", href: "/login" },
              { label: "Register", href: "/register" },
              { label: "Verify Email", href: "/verify-email" },
              { label: "Forgot Password", href: "/forgot-password" },
              { label: "Reset Password", href: "/reset-password" },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300">
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* User */}
        <section className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">User</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Dashboard", href: "/dashboard" },
              { label: "My Registrations", href: "/my-registrations" },
              { label: "Ticket", href: "/tickets/1" },
              { label: "Profile", href: "/profile" },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 rounded border border-blue-300">
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* Organizer */}
        <section className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Organizer</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Organizer Dashboard", href: "/organizer/dashboard" },
              { label: "Events List", href: "/organizer/events" },
              { label: "Create Event", href: "/organizer/events/create" },
              { label: "Edit Event", href: "/organizer/events/1/edit" },
              { label: "Registrations", href: "/organizer/events/1/registrations" },
              { label: "Approval Queue", href: "/organizer/events/1/queue" },
              { label: "Check-In", href: "/organizer/events/1/checkin" },
              { label: "Check-In Stats", href: "/organizer/events/1/checkin-stats" },
              { label: "Analytics", href: "/organizer/events/1/analytics" },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="px-3 py-1.5 text-sm bg-green-100 hover:bg-green-200 rounded border border-green-300">
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* Admin */}
        <section className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Admin</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Users", href: "/admin/users" },
              { label: "Analytics", href: "/admin/analytics" },
              { label: "Export Event", href: "/admin/events/1/export" },
            ].map(({ label, href }) => (
              <Link key={href} href={href} className="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 rounded border border-red-300">
                {label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
