"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

const navItems: { label: string; href: string; match: string | null }[] = [
  { label: "Home", href: "home", match: "/" },
  { label: "About Us", href: "/#categories", match: null },
  { label: "Search", href: "/search", match: "/search" },
  { label: "Feed", href: "/feed", match: "/feed" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
        : "/userDashboard/dashboard";

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/auth/login");
  };

  return (
    <header className="flex h-[72px] items-center gap-9 border-b border-[#f0f1f2] bg-white px-6 lg:px-[max(30px,calc((100vw-1400px)/2))]">
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
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00663f] text-white"
              aria-label="Account menu"
              aria-expanded={open}
            >
              <User size={16} />
            </button>
            {open && (
              <div className="absolute right-0 top-11 w-52 rounded-lg border border-[#eef0f1] bg-white py-2 shadow-[0_8px_22px_#1a1a1a14]">
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
        <Link
          className="rounded-lg bg-[#00663f] px-6 py-2.5 font-bold text-white"
          href={user ? "/auth/register" : "/auth/login"}
        >
          Add Your Business
        </Link>
      </div>

      <button className="ml-auto text-[#00663f] md:hidden" type="button" aria-label="Open navigation menu"><Menu size={20} /></button>
    </header>
  );
}
