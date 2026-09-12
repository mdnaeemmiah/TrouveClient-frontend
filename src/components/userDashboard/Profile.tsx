"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiBookmark,
  FiCheckCircle,
  FiMapPin,
  FiStar,
} from "react-icons/fi";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type BusinessItem = {
  id: string;
  slug?: string;
  image?: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  verified: boolean;
};

function parseBusinesses(payload: unknown): BusinessItem[] {
  const response = payload as { data?: unknown; items?: unknown; businesses?: unknown };
  const data = response?.data;
  const candidates = Array.isArray(data)
    ? data
    : Array.isArray(response?.items)
      ? response.items
      : Array.isArray(response?.businesses)
        ? response.businesses
        : data && typeof data === "object"
          ? parseBusinesses(data)
          : Array.isArray(payload)
            ? payload
            : [];

  return candidates.slice(0, 3).map((entry, index) => {
    const item = entry as Record<string, unknown>;
    const nested = (item.business ?? item.businessId ?? item) as Record<string, unknown>;
    const location = nested.location as { city?: string; address?: string } | undefined;
    const category = nested.categoryId as { name?: string } | string | undefined;
    const rawId = nested._id ?? nested.id ?? nested.slug ?? item._id ?? item.id;

    return {
      id: String(rawId ?? `business-${index}`),
      slug: typeof nested.slug === "string" ? nested.slug : undefined,
      image: typeof nested.logo === "string" ? nested.logo : typeof nested.coverImage === "string" ? nested.coverImage : undefined,
      name: String(nested.name ?? "Unnamed business"),
      category: typeof category === "string" ? category : category?.name ?? "Business",
      location: String(location?.city ?? location?.address ?? "Location not provided"),
      rating: Number(nested.averageRating ?? nested.rating ?? 0),
      verified: Boolean(nested.verified ?? nested.isVerified),
    };
  });
}

export default function Profile() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState<BusinessItem[]>([]);
  const [recentItems, setRecentItems] = useState<BusinessItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      baseApi.get(ENDPOINTS.getUserProfile),
      baseApi.get(ENDPOINTS.getSavedBusinesses),
      baseApi.get(ENDPOINTS.recentlyVisited),
    ])
      .then(([userResult, savedResult, recentResult]) => {
        if (!isMounted) return;
        if (userResult.status === "fulfilled") {
          const userPayload = userResult.value.data?.data ?? userResult.value.data;
          setCurrentUser(userPayload?.fullName ?? userPayload?.name ?? userPayload?.email ?? null);
        }
        if (savedResult.status === "fulfilled") setSavedItems(parseBusinesses(savedResult.value.data));
        if (recentResult.status === "fulfilled") setRecentItems(parseBusinesses(recentResult.value.data));
        if (savedResult.status === "rejected" || recentResult.status === "rejected") {
          setHasError(true);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const renderImage = (item: BusinessItem, className: string) => item.image ? (
    <Image src={item.image} alt={item.name} fill className={className} />
  ) : (
    <div className="grid h-full w-full place-items-center bg-[#e4f3ec] text-2xl font-bold text-[#00663f]">
      {item.name.charAt(0)}
    </div>
  );

  const renderStatus = () => {
    if (isLoading) return <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">Loading businesses...</div>;
    if (hasError) return <div className="rounded-2xl bg-white p-8 text-center text-sm text-red-500 shadow-sm">Unable to load businesses right now.</div>;
    return null;
  };

  return (
    <div className="space-y-8">
      {/* <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {currentUser ? `Bonjour, ${currentUser}` : isLoading ? "Loading profile..." : "Unable to load profile"} {currentUser && "👋"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back to your dashboard. Here&apos;s what&apos;s been happening.</p>
      </div> */}

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recently Visited</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#00663f]">Last 3</span>
        </div>

        <div className="mt-4">
          {renderStatus()}
          {!isLoading && !hasError && recentItems.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#c7d8cd] bg-white p-8 text-center text-sm text-slate-500">No recently visited businesses yet.</div>
          )}
          {!isLoading && !hasError && recentItems.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {recentItems.map((item) => (
                <Link key={item.id} href={`/feature/${item.slug || item.id}`} className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="relative h-40 overflow-hidden bg-[#e4f3ec]">
                    {renderImage(item, "h-full w-full object-cover transition duration-500 group-hover:scale-105")}
                    {item.verified && <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#00663f] px-2.5 py-1 text-[10px] font-bold text-white"><FiCheckCircle /> Verified</span>}
                  </div>
                  <div className="p-4">
                    <p className="truncate text-base font-bold text-slate-900">{item.name}</p>
                    <p className="mt-1 truncate text-xs font-medium uppercase tracking-wide text-[#00663f]">{item.category}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex min-w-0 items-center gap-1 truncate"><FiMapPin /> {item.location}</span>
                      <span className="ml-2 flex shrink-0 items-center gap-1"><FiStar className="text-[#e1a52b]" /> {item.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Saved for Later</h2>
            <span className="rounded-full bg-[#e4f3ec] px-2.5 py-1 text-xs font-semibold text-[#00663f]">{savedItems.length} of 3</span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#00663f]">Last 3</span>
        </div>

        <div className="mt-4">
          {renderStatus()}
          {!isLoading && !hasError && savedItems.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#c7d8cd] bg-white p-8 text-center text-sm text-slate-500">No saved businesses yet.</div>
          )}
          {!isLoading && !hasError && savedItems.length > 0 && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {savedItems.map((item) => (
                <Link key={item.id} href={`/feature/${item.slug || item.id}`} className="group flex items-center gap-3 rounded-2xl border border-transparent bg-white p-3 shadow-sm transition hover:border-[#b9d8c7] hover:shadow-md">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#e4f3ec]">{renderImage(item, "h-full w-full object-cover")}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">{item.category}</p>
                    <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-400"><FiMapPin /> {item.location}</p>
                  </div>
                  <FiBookmark className="shrink-0 text-[#00663f]" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity is intentionally omitted here; this dashboard prioritizes live business data. */}
      {/* <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Saved for Later</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
              {savedItems.length} items
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {savedItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {item.category} · {item.location}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${item.name} from saved`}
                  className="shrink-0 text-[#00663f] transition-colors hover:text-[#004f31]"
                >
                  <FiBookmark className="text-[16px] fill-current" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div> */}
    </div>
  );
}
