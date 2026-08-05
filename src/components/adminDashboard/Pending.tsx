"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiFilter,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTag,
  FiTrash2,
  FiUser,
  FiX,
  FiZap,
} from "react-icons/fi";
import detailOneImage from "@/src/assets/details/img1.png";
import detailTwoImage from "@/src/assets/details/img2.png";
import detailThreeImage from "@/src/assets/details/img3.png";
import detailFourImage from "@/src/assets/details/img4.png";

type PendingBusiness = {
  name: string;
  owner: string;
  description: string;
  location: string;
  timeAgo: string;
  urgency: "Urgent" | "Standard";
  category: string;
  image: StaticImageData;
  gallery: StaticImageData[];
  applicationId: string;
  submittedOn: string;
  registeredSince: string;
  email: string;
  phone: string;
};

const pendingBusinesses: PendingBusiness[] = [
  {
    name: "Le Petit Fournil",
    owner: "Jean-Pierre Dupont",
    description:
      "Le Petit Fournil is a family-owned artisanal bakery located in the heart of Paris, specializing in traditional sourdough breads and classic French pastries. Our mission is to bring the authentic taste of old-world boulangerie techniques to the modern city dweller. All our ingredients are sourced from local organic farms within the Île-de-France region, ensuring sustainability and peak flavor profile in every bite.",
    location: "12 Rue de la Paix, 75002 Paris, France",
    timeAgo: "2 hours ago",
    urgency: "Urgent",
    category: "Gastronomy",
    image: detailOneImage,
    gallery: [detailOneImage, detailTwoImage, detailThreeImage],
    applicationId: "#APP-2023-4412",
    submittedOn: "Oct 24, 2023 · 14:30",
    registeredSince: "Registered: Oct 2023",
    email: "jp.dupont@lepetitfournil.fr",
    phone: "+33 1 42 77 12 34",
  },
  {
    name: "Atelier Horizons",
    owner: "Sophie Martin",
    description:
      "Contemporary architecture studio focusing on eco-responsible urban design and residential projects across the Bordeaux region. The team blends sustainable materials with modern aesthetics to deliver spaces that respect both client and environment.",
    location: "45 Quai des Chartrons, 33000 Bordeaux, France",
    timeAgo: "5 hours ago",
    urgency: "Standard",
    category: "Services",
    image: detailTwoImage,
    gallery: [detailTwoImage, detailFourImage, detailOneImage],
    applicationId: "#APP-2023-4413",
    submittedOn: "Oct 24, 2023 · 09:05",
    registeredSince: "Registered: Sep 2023",
    email: "sophie.martin@atelierhorizons.fr",
    phone: "+33 5 56 44 21 09",
  },
  {
    name: "L'Éclat Zen",
    owner: "Marc Lefebvre",
    description:
      "Holistic wellness center offering traditional massage therapy, aromatherapy, and meditation sessions in a calm, minimalist setting inspired by Japanese onsen culture, located in the heart of Lyon.",
    location: "8 Route de Lyon, 69003 Lyon, France",
    timeAgo: "Yesterday",
    urgency: "Standard",
    category: "Wellness",
    image: detailThreeImage,
    gallery: [detailThreeImage, detailOneImage, detailFourImage],
    applicationId: "#APP-2023-4401",
    submittedOn: "Oct 23, 2023 · 11:47",
    registeredSince: "Registered: Aug 2023",
    email: "marc.lefebvre@eclatzen.fr",
    phone: "+33 4 78 92 15 60",
  },
];

const filters = [
  { label: "Date Range", value: "Last 7 Days", icon: FiCalendar },
  { label: "Category", value: "All Categories", icon: FiTag },
  { label: "Priority", value: "All Priority", icon: FiAlertCircle },
];

const summary = [
  { label: "Pending Total", value: pendingBusinesses.length, icon: FiClock, iconBg: "bg-[#e4f3ec]", iconColor: "text-[#00663f]" },
  {
    label: "Urgent Tasks",
    value: pendingBusinesses.filter((b) => b.urgency === "Urgent").length,
    icon: FiZap,
    iconBg: "bg-[#fdf1e2]",
    iconColor: "text-[#d99a3d]",
  },
  { label: "Avg. Review Time", value: "4.2 hrs", icon: FiClock, iconBg: "bg-slate-100", iconColor: "text-slate-500" },
];

