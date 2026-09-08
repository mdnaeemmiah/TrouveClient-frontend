"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronDown, FiHeart, FiStar } from "react-icons/fi";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type Category = "All" | "Restaurants" | "Services" | "Shops";

const categories: Category[] = ["All", "Restaurants", "Services", "Shops"];

type SavedBusiness = {
  id: string;
  slug?: string;
  image?: string;
  verified?: boolean;
  category: Category;
  categoryLabel: string;
  city: string;
  name: string;
  rating: number;
  reviews: number;
};

function normalizeCategory(category: unknown): Category {
  const value = String(category ?? "").toLowerCase();

  if (["restaurant", "restaurants", "food", "cafe", "café", "bakery", "bar"].some((item) => value.includes(item))) {
    return "Restaurants";
  }

  if (["salon", "beauty", "service", "services", "repair", "garage", "plumber", "clinic", "spa", "health"].some((item) => value.includes(item))) {
    return "Services";
  }

  return "Shops";
}

function parseSavedBusinesses(payload: unknown): SavedBusiness[] {
  const response = payload as { data?: unknown; savedBusinesses?: unknown; businesses?: unknown };
  const candidates: unknown[] = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response?.savedBusinesses)
      ? response.savedBusinesses
      : Array.isArray(response?.businesses)
        ? response.businesses
        : Array.isArray(response)
          ? response
          : [];

  return candidates
    .map((entry) => {
      const business = (entry as { business?: Record<string, unknown>; businessId?: unknown })?.business ?? (entry as Record<string, unknown>);
      const rawId = business?._id ?? business?.id ?? business?.slug ?? (entry as { businessId?: unknown })?.businessId;
      const id = typeof rawId === "string" ? rawId : typeof rawId === "object" && rawId && "_id" in rawId ? String((rawId as { _id?: string })._id) : "";
      const categoryValue = business?.categoryId ?? business?.category ?? business?.categoryName ?? "Business";
      const category = normalizeCategory(categoryValue);
      const categoryLabel = typeof categoryValue === "string"
        ? categoryValue
        : typeof categoryValue === "object" && categoryValue && "name" in categoryValue
          ? String((categoryValue as { name?: string }).name)
          : "Business";
      const location = business?.location as { city?: string; address?: string } | undefined;
      const city = String(location?.city ?? location?.address ?? "Location not provided");
      const hasValidImage = typeof business?.logo === "string" || typeof business?.coverImage === "string";

      return {
        id: id || String(business?.slug || business?.name || "saved-business"),
        slug: typeof business?.slug === "string" ? business.slug : undefined,
        image: typeof business?.logo === "string"
          ? business.logo
          : typeof business?.coverImage === "string"
            ? business.coverImage
            : undefined,
        verified: Boolean(business?.verified ?? business?.isVerified),
        category,
        categoryLabel: categoryLabel || "Business",
        city,
        name: String(business?.name || "Unnamed business"),
        rating: Number(business?.averageRating ?? business?.rating ?? 0),
        reviews: Number(business?.reviewCount ?? business?.reviews ?? 0),
        hasValidImage,
      };
    })
    .filter((business) => business.name && business.id && (business.hasValidImage || business.image !== undefined || business.name.length > 0));
}

export default function SavedBusinesses() {
  const [savedBusinesses, setSavedBusinesses] = useState<SavedBusiness[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    baseApi.get(ENDPOINTS.getSavedBusinesses)
      .then((response) => {
        if (!isMounted) return;
        const businesses = parseSavedBusinesses(response.data);
        setSavedBusinesses(businesses);
      })
      .catch(() => {
        if (isMounted) setSavedBusinesses([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBusinesses = useMemo(
    () => savedBusinesses.filter((business) => activeCategory === "All" || business.category === activeCategory),
    [savedBusinesses, activeCategory]
  );

  const toggleSaveBusiness = async (businessId: string) => {
    const previous = savedBusinesses.some((business) => business.id === businessId);

    setSavedBusinesses((current) => current.filter((business) => business.id !== businessId));

    try {
      await baseApi.post(ENDPOINTS.saveBusiness(businessId));
      const response = await baseApi.get(ENDPOINTS.getSavedBusinesses);
      const businesses = parseSavedBusinesses(response.data);
      setSavedBusinesses(businesses);
    } catch (error) {
      setSavedBusinesses((current) => {
        if (previous) {
          return [...current, ...savedBusinesses.filter((business) => business.id === businessId)];
        }
        return current;
      });
      console.error("Failed to toggle saved business:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">My Saved Businesses</h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage all your saved businesses for quick access. Handle your preferences and bookings in one place.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                activeCategory === category
                  ? "bg-[#00663f] text-white"
                  : "bg-[#e4f3ec] text-[#00663f] hover:bg-[#d5ebe0]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-500">
          Sort by:
          <span className="relative">
            <select className="appearance-none rounded-lg border border-transparent bg-transparent py-1 pl-1 pr-6 text-sm font-semibold text-slate-700 outline-none">
              <option>Recently added</option>
              <option>Highest rated</option>
              <option>Name (A-Z)</option>
            </select>
            <FiChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[14px] text-slate-400" />
          </span>
        </label>
      </div>

      {isLoading ? (
        <div className="mt-5 rounded-2xl bg-white p-8 text-center text-sm text-slate-500">Loading saved businesses...</div>
      ) : filteredBusinesses.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-[#d7d9db] bg-white p-8 text-center text-sm text-slate-500">No saved businesses found.</div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBusinesses.map((business) => (
            <div key={business.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="relative h-40 w-full">
                {business.image ? (
                  <Image src={business.image} alt={business.name} fill className="object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-[#e4f3ec] text-lg font-bold text-[#00663f]">
                    {business.name.charAt(0)}
                  </div>
                )}
                {business.verified && (
                  <span className="absolute left-3 top-3 rounded-full bg-[#00663f] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Verified
                  </span>
                )}
                <button
                  type="button"
                  aria-label={`Remove ${business.name} from saved`}
                  onClick={() => void toggleSaveBusiness(business.id)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#00663f] shadow transition-colors hover:bg-white"
                >
                  <FiHeart className="text-[15px] fill-current" />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="text-[12px] text-[#00663f]">•</span>
                  {business.categoryLabel} · {business.city}
                </div>
                <p className="mt-1 text-base font-bold leading-snug text-slate-900">{business.name}</p>
                <div className="mt-1.5 flex items-center gap-1.5 text-sm">
                  <FiStar className="text-[14px] text-[#f5c451]" />
                  <span className="font-semibold text-slate-900">{business.rating.toFixed(1)}</span>
                  <span className="text-slate-400">({business.reviews} reviews)</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/feature/${business.slug || business.id}`}
                    className="flex-1 rounded-xl bg-[#00663f] py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
                  >
                    contact
                  </Link>
          
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
        >
          View more
          <FiChevronDown className="text-[14px]" />
        </button>
      </div>
    </div>
  );
}
