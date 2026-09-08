"use client";

import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAtSign,
  FiBell,
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiMessageSquare,
  FiShield,
  FiSliders,
  FiZap,
} from "react-icons/fi";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? "bg-[#00663f]" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function SectionCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  children,
  action,
}: {
  icon: IconType;
  iconBg: string;
  iconColor: string;
  title: string;
  children: React.ReactNode;
  action: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`text-[15px] ${iconColor}`} />
        </span>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>

      <div className="mt-5 space-y-5">{children}</div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          className="rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
        >
          {action}
        </button>
      </div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: IconType;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-2.5">
        <Icon className="mt-0.5 text-[15px] text-slate-400" />
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="mt-0.5 text-xs text-slate-400">{description}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function Settings() {
  const [profileEmail, setProfileEmail] = useState("");
  const [require2fa, setRequire2fa] = useState(true);
  const [autoApprove, setAutoApprove] = useState(true);
  const [aiReview, setAiReview] = useState(true);
  const [hideInactive, setHideInactive] = useState(false);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [emailDigests, setEmailDigests] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  useEffect(() => {
    baseApi.get(ENDPOINTS.getUserProfile)
      .then((response) => {
        const user = response.data?.data?.user ?? response.data?.data ?? response.data;
        setProfileEmail(user?.email ?? "");
      })
      .catch(() => setProfileEmail(""));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure global platform controls and security protocols for the Motor Bridge directory.
        </p>
      </div>

      <SectionCard icon={FiGlobe} iconBg="bg-[#e4f3ec]" iconColor="text-[#00663f]" title="General Settings" action="Save Changes">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-500">Site Title</label>
            <input
              type="text"
              defaultValue="Motor Bridge French Business Directory"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#00663f]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Contact Email</label>
            <input
              type="email"
              value={profileEmail}
              onChange={(event) => setProfileEmail(event.target.value)}
              placeholder="Loading current user email..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#00663f]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500">Platform Description</label>
          <textarea
            defaultValue="The premier curated directory for trusted French enterprises and professional services."
            rows={3}
            className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#00663f]"
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={FiShield}
        iconBg="bg-[#fbe2e2]"
        iconColor="text-[#c0524d]"
        title="Security & Authentication"
        action="Update Security Policy"
      >
        <ToggleRow
          icon={FiShield}
          title="Two-Factor Authentication (2FA)"
          description="Require 2FA for all administrator accounts."
          checked={require2fa}
          onChange={() => setRequire2fa((prev) => !prev)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-500">Session Timeout (Minutes)</label>
            <select
              defaultValue="60 Minutes"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#00663f]"
            >
              <option>15 Minutes</option>
              <option>30 Minutes</option>
              <option>60 Minutes</option>
              <option>120 Minutes</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Password Expiry Policy</label>
            <select
              defaultValue="90 Days"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#00663f]"
            >
              <option>30 Days</option>
              <option>60 Days</option>
              <option>90 Days</option>
              <option>Never</option>
            </select>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={FiSliders}
        iconBg="bg-[#fdf1e2]"
        iconColor="text-[#b17a3a]"
        title="Content Moderation"
        action="Save Moderation Rules"
      >
        <ToggleRow
          icon={FiZap}
          title="Auto-approve Verified Listings"
          description="Bypasses manual review for businesses with validated SIRET numbers."
          checked={autoApprove}
          onChange={() => setAutoApprove((prev) => !prev)}
        />
        <ToggleRow
          icon={FiEye}
          title="AI Review Sentiment Analysis"
          description="Flag reviews with high toxic probability for immediate manual review."
          checked={aiReview}
          onChange={() => setAiReview((prev) => !prev)}
        />
        <ToggleRow
          icon={FiEyeOff}
          title="Hide Inactive Profiles"
          description="Automatically delist businesses that haven't updated in 12 months."
          checked={hideInactive}
          onChange={() => setHideInactive((prev) => !prev)}
        />
      </SectionCard>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5ecfb]">
            <FiBell className="text-[15px] text-[#4a5fa5]" />
          </span>
          <h2 className="text-base font-bold text-slate-900">Notification Preferences</h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: FiBell,
              title: "In-App Alerts",
              description: "Real-time admin dashboard notifications.",
              checked: inAppAlerts,
              onChange: () => setInAppAlerts((prev) => !prev),
            },
            {
              icon: FiAtSign,
              title: "Email Digests",
              description: "Weekly summary of platform activity.",
              checked: emailDigests,
              onChange: () => setEmailDigests((prev) => !prev),
            },
            {
              icon: FiMessageSquare,
              title: "SMS Critical Alerts",
              description: "Text alerts for high-severity security issues.",
              checked: smsAlerts,
              onChange: () => setSmsAlerts((prev) => !prev),
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 p-4 text-center">
              <item.icon className="text-[18px] text-slate-500" />
              <p className="text-sm font-semibold text-slate-800">{item.title}</p>
              <p className="text-xs text-slate-400">{item.description}</p>
              <Toggle checked={item.checked} onChange={item.onChange} />
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
          >
            Save Notification Settings
          </button>
        </div>
      </div>
    </div>
  );
}
