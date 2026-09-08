"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiClock, FiExternalLink, FiLoader, FiMapPin, FiXCircle } from "react-icons/fi";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type PendingBusiness = {
  _id: string;
  name?: string;
  logo?: string;
  coverImage?: string;
  description?: string;
  categoryId?: string | { name?: string };
  location?: { city?: string; address?: string };
  ownerId?: string | { fullName?: string; email?: string };
  status?: string;
};

type BusinessResponse = {
  data?: { items?: PendingBusiness[]; businesses?: PendingBusiness[]; result?: PendingBusiness[] | PendingBusiness; data?: unknown } | PendingBusiness[] | PendingBusiness;
  items?: PendingBusiness[];
  businesses?: PendingBusiness[];
  result?: PendingBusiness[] | PendingBusiness;
};

function getBusinesses(payload: unknown): PendingBusiness[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const response = payload as BusinessResponse;
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const nested = data as Exclude<BusinessResponse["data"], PendingBusiness[] | PendingBusiness>;
    if (nested.items) return nested.items;
    if (nested.businesses) return nested.businesses;
    if (nested.result) return Array.isArray(nested.result) ? nested.result : [nested.result];
    if (nested.data) return getBusinesses(nested.data);
  }
  if (response.items) return response.items;
  if (response.businesses) return response.businesses;
  if (response.result) return Array.isArray(response.result) ? response.result : [response.result];
  if ("_id" in response) return [response as PendingBusiness];
  return [];
}

function getLabel(value?: string | { name?: string; fullName?: string; email?: string }) {
  if (!value) return "Not provided";
  if (typeof value === "string") return value;
  return value.name || value.fullName || value.email || "Not provided";
}

export default function Pending() {
  const [businesses, setBusinesses] = useState<PendingBusiness[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const loadPending = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await baseApi.get(ENDPOINTS.allBusinessesProfile, { params: { page: 1, limit: 100 } });
      setBusinesses(getBusinesses(response.data));
    } catch (requestError: unknown) {
      const message = (requestError as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || "Unable to load pending approvals.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPending();
  }, []);

  const updateStatus = async (businessId: string, status: "APPROVED" | "REJECTED") => {
    setUpdatingId(businessId);
    try {
      await baseApi.patch(ENDPOINTS.updateStatus(businessId), { status });
      setBusinesses((current) => current.map((business) => business._id === businessId ? { ...business, status } : business));
    } catch (requestError: unknown) {
      const message = (requestError as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || "Unable to update business status.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Business Profiles</h1>
          <p className="mt-1 text-sm text-slate-500">Review and manage all registered business profiles.</p>
        </div>
        <button type="button" onClick={() => void loadPending()} disabled={isLoading} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-[#00663f] hover:text-[#00663f] disabled:opacity-60">
          <FiClock className={isLoading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {isLoading ? <div className="flex justify-center rounded-2xl bg-white p-12 text-[#00663f] shadow-sm"><FiLoader className="animate-spin text-xl" /></div> : error ? <div className="rounded-2xl bg-red-50 p-5 text-sm text-red-700">{error}</div> : businesses.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No pending approvals found.</div> : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => {
            const image = business.logo || business.coverImage;
            const category = getLabel(business.categoryId);
            const location = business.location?.city || business.location?.address || "Location not provided";
            return (
              <article key={business._id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="relative h-40 bg-[#e4f3ec]">
                  {image ? <Image src={image} alt={business.name || "Business"} fill className="object-cover" /> : <div className="grid h-full place-items-center text-3xl font-bold text-[#00663f]">{business.name?.charAt(0) || "B"}</div>}
                  <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${String(business.status).toUpperCase() === "APPROVED" ? "bg-[#e4f3ec] text-[#00663f]" : String(business.status).toUpperCase() === "REJECTED" ? "bg-[#fbeceb] text-[#c0524d]" : "bg-[#fff4dc] text-[#b17a3a]"}`}>{String(business.status || "UNKNOWN").replaceAll("_", " ")}</span>
                </div>
                <div className="p-5">
                  <h2 className="truncate text-base font-bold text-slate-900">{business.name || "Unnamed business"}</h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#00663f]">{category}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500"><FiMapPin /> {location}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{business.description || "No description provided."}</p>
                  <p className="mt-3 text-xs text-slate-400">Owner: {getLabel(business.ownerId)}</p>
                  <Link href={`/adminDashboard/businessProfiles/${business._id}`} className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#00663f] hover:underline">View <FiExternalLink /></Link>
                  <div className="mt-4 flex gap-3">
                    <button type="button" disabled={updatingId === business._id} onClick={() => void updateStatus(business._id, "APPROVED")} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00663f] py-2.5 text-sm font-semibold text-white hover:bg-[#004f31] disabled:opacity-60"><FiCheckCircle /> Approve</button>
                    <button type="button" disabled={updatingId === business._id} onClick={() => void updateStatus(business._id, "REJECTED")} aria-label={`Reject ${business.name || "business"}`} className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fde8e8] text-[#d9534f] hover:bg-[#fbd4d4] disabled:opacity-60"><FiXCircle /></button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
