"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiClock } from "react-icons/fi";
import { upcomingBookings, pastBookings } from "@/src/data/bookings";

type Tab = "Upcoming" | "Past Bookings";
const tabs: Tab[] = ["Upcoming", "Past Bookings"];

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState<Tab>("Upcoming");
  const bookings = activeTab === "Upcoming" ? upcomingBookings : pastBookings;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#00663f]">My Bookings</h1>
      <p className="mt-1 text-sm text-slate-500">Manage your reservations and appointments.</p>

      <div className="mt-6 flex items-center gap-6 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`relative pb-3 text-sm font-semibold transition-colors ${
              activeTab === tab ? "text-[#00663f]" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#00663f]" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {bookings.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
            No bookings to show.
          </div>
        )}

        {bookings.map((booking) => (
          <div
            key={booking.slug}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              <Image src={booking.image} alt={booking.name} fill className="object-cover" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-slate-900">{booking.name}</p>
              <p className="text-sm text-slate-500">{booking.detail}</p>
              <div className="mt-1.5 flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="text-[14px]" />
                  {booking.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiClock className="text-[14px]" />
                  {booking.time}
                </span>
              </div>
            </div>

            <Link
              href={`/userDashboard/myBookings/${booking.slug}`}
              className="shrink-0 rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
