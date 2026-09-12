"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiMenu } from "react-icons/fi";
import { useProfileAvatar } from "@/src/hooks/useProfileAvatar";

type BusinessHeaderProps = {
  onMenuClick: () => void;
};

export default function BusinessHeader({ onMenuClick }: BusinessHeaderProps) {
  const { avatar, initials } = useProfileAvatar();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const handleProfileUpdate = () => {
      setRefresh((prev) => prev + 1);
    };
    window.addEventListener("profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("profile-updated", handleProfileUpdate);
  }, []);

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

      <div className="flex items-center gap-4">
        {avatar ? (
          <div className="relative h-9 w-9 flex-shrink-0 rounded-full overflow-hidden border border-slate-200">
            <Image src={avatar} alt="Profile" fill className="object-cover" unoptimized key={refresh} />
          </div>
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4f3ec] text-sm font-semibold text-[#00663f]">
            {initials}
          </span>
        )}
      </div>
    </header>
  );
}
