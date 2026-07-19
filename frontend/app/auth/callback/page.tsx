"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { syncFrontendSession } from "@/lib/auth-client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await syncFrontendSession();
      router.replace("/");
      router.refresh();
    })();
  }, [router]);

  return (
    <div className="grid min-h-[60vh] place-items-center">
      <p className="text-sm text-[var(--color-neutral-text)]">Signing you in…</p>
    </div>
  );
}