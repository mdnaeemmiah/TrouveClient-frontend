"use client";

import { useEffect, useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertCircle,
  FiFilter,
  FiMoreVertical,
  FiShield,
  FiUsers,
  FiBriefcase,
  FiEye,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import { toast } from "sonner";
import CustomSelect from "@/src/components/ui/CustomSelect";

type Role = "Business Owner" | "Customer" | "Admin";
type Status = "Active" | "Flagged" | "Banned";
type ApiRole = "CUSTOMER" | "BUSINESS_OWNER" | "ADMIN";
type ApiStatus = "ACTIVE" | "FLAGGED" | "BANNED";

type User = {
  name: string;
  id: string;
  apiId?: string;
  email: string;
  role: Role;
  joined: string;
  status: Status;
  initials: string;
  avatarBg: string;
  avatarColor: string;
};

const fallbackUsers: User[] = [
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

const statDefinitions: { label: string; key: "totalUsers" | "businessOwners" | "verifiedCustomers" | "flaggedOrBanned"; icon: IconType; iconBg: string; iconColor: string }[] = [
  { label: "Total Users", key: "totalUsers", icon: FiUsers, iconBg: "bg-[#e4f3ec]", iconColor: "text-[#00663f]" },
  { label: "Business Owners", key: "businessOwners", icon: FiBriefcase, iconBg: "bg-[#fdf1e2]", iconColor: "text-[#d99a3d]" },
  { label: "Verified Customers", key: "verifiedCustomers", icon: FiShield, iconBg: "bg-[#e5ecfb]", iconColor: "text-[#4a5fa5]" },
  { label: "Flagged/Banned", key: "flaggedOrBanned", icon: FiAlertCircle, iconBg: "bg-[#fbe2e2]", iconColor: "text-[#c0524d]" },
];

const tabs: { label: string; role: Role | "All" }[] = [
  { label: "All", role: "All" },
  { label: "Business Owners", role: "Business Owner" },
  { label: "Customers", role: "Customer" },
  { label: "Admins", role: "Admin" },
];

const statusStyles: Record<Status, string> = {
  Active: "text-[#00663f]",
  Flagged: "text-[#b17a3a]",
  Banned: "text-[#c0524d]",
};

const roleBadge: Record<Role, string> = {
  "Business Owner": "bg-[#fdf1e2] text-[#b17a3a]",
  Customer: "bg-slate-100 text-slate-500",
  Admin: "bg-[#e5ecfb] text-[#4a5fa5]",
};

type UsersResponse = {
  data?: {
    items?: Array<Record<string, unknown>>;
    meta?: { total?: number; totalPages?: number };
    stats?: Record<string, number>;
  };
  items?: Array<Record<string, unknown>>;
  meta?: { total?: number; totalPages?: number };
};

type UserDetails = {
  _id?: string;
  shortId?: string;
  fullName?: string;
  email?: string;
  role?: string;
  status?: string;
  isEmailVerified?: boolean;
  dateJoined?: string;
  createdAt?: string;
  savedBusinessesCount?: number;
  followingBusinessesCount?: number;
  ownedBusinesses?: { _id?: string; name?: string; slug?: string; status?: string; categoryId?: { name?: string } }[];
  recentBookings?: unknown[];
};

function parseUsers(payload: unknown): User[] {
  const response = payload as UsersResponse;
  const items = response.data?.items || response.items || [];
  return items.map((item, index) => {
    const role = String(item.role || "CUSTOMER").toUpperCase() as ApiRole;
    const status = String(item.status || "ACTIVE").toUpperCase() as ApiStatus;
    const displayRole: Role = role === "BUSINESS_OWNER" ? "Business Owner" : role === "ADMIN" ? "Admin" : "Customer";
    const displayStatus: Status = status === "FLAGGED" ? "Flagged" : status === "BANNED" ? "Banned" : "Active";
    return {
      name: String(item.fullName || "Unnamed user"),
      id: String(item.shortId || item._id || `#${index + 1}`),
      apiId: String(item._id || item.shortId || ""),
      email: String(item.email || "No email provided"),
      role: displayRole,
      joined: String(item.dateJoined || "Not provided"),
      status: displayStatus,
      initials: String(item.initials || String(item.fullName || "U").split(" ").map((part) => part[0]).join("").slice(0, 2)).toUpperCase(),
      avatarBg: displayRole === "Business Owner" ? "bg-[#fdf1e2]" : "bg-slate-100",
      avatarColor: displayRole === "Business Owner" ? "text-[#b17a3a]" : "text-slate-500",
    };
  });
}

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<Role | "All">("All");
  const [statusFilter, setStatusFilter] = useState<ApiStatus | "">("");
  const [users, setUsers] = useState<User[]>(fallbackUsers);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userStats, setUserStats] = useState<Record<string, number>>({});
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusTarget, setStatusTarget] = useState<{ user: User; status: ApiStatus } | null>(null);
  const [statusReason, setStatusReason] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    baseApi.get(ENDPOINTS.stateAdmin)
      .then((response) => {
        const stats = response.data?.data ?? response.data;
        setUserStats(stats || {});
      })
      .catch(() => setUserStats({}));
  }, []);

  useEffect(() => {
    const role = activeTab === "All" ? undefined : activeTab === "Business Owner" ? "BUSINESS_OWNER" : activeTab === "Admin" ? "ADMIN" : "CUSTOMER";
    baseApi.get(ENDPOINTS.allUsers, { params: { page, limit, ...(role ? { role } : {}), ...(statusFilter ? { status: statusFilter } : {}) } })
      .then((response) => {
        const payload = response.data?.data ?? response.data;
        const parsed = parseUsers(payload);
        setUsers(parsed);
        setTotalUsers(payload?.meta?.total ?? parsed.length);
      })
      .catch(() => {
        setUsers([]);
        setTotalUsers(0);
      });
  }, [activeTab, page, limit, statusFilter]);

  const stats = statDefinitions.map((stat) => ({
    ...stat,
    value: (userStats[stat.key] ?? 0).toLocaleString(),
  }));

  const filteredUsers = useMemo(() => users, [users]);

  const viewUser = async (user: User) => {
    setOpenActionId(null);
    setIsLoadingDetails(true);
    try {
      const response = await baseApi.get(ENDPOINTS.UserDetails(user.apiId || user.id.replace(/^#/, "")));
      const payload = response.data?.data ?? response.data;
      setSelectedUser({ ...(payload?.user ?? payload), ownedBusinesses: payload?.ownedBusinesses ?? [], recentBookings: payload?.recentBookings ?? [] });
    } catch {
      toast.error("Unable to load user details.");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await baseApi.delete(ENDPOINTS.userDelete(userToDelete.apiId || userToDelete.id.replace(/^#/, "")));
      setUsers((current) => current.filter((user) => user.id !== userToDelete.id));
      setTotalUsers((current) => Math.max(0, current - 1));
      toast.success("User deleted successfully.");
      setUserToDelete(null);
    } catch {
      toast.error("Unable to delete this user.");
    } finally {
      setIsDeleting(false);
    }
  };

  const updateUserStatus = async (user: User, status: ApiStatus, reason = "") => {
    setIsUpdatingStatus(true);
    try {
      await baseApi.patch(ENDPOINTS.ChangeUserStatus(user.apiId || user.id.replace(/^#/, "")), {
        status,
        ...(reason.trim() ? { reason: reason.trim() } : {}),
      });
      setUsers((current) => current.map((item) => item.id === user.id ? { ...item, status: status === "FLAGGED" ? "Flagged" : status === "BANNED" ? "Banned" : "Active" } : item));
      toast.success("User status updated successfully.");
      setStatusTarget(null);
      setStatusReason("");
    } catch {
      toast.error("Unable to update user status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600">
              <FiFilter className="text-[14px]" />
              <CustomSelect
                value={statusFilter}
                onChange={(val) => { setStatusFilter(val as ApiStatus | ""); setPage(1); }}
                placeholder="All statuses"
                options={[
                  { value: "", label: "All statuses" },
                  { value: "ACTIVE", label: "Active" },
                  { value: "FLAGGED", label: "Flagged" },
                  { value: "BANNED", label: "Banned" },
                ]}
                className="w-36"
              />
            </div>

            <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.role}
                  type="button"
                  onClick={() => { setActiveTab(tab.role); setPage(1); }}
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
            Showing {filteredUsers.length ? (page - 1) * limit + 1 : 0}-{(page - 1) * limit + filteredUsers.length} of {(totalUsers || userStats.totalUsers || 0).toLocaleString()} users
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
                  <td className="relative py-3">
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
                    <CustomSelect
                      value={user.status.toUpperCase()}
                      onChange={(val) => {
                        const nextStatus = val as ApiStatus;
                        if (nextStatus === "FLAGGED" || nextStatus === "BANNED") setStatusTarget({ user, status: nextStatus });
                        else void updateUserStatus(user, nextStatus);
                      }}
                      options={[
                        { value: "ACTIVE", label: "Active" },
                        { value: "FLAGGED", label: "Flagged" },
                        { value: "BANNED", label: "Banned" },
                      ]}
                      className={`w-32 text-xs ${statusStyles[user.status]}`}
                    />
                  </td>
                  <td className="py-3">
                    <button type="button" onClick={() => setOpenActionId((current) => current === user.id ? null : user.id)} aria-label={`Actions for ${user.name}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                      <FiMoreVertical className="text-[16px]" />
                    </button>
                    {openActionId === user.id && (
                      <div className="absolute z-20 mt-1 w-32 rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
                        <button type="button" onClick={() => void viewUser(user)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"><FiEye /> View</button>
                        <button type="button" onClick={() => { setUserToDelete(user); setOpenActionId(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"><FiTrash2 /> Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(totalUsers || filteredUsers.length) > limit && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <label className="flex items-center gap-2 text-sm text-slate-500">
            Per page
            <CustomSelect
              value={String(limit)}
              onChange={(val) => { setLimit(Number(val)); setPage(1); }}
              options={[
                { value: "10", label: "10" },
                { value: "25", label: "25" },
                { value: "50", label: "50" },
              ]}
              className="w-20"
            />
          </label>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>Page {page} of {Math.max(1, Math.ceil((totalUsers || filteredUsers.length) / limit))}</span>
            <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold disabled:opacity-40">Previous</button>
            <button type="button" disabled={page >= Math.ceil((totalUsers || filteredUsers.length) / limit)} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      {(selectedUser || isLoadingDetails) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !isLoadingDetails && setSelectedUser(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">User Details</h2><button type="button" onClick={() => setSelectedUser(null)} aria-label="Close user details"><FiX /></button></div>
            {isLoadingDetails ? <p className="mt-6 text-sm text-slate-500">Loading user details...</p> : <div className="mt-5 space-y-3 text-sm"><p><span className="font-semibold text-slate-500">Name:</span> {selectedUser?.fullName || "Not provided"}</p><p><span className="font-semibold text-slate-500">Email:</span> {selectedUser?.email || "Not provided"}</p><p><span className="font-semibold text-slate-500">Role:</span> {selectedUser?.role || "Not provided"}</p><p><span className="font-semibold text-slate-500">Status:</span> {selectedUser?.status || "Not provided"}</p><p><span className="font-semibold text-slate-500">Email verified:</span> {selectedUser?.isEmailVerified ? "Yes" : "No"}</p><p><span className="font-semibold text-slate-500">Joined:</span> {selectedUser?.dateJoined || selectedUser?.createdAt || "Not provided"}</p><div className="border-t border-slate-100 pt-3"><p className="font-semibold text-slate-700">Owned businesses ({selectedUser?.ownedBusinesses?.length || 0})</p>{selectedUser?.ownedBusinesses?.length ? <div className="mt-2 space-y-2">{selectedUser.ownedBusinesses.map((business) => <div key={business._id || business.slug} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"><span className="font-medium text-slate-700">{business.name || "Unnamed business"}</span><span className="text-xs text-slate-500">{business.status || "Unknown"}</span></div>)}</div> : <p className="mt-1 text-slate-500">No owned businesses.</p>}</div><p><span className="font-semibold text-slate-500">Recent bookings:</span> {selectedUser?.recentBookings?.length || 0}</p></div>}
          </div>
        </div>
      )}

      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !isDeleting && setUserToDelete(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-900">Delete user?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Are you sure you want to delete {userToDelete.name}? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3"><button type="button" disabled={isDeleting} onClick={() => setUserToDelete(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-50">Cancel</button><button type="button" disabled={isDeleting} onClick={() => void deleteUser()} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{isDeleting ? "Deleting..." : "Delete"}</button></div>
          </div>
        </div>
      )}

      {statusTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !isUpdatingStatus && setStatusTarget(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-900">Update user status</h2>
            <p className="mt-2 text-sm text-slate-500">Set {statusTarget.user.name} to {statusTarget.status.toLowerCase()}.</p>
            <label className="mt-4 block text-sm font-semibold text-slate-700">Reason <span className="font-normal text-slate-400">(optional)</span><textarea value={statusReason} onChange={(event) => setStatusReason(event.target.value)} rows={3} placeholder="Add a note for this status change" className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-[#00663f]" /></label>
            <div className="mt-5 flex justify-end gap-3"><button type="button" disabled={isUpdatingStatus} onClick={() => setStatusTarget(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-50">Cancel</button><button type="button" disabled={isUpdatingStatus} onClick={() => void updateUserStatus(statusTarget.user, statusTarget.status, statusReason)} className="rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{isUpdatingStatus ? "Saving..." : "Save status"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
