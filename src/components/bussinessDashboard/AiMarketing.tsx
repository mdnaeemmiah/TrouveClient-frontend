"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiBriefcase, FiCamera, FiClipboard, FiGift, FiRotateCcw, FiZap } from "react-icons/fi";

type Platform = "Facebook" | "Instagram" | "LinkedIn";

const platforms: { label: Platform; icon: IconType }[] = [
  { label: "Facebook", icon: FaFacebookF },
  { label: "Instagram", icon: FaInstagram },
  { label: "LinkedIn", icon: FaLinkedinIn },
];

const pastGenerations: {
  title: string;
  quote: string;
  time: string;
  icon: IconType;
}[] = [
  {
    title: "LinkedIn Post: Grand Opening",
    quote: '"We are thrilled to announce the opening of our new flagship store in..."',
    time: "2 DAYS AGO",
    icon: FiBriefcase,
  },
  {
    title: "Instagram: Artisan Spotlight",
    quote: '"Meet Jean, the hands behind our latest hand-poured collection..."',
    time: "5 DAYS AGO",
    icon: FiCamera,
  },
  {
    title: "FB Ad: Mother's Day Promo",
    quote: '"Give the gift of luxury this Mother\'s Day with our exclusive candle..."',
    time: "1 WEEK AGO",
    icon: FiGift,
  },
];

export default function AiMarketing() {
  const [platform, setPlatform] = useState<Platform>("Facebook");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Marketing Assistant</h1>
        <p className="mt-1 text-sm text-slate-500">
          Generate ready-to-post social content tailored to your business.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Create New Content</h2>
          <p className="mt-1 text-sm text-slate-500">Describe what you need and select your target platform.</p>

          <p className="mt-5 text-sm font-semibold text-slate-700">Select Platform</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {platforms.map((item) => {
              const Icon = item.icon;
              const active = platform === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setPlatform(item.label)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-[#00663f] bg-[#00663f] text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="text-[13px]" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <p className="mt-5 text-sm font-semibold text-slate-700">Your Requirement</p>
          <textarea
            rows={5}
            placeholder="e.g., Write a Facebook post for our 20% off summer sale on artisanal French candles..."
            className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#00663f]"
          />

          <button
            type="button"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00663f] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
          >
            <FiZap className="text-[15px]" />
            Generate Content
          </button>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                AI Generated
              </span>
              <span className="text-sm font-medium text-[#00663f]">Ready to use</span>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <FiClipboard className="text-[13px]" />
              Copy to Clipboard
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-[#00663f]">✨ Summer Vibes at Lumière Paris! ✨</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Ready to upgrade your home atmosphere? 🕯️ Our exclusive Summer Sale is NOW LIVE! Enjoy a massive{" "}
              <strong className="font-semibold text-slate-800">20% OFF</strong> all our premium artisanal candles.
              Whether you crave the fresh scent of Provence lavender or the warm glow of Mediterranean citrus,
              we&rsquo;ve got your summer evenings covered.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Use code: SUMMER20 at checkout or visit us in-store. Don&rsquo;t wait—when they&rsquo;re gone,
              they&rsquo;re gone! 🌿
            </p>
            <p className="mt-3 text-sm text-[#00663f]">
              #LumièreParis #FrenchArtisans #SummerSale #HomeDecor #HandmadeWithLove
            </p>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 p-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00663f]" />
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Pro-tip:</span> LinkedIn versions of this post should
              focus more on the &ldquo;Craftsmanship&rdquo; aspect of your brand.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-900">Past Generations</h2>

        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pastGenerations.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e4f3ec] text-[#00663f]">
                    <Icon className="text-[15px]" />
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{item.time}</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-800">{item.title}</p>
                <p className="mt-1 text-xs italic text-slate-500">{item.quote}</p>
                <button
                  type="button"
                  className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#00663f] hover:underline"
                >
                  <FiRotateCcw className="text-[12px]" />
                  Re-use Text
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
