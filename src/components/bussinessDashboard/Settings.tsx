"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { FiBriefcase, FiCheckCircle, FiClock, FiGlobe, FiImage, FiInfo, FiMapPin, FiPhone, FiShield } from "react-icons/fi";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import { useAuth } from "@/src/context/AuthContext";
import type { OnboardingFormData } from "@/src/context/OnboardingContext";

type BusinessProfile = Omit<Partial<OnboardingFormData>, "location"> & {
  _id?: string;
  slug?: string;
  status?: string;
  isApproved?: boolean;
  averageRating?: number;
  reviewCount?: number;
  totalViews?: number;
  uniqueVisitors?: number;
  location?: Partial<OnboardingFormData["location"]> & { coordinates?: unknown };
};

function extractBusinesses(response: unknown): BusinessProfile[] {
  const payload = response as { businesses?: BusinessProfile[]; data?: { businesses?: BusinessProfile[] } };
  return payload.businesses || payload.data?.businesses || [];
}

function valueOrFallback(value: unknown) {
  return value ? String(value) : "Not provided";
}

function getMediaUrl(value: string | undefined) {
  if (!value) return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return value;
  try {
    return new URL(value, apiUrl).toString();
  } catch {
    return value;
  }
}

function formatCoordinates(location: BusinessProfile["location"]) {
  const coordinates = location?.coordinates;
  if (Array.isArray(coordinates)) return coordinates.join(", ");
  if (coordinates && typeof coordinates === "object") {
    const nested = (coordinates as { coordinates?: unknown }).coordinates;
    if (Array.isArray(nested)) return nested.join(", ");
  }
  if (typeof coordinates === "string") return coordinates;
  if (location?.latitude != null && location?.longitude != null) {
    return `${location.latitude}, ${location.longitude}`;
  }
  return "Not provided";
}

