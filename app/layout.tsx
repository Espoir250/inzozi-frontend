import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inzozi Market - Your Digital Marketplace",
  description: "Inzozi Market is a modern digital marketplace platform built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-background text-foreground font-sans">{children}</body>
    </html>
  );
}
