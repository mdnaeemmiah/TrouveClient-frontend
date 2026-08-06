"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiClipboard,
  FiPlus,
  FiSave,
  FiSettings,
  FiTool,
  FiTrash2,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { FaLightbulb } from "react-icons/fa";

type FieldVisibility = "required" | "optional" | "hidden";

type StandardField = {
  name: string;
  visibility: FieldVisibility;
};

const INITIAL_STANDARD_FIELDS: StandardField[] = [
  { name: "Full Name", visibility: "required" },
  { name: "Email Address", visibility: "required" },
  { name: "Phone Number", visibility: "optional" },
  { name: "Guest Count", visibility: "required" },
];

type BusinessField = {
  name: string;
  placeholder?: string;
  required: boolean;
};

const INITIAL_BUSINESS_FIELDS: BusinessField[] = [
  { name: "Service Type", required: true },
  { name: "Urgency Level", required: false },
];

const VISIBILITY_OPTIONS: { key: FieldVisibility; label: string }[] = [
  { key: "required", label: "Required" },
  { key: "optional", label: "Optional" },
  { key: "hidden", label: "Hidden" },
];

function DragHandle() {
  return (
    <span className="grid grid-cols-2 gap-0.75">
      {Array.from({ length: 6 }).map((_, index) => (
        <span key={index} className="h-1 w-1 rounded-full bg-slate-300" />
      ))}
    </span>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-[#00663f]" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function Booking() {
  const [standardFields, setStandardFields] = useState<StandardField[]>(INITIAL_STANDARD_FIELDS);
  const [businessFields, setBusinessFields] = useState<BusinessField[]>(INITIAL_BUSINESS_FIELDS);
  const [specialRequests, setSpecialRequests] = useState(true);
  const [occasions, setOccasions] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState("");
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  const setVisibility = (name: string, visibility: FieldVisibility) => {
    setStandardFields((current) =>
      current.map((field) => (field.name === name ? { ...field, visibility } : field))
    );
  };

  const toggleBusinessFieldRequired = (name: string) => {
    setBusinessFields((current) =>
      current.map((field) => (field.name === name ? { ...field, required: !field.required } : field))
    );
  };

  const removeBusinessField = (name: string) => {
    setBusinessFields((current) => current.filter((field) => field.name !== name));
  };

  const openAddFieldModal = () => {
    setNewFieldLabel("");
    setNewFieldPlaceholder("");
    setNewFieldRequired(false);
    setIsAddFieldModalOpen(true);
  };

  const closeAddFieldModal = () => {
    setIsAddFieldModalOpen(false);
  };

  const confirmAddField = () => {
    if (!newFieldLabel.trim()) return;
    setBusinessFields((current) => [
      ...current,
      { name: newFieldLabel.trim(), placeholder: newFieldPlaceholder.trim(), required: newFieldRequired },
    ]);
    setIsAddFieldModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Booking Configuration</h2>
          <p className="mt-1 text-sm text-slate-500">
            Customize the client booking experience and data collection requirements.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
        >
          <FiSave className="text-[14px]" />
          Save Settings
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <FiUsers className="text-[15px] text-[#00663f]" />
              Standard Information Fields
            </h3>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-105 border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Field Name
                    </th>
                    {VISIBILITY_OPTIONS.map((option) => (
                      <th
                        key={option.key}
                        className="pb-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400"
                      >
                        {option.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {standardFields.map((field) => (
                    <tr key={field.name}>
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <DragHandle />
                          <span className="text-sm font-medium text-slate-700">{field.name}</span>
                        </div>
                      </td>
                      {VISIBILITY_OPTIONS.map((option) => (
                        <td key={option.key} className="py-3 text-center">
                          <button
                            type="button"
                            aria-label={`Set ${field.name} to ${option.label}`}
                            onClick={() => setVisibility(field.name, option.key)}
                            className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-200"
                          >
                            {field.visibility === option.key && (
                              <span className="h-2.5 w-2.5 rounded-full bg-[#00663f]" />
                            )}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <FiClipboard className="text-[15px] text-[#00663f]" />
                  Business-Specific Fields
                </h3>
                <select className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-600 outline-none focus:border-[#00663f]">
                  <option>General Template</option>
                  <option>Restaurant</option>
                  <option>Beauty &amp; Wellness</option>
                  <option>Professional Services</option>
                  <option>Retail &amp; Shops</option>
                </select>
              </div>
              <p className="mt-1.5 text-xs text-slate-400">Suggested fields based on your industry template.</p>

              <div className="mt-4 space-y-2.5">
                {businessFields.map((field) => (
                  <div
                    key={field.name}
                    className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5"
                  >
                    <span className="text-sm font-medium text-slate-700">{field.name}</span>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs text-slate-400">Required</span>
                      <ToggleSwitch
                        checked={field.required}
                        onChange={() => toggleBusinessFieldRequired(field.name)}
                      />
                      <button
                        type="button"
                        aria-label={`Remove ${field.name}`}
                        onClick={() => removeBusinessField(field.name)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fbeceb] text-[#c0524d] hover:bg-[#f6d9d7]"
                      >
                        <FiTrash2 className="text-[13px]" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={openAddFieldModal}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-2.5 text-sm font-medium text-slate-500 hover:border-[#00663f]/40 hover:text-[#00663f]"
                >
                  <FiPlus className="text-[13px]" />
                  Add Industry-Specific Field
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <FiSettings className="text-[15px] text-[#00663f]" />
                Additional Info
              </h3>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Special Requests</p>
                    <p className="text-xs text-slate-400">Allow notes for custom requests</p>
                  </div>
                  <ToggleSwitch checked={specialRequests} onChange={() => setSpecialRequests((v) => !v)} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Occasions</p>
                    <p className="text-xs text-slate-400">Birthday, Anniversary, etc.</p>
                  </div>
                  <ToggleSwitch checked={occasions} onChange={() => setOccasions((v) => !v)} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Newsletter Opt-in</p>
                    <p className="text-xs text-slate-400">Marketing consent checkbox</p>
                  </div>
                  <ToggleSwitch checked={newsletter} onChange={() => setNewsletter((v) => !v)} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Link
              href="/onboarding/showCase"
              className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Back
            </Link>
            <Link
              href="/onboarding/review"
              className="flex items-center gap-2 rounded-full bg-[#00663f] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
            >
              Continue to Step 6
              <FiArrowRight className="text-[14px]" />
            </Link>
          </div>
        </div>

        <div className="flex gap-2 rounded-2xl bg-slate-50 p-5">
          <FaLightbulb className="mt-0.5 shrink-0 text-[14px] text-[#00663f]" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Did you know?</h3>
            <p className="mt-1 text-xs text-slate-500">
              Collecting the right information early reduces &ldquo;no-shows&rdquo; by up to 25%. Consider making
              the Phone Number required for better follow-up.
            </p>
          </div>
        </div>
      </div>

      {isAddFieldModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={closeAddFieldModal}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <FiTool className="text-[16px] text-[#00663f]" />
                Add Industry-Specific Field
              </h3>
              <button
                type="button"
                aria-label="Close"
                onClick={closeAddFieldModal}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <FiX className="text-[16px]" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Field Label</label>
                <input
                  type="text"
                  value={newFieldLabel}
                  onChange={(event) => setNewFieldLabel(event.target.value)}
                  placeholder="e.g., Boiler Model, Number of Bedrooms"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Placeholder Text</label>
                <input
                  type="text"
                  value={newFieldPlaceholder}
                  onChange={(event) => setNewFieldPlaceholder(event.target.value)}
                  placeholder="Helper text for customers"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/20"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Mark as Required</span>
                <ToggleSwitch checked={newFieldRequired} onChange={() => setNewFieldRequired((v) => !v)} />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeAddFieldModal}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAddField}
                disabled={!newFieldLabel.trim()}
                className="rounded-xl bg-[#00663f] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
