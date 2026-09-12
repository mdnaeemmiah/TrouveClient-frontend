"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiClock } from "react-icons/fi";
import { ENDPOINTS } from "@/src/api/endPoints";
import baseApi from "@/src/api/baseApi";
import img1 from "@/src/assets/details/img1.png";
import type { Booking } from "@/src/data/bookings";

type ApiBooking = {
  _id?: string;
  id?: string;
  slug?: string;
  serviceName?: string;
  dateTime?: string;
  status?: string;
  business?: { name?: string; slug?: string; logo?: string; location?: { address?: string; city?: string } };
  businessId?: { name?: string; slug?: string; logo?: string; location?: { address?: string; city?: string } } | string;
};

function getBookingList(payload: unknown): ApiBooking[] {
  if (Array.isArray(payload)) return payload as ApiBooking[];
  if (!payload || typeof payload !== "object") return [];

  const response = payload as { data?: unknown; result?: unknown; bookings?: unknown };
  if (Array.isArray(response.bookings)) return response.bookings as ApiBooking[];
  if (Array.isArray(response.result)) return response.result as ApiBooking[];
  if (Array.isArray(response.data)) return response.data as ApiBooking[];
  if (response.data && typeof response.data === "object") return getBookingList(response.data);
  return [];
}

function toBooking(item: ApiBooking, index: number): Booking {
  const business = item.business || (typeof item.businessId === "object" ? item.businessId : undefined);
  const date = item.dateTime ? new Date(item.dateTime) : null;
  const validDate = date && !Number.isNaN(date.getTime()) ? date : null;

  return {
    slug: business?.slug || item.slug || item.businessId?.toString() || item._id || item.id || `booking-${index}`,
    image: business?.logo || img1,
    name: business?.name || "Business",
    detail: item.serviceName || "Booking",
    date: validDate ? validDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Date not provided",
    time: validDate ? validDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "",
    status: item.status === "CANCELLED" ? "Cancelled" : item.status === "COMPLETED" ? "Completed" : "Confirmed",
    reference: item._id || item.id || "",
    service: item.serviceName || "Booking",
    guests: "",
    address: [business?.location?.address, business?.location?.city].filter(Boolean).join(", "),
    phone: "",
    email: "",
    notes: "",
    cancellationPolicy: "",
    arrivalInstructions: "",
  };
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        const response = await baseApi.get(ENDPOINTS.getBookings);
        if (isMounted) setBookings(getBookingList(response.data).map(toBooking));
      } catch {
        if (isMounted) setError("Unable to load your bookings.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadBookings();
    return () => { isMounted = false; };
  }, []);

  const visibleBookings = [...bookings].reverse();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#00663f]">History</h1>
      <p className="mt-1 text-sm text-slate-500">Manage your reservations and appointments.</p>

      <div className="mt-6 space-y-4">
        {isLoading && (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
            Loading bookings...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-red-500 shadow-sm">
            {error}
          </div>
        )}

        {!isLoading && !error && visibleBookings.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
            No bookings to show.
          </div>
        )}

        {visibleBookings.map((booking) => (
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
