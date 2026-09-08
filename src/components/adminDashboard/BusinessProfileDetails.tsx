"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiBriefcase, FiCalendar, FiCheckCircle, FiClock, FiGlobe, FiLoader, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type Business = {
  _id: string;
  name?: string;
  slug?: string;
  categoryId?: string | { name?: string };
  description?: string;
  logo?: string;
  coverImage?: string;
  gallery?: string[];
  status?: string;
  ownerId?: string | { _id?: string; fullName?: string; email?: string };
  contactInfo?: { email?: string; phone?: string; website?: string };
  location?: { city?: string; address?: string; postalCode?: string };
  socialLinks?: { facebook?: string; instagram?: string; linkedin?: string; x?: string; customLinks?: { platformName?: string; url?: string }[] };
  services?: string[];
  openingHours?: { day: string; open: string; close: string; isClosed: boolean }[];
  bookingConfig?: { isEnabled?: boolean; showModalImage?: boolean; modalImage?: string; templateType?: string; standardFields?: Record<string, string>; customFields?: { fieldName?: string; isRequired?: boolean }[]; allowSpecialRequests?: boolean; allowOccasions?: boolean; allowNewsletterOptIn?: boolean };
  averageRating?: number;
  reviewCount?: number;
  totalViews?: number;
  uniqueVisitors?: number;
  followerCount?: number;
  savedCount?: number;
  bookingClicks?: number;
  createdAt?: string;
  updatedAt?: string;
};

function getBusiness(payload: unknown) {
  const response = payload as { data?: { item?: Business; business?: Business; result?: Business } | Business; item?: Business; business?: Business };
  if (response.data && "_id" in response.data) return response.data;
  return response.data?.item || response.data?.business || response.data?.result || response.item || response.business;
}

function getOwnerLabel(ownerId: Business["ownerId"]) {
  if (!ownerId) return "Not assigned";
  if (typeof ownerId === "string") return ownerId;
  return ownerId.fullName || ownerId.email || ownerId._id || "Not assigned";
}

function getCategoryLabel(categoryId: Business["categoryId"]) {
  if (!categoryId) return "Not provided";
  return typeof categoryId === "string" ? categoryId : categoryId.name || "Not provided";
}

function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Not provided";
}

