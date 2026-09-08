"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark, Check, Map, MapPin, Sparkles, Star, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type Result = {
  _id: string;
  slug: string;
  name: string;
  category: string;
  city: string;
  rating: number;
  reviews: number;
  image?: string;
};

type BusinessResponse = {
  data?: {
    businesses?: Array<Record<string, unknown>>;
    results?: Array<Record<string, unknown>>;
    items?: Array<Record<string, unknown>>;
    total?: number;
    meta?: { total?: number };
  } | Array<Record<string, unknown>>;
  businesses?: Array<Record<string, unknown>>;
  results?: Array<Record<string, unknown>>;
};
type Category = { _id?: string; name?: string; title?: string };

function parseBusinesses(payload: unknown): { results: Result[]; total: number } {
  const response = payload as BusinessResponse;
  const data = response.data;
  const businesses = Array.isArray(data)
    ? data
    : data?.businesses || data?.results || data?.items || response.businesses || response.results || [];
  const total = Array.isArray(data) ? businesses.length : data?.total ?? data?.meta?.total ?? businesses.length;
  return {
    results: businesses.map((business) => {
      const category = business.categoryId as { name?: string } | string | undefined;
      const location = business.location as { city?: string } | undefined;
      return {
        _id: String(business._id || business.slug || business.name),
        slug: String(business.slug || business._id || ""),
        name: String(business.name || "Unnamed business"),
        category: typeof category === "string" ? category : category?.name || "Business",
        city: location?.city || "Location not provided",
        rating: Number(business.averageRating || 0),
        reviews: Number(business.reviewCount || 0),
        image: typeof business.logo === "string" ? business.logo : typeof business.coverImage === "string" ? business.coverImage : undefined,
      };
    }),
    total,
  };
}

