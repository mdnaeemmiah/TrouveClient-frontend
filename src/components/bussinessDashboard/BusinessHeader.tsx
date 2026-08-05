"use client";

import Link from "next/link";
import { FiArrowLeft, FiMenu } from "react-icons/fi";

type BusinessHeaderProps = {
  onMenuClick: () => void;
};

export default function BusinessHeader({ onMenuClick }: BusinessHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#00663f] lg:hidden"
        >
          <FiMenu className="text-[20px]" />
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-[#00663f] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
        >
          <FiArrowLeft className="text-[14px]" />
          Back to Homepage
        </Link>
        {/* <span className="text-lg font-bold tracking-tight text-[#00663f]">TrouveClients.fr</span> */}
      </div>

      <div className="flex items-center gap-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
          JD
        </span>
      </div>
    </header>
  );
}
