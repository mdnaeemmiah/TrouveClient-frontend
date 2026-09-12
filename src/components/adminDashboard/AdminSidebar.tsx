"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { IconType } from "react-icons";
import {
  FiAlertTriangle,
  FiBarChart2,
  FiClock,
  FiHome,
  FiLogOut,
  FiArchive,
  FiSettings,
  FiUsers,
  FiX,
  FiTag,
  FiCalendar,
} from "react-icons/fi";
import { useAuth } from "@/src/context/AuthContext";

type NavItem = {
  label: string;
  href: string;
  icon: IconType;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/adminDashboard/dashboard", icon: FiHome },
  { label: "User Management", href: "/adminDashboard/userManagement", icon: FiUsers },
  { label: "Analytics", href: "/adminDashboard/analytics", icon: FiBarChart2 },
  { label: "Moderation", href: "/adminDashboard/moderation", icon: FiAlertTriangle },
  { label: "Trash Archive", href: "/adminDashboard/trash", icon: FiArchive },
  { label: "All Business Profiles", href: "/adminDashboard/pendingApprovals", icon: FiClock },
  { label: "Categories", href: "/adminDashboard/categories", icon: FiTag },
  { label: "Booking Templates", href: "/adminDashboard/booking-templates", icon: FiCalendar },
  { label: "Settings", href: "/adminDashboard/settings", icon: FiSettings },
];

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col overflow-y-auto bg-[#00663f] px-3 py-5 text-white shadow-xl transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between px-3 pb-5">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Motor Bridge</h2>
            <p className="mt-1 text-sm text-green-100/90">Admin Dashboard</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-green-100 transition-colors hover:text-white lg:hidden"
          >
            <FiX className="text-[20px]" />
          </button>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-all duration-200 ${
                  active
                    ? "bg-white text-[#00663f] shadow-sm"
                    : "text-green-100 hover:bg-white/12 hover:text-white"
                }`}
              >
                <Icon
                  className={`text-[17px] transition-transform duration-200 ${
                    active
                      ? "text-[#00663f] scale-105"
                      : "text-green-200 group-hover:scale-105 group-hover:text-white"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/15 pt-3">
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-green-100 transition-all duration-200 hover:bg-white/12 hover:text-white"
          >
            <FiLogOut className="text-[17px] text-green-200 transition-transform duration-200 group-hover:scale-105 group-hover:text-white" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
