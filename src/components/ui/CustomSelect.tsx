"use client";

import { useEffect, useRef, useState } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";

export type SelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className = "",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-[#f0faf5] px-3 py-2.5 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
          open
            ? "border-[#00663f] ring-2 ring-[#00663f]/15"
            : "border-slate-200 hover:border-[#00663f]/50"
        }`}
      >
        <span className={selected ? "text-slate-900" : "text-slate-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <FiChevronDown
          className={`shrink-0 text-[#00663f] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {/* Scrollable list */}
          <ul
            role="listbox"
            className="max-h-60 overflow-y-auto py-1 scrollbar-thin"
          >
            {options.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-400">No options available</li>
            ) : (
              options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                      isSelected
                        ? "bg-[#e4f3ec] font-semibold text-[#00663f]"
                        : "text-slate-700 hover:bg-[#f0faf5] hover:text-[#00663f]"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && <FiCheck className="text-[#00663f]" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