const ratingOptions = ["4 stars & up", "3 stars & up", "2 stars & up"];

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.trim() || "";
  const [results, setResults] = useState<Result[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [minRating, setMinRating] = useState<string | null>(null);
  const [savedBusinesses, setSavedBusinesses] = useState<Set<string>>(new Set());
  const [compareSelection, setCompareSelection] = useState<Set<string>>(new Set());
  const [activePage, setActivePage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    baseApi.get(ENDPOINTS.categories)
      .then((response) => {
        const payload = response.data?.data ?? response.data;
        const items = Array.isArray(payload) ? payload : payload?.categories || payload?.items || [];
        setCategories(items);
      })
      .catch(() => setCategories([]))
      .finally(() => setIsLoadingCategories(false));
  }, []);

  useEffect(() => {
    let isMounted = true;

    baseApi.get(ENDPOINTS.getSavedBusinesses)
      .then((response) => {
        if (!isMounted) return;
        const payload = response.data?.data ?? response.data;
        const rawItems = Array.isArray(payload) ? payload : payload?.savedBusinesses || payload?.businesses || [];
        const savedIds = new Set<string>(rawItems.map((item: unknown) => {
          const business = (item as { business?: Record<string, unknown>; businessId?: string | { _id?: string } })?.business ?? (item as Record<string, unknown>);
          const rawBusinessId = business?._id ?? business?.id ?? business?.slug ?? (item as { businessId?: string | { _id?: string } })?.businessId;
          if (typeof rawBusinessId === "string") return rawBusinessId;
          if (rawBusinessId && typeof rawBusinessId === "object" && "_id" in rawBusinessId) return String(rawBusinessId._id);
          return "";
        }).filter(Boolean));
        setSavedBusinesses(savedIds);
      })
      .catch(() => {
        if (isMounted) setSavedBusinesses(new Set());
      });

    const endpoint = query ? ENDPOINTS.searchBusinesses : ENDPOINTS.getBusinesses;
      const params = query ? { query } : { page: activePage, limit: 10 };
      baseApi.get(endpoint, { params })
      .then((response) => {
        if (!isMounted) return;
        const parsed = parseBusinesses(response.data);
        setResults(parsed.results);
        setTotalResults(parsed.total);
      })
      .catch(() => {
        if (isMounted) setResults([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activePage, query]);

  const toggleSave = async (businessId: string) => {
    const wasSaved = savedBusinesses.has(businessId);
    const next = new Set(savedBusinesses);
    if (wasSaved) next.delete(businessId);
    else next.add(businessId);
    setSavedBusinesses(next);

    try {
      await baseApi.post(ENDPOINTS.saveBusiness(businessId));
      const response = await baseApi.get(ENDPOINTS.getSavedBusinesses);
      const payload = response.data?.data ?? response.data;
      const rawItems = Array.isArray(payload) ? payload : payload?.savedBusinesses || payload?.businesses || [];
      const savedIds = new Set<string>(rawItems.map((item: unknown) => {
        const business = (item as { business?: Record<string, unknown>; businessId?: string | { _id?: string } })?.business ?? (item as Record<string, unknown>);
        const rawBusinessId = business?._id ?? business?.id ?? business?.slug ?? (item as { businessId?: string | { _id?: string } })?.businessId;
        if (typeof rawBusinessId === "string") return rawBusinessId;
        if (rawBusinessId && typeof rawBusinessId === "object" && "_id" in rawBusinessId) return String(rawBusinessId._id);
        return "";
      }).filter(Boolean));
      setSavedBusinesses(savedIds);
    } catch (error: unknown) {
      setSavedBusinesses(new Set(savedBusinesses));
      const message = (error as { response?: { data?: { message?: string | string[] } } }).response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(" ") : message || "Unable to update saved business.");
    }
  };

  const toggleCompare = (name: string) => {
    setCompareSelection((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f7fa]">
      <div className="mx-auto grid grid-cols-1 gap-5 px-5 py-8 md:px-6 lg:grid-cols-[260px_1fr] lg:px-[max(30px,calc((100vw-1400px)/2))] lg:py-10">
        <aside className="h-fit rounded-2xl border border-[#eef0f1] bg-white p-5">
          <h2 className="text-lg font-bold text-[#1c1d22]">Filters</h2>

          <div className="mt-4">
            <label className="text-[13px] font-semibold text-[#1c1d22]">Category</label>
            <select disabled={isLoadingCategories} className="mt-1.5 w-full rounded-xl border border-[#e1e3e6] px-3 py-2.5 text-[13px] text-[#3a3d40] outline-none focus:border-[#00663f] disabled:opacity-60">
              <option>{isLoadingCategories ? "Loading categories..." : "All categories"}</option>
              {categories.map((category) => <option key={category._id || category.name} value={category._id}>{category.name || category.title || "Unnamed category"}</option>)}
            </select>
          </div>

          <div className="mt-4">
            <label className="text-[13px] font-semibold text-[#1c1d22]">City</label>
            <select className="mt-1.5 w-full rounded-xl border border-[#e1e3e6] px-3 py-2.5 text-[13px] text-[#3a3d40] outline-none focus:border-[#00663f]">
              <option>All cities</option>
              <option>Paris</option>
              <option>Lyon</option>
              <option>Marseille</option>
              <option>Nice</option>
            </select>
          </div>

          <div className="mt-4">
            <p className="text-[13px] font-semibold text-[#1c1d22]">Minimum rating</p>
            <div className="mt-2 space-y-2">
              {ratingOptions.map((option) => (
                <label key={option} className="flex cursor-pointer items-center gap-2 text-[13px] text-[#3a3d40]">
                  <input
                    type="radio"
                    name="minRating"
                    checked={minRating === option}
                    onChange={() => setMinRating(option)}
                    className="h-3.5 w-3.5 accent-[#00663f]"
                  />
                  {option} <Star size={12} className="fill-[#f4ac00] text-[#f4ac00]" />
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="text-[13px] font-semibold text-[#1c1d22]">Sort by</label>
            <select className="mt-1.5 w-full rounded-xl border border-[#e1e3e6] px-3 py-2.5 text-[13px] text-[#3a3d40] outline-none focus:border-[#00663f]">
              <option>Most relevant</option>
              <option>Highest rated</option>
              <option>Most reviewed</option>
            </select>
          </div>

          <button
            type="button"
            className="mt-5 w-full rounded-xl bg-[#00663f] py-2.5 text-[13px] font-bold text-white hover:bg-[#00552f]"
          >
            Apply Filters
          </button>
        </aside>

        <main>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-[26px] font-bold text-[#1c1d22]">Search Results</h1>
              <p className="mt-1 text-[13px] text-[#5c6168]">We found {totalResults} businesses for you</p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full border border-[#d7d9db] px-4 py-2 text-[13px] font-semibold text-[#3a3d40] hover:bg-white"
              >
                <Map size={15} /> View on map
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full bg-[#00663f] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#00552f]"
              >
                <Sparkles size={15} /> Compare using AI
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {isLoading ? <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">Loading businesses...</div> : results.length === 0 ? <div className="rounded-2xl border border-dashed border-[#d7d9db] bg-white p-10 text-center text-sm text-[#5c6168]">No businesses found.</div> : results.map((result) => (
              <div key={result._id} className="flex flex-col gap-4 rounded-2xl border border-[#eef0f1] bg-white p-4 sm:flex-row sm:items-center">
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:w-36">
                  {result.image ? <img src={result.image} alt={result.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center bg-[#e4f3ec] text-sm font-bold text-[#00663f]">{result.name.charAt(0)}</div>}
                  <button
                    type="button"
                    onClick={() => void toggleSave(result._id)}
                    className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[#3a3d40] shadow-sm hover:text-[#00663f]"
                    aria-label={savedBusinesses.has(result._id) ? `Remove ${result.name} from saved businesses` : `Save ${result.name}`}
                  >
                    <Bookmark size={14} className={savedBusinesses.has(result._id) ? "fill-[#00663f] text-[#00663f]" : ""} />
                  </button>
                  {/* <button
                    type="button"
                    onClick={() => toggleCompare(result.name)}
                    className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-md shadow-sm transition-colors ${
                      compareSelection.has(result.name) ? "bg-[#00663f] text-white" : "bg-white/95 text-transparent"
                    }`}
                  >
                    <Check size={12} />
                  </button> */}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-bold text-[#1c1d22]">{result.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[#5c6168]">
                    <UtensilsCrossed size={13} /> {result.category}
                    <span className="text-[#c3c5c8]">·</span>
                    <MapPin size={13} /> {result.city}
                  </p>
                  <p className="mt-1.5 flex items-center gap-1 text-[13px] text-[#3a3d40]">
                    <Star size={13} className="fill-[#f4ac00] text-[#f4ac00]" />
                    <span className="font-semibold">{result.rating.toFixed(1)}</span>
                    <span className="text-[#8a8d91]">({result.reviews} reviews)</span>
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2.5">
                  <Link
                    href={`/feature/${result.slug}`}
                    className="rounded-lg border border-[#00663f] px-4 py-2 text-[13px] font-bold text-[#00663f] hover:bg-[#eaf6f0]"
                  >
                    View
                  </Link>
                  <Link
                    href={`/feature/${result.slug}`}
                    className="rounded-lg bg-[#00663f] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#00552f]"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalResults > 10 && <div className="mt-6 flex items-center justify-center gap-1.5">
            {Array.from({ length: Math.ceil(totalResults / 10) }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setActivePage(page)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-semibold transition-colors ${
                  activePage === page ? "bg-[#00663f] text-white" : "border border-[#e1e3e6] text-[#3a3d40] hover:bg-white"
                }`}
              >
                {page}
              </button>
            ))}
          </div>}
        </main>
      </div>
    </div>
  );
}
