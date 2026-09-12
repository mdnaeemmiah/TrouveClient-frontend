"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiMenu } from "react-icons/fi";
import { useProfileAvatar } from "@/src/hooks/useProfileAvatar";

type UserHeaderProps = {
  onMenuClick: () => void;
};

export default function UserHeader({ onMenuClick }: UserHeaderProps) {
  const { name, avatar, initials } = useProfileAvatar();

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
      </div>

      <div className="flex items-center gap-3">
        {name && (
          <span className="hidden text-sm font-medium text-slate-600 sm:block">{name}</span>
        )}
        <Link
          href="/userDashboard/settings"
          aria-label="Profile settings"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-[#00663f]/30 transition hover:ring-[#00663f]"
        >
          {avatar ? (
            <Image src={avatar} alt={name || "Profile"} fill className="object-cover" unoptimized />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-[#00663f] text-sm font-semibold text-white">
              {initials || "?"}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
