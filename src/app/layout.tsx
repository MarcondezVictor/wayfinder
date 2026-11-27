import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";

// Plus Jakarta Sans (variable font, SIL OFL 1.1 — see fonts/OFL.txt), stored in the
// repo so builds do not depend on Google Fonts. Weights 400–600, as before.
const jakarta = localFont({
  src: "./fonts/PlusJakartaSans-Variable.woff2",
  weight: "400 600",
  style: "normal",
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WayFinder",
  description: "Explore. Plan. Go — visa info, costs, safety and climate for destinations worldwide.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
          lang="en"
          className={`${jakarta.variable} h-full antialiased dark`}
          suppressHydrationWarning
      >
      <body className="min-h-full flex flex-col bg-[var(--bg-page)] text-[var(--text-body)] antialiased">
      <AuthProvider>
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </AuthProvider>
      </body>
      </html>
  );
}
  