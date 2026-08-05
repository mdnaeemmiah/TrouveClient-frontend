"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Check, Heart, Map, MapPin, Sparkles, Star, UtensilsCrossed } from "lucide-react";
import detailOneImage from "@/src/assets/details/img1.png";
import detailTwoImage from "@/src/assets/details/img2.png";
import detailThreeImage from "@/src/assets/details/img3.png";

type Result = {
  name: string;
  category: string;
  city: string;
  rating: string;
  reviews: number;
  image: StaticImageData;
};

const results: Result[] = [
  { name: "Le Bistrot Parisien", category: "Restaurant", city: "Paris", rating: "4.8", reviews: 124, image: detailOneImage },
  { name: "Pizza Bella", category: "Restaurant", city: "Lyon", rating: "4.6", reviews: 88, image: detailTwoImage },
  { name: "Le Gourmet", category: "Restaurant", city: "Marseille", rating: "4.5", reviews: 76, image: detailThreeImage },
];

const ratingOptions = ["4 stars & up", "3 stars & up", "2 stars & up"];

const pages = [1, 2, 3];
const totalPages = 12;

export default function Search() {
  const [minRating, setMinRating] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [compareSelection, setCompareSelection] = useState<Set<string>>(new Set());
  const [activePage, setActivePage] = useState(1);

  const toggleFavorite = (name: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
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
            <select className="mt-1.5 w-full rounded-xl border border-[#e1e3e6] px-3 py-2.5 text-[13px] text-[#3a3d40] outline-none focus:border-[#00663f]">
              <option>All categories</option>
              <option>Restaurant</option>
              <option>Hair Salon</option>
              <option>Garage</option>
              <option>Plumber</option>
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
              <p className="mt-1 text-[13px] text-[#5c6168]">We found 128 businesses for you</p>
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
            {results.map((result) => (
              <div key={result.name} className="flex flex-col gap-4 rounded-2xl border border-[#eef0f1] bg-white p-4 sm:flex-row sm:items-center">
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:w-36">
                  <Image src={result.image} alt={result.name} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => toggleFavorite(result.name)}
                    className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[#3a3d40] shadow-sm hover:text-[#c0524d]"
                  >
                    <Heart size={14} className={favorites.has(result.name) ? "fill-[#c0524d] text-[#c0524d]" : ""} />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCompare(result.name)}
                    className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-md shadow-sm transition-colors ${
                      compareSelection.has(result.name) ? "bg-[#00663f] text-white" : "bg-white/95 text-transparent"
                    }`}
                  >
                    <Check size={12} />
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
                    <span className="font-semibold">{result.rating}</span>
                    <span className="text-[#8a8d91]">({result.reviews} reviews)</span>
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2.5">
                  <button
                    type="button"
                    className="rounded-lg border border-[#00663f] px-4 py-2 text-[13px] font-bold text-[#00663f] hover:bg-[#eaf6f0]"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-[#00663f] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#00552f]"
                  >
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-1.5">
            {pages.map((page) => (
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
            <span className="px-1 text-[13px] text-[#8a8d91]">...</span>
            <button
              type="button"
              onClick={() => setActivePage(totalPages)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-semibold transition-colors ${
                activePage === totalPages ? "bg-[#00663f] text-white" : "border border-[#e1e3e6] text-[#3a3d40] hover:bg-white"
              }`}
            >
              {totalPages}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