export default function Settings() {
  const { user } = useAuth();
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    baseApi.get(ENDPOINTS.getBusinesses)
      .then((response) => {
        if (!isMounted) return;
        const businesses = extractBusinesses(response.data);
        const matchedBusiness = businesses.find((item) => item.contactInfo?.email === user?.email) || businesses[0];
        setBusiness(matchedBusiness || null);
      })
      .catch(() => { if (isMounted) setError("Unable to load your business profile right now."); })
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, [user?.email]);

  if (isLoading) return <div className="rounded-2xl bg-white p-8 text-sm text-slate-500 shadow-sm">Loading business profile...</div>;
  if (error) return <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">{error}</div>;
  if (!business) return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">No business profile found.</div>;

  const location = business.location;
  const contact = business.contactInfo;
  const hours = business.openingHours || [];
  const booking = business.bookingConfig;

  return (
    <div className="space-y-6">
      <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00663f]">Business profile</p><h1 className="mt-2 text-2xl font-black text-slate-950">Settings &amp; preferences</h1><p className="mt-1 text-sm text-slate-500">All profile information received from your business account.</p></div>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="relative h-40 bg-[#dcebe4]">{business.coverImage ? <><span className="sr-only">Business cover image</span><img src={getMediaUrl(business.coverImage)} alt="Business cover" className="h-full w-full object-cover" /></> : null}<div className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent" /><div className="absolute bottom-4 left-5 flex items-end gap-3 text-white"><div className="grid h-16 w-16 place-items-center overflow-hidden rounded-xl border-4 border-white bg-white text-2xl font-black text-[#00663f] shadow">{business.logo ? <img src={getMediaUrl(business.logo)} alt="Business logo" className="h-full w-full object-cover" /> : business.name?.charAt(0) || "B"}</div><div><h2 className="text-xl font-bold">{valueOrFallback(business.name)}</h2><p className="text-sm text-white/85">{valueOrFallback(business.categoryName || business.categoryId)}</p></div></div></div>
        <div className="grid gap-4 p-5 sm:grid-cols-4"><div><p className="text-xs text-slate-500">Status</p><p className="mt-1 flex items-center gap-1.5 font-bold text-[#00663f]"><FiCheckCircle />{valueOrFallback(business.status)}</p></div><div><p className="text-xs text-slate-500">Rating</p><p className="mt-1 font-bold text-slate-800">{valueOrFallback(business.averageRating)}</p></div><div><p className="text-xs text-slate-500">Reviews</p><p className="mt-1 font-bold text-slate-800">{valueOrFallback(business.reviewCount)}</p></div><div><p className="text-xs text-slate-500">Approved</p><p className="mt-1 font-bold text-slate-800">{business.isApproved ? "Yes" : "Pending"}</p></div></div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-bold text-slate-950"><FiBriefcase className="text-[#00663f]" /> Basic information</h2><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-xs text-slate-500">Business name</dt><dd className="mt-1 font-semibold text-slate-800">{valueOrFallback(business.name)}</dd></div><div><dt className="text-xs text-slate-500">Description</dt><dd className="mt-1 leading-6 text-slate-700">{valueOrFallback(business.description)}</dd></div><div><dt className="text-xs text-slate-500">Slug</dt><dd className="mt-1 text-slate-700">{valueOrFallback(business.slug)}</dd></div></dl></section>
        <section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-bold text-slate-950"><FiPhone className="text-[#00663f]" /> Contact information</h2><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-xs text-slate-500">Phone</dt><dd className="mt-1 font-semibold text-slate-800">{valueOrFallback(contact?.phone)}</dd></div><div><dt className="text-xs text-slate-500">Email</dt><dd className="mt-1 break-all text-slate-700">{valueOrFallback(contact?.email)}</dd></div><div><dt className="text-xs text-slate-500">Website</dt><dd className="mt-1 break-all text-slate-700">{valueOrFallback(contact?.website)}</dd></div></dl></section>
        <section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-bold text-slate-950"><FiMapPin className="text-[#00663f]" /> Location</h2><p className="mt-5 text-sm leading-6 text-slate-700">{[location?.address, location?.postalCode, location?.city].filter(Boolean).join(", ") || "Not provided"}</p><p className="mt-3 text-xs text-slate-500">Coordinates: {formatCoordinates(location)}</p></section>
        <section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-bold text-slate-950"><FiGlobe className="text-[#00663f]" /> Social links</h2><div className="mt-5 space-y-3 text-sm">{Object.entries(business.socialLinks || {}).filter(([, value]) => typeof value === "string" && value).map(([key, value]) => <p key={key}><span className="capitalize text-slate-500">{key}:</span> <span className="text-slate-800">{value}</span></p>)}{!Object.values(business.socialLinks || {}).some((value) => typeof value === "string" && value) && <p className="text-slate-500">Not provided</p>}</div></section>
        <section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-bold text-slate-950"><FiClock className="text-[#00663f]" /> Opening hours</h2><div className="mt-5 space-y-2 text-sm">{hours.length ? hours.map((hour) => <div key={hour.day} className="flex justify-between gap-4"><span className="text-slate-500">{hour.day}</span><span className="font-semibold text-slate-800">{hour.isClosed ? "Closed" : `${hour.open} - ${hour.close}`}</span></div>) : <p className="text-slate-500">Not provided</p>}</div></section>
        <section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-bold text-slate-950"><FiImage className="text-[#00663f]" /> Media &amp; services</h2><p className="mt-5 text-sm text-slate-700">Gallery: {business.gallery?.length || 0} photo(s)</p>{business.gallery?.length ? <div className="mt-4 grid grid-cols-2 gap-3">{business.gallery.map((image, index) => <div key={`${image}-${index}`} className="aspect-video overflow-hidden rounded-xl bg-slate-100"><img src={getMediaUrl(image)} alt={`${business.name || "Business"} gallery ${index + 1}`} className="h-full w-full object-cover transition duration-300 hover:scale-105" /></div>)}</div> : <p className="mt-3 text-sm text-slate-500">No gallery images provided.</p>}<p className="mt-4 text-sm text-slate-700">Services: {business.services?.join(", ") || "Not provided"}</p></section>
      </div>

      <section className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-bold text-slate-950"><FiShield className="text-[#00663f]" /> Booking configuration</h2><div className="mt-5 grid gap-4 text-sm sm:grid-cols-3"><p><span className="block text-xs text-slate-500">Online bookings</span><b>{booking?.isEnabled ? "Enabled" : "Disabled"}</b></p><p><span className="block text-xs text-slate-500">Special requests</span><b>{booking?.allowSpecialRequests ? "Allowed" : "Off"}</b></p><p><span className="block text-xs text-slate-500">Occasions</span><b>{booking?.allowOccasions ? "Allowed" : "Off"}</b></p></div></section>
      <p className="flex items-center gap-2 text-xs text-slate-500"><FiInfo className="text-[#00663f]" /> Profile data is loaded from the businesses API. Editing requires a backend update endpoint.</p>
    </div>
  );
}
