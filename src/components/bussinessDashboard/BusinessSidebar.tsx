"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  FiBriefcase,
  FiClipboard,
  FiCompass,
  FiGrid,
  FiLogOut,
  FiSettings,
  FiStar,
  FiX,
  FiZap,
} from "react-icons/fi";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type NavItem = {
  label: string;
  href: string;
  icon: IconType;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/businessDashboard/dashboard", icon: FiGrid },
  { label: "Reputation Center", href: "/businessDashboard/reputation", icon: FiStar },
  { label: "Booking Requests", href: "/businessDashboard/booking", icon: FiClipboard },
  { label: "Business Listings", href: "/businessDashboard/listings", icon: FiBriefcase },
  { label: "AI Marketing Assistant", href: "/businessDashboard/aiMarketing", icon: FiZap },
  // { label: "AI Business Coach", href: "/businessDashboard/aiCoach", icon: FiCompass },
  { label: "System Settings", href: "/businessDashboard/settings", icon: FiSettings },
];

type BusinessSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function BusinessSidebar({ open, onClose }: BusinessSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname?.startsWith(href);

  const handleLogout = async () => {
    try {
      await baseApi.post(ENDPOINTS.logout);
      localStorage.clear();
      sessionStorage.clear();
      toast.success("Logged out successfully.");
      router.push("/auth/login");
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(msg || "Failed to logout.");
    }
  };

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
        <div className="flex items-start justify-between px-3 pb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight">TrouveClients.fr</h2>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-green-100/80">
              Business Dashboard
            </p>
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

        <div className="mt-auto border-t border-white/15 pt-3 space-y-1.5">

          <button
            type="button"
            onClick={() => {
              onClose();
              handleLogout();
            }}
            className="group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-all duration-200 text-green-100 hover:bg-white/12 hover:text-white"
          >
            <FiLogOut className="text-[17px] transition-transform duration-200 text-green-200 group-hover:scale-105 group-hover:text-white" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
