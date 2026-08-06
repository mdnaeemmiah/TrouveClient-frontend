"use client";

import { useState } from "react";
import { FiBell, FiInfo, FiShield, FiUser } from "react-icons/fi";

type NotificationPref = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

const initialPreferences: NotificationPref[] = [
  {
    id: "email",
    label: "Email Notifications",
    description: "Booking confirmations, reminders, and business updates.",
    enabled: true,
  },
  {
    id: "sms",
    label: "SMS Notifications",
    description: "Text alerts for upcoming bookings and last-minute changes.",
    enabled: false,
  },
  {
    id: "push",
    label: "Push Notifications",
    description: "Real-time alerts on this device for saved business activity.",
    enabled: true,
  },
  {
    id: "marketing",
    label: "Marketing Emails",
    description: "Offers, promotions, and news from TrouveClients.fr.",
    enabled: false,
  },
];

export default function Settings() {
  const [preferences, setPreferences] = useState(initialPreferences);

  const togglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.map((pref) => (pref.id === id ? { ...pref, enabled: !pref.enabled } : pref))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account information, security, and notification preferences.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f3ec]">
            <FiUser className="text-[15px] text-[#00663f]" />
          </span>
          <h2 className="text-base font-semibold text-slate-900">Profile Information</h2>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-600">
            JD
          </span>
          <div>
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Change Photo
            </button>
            <p className="mt-1.5 text-xs text-slate-400">JPG or PNG. Max 2MB.</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm text-slate-500">Full Name</label>
            <input
              type="text"
              defaultValue="Jean Dubois"
              className="mt-1.5 w-full rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#00663f]/30"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500">Email Address</label>
            <input
              type="email"
              defaultValue="jean.dubois@example.com"
              className="mt-1.5 w-full rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#00663f]/30"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500">Phone Number</label>
            <input
              type="tel"
              defaultValue="+33 6 12 34 56 78"
              className="mt-1.5 w-full rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#00663f]/30"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500">City</label>
            <input
              type="text"
              defaultValue="Paris"
              className="mt-1.5 w-full rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#00663f]/30"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end border-t border-slate-100 pt-5">
          <button
            type="button"
            className="rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f3ec]">
            <FiShield className="text-[15px] text-[#00663f]" />
          </span>
          <h2 className="text-base font-semibold text-slate-900">Security</h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm text-slate-500">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              className="mt-1.5 w-full rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#00663f]/30"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500">New Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              className="mt-1.5 w-full rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#00663f]/30"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500">Confirm New Password</label>
            <input
              type="password"
              placeholder="Repeat new password"
              className="mt-1.5 w-full rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#00663f]/30"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <FiInfo className="text-[13px] text-[#00663f]" />
            Password must include a mix of letters, numbers, and symbols.
          </p>
          <button
            type="button"
            className="rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
          >
            Update Password
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f3ec]">
            <FiBell className="text-[15px] text-[#00663f]" />
          </span>
          <h2 className="text-base font-semibold text-slate-900">Notification Preferences</h2>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {preferences.map((pref) => (
            <div key={pref.id} className="flex items-center justify-between gap-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-slate-900">{pref.label}</p>
                <p className="mt-0.5 text-sm text-slate-500">{pref.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={pref.enabled}
                aria-label={pref.label}
                onClick={() => togglePreference(pref.id)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                  pref.enabled ? "bg-[#00663f]" : "bg-slate-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                    pref.enabled ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#f3d6d3] bg-[#fdf4f3] p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-[#c0524d]">Danger Zone</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            Deleting your account permanently removes your profile, saved businesses, and booking history.
          </p>
          <button
            type="button"
            className="shrink-0 rounded-xl border border-[#c0524d] bg-white px-4 py-2.5 text-sm font-semibold text-[#c0524d] transition-colors hover:bg-[#fbeceb]"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
