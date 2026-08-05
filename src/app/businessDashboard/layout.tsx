"use client";

import { useState, type ReactNode } from "react";
import BusinessSidebar from "@/src/components/bussinessDashboard/BusinessSidebar";
import BusinessHeader from "@/src/components/bussinessDashboard/BusinessHeader";

export default function BusinessDashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f7fa]">
      <BusinessSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <BusinessHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
