"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/src/context/AuthContext";
import { useProfileAvatar } from "@/src/hooks/useProfileAvatar";

const BUSINESS_SUBMISSION_KEY = "business_submission";

function hasSubmittedBusiness() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return localStorage.getItem(`${BUSINESS_SUBMISSION_KEY}:${user?.email || "guest"}`) === "true";
  } catch {
    return false;
  }
}

const navItems: { label: string; href: string; match: string | null }[] = [
  { label: "Home", href: "/", match: "/" },
  { label: "About Us", href: "/#categories", match: null },
  { label: "Search", href: "/search", match: "/search" },
  { label: "Feed", href: "/feed", match: "/feed" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { name, avatar, initials } = useProfileAvatar();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // refresh avatar when profile is saved from any settings page
  const [avatarKey, setAvatarKey] = useState(0);
  
  useEffect(() => {
    const handler = () => setAvatarKey((k) => k + 1);
    window.addEventListener("profile-updated", handler);
    return () => window.removeEventListener("profile-updated", handler);
  }, []);

  // live avatar/name from localStorage + fresh API (re-runs on avatarKey change)
  // Safe localStorage access
  const getLocalStorage = (key: string) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  };
  
  const liveAvatar = avatarKey >= 0 ? (getLocalStorage("profile_image") ?? avatar) : avatar;
  const liveName = avatarKey >= 0 ? (getLocalStorage("profile_name") ?? name) : name;
  const liveInitials = liveName
    ? liveName.split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase()
    : initials;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dashboardHref =
    user?.role === "admin"
      ? "/adminDashboard/dashboard"
      : user?.role === "business"
        ? "/businessDashboard/dashboard"
        : "/userDashboard/profile";

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/auth/login");
  };

  const handleAddBusiness = () => {
    if (!user) {
      toast.info("Please log in before adding your business.");
      router.push("/auth/login");
      return;
    }
    if (hasSubmittedBusiness()) {
      toast.info("You have already submitted a business profile. Checking its approval status.");
      router.push("/business-submitted");
      return;
    }
    router.push("/onboarding/grow");
  };

  return (
    <header className="sticky top-0 z-50 flex h-[72px] items-center gap-9 border-b border-[#f0f1f2] bg-white px-6 shadow-xs lg:px-[max(30px,calc((100vw-1400px)/2))]">
      <Link className="text-xl font-extrabold tracking-tight text-[#00663f] lg:text-[22px]" href="/#top">TrouveClients.fr</Link>
      <nav className="hidden h-full items-center gap-7 text-xs md:flex lg:text-[13px]" aria-label="Primary navigation">
        {navItems.map((item) => {
          const active = item.match !== null && pathname === item.match;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative grid h-full place-items-center font-bold hover:text-[#00663f] ${
                active
                  ? "text-[#00663f] after:absolute after:bottom-4 after:h-0.5 after:w-7 after:bg-[#00663f]"
                  : "text-black"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto hidden items-center gap-8 text-xs md:flex lg:text-[13px]">
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-[#00663f]/30 transition hover:ring-[#00663f]"
              aria-label="Account menu"
              aria-expanded={open}
            >
              {liveAvatar ? (
                <Image src={liveAvatar} alt={liveName || "Profile"} fill className="object-cover" unoptimized />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-[#00663f] text-sm font-semibold text-white">
                  {liveInitials || (user?.name?.charAt(0).toUpperCase()) || "?"}
                </span>
              )}
            </button>
            {open && (
              <div className="absolute right-0 top-11 z-50 w-52 rounded-lg border border-[#eef0f1] bg-white py-2 shadow-[0_8px_22px_#1a1a1a14]">
                <p className="truncate px-4 py-1.5 text-[11px] text-[#8b9292]">{user.email}</p>
                <Link
                  href={dashboardHref}
                  className="block px-4 py-2 text-xs font-semibold text-[#1c1d22] hover:bg-[#f2f2f5]"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-[#f2f2f5]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/auth/login">Sign in</Link>
        )}
        <button
          type="button"
          onClick={handleAddBusiness}
          className="rounded-lg bg-[#00663f] px-6 py-2.5 font-bold text-white"
        >
          Add Your Business
        </button>
      </div>

      <button className="ml-auto text-[#00663f] md:hidden" type="button" aria-label="Open navigation menu"><Menu size={20} /></button>
    </header>
  );
}
