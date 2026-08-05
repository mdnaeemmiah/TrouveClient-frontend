"use client";

import { usePathname } from "next/navigation";
import { FiBell, FiMenu, FiUser } from "react-icons/fi";

const titles: Record<string, string> = {
  "/adminDashboard/dashboard": "Dashboard",
  "/adminDashboard/userManagement": "User Management",
  "/adminDashboard/analytics": "Analytics",
  "/adminDashboard/moderation": "Moderation",
  "/adminDashboard/pendingApprovals": "Pending Approvals",
  "/adminDashboard/settings": "Settings",
};

type AdminHeaderProps = {
  onMenuClick: () => void;
};

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const title =
    Object.entries(titles).find(([href]) => pathname?.startsWith(href))?.[1] ??
    "Overview";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#00663f] lg:hidden"
        >
          <FiMenu className="text-[20px]" />
        </button>
        {/* <h1 className="text-xl font-semibold text-slate-800">{title}</h1> */}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#1b4e9f]"
        >
          <FiBell className="text-[18px]" />
        </button>

        <div className="flex items-center gap-2.5 rounded-full bg-slate-100 py-1 pl-1 pr-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1b4e9f] text-white">
            <FiUser className="text-[14px]" />
          </span>
          <span className="text-sm font-medium text-slate-700">Admin</span>
        </div>
      </div>
    </header>
  );
}
