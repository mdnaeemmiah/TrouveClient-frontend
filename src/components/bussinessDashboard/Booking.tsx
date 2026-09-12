"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiCalendar, FiClock, FiMail, FiTag, FiUser } from "react-icons/fi";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";
type Tab = "PENDING" | "CONFIRMED" | "CANCELLED";

type ApiBooking = {
  _id: string;
  customerId: { _id: string; fullName: string; email: string };
  businessId: { _id: string; name: string; slug: string; logo: string };
  serviceName: string;
  dateTime: string;
  status: BookingStatus;
  createdAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

const TAB_LABELS: Record<Tab, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
};

const STATUS_STYLE: Record<BookingStatus, string> = {
  PENDING:   "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
  CONFIRMED: "bg-[#e4f3ec] text-[#00663f] ring-1 ring-[#00663f]/20",
  CANCELLED: "bg-red-50 text-red-500 ring-1 ring-red-200",
};

const peakHours = [
  { time: "19:00 – 21:00", label: "High Demand", dot: "bg-[#00663f]", text: "text-slate-800" },
  { time: "12:00 – 14:00", label: "Moderate",    dot: "bg-[#d99a3d]", text: "text-slate-500" },
  { time: "15:00 – 17:00", label: "Low Traffic",  dot: "bg-slate-300",  text: "text-slate-400" },
];

const tabs: Tab[] = ["PENDING", "CONFIRMED", "CANCELLED"];

export default function Booking() {
  const [activeTab, setActiveTab] = useState<Tab>("PENDING");
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const res = await baseApi.get<{ data: ApiBooking[] }>(ENDPOINTS.bookingRequests);
        const data = res.data?.data ?? (Array.isArray(res.data) ? (res.data as ApiBooking[]) : []);
        setBookings(data);
      } catch {
        toast.error("Failed to load booking requests.");
      } finally {
        setIsLoading(false);
      }
    };
    void fetchBookings();
  }, []);

  const filtered = bookings.filter((b) => b.status === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Booking Requests</h1>
        <p className="mt-1 text-sm text-slate-500">Review and respond to incoming customer bookings.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Left: Tabs + Cards ── */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
            {tabs.map((tab) => {
              const count = bookings.filter((b) => b.status === tab).length;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-all ${
                    activeTab === tab
                      ? "bg-white text-[#00663f] shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {TAB_LABELS[tab]}
                  {count > 0 && (
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      tab === "PENDING" ? "bg-amber-100 text-amber-600" :
                      tab === "CONFIRMED" ? "bg-[#e4f3ec] text-[#00663f]" :
                      "bg-red-100 text-red-500"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Cards */}
          <div className="mt-4 space-y-4">
            {isLoading ? (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                <p className="text-sm text-slate-400">Loading bookings...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
                <p className="text-sm text-slate-400">No {TAB_LABELS[activeTab].toLowerCase()} bookings yet.</p>
              </div>
            ) : (
              filtered.map((booking) => (
                <div key={booking._id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                  {/* Top stripe per status */}
                  <div className={`h-1 w-full ${
                    booking.status === "PENDING" ? "bg-amber-400" :
                    booking.status === "CONFIRMED" ? "bg-[#00663f]" : "bg-red-400"
                  }`} />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      {/* Business logo + info */}
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#e4f3ec]">
                          {booking.businessId.logo ? (
                            <Image
                              src={booking.businessId.logo}
                              alt={booking.businessId.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="grid h-full place-items-center text-lg font-bold text-[#00663f]">
                              {booking.businessId.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{booking.businessId.name}</p>
                          <span className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLE[booking.status]}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      {/* Date & time */}
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                          <FiCalendar className="text-slate-400" />
                          {formatDate(booking.dateTime)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <FiClock />
                          {formatTime(booking.dateTime)}
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="my-4 border-t border-slate-100" />

                    {/* Customer + service */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <FiUser className="shrink-0 text-[#00663f]" />
                        <span className="font-semibold">{booking.customerId.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <FiMail className="shrink-0 text-slate-400" />
                        <span className="truncate">{booking.customerId.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <FiTag className="shrink-0 text-[#00663f]" />
                        <span className="font-semibold text-[#00663f]">{booking.serviceName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {/* Peak Hours */}
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

          {/* Summary */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Summary</p>
            <div className="mt-3 space-y-2">
              {tabs.map((tab) => (
                <div key={tab} className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{TAB_LABELS[tab]}</span>
                  <span className="font-bold text-slate-800">
                    {bookings.filter((b) => b.status === tab).length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
