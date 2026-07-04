import Link from "next/link";

const inputCls = `
  w-full px-4 py-2.5 rounded-xl text-sm
  bg-[var(--color-background)]
  border border-[var(--color-border)]
  text-[var(--color-text-primary)]
  placeholder:text-[var(--color-text-secondary)]
  outline-none
  focus:border-[var(--color-primary-blue)]
  focus:ring-2 focus:ring-[rgba(0,102,255,0.2)]
  transition-colors duration-150
`.trim();

const labelCls = "text-sm font-medium text-[var(--color-text-primary)]";
const fieldCls = "flex flex-col gap-1.5";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function RegisterForEventPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8 py-10">

        {/* Back link */}
        <Link
          href={`/events/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-150 mb-6"
        >
          ← Back to event
        </Link>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-1">
          Register for Full-Stack Web Dev Workshop
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">
          Saturday, Jul 12, 2026 · Tech Hub, Lahore
        </p>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 sm:px-8 py-8">
          <form className="flex flex-col gap-8">

            {/* Required fields */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Required information
              </h2>
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="full-name">Full name <span className="text-red-400">*</span></label>
                <input id="full-name" type="text" placeholder="Your full name" autoComplete="name" className={inputCls} />
              </div>
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="email">Email address <span className="text-red-400">*</span></label>
                <input id="email" type="email" placeholder="you@example.com" autoComplete="email" className={inputCls} />
              </div>
            </section>

            {/* Optional fields */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Optional information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={fieldCls}>
                  <label className={labelCls} htmlFor="phone">Phone number</label>
                  <input id="phone" type="tel" placeholder="+92 300 0000000" autoComplete="tel" className={inputCls} />
                </div>
                <div className={fieldCls}>
                  <label className={labelCls} htmlFor="university">University</label>
                  <input id="university" type="text" placeholder="Your university" className={inputCls} />
                </div>
                <div className={fieldCls}>
                  <label className={labelCls} htmlFor="company">Company</label>
                  <input id="company" type="text" placeholder="Your company" autoComplete="organization" className={inputCls} />
                </div>
                <div className={fieldCls}>
                  <label className={labelCls} htmlFor="job-title">Job title</label>
                  <input id="job-title" type="text" placeholder="e.g. Software Engineer" autoComplete="organization-title" className={inputCls} />
                </div>
                <div className={fieldCls}>
                  <label className={labelCls} htmlFor="linkedin">LinkedIn profile</label>
                  <input id="linkedin" type="url" placeholder="https://linkedin.com/in/you" className={inputCls} />
                </div>
                <div className={fieldCls}>
                  <label className={labelCls} htmlFor="github">GitHub profile</label>
                  <input id="github" type="url" placeholder="https://github.com/you" className={inputCls} />
                </div>
              </div>
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="portfolio">Portfolio URL</label>
                <input id="portfolio" type="url" placeholder="https://yourportfolio.com" className={inputCls} />
              </div>
            </section>

            {/* Dynamic questions — organizer-defined per event (future iteration will render these from API) */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Additional questions
              </h2>
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="why-attend">Why do you want to attend?</label>
                <textarea
                  id="why-attend"
                  rows={4}
                  placeholder="Tell us what you're hoping to learn or get out of this event…"
                  className={`${inputCls} resize-y`}
                />
              </div>
              <div className={fieldCls}>
                <label className={labelCls} htmlFor="experience">What is your current experience level with web development?</label>
                <input id="experience" type="text" placeholder="e.g. Beginner, 1 year with React, etc." className={inputCls} />
              </div>
            </section>

            {/* Submit */}
            <div className="flex flex-col gap-3 pt-2 border-t border-[var(--color-border)]">
              <button
                type="submit"
                className="
                  w-full py-3 rounded-full
                  text-base font-semibold text-white
                  bg-[var(--color-primary-blue)]
                  hover:opacity-90 active:scale-[0.98]
                  transition duration-150
                  shadow-lg shadow-[rgba(0,102,255,0.25)]
                  cursor-pointer
                "
              >
                Submit registration
              </button>
              <p className="text-xs text-center text-[var(--color-text-secondary)]">
                By registering, you agree to receive event updates via email.
              </p>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}
