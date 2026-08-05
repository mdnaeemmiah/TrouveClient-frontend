"use client";

import { useAuth } from "@/src/context/AuthContext";

const COPY: Record<string, { title: string; description: string }> = {
  admin: {
    title: "Admin Dashboard",
    description: "Manage users, businesses, and platform settings.",
  },
  business: {
    title: "Business Dashboard",
    description: "Manage your listing, view leads, and track performance.",
  },
  customer: {
    title: "Customer Dashboard",
    description: "Browse businesses, track requests, and manage your profile.",
  },
};

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const { title, description } = COPY[user.role];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1c1d22]">{title}</h1>
      <p className="mt-2 text-sm text-[#5c6168]">{description}</p>
    </div>
  );
}
