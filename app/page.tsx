"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Hero } from "@/components/Hero";
import { CreatorDashboard } from "@/components/CreatorDashboard";
import { BusinessDashboard } from "@/components/BusinessDashboard";
import { ViewerFeed } from "@/components/ViewerFeed";
import { MessagingPanel } from "@/components/MessagingPanel";
import { AdminDashboard } from "@/components/AdminDashboard";
import { WalletDashboard } from "@/components/WalletDashboard";
import { CreatorProfile } from "@/components/CreatorProfile";

export default function Home() {
  const router = useRouter();
  const { activeRole, activeTab, isAuthenticated } = useApp();

  React.useEffect(() => {
    if (activeRole !== "landing" && !isAuthenticated) {
      router.push("/login");
    }
  }, [activeRole, isAuthenticated, router]);

  // Render the appropriate main content panel based on active role and selected sidebar tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        if (activeRole === "creator") return <CreatorDashboard />;
        if (activeRole === "business") return <BusinessDashboard />;
        if (activeRole === "admin") return <AdminDashboard />;
        return <ViewerFeed />; // Fans default to content feed
      
      case "feed":
        return <ViewerFeed />;
      
      case "campaigns":
        if (activeRole === "creator") return <MessagingPanel />; // Negotiations and contract approval
        if (activeRole === "business") return <BusinessDashboard />; // Includes Campaign Escrow registry
        return <ViewerFeed />;

      case "messages":
        return <MessagingPanel />;

      case "wallet":
        return <WalletDashboard />;

      case "profile":
        if (activeRole === "creator") return <CreatorProfile />;
        return <ViewerFeed />;

      case "admin":
        if (activeRole === "admin") return <AdminDashboard />;
        return null;

      default:
        return <ViewerFeed />;
    }
  };

  if (activeRole === "landing") {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col justify-center">
          <Hero />
        </main>
        <footer className="py-6 border-t border-neutral-200 text-center text-xs text-neutral-600 bg-white">
          <p>© {new Date().getFullYear()} InzoziMarket. Where Dreams Become Digital Value. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gradient-dark">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
