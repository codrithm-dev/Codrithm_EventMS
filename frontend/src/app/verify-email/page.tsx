"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import AuthCard from "@/components/AuthCard";
import { api, ApiClientError } from "@/lib/api";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      (async () => {
        try {
          await api.post("/auth/verify-email", { token }, true);
          setMessage("Email verified successfully! Redirecting to login...");
          setTimeout(() => router.push("/login"), 2000);
        } catch (err) {
          if (err instanceof ApiClientError) setMessage(err.detail);
          else setMessage("Verification failed");
        } finally {
          setVerifying(false);
        }
      })();
    } else {
      setVerifying(false);
      setMessage("No verification token provided. Check the link in your email.");
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center gap-6 -mt-2">
      {message.includes("successfully") ? (
        <CheckCircle size={56} strokeWidth={1.5} color="var(--color-accent-green)" aria-hidden="true" />
      ) : null}
      <p className="text-sm text-center text-[var(--color-text-secondary)] leading-relaxed">
        {verifying ? "Verifying..." : message}
      </p>
      {!verifying && !message.includes("successfully") && (
        <button type="button"
          className="w-full py-2.5 rounded-full text-sm font-semibold text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary-blue)] hover:text-[var(--color-primary-blue)] bg-transparent transition duration-150 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Back to login
        </button>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthCard heading="Verify your email" subtext="Confirm your email address to activate your account.">
      <Suspense fallback={<div className="text-center py-4 text-[var(--color-text-secondary)]">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </AuthCard>
  );
}
