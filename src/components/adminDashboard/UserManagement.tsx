"use client";

import { useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertCircle,
  FiFilter,
  FiMoreVertical,
  FiShield,
  FiUsers,
  FiBriefcase,
} from "react-icons/fi";

type Role = "Business Owner" | "Customer";
type Status = "Active" | "Flagged" | "Banned";

type User = {
  name: string;
  id: string;
  email: string;
  role: Role;
  joined: string;
  status: Status;
  initials: string;
  avatarBg: string;
  avatarColor: string;
};

const users: User[] = [
  {
    name: "Amélie Durand",
    id: "#82910",
    email: "amelie.durand@example.fr",
    role: "Business Owner",
    joined: "Oct 12, 2023",
    status: "Active",
    initials: "AD",
    avatarBg: "bg-[#fbe2e2]",
    avatarColor: "text-[#c0524d]",
  },
  {
    name: "Jean-Pierre Bernard",
    id: "#91023",
    email: "jp.bernard@outlook.fr",
    role: "Customer",
    joined: "Nov 05, 2023",
    status: "Active",
    initials: "JB",
    avatarBg: "bg-[#e0e7f5]",
    avatarColor: "text-[#4a5fa5]",
  },
  {
    name: "Lucie Moreau",
    id: "#77432",
    email: "lucie.moreau@design.com",
    role: "Business Owner",
    joined: "Jan 18, 2024",
    status: "Flagged",
    initials: "LM",
    avatarBg: "bg-[#f6e2d0]",
    avatarColor: "text-[#b17a3a]",
  },
  {
    name: "Mathieu Kasov",
    id: "#10022",
    email: "mk.dev@services.fr",
    role: "Customer",
    joined: "Feb 01, 2024",
    status: "Banned",
    initials: "MK",
    avatarBg: "bg-slate-200",
    avatarColor: "text-slate-500",
  },
  {
    name: "Olivier Blanc",
    id: "#44921",
    email: "o.blanc@boulangerie.fr",
    role: "Business Owner",
    joined: "Feb 15, 2024",
    status: "Active",
    initials: "OB",
    avatarBg: "bg-[#e4f3ec]",
    avatarColor: "text-[#00663f]",
  },
];

const stats: { label: string; value: string; icon: IconType; iconBg: string; iconColor: string }[] = [
  { label: "Total Users", value: "12,482", icon: FiUsers, iconBg: "bg-[#e4f3ec]", iconColor: "text-[#00663f]" },
  { label: "Business Owners", value: "3,120", icon: FiBriefcase, iconBg: "bg-[#fdf1e2]", iconColor: "text-[#d99a3d]" },
  { label: "Verified Customers", value: "9,362", icon: FiShield, iconBg: "bg-[#e5ecfb]", iconColor: "text-[#4a5fa5]" },
  { label: "Flagged/Banned", value: "45", icon: FiAlertCircle, iconBg: "bg-[#fbe2e2]", iconColor: "text-[#c0524d]" },
];

const tabs: { label: string; role: Role | "All" }[] = [
  { label: "All", role: "All" },
  { label: "Business Owners", role: "Business Owner" },
  { label: "Customers", role: "Customer" },
];

const statusStyles: Record<Status, string> = {
  Active: "text-[#00663f]",
  Flagged: "text-[#b17a3a]",
  Banned: "text-[#c0524d]",
};

const statusDot: Record<Status, string> = {
  Active: "bg-[#00663f]",
  Flagged: "bg-[#b17a3a]",
  Banned: "bg-[#c0524d]",
};

const roleBadge: Record<Role, string> = {
  "Business Owner": "bg-[#fdf1e2] text-[#b17a3a]",
  Customer: "bg-slate-100 text-slate-500",
};

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<Role | "All">("All");

  const filteredUsers = useMemo(
    () => (activeTab === "All" ? users : users.filter((user) => user.role === activeTab)),
    [activeTab],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review, moderate, and manage all users registered on the Motor Bridge platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                <Icon className={`text-[18px] ${stat.iconColor}`} />
              </span>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <FiFilter className="text-[14px]" />
              Filter
            </button>

            <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.role}
                  type="button"
                  onClick={() => setActiveTab(tab.role)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    activeTab === tab.role
                      ? "bg-[#00663f] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-400">
            Showing 1-{filteredUsers.length} of 12,482 users
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                <th className="pb-3 font-medium">User Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Joined Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${user.avatarBg} ${user.avatarColor}`}
                      >
                        {user.initials}
                      </span>
                      <div>
                        <p className="font-medium text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-400">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-slate-500">{user.email}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${roleBadge[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{user.joined}</td>
                  <td className="py-3">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${statusStyles[user.status]}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${statusDot[user.status]}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                      <FiMoreVertical className="text-[16px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
