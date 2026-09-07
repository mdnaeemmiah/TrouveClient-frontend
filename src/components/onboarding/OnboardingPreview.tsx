"use client";

import Image from "next/image";
import { FiCheck, FiClock, FiMapPin, FiPhone, FiStar } from "react-icons/fi";
import { useOnboarding } from "@/src/context/OnboardingContext";

export default function OnboardingPreview() {
  const { formData } = useOnboarding();
  const location = [formData.location.city, formData.location.postalCode].filter(Boolean).join(", ");
  const activeHours = formData.openingHours.filter((hour) => !hour.isClosed);

  return (
    <aside className="hidden self-start lg:sticky lg:top-6 lg:block">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(28,73,53,0.1)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#00663f]">Live preview</p><p className="text-xs text-slate-500">Your public business card</p></div>
          <span className="flex items-center gap-1 rounded-full bg-[#e4f3ec] px-2 py-1 text-[10px] font-bold text-[#00663f]"><FiCheck /> Draft</span>
        </div>
        <div className="relative h-40 bg-[#dcebe4]">
          {formData.coverImage ? <Image src={formData.coverImage} alt="Business cover preview" fill unoptimized className="object-cover" /> : <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#dcebe4,#f3f7f5)] text-sm font-semibold text-[#00663f]">Add a cover photo</div>}
          <div className="absolute bottom-3 left-4 grid h-14 w-14 place-items-center overflow-hidden rounded-xl border-4 border-white bg-white shadow-sm">
            {formData.logo ? <Image src={formData.logo} alt="Business logo preview" width={56} height={56} unoptimized className="h-full w-full object-cover" /> : <span className="text-lg font-black text-[#00663f]">{formData.name.charAt(0) || "B"}</span>}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-slate-950">{formData.name || "Your Business Name"}</h3><p className="mt-1 text-xs text-slate-500">{formData.categoryName || "Business category"}</p></div><span className="flex items-center gap-1 text-xs font-bold text-amber-500"><FiStar /> 4.9</span></div>
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-600">{formData.description || "Your business description will appear here for local customers."}</p>
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600"><p className="flex items-center gap-2"><FiMapPin className="shrink-0 text-[#00663f]" />{location || "Add your location"}</p><p className="flex items-center gap-2"><FiPhone className="shrink-0 text-[#00663f]" />{formData.contactInfo.phone || "Add a phone number"}</p><p className="flex items-center gap-2"><FiClock className="shrink-0 text-[#00663f]" />{activeHours.length ? `${activeHours[0].open} - ${activeHours[0].close}` : "Add opening hours"}</p></div>
          <div className="mt-4 flex flex-wrap gap-1.5">{formData.services.slice(0, 3).map((service) => <span key={service} className="rounded-full bg-[#edf7f2] px-2 py-1 text-[10px] font-semibold text-[#00663f]">{service}</span>)}{formData.services.length > 3 ? <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">+{formData.services.length - 3} more</span> : null}</div>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-[#cfe6da] bg-[#edf7f2] p-4 text-xs leading-5 text-[#245b46]"><p className="font-bold">Keep going</p><p className="mt-1">A complete profile helps customers trust your business faster.</p></div>
    </aside>
  );
}
