"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight, FiBriefcase, FiLoader, FiMapPin, FiRefreshCw } from "react-icons/fi";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type Business = {
  _id: string;
  name?: string;
  ownerId?: string | { _id?: string; fullName?: string; email?: string };
  status?: string;
  contactInfo?: { email?: string };
  location?: { city?: string; address?: string };
};
type StatusAction = "APPROVED" | "REJECTED";

type BusinessResponse = {
  data?: {
    items?: Business[];
    meta?: { total?: number; page?: number; limit?: number; totalPages?: number };
  };
  items?: Business[];
};

function getBusinessData(payload: unknown) {
  const response = payload as BusinessResponse;
  return {
    items: response.data?.items || response.items || [],
    total: response.data?.meta?.total ?? 0,
  };
}

function getLocation(business: Business) {
  return business.location?.city || business.location?.address || "Location not provided";
}

function getOwnerLabel(ownerId: Business["ownerId"]) {
  if (!ownerId) return "Not assigned";
  if (typeof ownerId === "string") return ownerId;
  return ownerId.fullName || ownerId.email || ownerId._id || "Not assigned";
}

export default function BusinessProfiles() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingBusinessId, setUpdatingBusinessId] = useState("");

  const loadBusinesses = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await baseApi.get(ENDPOINTS.getAllBusinesses);
      const result = getBusinessData(response.data);
      setBusinesses(result.items);
      setTotal(result.total);
    } catch (requestError: unknown) {
      const message = (requestError as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || "Unable to load business profiles.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateBusinessStatus = async (businessId: string, status: StatusAction) => {
    setUpdatingBusinessId(businessId);
    setError("");
    try {
      await baseApi.patch(ENDPOINTS.updateStatus(businessId), { status });
      setBusinesses((current) => current.map((business) => business._id === businessId ? { ...business, status } : business));
    } catch (requestError: unknown) {
      const message = (requestError as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || "Unable to update business status.");
    } finally {
      setUpdatingBusinessId("");
    }
  };

  useEffect(() => {
    // Load the API-backed directory when the page mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadBusinesses();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00663f]">Directory</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Business Profiles</h1>
          <p className="mt-1 text-sm text-slate-500">Review business profile names and account details.</p>
        </div>
        <button
          type="button"
          onClick={() => void loadBusinesses()}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#00663f] hover:text-[#00663f] disabled:opacity-60"
        >
          <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e4f3ec] text-[#00663f]"><FiBriefcase /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Total profiles</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{total}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Loaded on this page</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{businesses.length}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-2xl bg-white p-12 text-[#00663f] shadow-sm"><FiLoader className="animate-spin text-xl" /></div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">{error}</div>
      ) : businesses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <FiBriefcase className="mx-auto text-3xl text-slate-300" />
          <h2 className="mt-4 text-lg font-bold text-slate-800">No business profiles found</h2>
          <p className="mt-1 text-sm text-slate-500">There are currently no business profiles to display.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Business name</th>
                  <th className="px-5 py-3 font-semibold">Owner</th>
                  <th className="px-5 py-3 font-semibold">Location</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((business) => (
                  <tr key={business._id} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{business.name || "Unnamed business"}</p>
                      <p className="mt-1 text-xs text-slate-400">{business.contactInfo?.email || "No email provided"}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{getOwnerLabel(business.ownerId)}</td>
                    <td className="px-5 py-4 text-slate-500"><span className="flex items-center gap-1.5"><FiMapPin />{getLocation(business)}</span></td>
                    <td className="px-5 py-4">
                      <select
                        value={business.status || ""}
                        onChange={(event) => {
                          const nextStatus = event.target.value as StatusAction;
                          if (nextStatus) void updateBusinessStatus(business._id, nextStatus);
                        }}
                        disabled={updatingBusinessId === business._id}
                        aria-label={`Update status for ${business.name || "business"}`}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/10 disabled:opacity-60"
                      >
                        <option value="" disabled>{business.status || "Select status"}</option>
                        <option value="APPROVED">Approve</option>
                        <option value="REJECTED">Reject</option>
                      </select>
                    </td>
                    <td className="px-5 py-4"><Link href={`/adminDashboard/businessProfiles/${business._id}`} className="inline-flex items-center gap-1.5 font-semibold text-[#00663f] hover:text-[#004f31]">View <FiArrowRight /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
