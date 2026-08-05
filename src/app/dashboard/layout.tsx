"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[#5c6168]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7fa]">
      <header className="flex h-16 items-center justify-between border-b border-[#eef0f1] bg-white px-6">
        <span className="text-lg font-extrabold tracking-tight text-[#00663f]">TrouveClients.fr</span>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-[#5c6168]">
            {user.name} · <span className="capitalize">{user.role}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="rounded-md bg-[#00663f] px-4 py-2 font-bold text-white"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}
