"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export type Category = {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  isPopular: boolean;
  businessCount: number;
};

const CATEGORY_TONES = [
  "bg-orange-50 text-orange-500",
  "bg-purple-50 text-purple-500",
  "bg-blue-50 text-blue-500",
  "bg-yellow-50 text-yellow-600",
  "bg-indigo-50 text-indigo-500",
  "bg-emerald-50 text-emerald-500",
];

const VISIBLE_COUNT = 5;

export default function CategoriesSection({ categories, assetsOrigin }: { categories: Category[]; assetsOrigin: string }) {
  const [showAll, setShowAll] = useState(false);
  const visibleCategories = showAll ? categories : categories.slice(0, VISIBLE_COUNT);

  return (
    <section className="px-5 py-12 md:px-6 md:py-[72px] lg:px-[max(30px,calc((100vw-1400px)/2))]" id="categories">
      <div className="mb-6 flex items-start justify-between gap-4 md:mb-9 md:items-end">
        <div>
          <h2 className="mb-2.5 text-[25px] font-bold leading-none tracking-tight md:text-[29px] lg:text-[34px]">Popular Categories</h2>
          <p className="text-[13px] text-[#5c6168] lg:text-[15px]">Browse the most searched industries in France</p>
        </div>
        {categories.length > VISIBLE_COUNT && (
          <button
            className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[11px] font-bold text-[#00663f] md:text-[13px] lg:text-sm"
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show fewer categories" : "View all categories"} <ArrowRight size={17} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
        {visibleCategories.map(({ _id, name, icon, description, businessCount }, index) => (
          <div title={description} className="flex min-h-[175px] flex-col items-center rounded-2xl border border-[#eef0f1] bg-white px-3 pt-6 pb-4 shadow-[0_4px_8px_#10101005] lg:min-h-[190px]" key={_id}>
            <span className={`mb-4 grid h-12 w-12 place-items-center rounded-xl ${CATEGORY_TONES[index % CATEGORY_TONES.length]}`}>
              <img className="h-[22px] w-[22px]" src={`${assetsOrigin}${icon}`} alt="" aria-hidden width={22} height={22} />
            </span>
            <strong className="text-[13px] tracking-tight lg:text-[15px]">{name}</strong>
            <p className="mt-1.5 line-clamp-2 text-center text-[9px] leading-snug text-[#8a8f94] lg:text-[10px]">{description}</p>
            <small className="mt-2 text-[10px] text-[#676d73] lg:text-[11px]">{businessCount} businesses</small>
          </div>
        ))}
      </div>
    </section>
  );
}
