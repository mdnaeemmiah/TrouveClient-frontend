"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Bell, Calendar, CheckCircle2, Clock, NotepadText, Repeat, X } from "lucide-react";

type Frequency = "One-time" | "Recurring";

type AddReminderButtonProps = {
  businessName: string;
  eventLabel: string;
  image: StaticImageData;
};

export default function AddReminderButton({ businessName, eventLabel, image }: AddReminderButtonProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("One-time");
  const [notes, setNotes] = useState("");

  const closeAndReset = () => {
    setOpen(false);
    setDate("");
    setTime("");
    setFrequency("One-time");
    setNotes("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-[#d7d9db] px-3 py-1.5 text-[12px] font-semibold text-[#3a3d40] hover:bg-[#f7f7fa]"
      >
        <Bell size={13} /> Add Reminder
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeAndReset}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between px-5 pt-5">
              <div>
                <h3 className="text-lg font-bold text-[#1c1d22]">Set a Reminder</h3>
                <p className="mt-1 text-[13px] text-[#5c6168]">
                  Never miss an update from your favorite local businesses.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAndReset}
                className="text-[#5c6168] transition-colors hover:text-[#1c1d22]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1c1d22]">
                    <Calendar size={14} className="text-[#00663f]" />
                    When should we remind you?
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    placeholder="mm/dd/yyyy"
                    className="mt-2 w-full rounded-xl bg-[#f7f7fa] px-3.5 py-2.5 text-[13px] text-[#1c1d22] outline-none focus:ring-2 focus:ring-[#00663f]/30"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1c1d22]">
                    <Clock size={14} className="text-[#00663f]" />
                    Preferred time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    className="mt-2 w-full rounded-xl bg-[#f7f7fa] px-3.5 py-2.5 text-[13px] text-[#1c1d22] outline-none focus:ring-2 focus:ring-[#00663f]/30"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1c1d22]">
                  <Repeat size={14} className="text-[#00663f]" />
                  Frequency
                </label>
                <div className="mt-2 flex items-center gap-1 rounded-xl bg-[#f7f7fa] p-1">
                  {(["One-time", "Recurring"] as Frequency[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFrequency(option)}
                      className={`flex-1 rounded-lg py-2 text-[13px] font-semibold transition-colors ${
                        frequency === option
                          ? "bg-white text-[#00663f] shadow-sm"
                          : "text-[#8a8d91] hover:text-[#5c6168]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1c1d22]">
                  <NotepadText size={14} className="text-[#00663f]" />
                  Reminder Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  placeholder="e.g., 'Check seasonal spring tartlets'"
                  className="mt-2 w-full resize-none rounded-xl bg-[#f7f7fa] px-3.5 py-3 text-[13px] text-[#1c1d22] outline-none placeholder:text-[#9a9da1] focus:ring-2 focus:ring-[#00663f]/30"
                />
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#f7f7fa] p-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                  <Image src={image} alt={businessName} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[#00663f]">{businessName}</p>
                  <p className="truncate text-[12px] text-[#5c6168]">{eventLabel}</p>
                </div>
                <CheckCircle2 size={20} className="shrink-0 fill-[#00663f] text-white" />
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-[#eef0f1] px-5 py-4">
              <button
                type="button"
                onClick={closeAndReset}
                className="flex-1 rounded-xl bg-[#f1f2f4] py-2.5 text-[13px] font-semibold text-[#3a3d40] hover:bg-[#e7e8eb]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={closeAndReset}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00663f] py-2.5 text-[13px] font-bold text-white hover:bg-[#00552f]"
              >
                <Bell size={14} /> Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
