"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { setStoredUser, setFrontendSessionCookie } from "@/lib/auth";
import type { User } from "@/types";
import { Suspense } from "react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    (async () => {
      try {
        const token = searchParams.get("token");
        if (token) {
          setFrontendSessionCookie(token);
        }

        const user = await api.get<User>("/users/me");
        setStoredUser(user as unknown as Record<string, unknown>);
        router.replace("/dashboard");
      } catch {
        router.replace("/login?error=fetch_user_failed");
      }
    })();
  }, [router, searchParams]);

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[var(--color-primary-blue)] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[var(--color-text-secondary)]">Signing you in...</p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<main className="flex-1 flex items-center justify-center px-4 py-20"><div className="w-8 h-8 border-2 border-[var(--color-primary-blue)] border-t-transparent rounded-full animate-spin" /></main>}>
      <CallbackHandler />
    </Suspense>
  );
}
