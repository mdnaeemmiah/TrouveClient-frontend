"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiFileText,
  FiLoader,
  FiMail,
  FiMap,
  FiMapPin,
  FiPhone,
  FiUsers,
} from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import { getBookingBySlug } from "@/src/data/bookings";
import type { Booking } from "@/src/data/bookings";

type ApiBooking = {
  _id?: string;
  id?: string;
  slug?: string;
  serviceName?: string;
  dateTime?: string;
  status?: string;
  notes?: string;
  guests?: string | number;
  business?: {
    name?: string;
    slug?: string;
    logo?: string;
    location?: { address?: string; city?: string };
    phone?: string;
    email?: string;
  };
  businessId?:
    | {
        name?: string;
        slug?: string;
        logo?: string;
        location?: { address?: string; city?: string };
        phone?: string;
        email?: string;
      }
    | string;
};

function apiToBooking(item: ApiBooking): Booking {
  const business =
    item.business ||
    (typeof item.businessId === "object" ? item.businessId : undefined);
  const date = item.dateTime ? new Date(item.dateTime) : null;
  const validDate = date && !Number.isNaN(date.getTime()) ? date : null;

  return {
    slug:
      business?.slug ||
      item.slug ||
      item._id ||
      item.id ||
      "booking",
    image:
      business?.logo || "",
    name: business?.name || "Business",
    detail: item.serviceName || "Booking",
    date: validDate
      ? validDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Date not provided",
    time: validDate
      ? validDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    status:
      item.status === "CANCELLED"
        ? "Cancelled"
        : item.status === "COMPLETED"
        ? "Completed"
        : "Confirmed",
    reference: item._id || item.id || "",
    service: item.serviceName || "Booking",
    guests: item.guests ? String(item.guests) : "",
    address: [business?.location?.address, business?.location?.city]
      .filter(Boolean)
      .join(", "),
    phone: business?.phone || "",
    email: business?.email || "",
    notes: item.notes || "",
    cancellationPolicy: "",
    arrivalInstructions: "",
  };
}

const statusStyles: Record<Booking["status"], string> = {
  Confirmed: "bg-[#e4f3ec] text-[#00663f]",
  Completed: "bg-slate-100 text-slate-600",
  Cancelled: "bg-[#fbeceb] text-[#c0524d]",
};

export default function BookingDetailsPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // First check static data
    const staticBooking = getBookingBySlug(slug);
    if (staticBooking) {
      setBooking(staticBooking);
      setIsLoading(false);
      return;
    }

    // Otherwise fetch from API
    baseApi
      .get(ENDPOINTS.getBookings)
      .then((response) => {
        const data = response.data;
        const list: ApiBooking[] = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        const found = list.find((item) => {
          const biz =
            item.business ||
            (typeof item.businessId === "object" ? item.businessId : undefined);
          return (
            biz?.slug === slug ||
            item.slug === slug ||
            item._id === slug ||
            item.id === slug
          );
        });

        if (found) {
          setBooking(apiToBooking(found));
        } else {
          setError("Booking not found.");
        }
      })
      .catch(() => {
        setError("Failed to load booking details.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-16 text-center shadow-sm">
        <FiLoader className="animate-spin text-2xl text-[#00663f]" />
        <p className="mt-3 text-sm text-slate-500">Loading booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-red-500">{error || "Booking not found."}</p>
        <Link
          href="/userDashboard/myBookings"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#00663f] hover:underline"
        >
          <FiArrowLeft className="text-[14px]" />
          Back to my bookings
        </Link>
      </div>
    );
  }

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
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}
            >
              {booking.status}
            </span>
            {booking.reference && (
              <span className="text-sm text-slate-500">
                Reference: {booking.reference}
              </span>
            )}
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
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Service
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {booking.service || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4f3ec] text-[#00663f]">
                  <FiCalendar className="text-[16px]" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Date
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {booking.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4f3ec] text-[#00663f]">
                  <FiClock className="text-[16px]" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Time
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {booking.time || "N/A"}
                  </p>
                </div>
              </div>

              {booking.guests && (
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4f3ec] text-[#00663f]">
                    <FiUsers className="text-[16px]" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Guests
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {booking.guests}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {booking.notes && (
            <div className="rounded-2xl bg-slate-100 p-5">
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <FiFileText className="text-[15px] text-slate-500" />
                Booking Notes
              </h2>
              <p className="mt-3 rounded-xl bg-white p-4 text-sm italic text-slate-600 shadow-sm">
                &ldquo;{booking.notes}&rdquo;
              </p>
            </div>
          )}

          {(booking.cancellationPolicy || booking.arrivalInstructions) && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {booking.cancellationPolicy && (
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#00663f]">
                    Cancellation Policy
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {booking.cancellationPolicy}
                  </p>
                </div>
              )}
              {booking.arrivalInstructions && (
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#00663f]">
                    Arrival Instructions
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {booking.arrivalInstructions}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {(booking.address || booking.phone || booking.email) && (
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-[#00663f]">
                Contact &amp; Access
              </h2>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                {booking.address && (
                  <div className="flex items-start gap-2.5">
                    <FiMapPin className="mt-0.5 shrink-0 text-[15px] text-slate-400" />
                    <span>{booking.address}</span>
                  </div>
                )}
                {booking.phone && (
                  <div className="flex items-center gap-2.5">
                    <FiPhone className="shrink-0 text-[15px] text-slate-400" />
                    <span>{booking.phone}</span>
                  </div>
                )}
                {booking.email && (
                  <div className="flex items-start gap-2.5">
                    <FiMail className="mt-0.5 shrink-0 text-[15px] text-slate-400" />
                    <span className="break-all">{booking.email}</span>
                  </div>
                )}
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
          )}

          <div className="rounded-2xl border border-[#f3d6d3] bg-[#fdf4f3] p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-[#c0524d]">
              Danger Zone
            </p>
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
