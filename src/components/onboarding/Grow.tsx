"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCamera, FiEye, FiInfo, FiStar } from "react-icons/fi";
import img1 from "@/src/assets/details/img1.png";

const MAX_DESCRIPTION_LENGTH = 250;

export default function Grow() {
  const [description, setDescription] = useState("");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
        <h2 className="text-lg font-bold text-slate-900">Step 1: Basic Information</h2>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Business Name <span className="text-[#c0524d]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Le Bistrot Parisien"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/20"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Category <span className="text-[#c0524d]">*</span>
            </label>
            <select
              defaultValue=""
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/20"
            >
              <option value="" disabled>
                Select a category
              </option>
              <option>Restaurant &amp; Dining</option>
              <option>Beauty &amp; Wellness</option>
              <option>Professional Services</option>
              <option>Retail &amp; Shops</option>
              <option>Hospitality</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="text-sm font-medium text-slate-700">
            Short Description <span className="text-[#c0524d]">*</span>
          </label>
          <textarea
            rows={4}
            maxLength={MAX_DESCRIPTION_LENGTH}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Tell customers what makes your business unique…"
            className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/20"
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {description.length} / {MAX_DESCRIPTION_LENGTH} characters
          </p>
        </div>

        <div className="mt-5">
          <label className="text-sm font-medium text-slate-700">Business Logo or Main Image</label>
          <button
            type="button"
            className="mt-1.5 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-10 text-center transition-colors hover:border-[#00663f]/40 hover:bg-slate-50"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <FiCamera className="text-[18px]" />
            </span>
            <span className="text-sm font-medium text-slate-600">Click to upload or drag &amp; drop</span>
            <span className="text-xs text-slate-400">PNG, JPG up to 5MB</span>
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
          <button type="button" className="text-sm font-semibold text-slate-500 hover:text-slate-700">
            Save Draft
          </button>
          <Link
            href="/onboarding/contact"
            className="flex items-center gap-2 rounded-xl bg-[#00663f] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
          >
            Next Step
            <FiArrowRight className="text-[14px]" />
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-5">
        <div className="flex items-center gap-2">
          <FiEye className="text-[15px] text-[#00663f]" />
          <h3 className="text-sm font-bold text-slate-900">Live Card Preview</h3>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="relative h-28 w-full">
            <Image src={img1} alt="" fill className="object-cover" />
            <span className="absolute left-2 top-2 rounded-md bg-[#00663f] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Preview
            </span>
          </div>
          <div className="space-y-2 p-3">
            <div className="h-2.5 w-3/4 rounded-full bg-slate-200" />
            <div className="h-2 w-1/2 rounded-full bg-slate-100" />
            <div className="flex items-center gap-0.5 pt-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <FiStar
                  key={index}
                  className={`text-[12px] ${index < 4 ? "fill-current text-[#f5c451]" : "text-slate-200"}`}
                />
              ))}
            </div>
            <div className="h-6 w-20 rounded-full bg-[#e4f3ec]" />
          </div>
        </div>

        <div className="mt-4 flex gap-2 border-t border-slate-200 pt-4">
          <FiInfo className="mt-0.5 shrink-0 text-[14px] text-[#00663f]" />
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Pro Tip:</span> Businesses with clear, bright photos
            receive up to 80% more inquiries. Choose an image that showcases your storefront or main service.
          </p>
        </div>
      </div>
    </div>
  );
}
