"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { FaBreadSlice, FaCut, FaLeaf, FaUtensils } from "react-icons/fa";
import type { IconType } from "react-icons";
import { FiChevronDown, FiHeart, FiStar } from "react-icons/fi";
import img1 from "@/src/assets/details/img1.png";
import img2 from "@/src/assets/details/img2.png";
import img3 from "@/src/assets/details/img3.png";
import img4 from "@/src/assets/details/img4.png";

type Category = "All" | "Restaurants" | "Services" | "Shops";
const categories: Category[] = ["All", "Restaurants", "Services", "Shops"];

type SavedBusiness = {
  id: string;
  image: StaticImageData;
  verified?: boolean;
  categoryIcon: IconType;
  category: Category;
  categoryLabel: string;
  city: string;
  name: string;
  rating: number;
  reviews: number;
};

const savedBusinesses: SavedBusiness[] = [
  {
    id: "le-bistrot-parisien",
    image: img1,
    verified: true,
    categoryIcon: FaUtensils,
    category: "Restaurants",
    categoryLabel: "Restaurant",
    city: "Paris 6th",
    name: "Le Bistrot Parisien",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "latelier-floral",
    image: img2,
    categoryIcon: FaLeaf,
    category: "Shops",
    categoryLabel: "Artisan",
    city: "Bordeaux",
    name: "L'Atelier Floral",
    rating: 4.9,
    reviews: 86,
  },
  {
    id: "boulangerie-artisanale",
    image: img4,
    categoryIcon: FaBreadSlice,
    category: "Shops",
    categoryLabel: "Bakery",
    city: "Lyon",
    name: "Boulangerie Artisanale",
    rating: 4.7,
    reviews: 210,
  },
  {
    id: "studio-coiffure-lumiere",
    image: img3,
    categoryIcon: FaCut,
    category: "Services",
    categoryLabel: "Beauty",
    city: "Nantes",
    name: "Studio Coiffure Lumière",
    rating: 5.0,
    reviews: 45,
  },
];

export default function SavedBusinesses() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredBusinesses = savedBusinesses.filter(
    (business) => activeCategory === "All" || business.category === activeCategory
  );

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

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBusinesses.map((business) => {
          const CategoryIcon = business.categoryIcon;

          return (
            <div key={business.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="relative h-40 w-full">
                <Image src={business.image} alt={business.name} fill className="object-cover" />
                {business.verified && (
                  <span className="absolute left-3 top-3 rounded-full bg-[#00663f] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Verified
                  </span>
                )}
                <button
                  type="button"
                  aria-label={`Remove ${business.name} from saved`}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#00663f] shadow transition-colors hover:bg-white"
                >
                  <FiHeart className="text-[15px] fill-current" />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <CategoryIcon className="text-[12px] text-[#00663f]" />
                  {business.categoryLabel} · {business.city}
                </div>
                <p className="mt-1 text-base font-bold leading-snug text-slate-900">{business.name}</p>
                <div className="mt-1.5 flex items-center gap-1.5 text-sm">
                  <FiStar className="text-[14px] text-[#f5c451]" />
                  <span className="font-semibold text-slate-900">{business.rating.toFixed(1)}</span>
                  <span className="text-slate-400">({business.reviews} reviews)</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded-xl bg-[#00663f] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-xl bg-[#e4f3ec] py-2 text-sm font-semibold text-[#00663f] transition-colors hover:bg-[#d5ebe0]"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
