"use client";

import { useState, type ReactNode } from "react";
import UserSidebar from "@/src/components/userDashboard/UserSidebar";
import UserHeader from "@/src/components/userDashboard/UserHeader";

export default function UserDashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f7fa]">
      <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <UserHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
