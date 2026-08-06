"use client";

import Link from "next/link";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiFileText,
  FiMail,
  FiMap,
  FiMapPin,
  FiPhone,
  FiUsers,
} from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import type { Booking } from "@/src/data/bookings";

const statusStyles: Record<Booking["status"], string> = {
  Confirmed: "bg-[#e4f3ec] text-[#00663f]",
  Completed: "bg-slate-100 text-slate-600",
  Cancelled: "bg-[#fbeceb] text-[#c0524d]",
};

type BookingDetailsProps = {
  booking: Booking;
};

export default function BookingDetails({ booking }: BookingDetailsProps) {
  return (
    <div>
      <Link
        href="/userDashboard/myBookings"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00663f] hover:underline"
      >
        <FiArrowLeft className="text-[14px]" />
        Back to my bookings
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#00663f]">{booking.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}>
              {booking.status}
            </span>
            <span className="text-sm text-slate-500">Reference: {booking.reference}</span>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          <FiCalendar className="text-[15px]" />
          Add to calendar
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-[#00663f]">Visit Details</h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4f3ec] text-[#00663f]">
                  <FaUtensils className="text-[16px]" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Service</p>
                  <p className="text-sm font-bold text-slate-900">{booking.service}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4f3ec] text-[#00663f]">
                  <FiCalendar className="text-[16px]" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Date</p>
                  <p className="text-sm font-bold text-slate-900">{booking.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4f3ec] text-[#00663f]">
                  <FiClock className="text-[16px]" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Time</p>
                  <p className="text-sm font-bold text-slate-900">{booking.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4f3ec] text-[#00663f]">
                  <FiUsers className="text-[16px]" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Guests</p>
                  <p className="text-sm font-bold text-slate-900">{booking.guests}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-100 p-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <FiFileText className="text-[15px] text-slate-500" />
              Booking Notes
            </h2>
            <p className="mt-3 rounded-xl bg-white p-4 text-sm italic text-slate-600 shadow-sm">
              &ldquo;{booking.notes}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-[#00663f]">Cancellation Policy</p>
              <p className="mt-2 text-sm text-slate-600">{booking.cancellationPolicy}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-[#00663f]">Arrival Instructions</p>
              <p className="mt-2 text-sm text-slate-600">{booking.arrivalInstructions}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-[#00663f]">Contact &amp; Access</h2>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-2.5">
                <FiMapPin className="mt-0.5 shrink-0 text-[15px] text-slate-400" />
                <span>{booking.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPhone className="shrink-0 text-[15px] text-slate-400" />
                <span>{booking.phone}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <FiMail className="mt-0.5 shrink-0 text-[15px] text-slate-400" />
                <span className="break-all">{booking.email}</span>
              </div>
            </div>

            <div className="relative mt-4 flex h-28 items-center justify-center overflow-hidden rounded-xl bg-[repeating-linear-gradient(45deg,#eef2ee,#eef2ee_10px,#e4ece4_10px,#e4ece4_20px)]">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#00663f] shadow"
              >
                <FiMap className="text-[14px]" />
                Open Map
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#f3d6d3] bg-[#fdf4f3] p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-[#c0524d]">Danger Zone</p>
            <p className="mt-2 text-sm text-slate-600">
              Something come up? You can cancel your reservation at any time.
            </p>
            <button
              type="button"
              className="mt-4 w-full rounded-xl border border-[#c0524d] bg-white py-2.5 text-sm font-semibold text-[#c0524d] transition-colors hover:bg-[#fbeceb]"
            >
              Cancel Reservation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
