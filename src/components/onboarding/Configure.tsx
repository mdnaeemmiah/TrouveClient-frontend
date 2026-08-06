"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiMapPin,
  FiPlus,
  FiShare2,
} from "react-icons/fi";
import img4 from "@/src/assets/details/img4.png";

const AVAILABLE_SERVICES = [
  "Web Development",
  "UI/UX Design",
  "Marketing",
  "SEO Optimization",
  "Content Writing",
];

type DayHours = {
  day: string;
  open: boolean;
  start: string;
  end: string;
};

const INITIAL_HOURS: DayHours[] = [
  { day: "Monday", open: true, start: "09:00 AM", end: "06:00 PM" },
  { day: "Tuesday", open: true, start: "09:00 AM", end: "06:00 PM" },
  { day: "Wednesday", open: true, start: "09:00 AM", end: "06:00 PM" },
  { day: "Thursday", open: true, start: "09:00 AM", end: "06:00 PM" },
  { day: "Friday", open: true, start: "09:00 AM", end: "06:00 PM" },
  { day: "Saturday", open: true, start: "10:00 AM", end: "02:00 PM" },
  { day: "Sunday", open: false, start: "", end: "" },
];

export default function Configure() {
  const [selectedServices, setSelectedServices] = useState<string[]>(["Web Development"]);
  const [hours, setHours] = useState<DayHours[]>(INITIAL_HOURS);

  const toggleService = (service: string) => {
    setSelectedServices((current) =>
      current.includes(service) ? current.filter((item) => item !== service) : [...current, service]
    );
  };

  const toggleDay = (day: string) => {
    setHours((current) =>
      current.map((entry) => (entry.day === day ? { ...entry, open: !entry.open } : entry))
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h2 className="text-lg font-bold text-slate-900">Configure Your Business Details</h2>
        <p className="mt-1 text-sm text-slate-500">
          Help customers find you at the right time and understand exactly what you offer.
        </p>

        <div className="mt-5 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <FiShare2 className="text-[15px] text-[#00663f]" />
            Services Offered
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {AVAILABLE_SERVICES.map((service) => {
              const isSelected = selectedServices.includes(service);
              return (
                <button
                  key={service}
                  type="button"
                  onClick={() => toggleService(service)}
                  className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    isSelected
                      ? "border-[#00663f]/30 bg-[#e4f3ec] text-[#00663f]"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {service}
                  {isSelected ? <FiCheck className="text-[12px]" /> : <FiPlus className="text-[12px]" />}
                </button>
              );
            })}
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-dashed border-[#00663f]/40 px-3.5 py-1.5 text-sm font-medium text-[#00663f] hover:bg-[#e4f3ec]/40"
            >
              <FiPlus className="text-[12px]" />
              Add Custom Service
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <FiClock className="text-[15px] text-[#00663f]" />
            Opening Hours
          </h3>

          <div className="mt-4 divide-y divide-slate-100">
            {hours.map((entry) => (
              <div key={entry.day} className="flex flex-wrap items-center gap-4 py-3">
                <span className="w-20 shrink-0 text-sm font-medium text-slate-700">{entry.day}</span>

                <button
                  type="button"
                  onClick={() => toggleDay(entry.day)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    entry.open ? "bg-[#00663f]" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      entry.open ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className={`w-14 shrink-0 text-xs font-medium ${entry.open ? "text-slate-600" : "text-slate-400"}`}>
                  {entry.open ? "Open" : "Closed"}
                </span>

                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    disabled={!entry.open}
                    defaultValue={entry.start}
                    placeholder="--:--"
                    className="w-24 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/20 disabled:bg-slate-50 disabled:text-slate-300"
                  />
                  <span className="text-slate-300">–</span>
                  <input
                    type="text"
                    disabled={!entry.open}
                    defaultValue={entry.end}
                    placeholder="--:--"
                    className="w-24 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/20 disabled:bg-slate-50 disabled:text-slate-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/onboarding/contact"
            className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Back
          </Link>
          <Link
            href="/onboarding/showCase"
            className="flex items-center gap-2 rounded-full bg-[#00663f] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
          >
            Continue to Step 4
            <FiArrowRight className="text-[14px]" />
          </Link>
        </div>
      </div>

      <div className="space-y-5">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="relative h-32 w-full">
            <Image src={img4} alt="" fill className="object-cover" />
            <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
              <span className="rounded-full bg-[#00663f] px-2.5 py-1 text-[10px] font-semibold text-white">
                Live Card Preview
              </span>
              <span className="flex items-center gap-1 rounded-full bg-[#e4f3ec] px-2.5 py-1 text-[10px] font-semibold text-[#00663f]">
                <FiCheck className="text-[10px]" />
                Verified Business
              </span>
            </div>
          </div>

          <div className="space-y-3 p-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Business Name</h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                <FiMapPin className="text-[12px]" />
                Paris, France
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Selected Services
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                {selectedServices.length > 0 ? (
                  <>
                    <span className="rounded-full bg-[#e4f3ec] px-2.5 py-1 text-[11px] font-medium text-[#00663f]">
                      {selectedServices[0]}
                    </span>
                    {selectedServices.length > 1 && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                        +{selectedServices.length - 1} more
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-[11px] text-slate-400">No services selected</span>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Opening Hours</span>
                <span className="text-[10px] font-semibold text-[#00663f]">Open Now</span>
              </div>
              <div className="mt-2 space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Monday - Friday</span>
                  <span>09:00 - 18:00</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Saturday</span>
                  <span>10:00 - 14:00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Sunday</span>
                  <span className="font-medium text-[#c0524d]">Closed</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#00663f] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
            >
              View Profile
              <FiArrowRight className="text-[14px]" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <FiMapPin className="mt-0.5 shrink-0 text-[14px] text-amber-600" />
          <p className="text-xs text-amber-800">
            <span className="font-semibold">Pro Tip:</span> Businesses with detailed opening hours and at least 5
            services listed get 40% more inquiries on average.
          </p>
        </div>
      </div>
    </div>
  );
}
