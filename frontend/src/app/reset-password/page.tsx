import AuthCard from "@/components/AuthCard";

const inputCls = `
  w-full px-4 py-2.5 rounded-xl text-sm
  bg-[var(--color-background)]
  border border-[var(--color-border)]
  text-[var(--color-text-primary)]
  placeholder:text-[var(--color-text-secondary)]
  outline-none
  focus:border-[var(--color-primary-blue)]
  focus:ring-2 focus:ring-[var(--color-primary-blue)]/20
  transition-colors duration-150
`.trim();

export default function ResetPasswordPage() {
  return (
    <AuthCard
      heading="Set a new password"
      subtext="Choose a strong password for your account."
    >
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="new-password">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            className={inputCls}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-primary)]" htmlFor="confirm-password">
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
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
          Reset password
        </button>
      </form>
    </AuthCard>
  );
}


