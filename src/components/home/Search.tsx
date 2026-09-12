"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Bookmark,
  Check,
  ExternalLink,
  Loader2,
  Map,
  MapPin,
  Search as SearchIcon,
  Sparkles,
  Star,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import CustomSelect from "@/src/components/ui/CustomSelect";

type Result = {
  _id: string;
  slug: string;
  name: string;
  category: string;
  categoryId?: string;
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
  items?: Array<Record<string, unknown>>;
  total?: number;
};

type Category = {
  _id?: string;
  name?: string;
  title?: string;
};

type ComparisonData = {
  business_one?: string;
  business_two?: string;
  business_one_summary?: string;
  business_two_summary?: string;
  summary?: string;
  comparison?: string;
};

function parseBusinesses(response: BusinessResponse): { results: Result[]; total: number } {
  const data = response?.data;
  const businesses = Array.isArray(data)
    ? data
    : data?.businesses || data?.results || data?.items || response.businesses || response.results || [];
  const total = Array.isArray(data) ? businesses.length : data?.total ?? data?.meta?.total ?? businesses.length;
  return {
    results: businesses.map((business) => {
      const category = business.categoryId as
        | { _id?: string; name?: string }
        | string
        | undefined;
      const location = business.location as { city?: string } | undefined;
      return {
        _id: String(business._id || business.slug || business.name),
        slug: String(business.slug || business._id || ""),
        name: String(business.name || "Unnamed business"),
        category: typeof category === "string" ? category : category?.name || "Business",
        categoryId:
          typeof category === "string"
            ? category
            : category?._id,
        city: location?.city || "Location not provided",
        rating: Number(business.averageRating || 0),
        reviews: Number(business.reviewCount || 0),
        image: typeof business.logo === "string" ? business.logo : typeof business.coverImage === "string" ? business.coverImage : undefined,
      };
    }),
    total,
  };
}

function parseComparisonResponse(payload: unknown): ComparisonData {
  if (!payload) return {};
  if (typeof payload === "string") {
    try {
      const parsed = JSON.parse(payload);
      return parseComparisonResponse(parsed);
    } catch {
      return { comparison: payload };
    }
  }
  if (typeof payload === "object" && payload !== null) {
    const obj = payload as Record<string, unknown>;
    const summary =
      (typeof obj.summary === "string" && obj.summary) ||
      (typeof obj.verdict === "string" && obj.verdict) ||
      (typeof obj.title === "string" && obj.title) ||
      (typeof obj.conclusion === "string" && obj.conclusion) ||
      undefined;

    let comparison =
      (typeof obj.comparison === "string" && obj.comparison) ||
      (typeof obj.aiAnalysis === "string" && obj.aiAnalysis) ||
      (typeof obj.analysis === "string" && obj.analysis) ||
      (typeof obj.content === "string" && obj.content) ||
      (typeof obj.result === "string" && obj.result) ||
      (typeof obj.recommendation === "string" && obj.recommendation) ||
      (typeof obj.text === "string" && obj.text) ||
      (typeof obj.message === "string" && obj.message) ||
      undefined;

    if (!comparison) {
      if (Array.isArray(obj.points) || Array.isArray(obj.comparisonPoints)) {
        const points = (obj.points || obj.comparisonPoints) as unknown[];
        comparison = points
          .map((p) => (typeof p === "string" ? `• ${p}` : JSON.stringify(p)))
          .join("\n");
      } else {
        const copy = { ...obj };
        delete copy.summary;
        delete copy.success;
        delete copy.statusCode;
        delete copy.timestamp;
        const keys = Object.keys(copy);
        if (keys.length > 0) {
          comparison = keys
            .map((k) => `${k.toUpperCase()}:\n${typeof copy[k] === "object" ? JSON.stringify(copy[k], null, 2) : String(copy[k])}`)
            .join("\n\n");
        }
      }
    }

    return { summary, comparison };
  }
  return {};
}

const ratingOptions = ["4 stars & up", "3 stars & up", "2 stars & up"];

type AppliedFilters = {
  category: string;
  city: string;
  minRating: string | null;
  sortBy: string;
};

