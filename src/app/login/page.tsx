"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg("Signed in successfully! Redirecting...");
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
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
            Welcome back!
          </h2>
          <p className="text-sm text-[var(--text-muted)] font-normal">
            Sign in to view and manage your saved destinations.
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

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full text-sm text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-colors placeholder:text-[var(--text-faint)]"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full text-sm text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-colors placeholder:text-[var(--text-faint)]"
            />
          </div>

          {/* Forgot password */}
          <div className="text-right -mt-1">
            <Link href="/forgot-password" className="text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
              Forgot your password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="text-sm font-medium text-white px-5 py-2.5 rounded-md bg-[var(--brand)] hover:bg-[var(--brand-hover)] transition-colors w-full cursor-pointer mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <hr className="border-[var(--border-subtle)]" />

        {/* Redirect to signup */}
        <div className="text-center text-xs font-medium text-[var(--text-muted)]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]">
            Create a free account
          </Link>
        </div>
      </div>
    </div>
  );
}
