import { CheckCircle } from "lucide-react";
import AuthCard from "@/components/AuthCard";

export default function VerifyEmailPage() {
  return (
    <AuthCard
      heading="Verify your email"
      subtext="We've sent a verification link to your email. Click it to activate your account."
    >
      {/* Icon — rendered above heading via slot trick: wrap in a fragment order override */}
      <div className="flex flex-col items-center gap-6 -mt-2">
        <CheckCircle
          size={56}
          strokeWidth={1.5}
          color="var(--color-accent-green)"
          aria-hidden="true"
        />

        <p className="text-sm text-center text-[var(--color-text-secondary)] leading-relaxed">
          Didn&apos;t receive the email? Check your spam folder, or request a new one below.
        </p>

        <button
          type="button"
          className="
            w-full py-2.5 rounded-full
            text-sm font-semibold
            text-[var(--color-text-primary)]
            border border-[var(--color-border)]
            hover:border-[var(--color-primary-blue)]
            hover:text-[var(--color-primary-blue)]
            bg-transparent
            transition duration-150
            cursor-pointer
          "
        >
          Resend email
        </button>
      </div>
    </AuthCard>
  );
}
