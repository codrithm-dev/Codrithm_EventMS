import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Codrithm Events — Discover, Register, Manage",
    template: "%s | Codrithm Events",
  },
  description:
    "Discover tech events, workshops, and meetups. Register in seconds, manage your events, and connect with the community — all in one place.",
  keywords: ["events", "tech events", "workshops", "meetups", "hackathons", "conferences", "registration", "coding"],
  authors: [{ name: "Codrithm" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codrithm-event-ms.vercel.app",
    siteName: "Codrithm Events",
    title: "Codrithm Events — Discover, Register, Manage",
    description: "Discover tech events, workshops, and meetups. Register in seconds and connect with the community.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Codrithm Events",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Codrithm Events — Discover, Register, Manage",
    description: "Discover tech events, workshops, and meetups. Register in seconds and connect with the community.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
  },
};

// Runs before hydration to apply the correct theme class without flash.
const themeScript = `(function(){try{var s=localStorage.getItem('theme');if(!s||s==='dark'){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-text-primary)]">
        {/*
         * beforeInteractive ensures this runs before React hydrates,
         * preventing flash of wrong theme on first paint.
         */}
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
