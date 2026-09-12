"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FiBell, FiHome, FiMenu, FiUser } from "react-icons/fi";
import { useProfileAvatar } from "@/src/hooks/useProfileAvatar";

const titles: Record<string, string> = {
  "/adminDashboard/dashboard": "Dashboard",
  "/adminDashboard/userManagement": "User Management",
  "/adminDashboard/businessProfiles": "Business Profiles",
  "/adminDashboard/analytics": "Analytics",
  "/adminDashboard/moderation": "Moderation",
  "/adminDashboard/pendingApprovals": "Pending Approvals",
  "/adminDashboard/categories": "Categories",
  "/adminDashboard/settings": "Settings",
};

type AdminHeaderProps = {
  onMenuClick: () => void;
};

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const profile = useProfileAvatar();
  const [avatar, setAvatar] = useState(profile.avatar);
  const [initials, setInitials] = useState(profile.initials);

  const title =
    Object.entries(titles).find(([href]) => pathname?.startsWith(href))?.[1] ??
    "Overview";

  useEffect(() => {
    // Update when profile hook data changes
    setAvatar(profile.avatar);
    setInitials(profile.initials);
  }, [profile.avatar, profile.initials]);

  useEffect(() => {
    // Listen for profile updates from Settings save
    const handleProfileUpdate = () => {
      const storedName   = localStorage.getItem("profile_name")  ?? "";
      const storedAvatar = localStorage.getItem("profile_image") ?? "";
      const fresh = storedName
        ? storedName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
        : initials;
      setAvatar(storedAvatar);
      setInitials(fresh);
    };

    window.addEventListener("profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("profile-updated", handleProfileUpdate);
  }, [initials]);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#00663f] lg:hidden"
        >
          <FiMenu className="text-[20px]" />
        </button>

        {/* Breadcrumb: Home → Current page */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#00663f]"
          >
            <FiHome className="text-base" />
            <span className="hidden sm:inline text-black">Home</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#1b4e9f]"
        >
          <FiBell className="text-[18px]" />
        </button>

        {avatar ? (
          <div className="relative h-9 w-9 overflow-hidden rounded-full">
            <Image src={avatar} alt="Admin Avatar" fill className="object-cover" unoptimized />
          </div>
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4f3ec] text-xs font-semibold text-[#00663f]">
            {initials}
          </span>
        )}
      </div>
    </header>
  );
}
