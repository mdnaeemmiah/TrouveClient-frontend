"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import {
  FiAlertCircle,
  FiArrowRight,
  FiClock,
  FiEdit2,
  FiEdit3,
  FiEye,
  FiFileText,
  FiHeart,
  FiImage,
  FiTrash2,
  FiTrendingUp,
  FiUploadCloud,
} from "react-icons/fi";
import detailOneImage from "@/src/assets/details/img1.png";

type FilterTab = "All Posts" | "Published" | "Drafts";
const tabs: FilterTab[] = ["All Posts", "Published", "Drafts"];

type Update = {
  status: "Published" | "Draft";
  timestamp: string;
  title: string;
  body: string;
  preview: "image" | "pdf" | "placeholder";
  image?: StaticImageData;
  fileName?: string;
  views?: string;
  likes?: string;
  reports?: number;
};

const updates: Update[] = [
  {
    status: "Published",
    timestamp: "Oct 24, 2023 · 14:30",
    title: "New Seasonal Menu: Autumn Flavors at Lumière Bistro",
    body: "We are thrilled to announce our new autumn menu featuring locally sourced ingredients from the Provence region. Join us for a unique culinary journey...",
    preview: "image",
    image: detailOneImage,
    views: "2.4k",
    likes: "142",
    reports: 0,
  },
  {
    status: "Published",
    timestamp: "Oct 18, 2023 · 09:15",
    title: "Early Access: 2023 Holiday Gift Guide & Special Offers",
    body: "The most wonderful time of the year is approaching. Download our digital catalog for early bird discounts and exclusive holiday sets available only for...",
    preview: "pdf",
    fileName: "Holiday_Catalog.pdf",
    views: "856",
    likes: "48",
    reports: 1,
  },
  {
    status: "Draft",
    timestamp: "Drafted today · 10:45",
    title: "Weekly Workshop: French Pastry Basics...",
    body: "Draft summary: Workshop details and ticketing link for next month's events...",
    preview: "placeholder",
  },
];

export default function Listings() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All Posts");

  const filteredUpdates = updates.filter((update) => {
    if (activeTab === "All Posts") return true;
    if (activeTab === "Published") return update.status === "Published";
    return update.status === "Draft";
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#00663f]">Content Manager</h1>
        <p className="mt-1 text-sm text-slate-500">Draft, publish, and track your business announcements and events.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <FiEdit3 className="text-[15px] text-[#00663f]" />
              Create Post
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
              Draft Autosaved
            </span>
          </div>

          <textarea
            rows={4}
            placeholder="What's happening at your business? Share an update, event, or special offer..."
            className="mt-4 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#00663f]"
          />

          <div className="mt-3 flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 py-6 text-center">
            <FiUploadCloud className="text-[22px] text-[#00663f]" />
            <p className="text-sm font-semibold text-slate-700">Drag and drop media</p>
            <p className="text-xs text-slate-400">Supported: JPG, PNG, PDF (Max 10MB)</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <button type="button" className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">
                <FiClock className="text-[14px]" />
                Schedule
              </button>
              <button type="button" className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">
                <FiEye className="text-[14px]" />
                Preview
              </button>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
            >
              Publish Now
              <FiArrowRight className="text-[14px]" />
            </button>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl bg-[#00663f] p-5 shadow-sm">
          <h2 className="text-base font-bold text-white">Performance Overview</h2>
          <p className="text-sm text-green-100/80">Last 30 Days</p>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-green-100/70">Total Reach</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-2xl font-bold text-white">12,482</p>
                <span className="flex items-center gap-1 text-xs font-semibold text-green-200">
                  <FiTrendingUp className="text-[12px]" />
                  +14%
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-green-100/70">Engagement Rate</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-2xl font-bold text-white">4.2%</p>
                <span className="flex items-center gap-1 text-xs font-semibold text-green-200">
                  <FiTrendingUp className="text-[12px]" />
                  +2.1%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">My Updates</h2>
          <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab ? "bg-[#00663f] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {filteredUpdates.map((update) => (
            <div key={update.title} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:w-32">
                  {update.preview === "image" && update.image && (
                    <>
                      <Image src={update.image} alt={update.title} fill className="object-cover" />
                      <span className="absolute left-2 top-2 rounded-md bg-[#00663f] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        Published
                      </span>
                    </>
                  )}
                  {update.preview === "pdf" && (
                    <div className="relative flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-100">
                      <span className="absolute left-2 top-2 rounded-md bg-[#00663f] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        Published
                      </span>
                      <FiFileText className="text-[22px] text-slate-400" />
                      <p className="px-2 text-center text-[10px] text-slate-500">{update.fileName}</p>
                    </div>
                  )}
                  {update.preview === "placeholder" && (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                      <FiImage className="text-[26px]" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-400">{update.timestamp}</p>
                  <p className={`mt-1 text-sm font-semibold ${update.status === "Draft" ? "text-slate-600" : "text-slate-900"}`}>
                    {update.title}
                  </p>
                  <p className={`mt-1 text-sm text-slate-500 ${update.status === "Draft" ? "italic" : ""}`}>
                    {update.body}
                  </p>

                  {update.status === "Published" ? (
                    <div className="mt-3 flex items-center gap-5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <FiEye className="text-[13px]" />
                        {update.views} Views
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FiHeart className="text-[13px]" />
                        {update.likes} Likes
                      </span>
                      <span className="flex items-center gap-1.5 text-[#c0524d]">
                        <FiAlertCircle className="text-[13px]" />
                        {update.reports} Reports
                      </span>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Metrics Unavailable (Draft)
                      </span>
                      <div className="flex items-center gap-2">
                        <button type="button" className="text-slate-400 transition-colors hover:text-[#00663f]">
                          <FiEdit2 className="text-[14px]" />
                        </button>
                        <button type="button" className="text-slate-400 transition-colors hover:text-[#c0524d]">
                          <FiTrash2 className="text-[14px]" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            View Older Updates
          </button>
        </div>
      </div>
    </div>
  );
}
