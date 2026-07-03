import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coderithm Events — Find your next moment",
  description: "Discover, create, and manage unforgettable events.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
