"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import {
  signInWithGoogle,
  signUp,
  syncFrontendSession,
} from "@/lib/auth-client";
import { BATCHES, type Batch } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [batch, setBatch] = useState<Batch>("1st year");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(): string | null {
    if (name.trim().length < 2) return "Please enter your full name.";
    if (studentId.trim().length < 3) return "Please enter a valid student ID.";
    if (!email.includes("@")) return "Please enter a valid email.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirm) return "Passwords do not match.";
    if (!agreed) return "You must accept the terms to continue.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

    setError("");
    setLoading(true);
    try {
      const { error: authError } = await signUp.email({
        name: name.trim(),
        email,
        password,
        studentId: studentId.trim(),
        batch,
      } as Parameters<typeof signUp.email>[0]);

      if (authError) {
        setError(authError.message ?? "Registration failed. Please try again.");
        return;
      }

      await syncFrontendSession();
      toast.success("Welcome to NEUCC!");
      router.push("/");
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    // Changed min-h to screen-based height and added responsive vertical padding
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col justify-center px-4 py-6 sm:py-12">
      {/* Changed absolute padding p-8 to dynamic sm:p-8 p-6 */}
      <div className="w-full rounded-[12px] border border-[var(--color-secondary)]/15 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-bold text-[var(--color-primary)] sm:text-2xl">
          Join NEUCC
        </h1>
        <p className="mt-1.5 text-xs text-[var(--color-neutral-text)] sm:text-sm">
          Registration is open to every enrolled B.Sc. CSE student.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--color-primary)] sm:text-sm">
              Full name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none sm:px-4 sm:py-2.5"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-[var(--color-primary)] sm:text-sm">
                Student ID
              </label>
              <input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. 21CSE045"
                className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none sm:px-4 sm:py-2.5"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-primary)] sm:text-sm">
                Batch / year
              </label>
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value as Batch)}
                className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none sm:py-2.5"
              >
                {BATCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-primary)] sm:text-sm">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@student.neu.ac.bd"
              className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none sm:px-4 sm:py-2.5"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-[var(--color-primary)] sm:text-sm">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none sm:px-4 sm:py-2.5"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-primary)] sm:text-sm">
                Confirm password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border border-[var(--color-secondary)]/25 px-3 py-2 text-sm focus:border-[var(--color-secondary)] focus:outline-none sm:px-4 sm:py-2.5"
              />
            </div>
          </div>

          {/* Adjusted layout for items-start alignment and smaller text on mobile */}
          <label className="flex items-start gap-2 text-xs text-[var(--color-neutral-text)] sm:text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--color-secondary)]/40"
            />
            <span className="leading-tight">
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-semibold text-[var(--color-secondary)] hover:underline"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-semibold text-[var(--color-secondary)] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {error && (
            <p className="text-xs text-[var(--color-danger)] sm:text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition hover:brightness-105 disabled:opacity-60 sm:py-3"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Create account
          </button>
          <div className="my-5 flex items-center gap-3 text-xs text-[var(--color-neutral-text)]">
            <div className="h-px flex-1 bg-[var(--color-secondary)]/15" />
            <span className="shrink-0 text-[10px] uppercase tracking-wider">
              or continue with
            </span>
            <div className="h-px flex-1 bg-[var(--color-secondary)]/15" />
          </div>

          <button
            type="button"
            onClick={() => void signInWithGoogle()}
            className="w-full rounded-full border border-[var(--color-secondary)]/25 px-5 py-2.5 text-sm font-medium text-[var(--color-primary)] transition hover:bg-[var(--color-secondary)]/5"
          >
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--color-neutral-text)] sm:text-sm">
          Already a member?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--color-secondary)] hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
