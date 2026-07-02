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

const disabledInputCls = `
  w-full px-4 py-2.5 rounded-xl text-sm
  bg-[var(--color-surface)]
  border border-[var(--color-border)]
  text-[var(--color-text-secondary)]
  cursor-not-allowed
  outline-none
`.trim();

export default function ProfilePage() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8 py-12">

        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">
          Profile settings
        </h1>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl px-6 sm:px-8 py-8">

          {/* Avatar */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <div
              className="
                w-20 h-20 rounded-full
                flex items-center justify-center
                text-2xl font-extrabold text-white
                select-none
              "
              style={{ background: "linear-gradient(135deg, #0066ff 0%, #87ffbc 100%)" }}
              aria-label="Profile avatar"
            >
              AR
            </div>
            <button
              type="button"
              className="text-xs font-medium text-[var(--color-primary-blue)] hover:underline cursor-pointer"
            >
              Change photo
            </button>
          </div>

          {/* Form — no onSubmit; static UI only */}
          <form className="flex flex-col gap-5">

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="full-name">
                Full name
              </label>
              <input
                id="full-name"
                type="text"
                defaultValue="Alex Rivera"
                autoComplete="name"
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]" htmlFor="email">
                Email <span className="text-xs font-normal">(cannot be changed)</span>
              </label>
              <input
                id="email"
                type="email"
                defaultValue="alex@example.com"
                disabled
                readOnly
                className={disabledInputCls}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="linkedin">
                LinkedIn URL
              </label>
              <input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                autoComplete="url"
                className={inputCls}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="github">
                GitHub URL
              </label>
              <input
                id="github"
                type="url"
                placeholder="https://github.com/yourusername"
                autoComplete="url"
                className={inputCls}
              />
            </div>

            <button
              type="submit"
              className="
                w-full mt-2 py-2.5 rounded-full
                text-sm font-semibold text-white
                bg-[var(--color-primary-blue)]
                hover:opacity-90 active:scale-[0.98]
                transition duration-150
                shadow-lg shadow-[rgba(0,102,255,0.2)]
                cursor-pointer
              "
            >
              Save changes
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}