function getOwnerEmail(ownerId: Business["ownerId"]) {
  return typeof ownerId === "object" ? ownerId.email : undefined;
}
export default function BusinessProfileDetails() {
  const { businessId } = useParams<{ businessId: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!businessId) return;
    baseApi.get(ENDPOINTS.getSingleBusiness(businessId))
      .then((response) => setBusiness(getBusiness(response.data) || null))
      .catch((requestError: unknown) => {
        const message = (requestError as { response?: { data?: { message?: string } } }).response?.data?.message;
        setError(message || "Unable to load this business profile.");
      })
      .finally(() => setIsLoading(false));
  }, [businessId]);

  if (isLoading) return <div className="flex justify-center rounded-2xl bg-white p-12 text-[#00663f] shadow-sm"><FiLoader className="animate-spin text-xl" /></div>;
  if (error) return <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">{error}</div>;
  if (!business) return <div className="rounded-2xl bg-white p-8 text-sm text-slate-500 shadow-sm">Business profile not found.</div>;

  const location = [business.location?.address, business.location?.city, business.location?.postalCode].filter(Boolean).join(", ");
  const mediaUrl = (value?: string) => value || "";
  const socialLinks = [
    ["Facebook", business.socialLinks?.facebook],
    ["Instagram", business.socialLinks?.instagram],
    ["LinkedIn", business.socialLinks?.linkedin],
    ["X", business.socialLinks?.x],
    ...(business.socialLinks?.customLinks || []).map((link) => [link.platformName || "Link", link.url]),
  ].filter((link): link is [string, string] => Boolean(link[1]));

  return (
    <div className="space-y-6">
      <Link href="/adminDashboard/businessProfiles" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#00663f]"><FiArrowLeft />Back to business profiles</Link>
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="relative h-48 bg-[#dcebe4]">
          {business.coverImage ? <img src={mediaUrl(business.coverImage)} alt="Business cover" className="h-full w-full object-cover" /> : null}
          <div className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" />
          <div className="absolute bottom-5 left-5 flex items-end gap-4 text-white">
            <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-xl border-4 border-white bg-white text-2xl font-black text-[#00663f] shadow">
              {business.logo ? <img src={mediaUrl(business.logo)} alt={`${business.name || "Business"} logo`} className="h-full w-full object-cover" /> : <FiBriefcase />}
            </div>
            <div><p className="text-xs font-bold uppercase tracking-wide text-white/80">Business profile</p><h1 className="mt-1 text-2xl font-bold">{business.name || "Unnamed business"}</h1><p className="text-sm text-white/85">{getCategoryLabel(business.categoryId)} · {business.slug || "No slug"}</p></div>
          </div>
          <span className="absolute right-5 top-5 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#00663f]">{business.status || "Pending"}</span>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {[["Rating", business.averageRating ?? 0], ["Reviews", business.reviewCount ?? 0], ["Views", business.totalViews ?? 0], ["Followers", business.followerCount ?? 0]].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-xl font-bold text-slate-900">{Number(value).toLocaleString()}</p></div>)}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-base font-bold text-slate-900">About this business</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{business.description || "No description provided."}</p>
          <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Owner</p><p className="mt-1 text-sm font-semibold text-slate-800">{getOwnerLabel(business.ownerId)}</p><p className="text-xs text-slate-500">{getOwnerEmail(business.ownerId) || "No owner email"}</p></div>
            <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Created</p><p className="mt-1 flex items-center gap-2 text-sm text-slate-700"><FiCalendar />{formatDate(business.createdAt)}</p></div>
            <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</p><p className="mt-1 flex items-center gap-2 text-sm text-slate-700"><FiMapPin />{location || "Not provided"}</p></div>
            <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Last updated</p><p className="mt-1 flex items-center gap-2 text-sm text-slate-700"><FiClock />{formatDate(business.updatedAt)}</p></div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Contact</h2>
          <div className="mt-4 space-y-4 text-sm">
            <p className="flex items-start gap-2 text-slate-600"><FiMail className="mt-0.5 shrink-0 text-[#00663f]" />{business.contactInfo?.email || "Not provided"}</p>
            <p className="flex items-start gap-2 text-slate-600"><FiPhone className="mt-0.5 shrink-0 text-[#00663f]" />{business.contactInfo?.phone || "Not provided"}</p>
            <p className="flex items-start gap-2 break-all text-slate-600"><FiGlobe className="mt-0.5 shrink-0 text-[#00663f]" />{business.contactInfo?.website || "Not provided"}</p>
          </div>
          {socialLinks.length > 0 ? <div className="mt-5 border-t border-slate-100 pt-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Social links</p><div className="mt-2 space-y-2 text-sm">{socialLinks.map(([label, url]) => <p key={`${label}-${url}`} className="break-all text-slate-600"><span className="font-semibold text-slate-800">{label}:</span> {url}</p>)}</div></div> : null}
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Services</h2>
          <div className="mt-4 flex flex-wrap gap-2">{business.services?.length ? business.services.map((service) => <span key={service} className="rounded-full bg-[#e4f3ec] px-3 py-1.5 text-xs font-semibold text-[#00663f]">{service}</span>) : <p className="text-sm text-slate-500">No services provided.</p>}</div>
        </section>
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Opening hours</h2>
          <div className="mt-4 space-y-2 text-sm">{business.openingHours?.length ? business.openingHours.map((hour) => <div key={hour.day} className="flex items-center justify-between gap-3"><span className="font-semibold text-slate-700">{hour.day}</span><span className={hour.isClosed ? "text-slate-400" : "text-slate-600"}>{hour.isClosed ? "Closed" : `${hour.open} - ${hour.close}`}</span></div>) : <p className="text-slate-500">No opening hours provided.</p>}</div>
        </section>
      </div>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3"><h2 className="text-base font-bold text-slate-900">Booking configuration</h2><span className="flex items-center gap-1.5 text-xs font-semibold text-[#00663f]"><FiCheckCircle />{business.bookingConfig?.isEnabled ? "Enabled" : "Disabled"}</span></div>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-xs text-slate-400">Template</p><p className="mt-1 font-semibold text-slate-700">{business.bookingConfig?.templateType || "Not provided"}</p></div><div><p className="text-xs text-slate-400">Special requests</p><p className="mt-1 font-semibold text-slate-700">{business.bookingConfig?.allowSpecialRequests ? "Allowed" : "Off"}</p></div><div><p className="text-xs text-slate-400">Occasions</p><p className="mt-1 font-semibold text-slate-700">{business.bookingConfig?.allowOccasions ? "Allowed" : "Off"}</p></div><div><p className="text-xs text-slate-400">Newsletter</p><p className="mt-1 font-semibold text-slate-700">{business.bookingConfig?.allowNewsletterOptIn ? "Allowed" : "Off"}</p></div></div>
        {business.bookingConfig?.standardFields ? <div className="mt-5 border-t border-slate-100 pt-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Standard fields</p><div className="mt-3 flex flex-wrap gap-2">{Object.entries(business.bookingConfig.standardFields).map(([field, value]) => <span key={field} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600">{field}: {value}</span>)}</div></div> : null}
        {business.bookingConfig?.customFields?.length ? <div className="mt-5 border-t border-slate-100 pt-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Custom fields</p><div className="mt-3 flex flex-wrap gap-2">{business.bookingConfig.customFields.map((field) => <span key={field.fieldName} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600">{field.fieldName}: {field.isRequired ? "Required" : "Optional"}</span>)}</div></div> : null}
      </section>

      {business.gallery?.length ? <section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="text-base font-bold text-slate-900">Gallery</h2><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{business.gallery.map((image, index) => <img key={`${image}-${index}`} src={mediaUrl(image)} alt={`${business.name || "Business"} gallery ${index + 1}`} className="aspect-video w-full rounded-xl object-cover" />)}</div></section> : null}
    </div>
  );
}
