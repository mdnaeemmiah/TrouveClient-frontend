"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  FiBookmark,
  FiCheckCircle,
  FiMapPin,
  FiMessageSquare,
  FiStar,
  FiUserPlus,
  FiMail,
} from "react-icons/fi";
import img1 from "@/src/assets/details/img1.png";
import img2 from "@/src/assets/details/img2.png";
import img3 from "@/src/assets/details/img3.png";
import img4 from "@/src/assets/details/img4.png";

type SavedItem = {
  image: StaticImageData;
  name: string;
  category: string;
  location: string;
};

const savedItems: SavedItem[] = [
  { image: img3, name: "Studio Architecture XL", category: "Architectural Services", location: "Bordeaux" },
  { image: img4, name: "Hôtel de l'Opéra", category: "Hospitality", location: "Lyon" },
  { image: img2, name: "Cabinet Juridique Maître", category: "Legal Services", location: "Marseille" },
];

type Activity = {
  icon: typeof FiMessageSquare;
  iconBg: string;
  iconColor: string;
  time: string;
  text: React.ReactNode;
  quote?: string;
};

const activities: Activity[] = [
  {
    icon: FiMessageSquare,
    iconBg: "bg-[#00663f]",
    iconColor: "text-white",
    time: "Today, 10:45 AM",
    text: (
      <>
        You left a review for <span className="font-semibold text-[#00663f]">Le Petit Bistro</span>
      </>
    ),
    quote: "Excellent service and the wine selection was outstanding…",
  },
  {
    icon: FiMail,
    iconBg: "bg-slate-700",
    iconColor: "text-white",
    time: "Yesterday",
    text: (
      <>
        Inquiry sent to <span className="font-semibold text-[#00663f]">Plomberie Express 24/7</span>
      </>
    ),
    quote: "Response typically within 2 hours",
  },
  {
    icon: FiUserPlus,
    iconBg: "bg-[#b17a3a]",
    iconColor: "text-white",
    time: "Mar 12, 2024",
    text: (
      <>
        Started following <span className="font-semibold text-[#00663f]">Green Landscaping Solutions</span>
      </>
    ),
  },
];

export default function Profile() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bonjour, Jean 👋</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back to your dashboard. Here&apos;s what&apos;s been happening.</p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recently Visited</h2>
          <Link href="#" className="text-sm font-semibold text-[#00663f] hover:underline">
            View All
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="relative h-64 overflow-hidden rounded-2xl shadow-sm lg:col-span-2">
            <Image src={img1} alt="Boulangerie L'Artisanale" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-[#00663f] px-3 py-1 text-xs font-semibold text-white">
              <FiCheckCircle className="text-[13px]" />
              Verified
            </span>
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-xs font-medium uppercase tracking-wide text-white/80">Bakery &amp; Pastry</p>
              <p className="mt-1 text-xl font-bold">Boulangerie L&apos;Artisanale</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-white/90">
                <span className="flex items-center gap-1">
                  <FiStar className="text-[14px] text-[#f5c451]" />
                  4.9
                </span>
                <span className="flex items-center gap-1">
                  <FiMapPin className="text-[14px]" />
                  Paris, 06
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="relative h-32 w-full">
              <Image src={img2} alt="Éclat Coiffure" fill className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#00663f]">Wellness</p>
              <p className="mt-1 text-base font-bold text-slate-900">Éclat Coiffure</p>
              <p className="mt-1 text-sm text-slate-500">Last visited 2 days ago</p>
              <button
                type="button"
                className="mt-auto pt-4 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Book Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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

        <div>
          <h2 className="text-lg font-bold text-slate-900">Last Activities</h2>

          <div className="mt-4 space-y-0">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              const isLast = index === activities.length - 1;

              return (
                <div key={activity.time + index} className="relative flex gap-3 pb-6">
                  {!isLast && (
                    <span className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-slate-200" />
                  )}
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activity.iconBg}`}
                  >
                    <Icon className={`text-[14px] ${activity.iconColor}`} />
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-xs text-slate-400">{activity.time}</p>
                    <p className="mt-0.5 text-sm font-medium text-slate-900">{activity.text}</p>
                    {activity.quote && (
                      <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm italic text-slate-500">
                        &ldquo;{activity.quote}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
