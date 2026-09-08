"use client";

import { useEffect, useState } from "react";
import { FiBell, FiCheckCircle, FiLoader, FiTrash2 } from "react-icons/fi";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type Reminder = {
  _id?: string;
  id?: string;
  reminderDate?: string;
  post?: { _id?: string; title?: string; content?: string; business?: { name?: string } };
  business?: { name?: string };
  title?: string;
  content?: string;
};

type ReminderResponse = { data?: { reminders?: Reminder[]; items?: Reminder[]; result?: Reminder[] } | Reminder[]; reminders?: Reminder[]; items?: Reminder[] };

function extractReminders(payload: unknown): Reminder[] {
  const response = payload as ReminderResponse;
  if (Array.isArray(response.data)) return response.data;
  return response.data?.reminders || response.data?.items || response.data?.result || response.reminders || response.items || [];
}

function formatDate(value?: string) {
  if (!value) return "Date not provided";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function Notification() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    baseApi.get(ENDPOINTS.myReminders)
      .then((response) => setReminders(extractReminders(response.data)))
      .catch((requestError: unknown) => {
        const message = (requestError as { response?: { data?: { message?: string } } }).response?.data?.message;
        setError(message || "Unable to load your reminders.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Reminders</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your alerts for saved business offers and limited-time deals.</p>
      </div>

      {isLoading ? <div className="mt-5 flex justify-center rounded-2xl bg-white p-12 text-[#00663f] shadow-sm"><FiLoader className="animate-spin text-xl" /></div> : error ? <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">{error}</div> : reminders.length === 0 ? <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No reminders found.</div> : <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {reminders.map((reminder) => {
          const name = reminder.business?.name || reminder.post?.business?.name || "Business update";
          const title = reminder.title || reminder.post?.title || "Business update";
          const content = reminder.content || reminder.post?.content || "No details provided.";

          return (
            <div key={reminder._id || reminder.id || reminder.post?._id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4f3ec] text-[#00663f]"><FiBell className="text-[16px]" /></span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{name}</p>
                  <span className="flex items-center gap-1 text-xs text-[#00663f]">
                    <FiCheckCircle className="text-[11px]" />
                    Verified Business
                  </span>
                </div>
              </div>

              <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#00663f]">Upcoming Alert</p>
                <p className="mt-0.5 text-sm font-medium text-slate-700">{formatDate(reminder.reminderDate)}</p>
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-700">{title}</p>
              <p className="mt-1 text-sm italic text-slate-500">&ldquo;{content}&rdquo;</p>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <button type="button" className="text-sm font-semibold text-[#00663f] hover:underline">
                  View Original Post ↗
                </button>
                <button
                  type="button"
                  aria-label={`Delete reminder for ${name}`}
                  className="text-slate-400 transition-colors hover:text-[#c0524d]"
                >
                  <FiTrash2 className="text-[15px]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>}
    </div>
  );
}
