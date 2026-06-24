"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase parses the token from the URL hash and fires an AUTH_CHANGE event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    if (!password || !confirm) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      const messages: Record<string, string> = {
        "Password should be at least 6 characters.": "Password must be at least 6 characters.",
        "Password should contain at least one character of each: abcdefghijklmnopqrstuvwxyz, ABCDEFGHIJKLMNOPQRSTUVWXYZ, 0123456789.": "Password must contain uppercase letters, lowercase letters and numbers.",
        "Auth session missing!": "Session expired. Please request a new reset link.",
        "Token has expired or is invalid": "The reset link has expired or is invalid. Please request a new one.",
        "New password should be different from the old password.": "New password must differ from the current one.",
      };
      setErrorMsg(messages[error.message] ?? "An error occurred. Please try again.");
      return;
    }

    setSuccessMsg("Password updated successfully! Redirecting...");
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-page)] text-[var(--text-body)]">
      <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] p-8 flex flex-col gap-6 shadow-sm">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <Link href="/" className="flex items-center gap-2 group mb-2">
            <Image
              src="/icon-192.png"
              alt="WayFinder"
              width={28}
              height={28}
              priority
            />
            <span className="text-[15px] font-semibold tracking-tight text-[var(--text-primary)]">
              wayfinder
            </span>
          </Link>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
            New Password
          </h2>
          <p className="text-sm text-[var(--text-muted)] font-normal">
            Choose a new password for your account.
          </p>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="rounded-md border border-[var(--danger-border)] bg-[var(--danger-bg)] p-3 text-xs font-medium text-[var(--danger)]">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="rounded-md border border-[var(--success-border)] bg-[var(--success-bg)] p-3 text-xs font-medium text-[var(--success)]">
            {successMsg}
          </div>
        )}

        {!ready && !successMsg && (
          <div className="rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] p-3 text-xs font-medium text-[var(--text-muted)] text-center">
            Verifying reset link...
          </div>
        )}

        {/* Form */}
        {ready && !successMsg && (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full text-sm text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-colors placeholder:text-[var(--text-faint)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Repeat your new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading}
                className="w-full text-sm text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-colors placeholder:text-[var(--text-faint)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="text-sm font-medium text-white px-5 py-2.5 rounded-md bg-[var(--brand)] hover:bg-[var(--brand-hover)] transition-colors w-full cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Set New Password"}
            </button>
          </form>
        )}

        <hr className="border-[var(--border-subtle)]" />

        <div className="text-center text-xs font-medium text-[var(--text-muted)]">
          <Link href="/login" className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
