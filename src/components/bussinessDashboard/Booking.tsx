"use client";

import { useState } from "react";
import { FiClock, FiTrendingUp } from "react-icons/fi";

type Tab = "Pending Requests" | "Confirmed" | "Cancelled";

type BookingRequest = {
  name: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  service: string;
  date: string;
  time: string;
  note: string;
};

const pendingRequests: BookingRequest[] = [
  {
    name: "Camille Bernard",
    initials: "CB",
    avatarBg: "bg-[#e4f3ec]",
    avatarColor: "text-[#00663f]",
    service: "Gourmet Dinner Service",
    date: "Oct 24, 2024",
    time: "19:30 · 4 Guests",
    note: "Celebrating our 10th anniversary. We would love a table near the window if possible. One of our guests has a gluten allergy.",
  },
  {
    name: "Marc Lefebvre",
    initials: "ML",
    avatarBg: "bg-[#e5ecfb]",
    avatarColor: "text-[#4a5fa5]",
    service: "Executive Haircut & Styling",
    date: "Oct 25, 2024",
    time: "14:00 · 1 Guest",
    note: "Coming in for a quick refresh before a conference.",
  },
  {
    name: "Sophie & Pierre",
    initials: "SP",
    avatarBg: "bg-[#fdf1e2]",
    avatarColor: "text-[#b17a3a]",
    service: "Wine Tasting Workshop",
    date: "Oct 26, 2024",
    time: "18:00 · 2 Guests",
    note: "First time visitors! Looking forward to learning about Bordeaux wines.",
  },
];

const tabs: Tab[] = ["Pending Requests", "Confirmed", "Cancelled"];

const forecastBars = [30, 42, 38, 55, 62, 90, 50];

const peakHours: { time: string; label: string; dot: string; text: string }[] = [
  { time: "19:00 - 21:00", label: "High Demand", dot: "bg-[#00663f]", text: "text-slate-800" },
  { time: "12:00 - 14:00", label: "Moderate", dot: "bg-[#d99a3d]", text: "text-slate-500" },
  { time: "15:00 - 17:00", label: "Low Traffic", dot: "bg-slate-300", text: "text-slate-400" },
];

export default function Booking() {
  const [activeTab, setActiveTab] = useState<Tab>("Pending Requests");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Booking Requests</h1>
        <p className="mt-1 text-sm text-slate-500">Review and respond to incoming customer bookings.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-6 border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 text-sm font-semibold transition-colors ${
                  activeTab === tab ? "text-[#00663f]" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab === "Pending Requests" ? `Pending Requests (${pendingRequests.length})` : tab}
                {activeTab === tab && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#00663f]" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            {activeTab === "Pending Requests" ? (
              pendingRequests.map((request) => (
                <div key={request.name} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${request.avatarBg} ${request.avatarColor}`}
                      >
                        {request.initials}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{request.name}</p>
                        <p className="text-xs font-medium text-[#00663f]">{request.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800">{request.date}</p>
                      <p className="text-xs text-slate-400">{request.time}</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-slate-50 p-3">
                    <p className="text-sm text-slate-500">&ldquo;{request.note}&rdquo;</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <p className="text-sm text-slate-400">
                  No {activeTab.toLowerCase()} bookings yet.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Weekly Forecast</p>
              <FiTrendingUp className="text-[15px] text-[#00663f]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">€4,280.00</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-[#00663f]">
              <FiTrendingUp className="text-[12px]" />
              +12% from last week
            </p>

            <div className="mt-4 flex h-20 items-end gap-1.5">
              {forecastBars.map((height, index) => (
                <div
                  key={index}
                  className={`flex-1 rounded-t-[3px] ${
                    index === forecastBars.length - 2 ? "bg-[#00663f]" : "bg-[#00663f]/25"
                  }`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Peak Hours</p>
              <FiClock className="text-[15px] text-[#d99a3d]" />
            </div>

            <div className="mt-3 space-y-3">
              {peakHours.map((slot) => (
                <div key={slot.time} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-slate-700">
                    <span className={`h-2 w-2 rounded-full ${slot.dot}`} />
                    {slot.time}
                  </span>
                  <span className={`text-xs font-semibold ${slot.text}`}>{slot.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
