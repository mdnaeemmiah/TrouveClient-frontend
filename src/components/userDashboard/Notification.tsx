"use client";

import { FiCheckCircle, FiTrash2 } from "react-icons/fi";
import type { IconType } from "react-icons";
import { FaBreadSlice, FaLaptopCode } from "react-icons/fa";

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
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Reminders</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your alerts for saved business offers and limited-time deals.</p>
      </div>

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
    </div>
  );
}
