import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CarBat — Find the right car battery for your UK reg",
  description:
    "Enter your car registration to discover batteries that fit. Accounts for start/stop, engine, polarity, dimensions, Ah and CCA. UK price comparison + guide only.",
  metadataBase: getSiteUrl(),
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-daylight text-ink">
        <header className="sticky top-0 z-50 border-b border-ink/10 bg-daylight/95 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-2xl font-black tracking-tighter">
              car<span className="text-emerald-600">bat</span>
            </Link>
            <div className="flex items-center gap-5 text-sm font-semibold">
              <Link href="/batteries" className="hover:text-emerald-600">All batteries</Link>
              <Link href="/how-it-works" className="hover:text-emerald-600">How it works</Link>
              <Link href="/disclaimer" className="hover:text-emerald-600">Disclaimer</Link>
              <Link
                href="/"
                className="rounded-full bg-ink px-4 py-1.5 text-daylight hover:bg-emerald-600"
              >
                Find battery
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16">{children}</main>

        <footer className="border-t border-ink/10 bg-white py-8 text-sm text-ink/60">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>CarBat — UK car battery fitment guide. Not affiliated with vehicle manufacturers.</p>
              <div className="flex gap-4">
                <Link href="/disclaimer" className="hover:text-ink">Full disclaimer</Link>
                <Link href="/how-it-works" className="hover:text-ink">How it works</Link>
              </div>
            </div>
            <p className="mt-3 text-xs">
              This site is for guidance only. Always double-check specifications against your vehicle handbook and with the retailer before purchase. Incorrect batteries can cause damage or electrical issues.
            </p>
          </div>
        </footer>

        {/* 
          ADSTERRA INTEGRATION
          Replace the AdPlaceholder components (in page.tsx, results/page.tsx, batteries/page.tsx)
          and/or add your real Adsterra scripts here.

          Recommended approach:
          - For banners: Use a <div id="your-zone-id"> and load Adsterra's script via next/script
          - For popunders: Include the script once (usually early in the document)

          Example for a banner:
          <Script src="https://...adsterra..." strategy="afterInteractive" />
          <div id="container-XXXXX"></div>

          You can also put raw ad HTML in NEXT_PUBLIC_ADSTERRA_* env vars and render them.
        */}
      </body>
    </html>
  );
}
