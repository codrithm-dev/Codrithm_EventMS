import Link from "next/link";

interface Applicant {
  id: string;
  name: string;
  email: string;
  date: string;
  answer: string;
}

const APPLICANTS: Applicant[] = [
  { id: "a1", name: "Hassan Raza",    email: "hassan@example.com",  date: "Jul 3, 2026", answer: "I want to improve my backend skills and learn how to deploy full-stack apps to the cloud." },
  { id: "a2", name: "Fatima Noor",    email: "fatima@example.com",  date: "Jul 3, 2026", answer: "Currently a CS student at LUMS, eager to get hands-on experience beyond coursework." },
  { id: "a3", name: "Mariam Yousaf",  email: "mariam@example.com",  date: "Jul 5, 2026", answer: "I've been self-learning React for 6 months and want structured guidance on the full stack." },
  { id: "a4", name: "Omar Farooq",    email: "omar@example.com",    date: "Jul 6, 2026", answer: "I'm transitioning from mobile development and this workshop aligns perfectly with my goals." },
  { id: "a5", name: "Nadia Baig",     email: "nadia@example.com",   date: "Jul 6, 2026", answer: "Looking to network with other developers and learn modern deployment practices." },
  { id: "a6", name: "Kamran Iqbal",   email: "kamran@example.com",  date: "Jul 7, 2026", answer: "Final year student working on a startup — need to understand full-stack architecture better." },
];

interface Props { params: Promise<{ id: string }> }

export default async function ApprovalQueuePage({ params }: Props) {
  const { id } = await params;
  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-10">

        <Link href={`/organizer/events/${id}/registrations`} className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-6">
          ← Back to registrations
        </Link>

        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-1">Approval queue</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">6 registrations awaiting review</p>

        {/* Empty state: when APPLICANTS is empty, show a message like "No pending registrations — all caught up!" */}

        <div className="flex flex-col gap-4">
          {APPLICANTS.map((a) => (
            <div key={a.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 py-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="font-semibold text-[var(--color-text-primary)]">{a.name}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{a.email} · Registered {a.date}</p>
                  <div className="mt-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">Why do you want to attend?</p>
                    <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">{a.answer}</p>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-3 shrink-0">
                  <button type="button" className="px-5 py-2 rounded-full text-sm font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition duration-150 cursor-pointer whitespace-nowrap">
                    Approve
                  </button>
                  <button type="button" className="px-5 py-2 rounded-full text-sm font-semibold text-red-400 border border-red-400/30 hover:border-red-400 hover:bg-red-400/5 bg-transparent transition duration-150 cursor-pointer whitespace-nowrap">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
