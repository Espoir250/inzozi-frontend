import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "InzoziMarket – Dream Creator & Monetization Marketplace",
  description: "Transforming dreams into economic opportunities. A next-generation platform for content monetization, influencer marketing collaborations, and transparent payment escrow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-white text-black relative overflow-x-hidden">
        <AppProvider>
          <div className="flex-1 flex flex-col z-10">{children}</div>
        </AppProvider>
      </body>
    </html>
  );
}
