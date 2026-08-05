"use client";

import { useState, type ReactNode } from "react";
import AdminSidebar from "@/src/components/adminDashboard/AdminSidebar";
import AdminHeader from "@/src/components/adminDashboard/AdminHeader";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex h-screen overflow-hidden bg-[#f7f7fa]">
			<AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<div className="flex flex-1 flex-col overflow-hidden">
				<AdminHeader onMenuClick={() => setSidebarOpen(true)} />
				<main className="flex-1 overflow-y-auto p-8">{children}</main>
			</div>
		</div>
	);
}