function applyResultFilters(
  results: Result[],
  filters: AppliedFilters,
) {
  const minimumRating = filters.minRating
    ? Number.parseInt(filters.minRating, 10)
    : 0;

  const filtered = results.filter((result) => {
    const matchesCategory =
      !filters.category ||
      result.categoryId === filters.category ||
      result.category.toLowerCase() === filters.category.toLowerCase();
    const matchesCity =
      !filters.city ||
      result.city.toLowerCase() === filters.city.toLowerCase();
    const matchesRating = result.rating >= minimumRating;

    return matchesCategory && matchesCity && matchesRating;
  });

  return [...filtered].sort((first, second) => {
    if (filters.sortBy === "rated") {
      return second.rating - first.rating;
    }

    if (filters.sortBy === "reviewed") {
      return second.reviews - first.reviews;
    }

    return 0;
  });
}

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.trim() || "";
  const [results, setResults] = useState<Result[]>([]);
  const [allResults, setAllResults] = useState<Result[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [minRating, setMinRating] = useState<string | null>(null);
  const [savedBusinesses, setSavedBusinesses] = useState<Set<string>>(new Set());
  const [selectedBusinesses, setSelectedBusinesses] = useState<Result[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [activePage, setActivePage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [sortBy, setSortBy] = useState("relevant");

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
          setAllResults(parsed.results);
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

  const handleApplyFilters = () => {
    const filters: AppliedFilters = {
      category: selectedCategory,
      city: selectedCity,
      minRating,
      sortBy,
    };
    const filteredResults = applyResultFilters(allResults, filters);
    setResults(filteredResults);
    setTotalResults(filteredResults.length);
  };

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

  const toggleCompare = (result: Result) => {
    const targetSlug = result.slug || result._id;
    setSelectedBusinesses((prev) => {
      const exists = prev.some((b) => (b.slug || b._id) === targetSlug);
      if (exists) {
        return prev.filter((b) => (b.slug || b._id) !== targetSlug);
      }
      if (prev.length >= 2) {
        toast.info("You can compare up to 2 businesses. Uncheck one first.");
        return prev;
      }
      return [...prev, result];
    });
  };

  const handleCompareClick = async () => {
    if (selectedBusinesses.length !== 2) {
      toast.info("Please select 2 businesses using the checkboxes to compare.");
      return;
    }

    const slug1 = selectedBusinesses[0].slug || selectedBusinesses[0]._id;
    const slug2 = selectedBusinesses[1].slug || selectedBusinesses[1]._id;

    setIsCompareModalOpen(true);
    setIsComparing(true);
    setComparisonData(null);

    try {
      const response = await baseApi.get(ENDPOINTS.compareBusinesses, {
        params: { slug1, slug2 },
      });
      const payload = response.data?.data ?? response.data;
      const parsed = parseComparisonResponse(payload);
      setComparisonData(parsed);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string | string[] } } }).response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(" ") : message || "Unable to compare selected businesses.");
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7fa]">
      <div className="mx-auto grid grid-cols-1 gap-5 px-5 py-8 md:px-6 lg:grid-cols-[260px_1fr] lg:px-[max(30px,calc((100vw-1400px)/2))] lg:py-10">
        <aside className="h-fit rounded-2xl border border-[#eef0f1] bg-white p-5">
          <h2 className="text-lg font-bold text-[#1c1d22]">Filters</h2>

          <div className="mt-4">
            <label className="text-[13px] font-semibold text-[#1c1d22]">Category</label>
            <CustomSelect
              disabled={isLoadingCategories}
              placeholder={isLoadingCategories ? "Loading categories..." : "All categories"}
              value={selectedCategory}
              options={[
                { value: "", label: "All categories" },
                ...categories.map((cat) => ({ value: cat._id ?? cat.name ?? "", label: cat.name || cat.title || "Unnamed category" })),
              ]}
              onChange={setSelectedCategory}
              className="mt-1.5"
            />
          </div>

          <div className="mt-4">
            <label className="text-[13px] font-semibold text-[#1c1d22]">City</label>
            <CustomSelect
              value={selectedCity}
              onChange={setSelectedCity}
              placeholder="All cities"
              options={[
                { value: "", label: "All cities" },
                { value: "paris", label: "Paris" },
                { value: "lyon", label: "Lyon" },
                { value: "marseille", label: "Marseille" },
                { value: "nice", label: "Nice" },
              ]}
              className="mt-1.5"
            />
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
            <CustomSelect
              value={sortBy}
              onChange={setSortBy}
              placeholder="Most relevant"
              options={[
                { value: "relevant", label: "Most relevant" },
                { value: "rated", label: "Highest rated" },
                { value: "reviewed", label: "Most reviewed" },
              ]}
              className="mt-1.5"
            />
          </div>

          <button
            type="button"
            onClick={handleApplyFilters}
            className="mt-5 w-full rounded-xl bg-[#00663f] py-2.5 text-[13px] font-bold text-white hover:bg-[#00552f]"
          >
            Apply Filters
          </button>
        </aside>

        <main>
          <form className="mb-6 flex h-[58px] items-center rounded-[11px] bg-white py-2 pr-2 pl-3.5 text-[#94999c] shadow-[0_5px_17px_#21212a10]" action="/search" method="get">
            <SearchIcon size={17} strokeWidth={2} />
            <input name="query" defaultValue={query} className="min-w-0 flex-1 border-0 px-2.5 text-[13px] text-[#1c1d22] outline-0" aria-label="Search local businesses" placeholder="What are you looking for?" />
            <button className="h-11 min-w-[83px] rounded-[9px] bg-[#00663f] text-[13px] font-bold text-white md:min-w-28" type="submit">Search</button>
          </form>

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
                onClick={() => void handleCompareClick()}
                disabled={isComparing}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold transition ${
                  selectedBusinesses.length === 2
                    ? "bg-[#00663f] text-white shadow-md hover:bg-[#00552f] ring-2 ring-[#00663f]/30"
                    : selectedBusinesses.length === 1
                    ? "bg-[#e4f3ec] text-[#00663f] hover:bg-[#d5ece1]"
                    : "bg-[#00663f] text-white hover:bg-[#00552f]"
                }`}
              >
                <Sparkles size={15} /> Compare using AI ({selectedBusinesses.length}/2)
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {isLoading ? (
              <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">
                Loading businesses...
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d7d9db] bg-white p-10 text-center text-sm text-[#5c6168]">
                No businesses found.
              </div>
            ) : (
              results.map((result) => {
                const targetSlug = result.slug || result._id;
                const isSelected = selectedBusinesses.some((b) => (b.slug || b._id) === targetSlug);

                return (
                  <div
                    key={result._id}
                    className={`flex flex-col gap-4 rounded-2xl border bg-white p-4 transition sm:flex-row sm:items-center ${
                      isSelected ? "border-[#00663f] ring-1 ring-[#00663f]" : "border-[#eef0f1]"
                    }`}
                  >
                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:w-36">
                      {result.image ? (
                        <img src={result.image} alt={result.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full place-items-center bg-[#e4f3ec] text-sm font-bold text-[#00663f]">
                          {result.name.charAt(0)}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => void toggleSave(result._id)}
                        className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[#3a3d40] shadow-sm hover:text-[#00663f]"
                        aria-label={savedBusinesses.has(result._id) ? `Remove ${result.name} from saved businesses` : `Save ${result.name}`}
                      >
                        <Bookmark size={14} className={savedBusinesses.has(result._id) ? "fill-[#00663f] text-[#00663f]" : ""} />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCompare(result)}
                        className={`absolute right-2 top-2 flex h-6 items-center gap-1 rounded-md px-1.5 text-[11px] font-bold shadow-sm transition ${
                          isSelected ? "bg-[#00663f] text-white" : "bg-white/95 text-slate-600 hover:bg-white"
                        }`}
                        aria-label={isSelected ? `Unselect ${result.name} from comparison` : `Select ${result.name} to compare`}
                      >
                        <Check size={12} className={isSelected ? "stroke-[3]" : "opacity-40"} />
                        <span>{isSelected ? "Selected" : "Compare"}</span>
                      </button>
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
                      <label
                        className={`flex items-center gap-1.5 cursor-pointer select-none rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                          isSelected
                            ? "border-[#00663f] bg-[#eaf6f0] text-[#00663f]"
                            : "border-[#d7d9db] text-[#3a3d40] hover:bg-[#f7f7fa]"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCompare(result)}
                          className="h-3.5 w-3.5 rounded accent-[#00663f] cursor-pointer"
                        />
                        <span>{isSelected ? "Selected" : "Compare"}</span>
                      </label>

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
                );
              })
            )}
          </div>

          {selectedBusinesses.length > 0 && (
            <div className="sticky bottom-6 z-40 mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#00663f]/30 bg-white/95 p-4 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00663f] text-xs font-bold text-white">
                  {selectedBusinesses.length}/2
                </span>
                <div className="text-xs">
                  <p className="font-bold text-slate-900">
                    {selectedBusinesses.length === 1
                      ? "Select 1 more business to compare"
                      : "Ready to compare businesses"}
                  </p>
                  <p className="text-slate-500">
                    {selectedBusinesses.map((b) => b.name).join(" vs ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBusinesses([])}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Clear
                </button>
                <button
                  type="button"
                  disabled={selectedBusinesses.length !== 2 || isComparing}
                  onClick={() => void handleCompareClick()}
                  className="flex items-center gap-1.5 rounded-lg bg-[#00663f] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#00552f] disabled:opacity-50"
                >
                  {isComparing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  Compare with AI
                </button>
              </div>
            </div>
          )}

          {totalResults > 10 && (
            <div className="mt-6 flex items-center justify-center gap-1.5">
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
            </div>
          )}
        </main>
      </div>

      {isCompareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsCompareModalOpen(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e4f3ec] text-[#00663f]">
                  <Sparkles size={18} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    AI Business Comparison
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comparing {selectedBusinesses[0]?.name || "Business 1"} vs {selectedBusinesses[1]?.name || "Business 2"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {selectedBusinesses.map((biz) => (
                  <div
                    key={biz._id}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white border border-slate-100">
                        {biz.image ? (
                          <img
                            src={biz.image}
                            alt={biz.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-full place-items-center bg-[#e4f3ec] text-sm font-bold text-[#00663f]">
                            {biz.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {biz.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {biz.category} · {biz.city}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-xs">
                          <Star size={11} className="fill-[#f4ac00] text-[#f4ac00]" />
                          <span className="font-semibold">{biz.rating.toFixed(1)}</span>
                          <span className="text-slate-400">({biz.reviews})</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/feature/${biz.slug}`}
                      target="_blank"
                      className="mt-3 flex items-center justify-center gap-1 text-xs font-semibold text-[#00663f] hover:underline"
                    >
                      View Profile <ExternalLink size={12} />
                    </Link>
                  </div>
                ))}
              </div>

              {isComparing ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e4f3ec] text-[#00663f]">
                    <Sparkles className="animate-spin text-[#00663f]" size={26} />
                  </div>
                  <p className="mt-4 text-sm font-bold text-slate-900">
                    Generating AI Comparison...
                  </p>
                  <p className="mt-1 max-w-sm text-xs text-slate-500">
                    Analyzing services, customer reviews, ratings, and key features to give you a comprehensive side-by-side evaluation.
                  </p>
                </div>
              ) : comparisonData ? (
                <div className="space-y-4">
                  {(comparisonData.business_one_summary || comparisonData.business_two_summary) && (
                    <div className="space-y-3">
                      {comparisonData.business_one_summary && (
                        <div className="rounded-xl border border-[#c7e5d8] bg-[#f2f9f5] p-4 text-[#00663f]">
                          <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#00663f]">
                            <Sparkles size={14} /> AI Analysis: {comparisonData.business_one || selectedBusinesses[0]?.name || "Business 1"}
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-slate-700 font-medium">
                            {comparisonData.business_one_summary}
                          </p>
                        </div>
                      )}

                      {comparisonData.business_two_summary && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-800">
                          <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-slate-700">
                            <Sparkles size={14} /> AI Analysis: {comparisonData.business_two || selectedBusinesses[1]?.name || "Business 2"}
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-slate-700 font-medium">
                            {comparisonData.business_two_summary}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {comparisonData.summary && (
                    <div className="rounded-xl border border-[#c7e5d8] bg-[#f2f9f5] p-4 text-[#00663f]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#00663f]">
                        Summary & Verdict
                      </h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-700 font-medium">
                        {comparisonData.summary}
                      </p>
                    </div>
                  )}

                  {comparisonData.comparison && (
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Detailed Comparison
                      </h4>
                      <div className="prose prose-sm max-w-none text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                        {comparisonData.comparison}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                  <p className="text-sm text-slate-500">
                    No comparison data returned.
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleCompareClick()}
                    className="mt-3 rounded-lg bg-[#00663f] px-4 py-2 text-xs font-bold text-white hover:bg-[#00552f]"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedBusinesses([]);
                  setIsCompareModalOpen(false);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Clear Selection
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCompareModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={isComparing}
                  onClick={() => void handleCompareClick()}
                  className="flex items-center gap-1.5 rounded-lg bg-[#00663f] px-4 py-2 text-xs font-bold text-white hover:bg-[#00552f] disabled:opacity-60"
                >
                  {isComparing ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  Refresh Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
