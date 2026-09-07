"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  Croissant,
  Download,
  FileText,
  Flag,
  Hotel,
  Leaf,
  Rocket,
  ThumbsUp,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import detailOneImage from "@/src/assets/details/img1.png";
import AddReminderButton from "@/src/components/AddReminderButton";

const categories = ["Restaurants", "Artisans", "Tech", "Boutiques", "Wellness", "Home Decor"];

const trendingBusinesses = [
  {
    name: "L'Atelier Vert",
    meta: "Consulting · Bordeaux",
    stat: "+45% visibility",
    icon: Leaf,
    iconBg: "bg-[#e4f3ec]",
    iconColor: "text-[#00663f]",
  },
  {
    name: "Hôtel de la Mer",
    meta: "Hospitality · Nice",
    stat: "+12% new reviews",
    icon: Hotel,
    iconBg: "bg-[#e5ecfb]",
    iconColor: "text-[#4a5fa5]",
  },
  {
    name: "Brasserie du Sud",
    meta: "Food & Beverage · Marseille",
    stat: "+28% followers",
    icon: UtensilsCrossed,
    iconBg: "bg-[#fdf1e2]",
    iconColor: "text-[#b17a3a]",
  },
];

const tabs = ["Recent Updates", "Most Popular"] as const;

export default function Feed() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Recent Updates");
  const [following, setFollowing] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f7fa]">
      <div className="mx-auto grid grid-cols-1 gap-5 px-5 py-8 md:px-6 lg:grid-cols-[240px_1fr_260px] lg:px-[max(30px,calc((100vw-1400px)/2))] lg:py-10">
        <aside className="space-y-5 lg:order-1">
          <div className="rounded-2xl border border-[#eef0f1] bg-white p-5">
            <h2 className="text-[15px] font-bold text-[#00663f]">
              Categories to Follow
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className="rounded-full bg-[#f1f2f4] px-3 py-1.5 text-[12px] font-medium text-[#3a3d40] hover:bg-[#e7e8eb]"
                >
                  {category}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="mt-3 text-[12px] font-semibold text-[#00663f] hover:underline"
            >
              See all categories
            </button>
          </div>

          <div className="rounded-2xl border border-[#eef0f1] bg-white p-5">
            <h2 className="text-[15px] font-bold text-[#00663f]">
              France News
            </h2>
            <p className="mt-2 text-[12px] text-[#5c6168]">
              Check out local market updates and new business laws in France.
            </p>
            <div className="mt-3 rounded-xl bg-[#f7f7fa] p-3">
              <p className="text-[11px] text-[#8a8d91]">March 12, 2024</p>
              <p className="mt-1 text-[13px] font-semibold text-[#1c1d22]">
                New Green Tax Credit for Small Businesses
              </p>
            </div>
          </div>
        </aside>

        <main className="lg:order-2">
          <div className="flex items-center gap-6 border-b border-[#eef0f1]">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 text-[14px] font-semibold transition-colors ${
                  activeTab === tab
                    ? "text-[#00663f]"
                    : "text-[#9a9da1] hover:text-[#5c6168]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#00663f]" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-5">
            <article className="rounded-2xl border border-[#eef0f1] bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e4f3ec] text-[#00663f]">
                    <Croissant size={18} />
                  </span>
                  <div>
                    <p className="text-[14px] font-bold text-[#1c1d22]">
                      Le Petit Fournil
                    </p>
                    <p className="text-[12px] text-[#8a8d91]">
                      Saint-Germain-des-Prés, Paris · 2h ago
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-full bg-[#00663f] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-[#00552f]"
                >
                  + Follow
                </button>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-[#3a3d40]">
                We are thrilled to announce our new seasonal Spring collection!
                From wild strawberry tartlets to honey-lavender macarons, come
                taste the essence of Provence right here in Paris. Exclusive
                offer for our followers: 10% off this weekend! 🥐✨
              </p>

              <div className="relative mt-3 h-56 w-full overflow-hidden rounded-xl sm:h-72">
                <Image
                  src={detailOneImage}
                  alt="Le Petit Fournil"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#5c6168]">
                  <ThumbsUp size={14} /> 124
                </span>
                <div className="flex items-center gap-3">
                  <AddReminderButton
                    businessName="Le Petit Fournil"
                    eventLabel="Update: Spring Collection Launch"
                    image={detailOneImage}
                  />
                  <button
                    type="button"
                    className="flex items-center gap-1 text-[12px] font-semibold text-[#00663f] hover:underline"
                  >
                    Visit Profile <ArrowRight size={13} />
                  </button>
                  <button
                    type="button"
                    className="text-[#c3c5c8] hover:text-[#8a8d91]"
                  >
                    <Flag size={14} />
                  </button>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-[#eef0f1] bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e5ecfb] text-[#4a5fa5]">
                    <Rocket size={18} />
                  </span>
                  <div>
                    <p className="text-[14px] font-bold text-[#1c1d22]">
                      Vortex Digital Labs
                    </p>
                    <p className="text-[12px] text-[#8a8d91]">Lyon · 5h ago</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFollowing((prev) => !prev)}
                  className="flex shrink-0 items-center gap-1 rounded-full border border-[#c7d8cd] px-4 py-1.5 text-[12px] font-bold text-[#00663f] hover:bg-[#eaf6f0]"
                >
                  {following ? "✓ Following" : "+ Follow"}
                </button>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-[#3a3d40]">
                Our Q1 2024 Tech Outlook for French SMEs is now available.
                Download our full report to understand how AI is transforming
                the local manufacturing landscape and how you can leverage new
                grants.
              </p>

              <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#eef0f1] bg-[#f7f7fa] p-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#00663f] text-white">
                  <FileText size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[#1c1d22]">
                    Q1_2024_Tech_Outlook_France.pdf
                  </p>
                  <p className="text-[11px] text-[#8a8d91]">
                    4.2 MB · 24 pages
                  </p>
                  <button
                    type="button"
                    className="mt-0.5 flex items-center gap-1 text-[12px] font-semibold text-[#00663f] hover:underline"
                  >
                    <Download size={12} /> Download Report
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#5c6168]">
                  <ThumbsUp size={14} /> 82
                </span>
                <div className="flex items-center gap-3">
                  <AddReminderButton
                    businessName="Vortex Digital Labs"
                    eventLabel="Report: Q1 2024 Tech Outlook"
                    image={detailOneImage}
                  />
                  <button
                    type="button"
                    className="flex items-center gap-1 text-[12px] font-semibold text-[#00663f] hover:underline"
                  >
                    Visit Profile <ArrowRight size={13} />
                  </button>
                  <button
                    type="button"
                    className="text-[#c3c5c8] hover:text-[#8a8d91]"
                  >
                    <Flag size={14} />
                  </button>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              className="flex items-center gap-1.5 text-[13px] font-semibold text-[#5c6168] hover:text-[#1c1d22]"
            >
              Load more updates <ChevronDown size={15} />
            </button>
          </div>
        </main>

        <aside className="lg:order-3">
          <div className="rounded-2xl border border-[#eef0f1] bg-white p-5">
            <h2 className="text-[15px] font-bold text-[#00663f]">
              Trending Businesses
            </h2>
            <div className="mt-3 space-y-4">
              {trendingBusinesses.map((business) => {
                const Icon = business.icon;
                return (
                  <div key={business.name} className="flex items-start gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${business.iconBg} ${business.iconColor}`}
                    >
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-[#1c1d22]">
                        {business.name}
                      </p>
                      <p className="text-[11px] text-[#8a8d91]">
                        {business.meta}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-[#00663f]">
                        <TrendingUp size={11} /> {business.stat}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
