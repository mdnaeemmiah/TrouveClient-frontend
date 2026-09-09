"use client";

import { useEffect, useState } from "react";
import { FiClock, FiTrendingUp } from "react-icons/fi";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
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

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

const TAB_LABELS: Record<Tab, string> = {
  PENDING: "Pending Requests",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
};

const AVATAR_COLORS = [
  { bg: "bg-[#e4f3ec]", text: "text-[#00663f]" },
  { bg: "bg-[#e5ecfb]", text: "text-[#4a5fa5]" },
  { bg: "bg-[#fdf1e2]", text: "text-[#b17a3a]" },
  { bg: "bg-[#fce8e8]", text: "text-[#a53a3a]" },
];

function avatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

const forecastBars = [30, 42, 38, 55, 62, 90, 50];
const peakHours = [
  { time: "19:00 - 21:00", label: "High Demand", dot: "bg-[#00663f]", text: "text-slate-800" },
  { time: "12:00 - 14:00", label: "Moderate", dot: "bg-[#d99a3d]", text: "text-slate-500" },
  { time: "15:00 - 17:00", label: "Low Traffic", dot: "bg-slate-300", text: "text-slate-400" },
];

export default function Booking() {
  const [activeTab, setActiveTab] = useState<Tab>("PENDING");
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const res = await baseApi.get<{ data: ApiBooking[] }>(ENDPOINTS.bookingRequests);
        const data = res.data?.data ?? (Array.isArray(res.data) ? res.data as ApiBooking[] : []);
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
  const tabs: Tab[] = ["PENDING", "CONFIRMED", "CANCELLED"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Booking Requests</h1>
        <p className="mt-1 text-sm text-slate-500">Review and respond to incoming customer bookings.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-200">
            {tabs.map((tab) => {
              const count = bookings.filter((b) => b.status === tab).length;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 text-sm font-semibold transition-colors ${
                    activeTab === tab ? "text-[#00663f]" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {TAB_LABELS[tab]}{tab === "PENDING" && count > 0 ? ` (${count})` : ""}
                  {activeTab === tab && (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#00663f]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* List */}
          <div className="mt-4 space-y-4">
            {isLoading ? (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <p className="text-sm text-slate-400">Loading bookings...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <p className="text-sm text-slate-400">No {TAB_LABELS[activeTab].toLowerCase()} bookings yet.</p>
              </div>
            ) : (
              filtered.map((booking, index) => {
                const color = avatarColor(index);
                const initials = getInitials(booking.customerId.fullName);
                return (
                  <div key={booking._id} className="rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${color.bg} ${color.text}`}
                        >
                          {initials}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{booking.customerId.fullName}</p>
                          <p className="text-xs text-slate-400">{booking.customerId.email}</p>
                          <p className="text-xs font-medium text-[#00663f]">{booking.serviceName}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">
                          <Calendar size={13} className="text-slate-400" />
                          {formatDate(booking.dateTime)}
                        </div>
                        <p className="text-xs text-slate-400">{formatTime(booking.dateTime)}</p>
                        <span className={`mt-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          booking.status === "PENDING" ? "bg-amber-50 text-amber-600" :
                          booking.status === "CONFIRMED" ? "bg-[#e4f3ec] text-[#00663f]" :
                          "bg-red-50 text-red-500"
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    {booking.status === "PENDING" && (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#00663f] py-2 text-[13px] font-bold text-white hover:bg-[#00552f]"
                        >
                          <CheckCircle2 size={14} /> Confirm
                        </button>
                        <button
                          type="button"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 py-2 text-[13px] font-bold text-red-500 hover:bg-red-50"
                        >
                          <XCircle size={14} /> Decline
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Weekly Forecast</p>
              <FiTrendingUp className="text-[15px] text-[#00663f]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">€4,280.00</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-[#00663f]">
              <FiTrendingUp className="text-[12px]" /> +12% from last week
            </p>
            <div className="mt-4 flex h-20 items-end gap-1.5">
              {forecastBars.map((height, index) => (
                <div
                  key={index}
                  className={`flex-1 rounded-t-[3px] ${index === forecastBars.length - 2 ? "bg-[#00663f]" : "bg-[#00663f]/25"}`}
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

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Summary</p>
            <div className="mt-3 space-y-2">
              {tabs.map((tab) => (
                <div key={tab} className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{TAB_LABELS[tab]}</span>
                  <span className="font-bold text-slate-800">{bookings.filter((b) => b.status === tab).length}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}