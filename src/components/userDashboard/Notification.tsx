"use client";

import { useState } from "react";
import { FiCheckCircle, FiTrash2 } from "react-icons/fi";
import type { IconType } from "react-icons";
import { FaBreadSlice, FaLaptopCode, FaSeedling, FaUtensils } from "react-icons/fa";

type Tab = "updates" | "reminders";

type BusinessUpdate = {
  id: string;
  icon: IconType;
  iconBg: string;
  iconColor: string;
  name: string;
  time: string;
  unread: boolean;
  lead?: string;
  body: string;
  cta?: string;
};

const businessUpdates: BusinessUpdate[] = [
  {
    id: "bistrot-menu",
    icon: FaUtensils,
    iconBg: "bg-[#fdece9]",
    iconColor: "text-[#c0524d]",
    name: "Le Bistrot Parisien",
    time: "Il y a 10 min",
    unread: true,
    lead: "Nouveau Menu !",
    body: "Venez découvrir notre carte d'automne revisitée par le Chef Laurent.",
    cta: "Voir le menu",
  },
  {
    id: "atelier-floral-arrivage",
    icon: FaSeedling,
    iconBg: "bg-[#e4f3ec]",
    iconColor: "text-[#00663f]",
    name: "L'Atelier Floral",
    time: "Il y a 2h",
    unread: true,
    lead: "Arrivage du jour.",
    body: "Des pivoines fraîches viennent d'arriver pour votre week-end.",
  },
  {
    id: "boulangerie-commande",
    icon: FaBreadSlice,
    iconBg: "bg-[#fdf1e2]",
    iconColor: "text-[#b17a3a]",
    name: "Boulangerie Artisanale",
    time: "Hier",
    unread: false,
    body: "Votre commande de pain surprise est prête à être retirée.",
  },
];

type Reminder = {
  id: string;
  icon: IconType;
  iconBg: string;
  iconColor: string;
  name: string;
  date: string;
  quote: string;
};

const reminders: Reminder[] = [
  {
    id: "le-petit-fournil",
    icon: FaBreadSlice,
    iconBg: "bg-[#fdf1e2]",
    iconColor: "text-[#b17a3a]",
    name: "Le Petit Fournil",
    date: "Oct 24, 2024 · 14:00",
    quote: "Flash Sale: 50% off all pastries before closing. Don't forget to grab the…",
  },
  {
    id: "innovate-paris",
    icon: FaLaptopCode,
    iconBg: "bg-[#e4f3ec]",
    iconColor: "text-[#00663f]",
    name: "Innovate Paris",
    date: "Oct 28, 2024 · 09:30",
    quote: "Webinar on SEO for Local Businesses. Check the registration link in the original…",
  },
];

export default function Notification() {
  const [activeTab, setActiveTab] = useState<Tab>("updates");
  const unreadCount = businessUpdates.filter((update) => update.unread).length;

  return (
    <div>
      {activeTab === "updates" ? (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            <p className="mt-1 text-sm text-slate-500">Restez informé des actualités de vos commerces préférés.</p>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-semibold text-[#00663f] hover:underline"
          >
            <FiCheckCircle className="text-[14px]" />
            Tout marquer comme lu
          </button>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Reminders</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your alerts for saved business offers and limited-time deals.</p>
        </div>
      )}

      <div className="mt-5 flex items-center gap-6 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("updates")}
          className={`relative flex items-center gap-2 pb-3 text-sm font-semibold transition-colors ${
            activeTab === "updates" ? "text-[#00663f]" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Business Updates
          <span
            className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
              activeTab === "updates" ? "bg-[#00663f] text-white" : "bg-slate-200 text-slate-500"
            }`}
          >
            {unreadCount}
          </span>
          {activeTab === "updates" && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#00663f]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reminders")}
          className={`relative flex items-center gap-2 pb-3 text-sm font-semibold transition-colors ${
            activeTab === "reminders" ? "text-[#00663f]" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          My Reminders
          <span
            className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
              activeTab === "reminders" ? "bg-[#00663f] text-white" : "bg-slate-200 text-slate-500"
            }`}
          >
            {reminders.length}
          </span>
          {activeTab === "reminders" && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#00663f]" />
          )}
        </button>
      </div>

      {activeTab === "updates" ? (
        <div className="mt-5 space-y-3">
          {businessUpdates.map((update) => {
            const Icon = update.icon;

            return (
              <div
                key={update.id}
                className={`rounded-2xl p-4 shadow-sm ${update.unread ? "bg-[#f2f9f5]" : "bg-white"}`}
              >
                <div className="flex gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${update.iconBg}`}
                  >
                    <Icon className={`text-[16px] ${update.iconColor}`} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-bold text-slate-900">{update.name}</p>
                      <span className="flex shrink-0 items-center gap-1.5 text-xs text-slate-400">
                        {update.time}
                        {update.unread && <span className="h-1.5 w-1.5 rounded-full bg-[#00663f]" />}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm text-slate-600 ${!update.unread ? "italic" : ""}`}>
                      {update.lead && <span className="font-semibold text-slate-900">{update.lead} </span>}
                      {update.body}
                    </p>
                    {update.cta && (
                      <button
                        type="button"
                        className="mt-2.5 rounded-full bg-[#00663f] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#004f31]"
                      >
                        {update.cta}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {reminders.map((reminder) => {
            const Icon = reminder.icon;

            return (
              <div key={reminder.id} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${reminder.iconBg}`}
                  >
                    <Icon className={`text-[16px] ${reminder.iconColor}`} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{reminder.name}</p>
                    <span className="flex items-center gap-1 text-xs text-[#00663f]">
                      <FiCheckCircle className="text-[11px]" />
                      Verified Business
                    </span>
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#00663f]">Upcoming Alert</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-700">{reminder.date}</p>
                </div>

                <p className="mt-3 text-sm italic text-slate-500">&ldquo;{reminder.quote}&rdquo;</p>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                  <button type="button" className="text-sm font-semibold text-[#00663f] hover:underline">
                    View Original Post ↗
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete reminder for ${reminder.name}`}
                    className="text-slate-400 transition-colors hover:text-[#c0524d]"
                  >
                    <FiTrash2 className="text-[15px]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
