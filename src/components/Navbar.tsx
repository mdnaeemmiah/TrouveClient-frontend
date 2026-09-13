"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { useProfileAvatar } from "@/src/hooks/useProfileAvatar";
import AddBusinessButton from "./AddBusinessButton";
import logo from "../assets/auth/image.png";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <header className="sticky top-0 z-50 flex h-[72px] items-center gap-9 border-b border-[#f0f1f2] bg-white px-6 shadow-xs lg:px-[max(30px,calc((100vw-1400px)/2))]">
      <Link className="flex h-12 w-[210px] shrink-0 items-center" href="/#top" aria-label="TrouveClients.fr home">
        <Image src={logo} alt="TrouveClients.fr" width={280} height={130} className="h-full w-full object-contain" priority unoptimized />
      </Link>
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
        <AddBusinessButton
          className="rounded-lg bg-[#00663f] px-6 py-2.5 font-bold text-white"
        >
          Add Your Business
        </AddBusinessButton>
      </div>

      <div className="relative ml-auto flex items-center gap-3 md:hidden">
        {user && (
          <button
            type="button"
            onClick={() => { setMobileMenuOpen(false); router.push(dashboardHref); }}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-[#00663f]/30"
            aria-label="Profile"
          >
            {liveAvatar ? (
              <Image src={liveAvatar} alt={liveName || "Profile"} fill className="object-cover" unoptimized />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-[#00663f] text-sm font-semibold text-white">
                {liveInitials || user.name?.charAt(0).toUpperCase() || "?"}
              </span>
            )}
          </button>
        )}
        <button
          className="text-[#00663f]"
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          aria-label="Open navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <Menu size={22} />
        </button>

        {mobileMenuOpen && (
          <div className="absolute right-0 top-12 z-50 w-60 rounded-xl border border-[#eef0f1] bg-white p-2 shadow-[0_8px_22px_#1a1a1a14]">
            <nav className="border-b border-[#eef0f1] pb-2" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    item.match !== null && pathname === item.match
                      ? "bg-[#e4f3ec] text-[#00663f]"
                      : "text-[#1c1d22] hover:bg-[#f2f2f5]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[#1c1d22] hover:bg-[#f2f2f5]"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-[#f2f2f5]"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[#1c1d22] hover:bg-[#f2f2f5]"
              >
                Sign in
              </Link>
            )}
            <AddBusinessButton
              className="mt-2 w-full rounded-lg bg-[#00663f] px-4 py-2.5 text-sm font-bold text-white"
            >
              Add Your Business
            </AddBusinessButton>
          </div>
        )}
      </div>
    </header>
  );
}
