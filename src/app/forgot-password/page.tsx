"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Por favor, insira o seu endereço de e-mail.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg("E-mail de recuperação enviado! Verifique a sua caixa de entrada.");
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
            Recuperar Palavra-passe
          </h2>
          <p className="text-sm text-[var(--text-muted)] font-normal">
            Insira o seu e-mail e enviaremos um link para redefinir a sua palavra-passe.
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
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Endereço de E-mail
            </label>
            <input
              type="email"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || !!successMsg}
              className="w-full text-sm text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10 transition-colors placeholder:text-[var(--text-faint)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!successMsg}
            className="text-sm font-medium text-white px-5 py-2.5 rounded-md bg-[var(--brand)] hover:bg-[var(--brand-hover)] transition-colors w-full cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "A enviar..." : "Enviar Link de Recuperação"}
          </button>
        </form>

        <hr className="border-[var(--border-subtle)]" />

        <div className="text-center text-xs font-medium text-[var(--text-muted)]">
          Lembrou-se da palavra-passe?{" "}
          <Link href="/login" className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]">
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}
