"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCrosshair,
  FiGlobe,
  FiInfo,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
  FiZoomIn,
} from "react-icons/fi";
import { FaFacebookF } from "react-icons/fa";

export default function Contact() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
        <h2 className="text-lg font-bold text-slate-900">Contact &amp; Address</h2>
        <p className="mt-1 text-sm text-slate-500">
          Help customers reach you by providing your business contact details and location.
        </p>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <FiPhone className="text-[15px] text-[#00663f]" />
            Contact Information
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Phone Number</label>
              <div className="mt-1.5 flex items-center rounded-lg border border-slate-200 px-3 focus-within:border-[#00663f] focus-within:ring-2 focus-within:ring-[#00663f]/20">
                <FiPhone className="text-[14px] text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+33 1 23 45 67 89"
                  className="w-full bg-transparent py-2.5 pl-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="mt-1.5 flex items-center rounded-lg border border-slate-200 px-3 focus-within:border-[#00663f] focus-within:ring-2 focus-within:ring-[#00663f]/20">
                <FiMail className="text-[14px] text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="contact@votre-entreprise.fr"
                  className="w-full bg-transparent py-2.5 pl-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium text-slate-700">Website URL (Optional)</label>
            <div className="mt-1.5 flex items-center rounded-lg border border-slate-200 px-3 focus-within:border-[#00663f] focus-within:ring-2 focus-within:ring-[#00663f]/20">
              <FiGlobe className="text-[14px] text-slate-400" />
              <input
                type="url"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                placeholder="https://www.votre-entreprise.fr"
                className="w-full bg-transparent py-2.5 pl-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <FiInstagram className="text-[15px] text-[#00663f]" />
            Social Presence
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Facebook</label>
              <div className="mt-1.5 flex items-center rounded-lg border border-slate-200 px-3 focus-within:border-[#00663f] focus-within:ring-2 focus-within:ring-[#00663f]/20">
                <FaFacebookF className="text-[13px] text-slate-400" />
                <input
                  type="text"
                  value={facebook}
                  onChange={(event) => setFacebook(event.target.value)}
                  placeholder="facebook.com/votre-page"
                  className="w-full bg-transparent py-2.5 pl-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Instagram</label>
              <div className="mt-1.5 flex items-center rounded-lg border border-slate-200 px-3 focus-within:border-[#00663f] focus-within:ring-2 focus-within:ring-[#00663f]/20">
                <FiInstagram className="text-[14px] text-slate-400" />
                <input
                  type="text"
                  value={instagram}
                  onChange={(event) => setInstagram(event.target.value)}
                  placeholder="@votre_entreprise"
                  className="w-full bg-transparent py-2.5 pl-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <FiMapPin className="text-[15px] text-[#00663f]" />
            Location Details
          </h3>

          <div className="mt-4">
            <label className="text-sm font-medium text-slate-700">Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="123 Rue de la Liberté"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/20"
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                placeholder="75000"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">City</label>
              <input
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Paris"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/20"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium text-slate-700">Pin your exact location</label>
            <div className="relative mt-1.5 h-48 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 bg-[linear-gradient(to_right,rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.35)_1px,transparent_1px)] bg-[size:24px_24px]">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <FiMapPin className="text-[32px] text-[#00663f] drop-shadow-md" />
              </div>
              <div className="absolute bottom-3 right-3 flex flex-col gap-2">
                <button
                  type="button"
                  aria-label="Center on my location"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm hover:text-[#00663f]"
                >
                  <FiCrosshair className="text-[14px]" />
                </button>
                <button
                  type="button"
                  aria-label="Zoom in"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm hover:text-[#00663f]"
                >
                  <FiZoomIn className="text-[14px]" />
                </button>
              </div>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              Drag the pin to adjust if the automatic detection is inaccurate.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
          <Link
            href="/onboarding/grow"
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            <FiArrowLeft className="text-[14px]" />
            Previous Step
          </Link>
          <Link
            href="/onboarding/details"
            className="flex items-center gap-2 rounded-xl bg-[#00663f] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
          >
            Continue to Step 3
            <FiArrowRight className="text-[14px]" />
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="relative h-28 w-full bg-gradient-to-br from-slate-700 to-slate-900">
            <span className="absolute left-2 top-2 rounded-md bg-[#00663f] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Preview
            </span>
          </div>
          <div className="space-y-2.5 p-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Votre Entreprise</h3>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#00663f]">
                Services Professionnels
              </p>
            </div>

            <div className="space-y-1.5 border-t border-slate-100 pt-2.5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FiMapPin className="text-[12px]" />
                {address ? `${address}, ${postalCode} ${city}` : "Adresse non renseignée"}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FiPhone className="text-[12px]" />
                {phone || "Téléphone non renseigné"}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FiMail className="text-[12px]" />
                {email || "Email non renseigné"}
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-slate-100 pt-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FaFacebookF className="text-[10px]" />
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FiInstagram className="text-[12px]" />
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FiGlobe className="text-[12px]" />
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <div className="flex items-center gap-2">
            <FiInfo className="text-[15px] text-[#00663f]" />
            <h3 className="text-sm font-bold text-slate-900">Quick Tip</h3>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Businesses with complete contact information and a physical address receive 3x more inquiries from
            potential customers.
          </p>
        </div>
      </div>
    </div>
  );
}