export default function Pending() {
  const [activeBusiness, setActiveBusiness] = useState<PendingBusiness | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pending Approvals</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review and manage {pendingBusinesses.length} new business applications waiting for verification.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#004f31]"
        >
          <FiCheckCircle className="text-[16px]" />
          Bulk Approve
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <div
              key={filter.label}
              className="flex flex-1 min-w-[160px] items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
            >
              <Icon className="text-[15px] text-[#00663f]" />
              <div className="leading-tight">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{filter.label}</p>
                <p className="text-sm font-medium text-slate-700">{filter.value}</p>
              </div>
            </div>
          );
        })}
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100"
        >
          <FiFilter className="text-[16px]" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {pendingBusinesses.map((business) => (
          <div key={business.name} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="relative h-40 w-full">
              <Image src={business.image} alt={business.name} fill className="object-cover" />
              <div className="absolute left-3 top-3 flex gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                    business.urgency === "Urgent"
                      ? "bg-[#00663f] text-white"
                      : "bg-white/90 text-slate-600"
                  }`}
                >
                  {business.urgency}
                </span>
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#00663f]">
                  {business.category}
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold text-slate-900">{business.name}</h3>
                <span className="shrink-0 text-xs text-slate-400">{business.timeAgo}</span>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <FiUser className="text-[13px]" />
                {business.owner}
              </p>

              <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-500">{business.description}</p>

              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                <FiMapPin className="text-[13px]" />
                {business.location}
              </p>

              <button
                type="button"
                onClick={() => setActiveBusiness(business)}
                className="mx-auto mt-4 flex items-center gap-1.5 text-sm font-medium text-[#00663f] hover:underline"
              >
                View Full Details
                <FiExternalLink className="text-[13px]" />
              </button>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00663f] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
                >
                  <FiCheckCircle className="text-[15px]" />
                  Approve
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fde8e8] text-[#d9534f] transition-colors hover:bg-[#fbd4d4]"
                >
                  <FiTrash2 className="text-[15px]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-8 rounded-2xl bg-white p-5 shadow-sm">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full ${item.iconBg}`}>
                <Icon className={`text-[15px] ${item.iconColor}`} />
              </span>
              <div className="leading-tight">
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{item.label}</p>
                <p className="text-base font-bold text-slate-800">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {activeBusiness && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setActiveBusiness(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between p-6 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-bold text-[#00663f]">{activeBusiness.name}</h2>
                  <span className="rounded-full bg-[#fdf1e2] px-2.5 py-1 text-[11px] font-semibold text-[#d99a3d]">
                    Pending
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                  <FiCalendar className="text-[13px]" />
                  Business Application ID: {activeBusiness.applicationId}
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Submitted On</p>
                  <p className="text-sm font-bold text-slate-800">{activeBusiness.submittedOn}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveBusiness(null)}
                  className="text-slate-400 transition-colors hover:text-slate-600"
                >
                  <FiX className="text-[20px]" />
                </button>
              </div>
            </div>

            <div className="px-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Business Gallery</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="relative h-56 overflow-hidden rounded-xl">
                  <Image
                    src={activeBusiness.gallery[0]}
                    alt={activeBusiness.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="grid grid-rows-2 gap-2">
                  <div className="relative overflow-hidden rounded-xl">
                    <Image
                      src={activeBusiness.gallery[1]}
                      alt={activeBusiness.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-xl">
                    <Image
                      src={activeBusiness.gallery[2]}
                      alt={activeBusiness.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">About the Business</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#e4f3ec] px-2.5 py-1 text-xs font-medium text-[#00663f]">
                    {activeBusiness.category}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                    <FiCalendar className="text-[12px]" />
                    {activeBusiness.registeredSince}
                  </span>
                </div>
                <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-500">{activeBusiness.description}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Contact Information</p>
                <div className="mt-2 space-y-3 rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4f3ec] text-[#00663f]">
                      <FiUser className="text-[15px]" />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">Owner</p>
                      <p className="text-sm font-bold text-slate-800">{activeBusiness.owner}</p>
                    </div>
                  </div>
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <FiMail className="text-[14px] text-slate-400" />
                    {activeBusiness.email}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <FiPhone className="text-[14px] text-slate-400" />
                    {activeBusiness.phone}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <FiMapPin className="text-[14px] text-slate-400" />
                    {activeBusiness.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 p-6">
              <button
                type="button"
                className="rounded-xl border border-[#f1c3c1] px-5 py-2.5 text-sm font-semibold text-[#d9534f] transition-colors hover:bg-[#fde8e8]"
              >
                Reject
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-[#00663f] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
              >
                <FiCheckCircle className="text-[15px]" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
