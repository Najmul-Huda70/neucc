"use client";

import type { Route } from "next";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { signIn, signInWithGoogle, syncFrontendSession } from "@/lib/auth-client";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="skeleton mx-auto mt-20 h-96 w-full max-w-md px-4" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function doLogin(loginEmail: string, loginPassword: string) {
    setError("");
    setLoading(true);
    try {
      const { error: authError } = await signIn.email({ email: loginEmail, password: loginPassword });
      if (authError) {
        setError(authError.message ?? "Invalid email or password.");
        return;
      }
      await syncFrontendSession();
      toast.success("Welcome back!");
      router.push(next as Route);
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return setError("Please enter a valid email.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    void doLogin(email, password);
  }

  return (
    <div className="grid w-full flex-1 place-items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-xl block rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-bold text-[var(--color-primary)] sm:text-2xl">Log in to NEUCC</h1>
        <p className="mt-1.5 text-xs text-[var(--color-neutral-text)] sm:text-sm">Welcome back — enter your details.</p>

        <form onSubmit={handleSubmit} className="mt-6 block space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-primary)] sm:text-sm">Email</label>
            <div className="relative mt-1 block w-full">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-neutral-text)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@student.neu.ac.bd"
                className="w-full block rounded-lg border border-[var(--color-secondary)]/25 py-2.5 pl-10 pr-4 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-primary)] sm:text-sm">Password</label>
            <div className="relative mt-1 block w-full">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-neutral-text)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full block rounded-lg border border-[var(--color-secondary)]/25 py-2.5 pl-10 pr-4 text-sm focus:border-[var(--color-secondary)] focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="block text-xs text-[var(--color-danger)] sm:text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:brightness-105 disabled:opacity-60 sm:py-3"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            Log in
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => void doLogin("demo.user@neu.ac.bd", "demo.user@neu.ac.bd")}
            className="w-full block rounded-full border border-[var(--color-secondary)] px-5 py-2.5 text-sm font-medium text-[var(--color-secondary)] transition hover:bg-[var(--color-secondary)]/10 disabled:opacity-60 sm:py-3"
          >
            Try demo login
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-[var(--color-neutral-text)]">
          <div className="h-px flex-1 bg-[var(--color-secondary)]/15" />
          <span className="shrink-0 text-[10px] uppercase tracking-wider">or continue with</span>
          <div className="h-px flex-1 bg-[var(--color-secondary)]/15" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => void signInWithGoogle()}
            className="w-full block rounded-full border border-[var(--color-secondary)]/25 px-2 py-2 text-xs font-medium text-[var(--color-primary)] transition hover:bg-[var(--color-secondary)]/5 sm:py-2.5 sm:text-sm"
          >
            Google
          </button>
          {/* <button
            type="button"
            onClick={() => toast("Social login is a decorative placeholder for now.")}
            className="rounded-full border border-[var(--color-secondary)]/25 px-2 py-2 text-xs font-medium text-[var(--color-primary)] transition hover:bg-[var(--color-secondary)]/5 sm:py-2.5 sm:text-sm"
          >
            Facebook
          </button> */}
        </div>

        <p className="mt-6 text-center text-xs text-[var(--color-neutral-text)] sm:text-sm">
          New to NEUCC?{" "}
          <Link href="/register" className="font-semibold text-[var(--color-secondary)] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}