"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { BadgeCheck, Calendar, MapPin, Users, Utensils, X } from "lucide-react";

const TIME_SLOTS = ["12:00", "12:30", "13:00", "13:30", "19:00", "19:30", "20:00", "21:00"];

type BookTableButtonProps = {
  businessName: string;
  location: string;
  category: string;
  image: StaticImageData;
};

export default function BookTableButton({ businessName, location, category, image }: BookTableButtonProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("2024-11-20");
  const [guests, setGuests] = useState("2");
  const [time, setTime] = useState("12:30");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [requests, setRequests] = useState("");

  const closeAndReset = () => {
    setOpen(false);
    setDate("2024-11-20");
    setGuests("2");
    setTime("12:30");
    setFullName("");
    setPhone("");
    setEmail("");
    setRequests("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 rounded-lg bg-[#00663f] py-2.5 text-[13px] font-bold text-white hover:bg-[#00552f]"
      >
        <Calendar size={16} /> Book Now
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeAndReset}
        >
          <div
            className="grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl sm:grid-cols-[1fr_1.4fr]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative hidden min-h-[520px] sm:block">
              <Image src={image} alt={businessName} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-[#00663f] px-3 py-1 text-[11px] font-bold text-white">
                <BadgeCheck size={13} /> Verified Premium Partner
              </span>
              <div className="absolute inset-x-4 bottom-4 text-white">
                <p className="text-lg font-bold">{businessName}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-[12px] text-white/85">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} /> {location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Utensils size={13} /> {category}
                  </span>
                </div>
              </div>
            </div>

            <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#1c1d22]">Book a Table</h3>
                  <p className="mt-0.5 text-[13px] text-[#5c6168]">Confirm your reservation in seconds</p>
                </div>
                <button
                  type="button"
                  onClick={closeAndReset}
                  className="text-[#5c6168] transition-colors hover:text-[#1c1d22]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[13px] font-semibold text-[#1c1d22]">Select Date</label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#e1e3e6] px-3 py-2.5">
                    <Calendar size={15} className="shrink-0 text-[#00663f]" />
                    <input
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      className="w-full text-[13px] text-[#1c1d22] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[#1c1d22]">Number of Guests</label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#e1e3e6] px-3 py-2.5">
                    <Users size={15} className="shrink-0 text-[#00663f]" />
                    <select
                      value={guests}
                      onChange={(event) => setGuests(event.target.value)}
                      className="w-full bg-transparent text-[13px] text-[#1c1d22] outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                        <option key={count} value={count}>
                          {count} Guest{count > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-semibold text-[#1c1d22]">Available Times</label>
                  <span className="text-[11px] text-[#8a8d91]">Central European Time</span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`rounded-lg border py-2 text-[13px] font-medium transition-colors ${
                        time === slot
                          ? "border-[#00663f] bg-[#00663f] text-white"
                          : "border-[#e1e3e6] text-[#3a3d40] hover:bg-[#f7f7fa]"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 border-t border-[#eef0f1] pt-5">
                <p className="text-[13px] font-semibold text-[#1c1d22]">Personal Details</p>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Full Name"
                    className="rounded-xl border border-[#e1e3e6] px-3.5 py-2.5 text-[13px] text-[#1c1d22] outline-none placeholder:text-[#9a9da1] focus:ring-2 focus:ring-[#00663f]/30"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Phone Number"
                    className="rounded-xl border border-[#e1e3e6] px-3.5 py-2.5 text-[13px] text-[#1c1d22] outline-none placeholder:text-[#9a9da1] focus:ring-2 focus:ring-[#00663f]/30"
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email Address"
                  className="mt-3 w-full rounded-xl border border-[#e1e3e6] px-3.5 py-2.5 text-[13px] text-[#1c1d22] outline-none placeholder:text-[#9a9da1] focus:ring-2 focus:ring-[#00663f]/30"
                />
              </div>

              <div className="mt-4">
                <label className="text-[13px] font-semibold text-[#1c1d22]">Special Requests (Optional)</label>
                <textarea
                  value={requests}
                  onChange={(event) => setRequests(event.target.value)}
                  rows={2}
                  placeholder="e.g. Window seat, food allergies..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-[#e1e3e6] px-3.5 py-2.5 text-[13px] text-[#1c1d22] outline-none placeholder:text-[#9a9da1] focus:ring-2 focus:ring-[#00663f]/30"
                />
              </div>

              <div className="mt-5 flex items-center gap-4">
                <button
                  type="button"
                  onClick={closeAndReset}
                  className="flex-1 rounded-xl bg-[#00663f] py-3 text-[13px] font-bold text-white hover:bg-[#00552f]"
                >
                  Confirm Booking
                </button>
                <button
                  type="button"
                  onClick={closeAndReset}
                  className="text-[13px] font-semibold text-[#5c6168] hover:text-[#1c1d22]"
                >
                  Cancel
                </button>
              </div>
              <p className="mt-3 text-center text-[11px] text-[#9a9da1]">
                By confirming, you agree to our <span className="text-[#00663f]">Terms</span> and{" "}
                <span className="text-[#00663f]">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
