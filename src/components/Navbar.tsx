"use client";

import Link from "next/link";
import { Compass, Menu, X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Comparar", href: "/compare" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {/* Tenta carregar logo, fallback para ícone Lucide */}
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand-subtle)] shrink-0">
            <img
              src="/images/logo-icon.png"
              alt=""
              className="h-7 w-7 object-contain rounded-lg"
              onError={(e) => {
                // Esconde imagem se não carregar
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement)
                  .nextElementSibling
                  ?.removeAttribute('hidden');
              }}
            />
            <Compass
              {...({ hidden: true } as any)}
              className="h-4 w-4 text-[var(--brand)]"
            />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--text-primary)]">
            wayfinder
          </span>
        </Link>

        {/* Right Side: Links & Auth */}
        <div className="hidden md:flex items-center gap-6">
          {/* Nav links */}
          <div className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm ${
                    isActive
                      ? "text-[var(--text-primary)] font-medium"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] font-normal transition-colors"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Separator */}
          <div className="h-4 w-px bg-[var(--border)]" />

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {profile?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
              </span>
              <button
                onClick={signOut}
                className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-white px-4 py-1.5 rounded-md bg-[var(--brand)] hover:bg-[var(--brand-hover)] transition-colors"
              >
                Começar
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-[var(--text-primary)] hover:text-[var(--brand)] p-1"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-4 flex flex-col gap-4 shadow-sm">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm ${
                    isActive
                      ? "text-[var(--text-primary)] font-medium"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] font-normal transition-colors"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="h-px w-full bg-[var(--border-subtle)]" />

          {user ? (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {profile?.full_name || user.email}
              </span>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  signOut();
                }}
                className="text-left text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-white px-4 py-1.5 rounded-md bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-center transition-colors"
              >
                Começar
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
