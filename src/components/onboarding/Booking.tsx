"use client";

import { useRef, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useOnboarding } from "@/src/context/OnboardingContext";

export default function Booking() {
  const { formData, updateFormData, saveDraft } = useOnboarding();
  const config = formData.bookingConfig;
  const modalImageRef = useRef<HTMLInputElement>(null);
  const update = (patch: Partial<typeof config>) => updateFormData({ bookingConfig: { ...config, ...patch } });
  const uploadModalImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" && updateFormData({ bookingModalImage: reader.result });
    reader.readAsDataURL(file);
  };
  return <div className="max-w-3xl rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-lg font-bold text-slate-900">Step 5: Booking Configuration</h2><p className="mt-1 text-sm text-slate-500">Choose what customers see when they request a booking.</p><label className="mt-6 flex items-center justify-between rounded-xl bg-[#e4f3ec] p-4 text-sm font-semibold text-[#00663f]">Enable online bookings<input type="checkbox" checked={config.isEnabled} onChange={(e) => update({ isEnabled: e.target.checked })} className="h-5 w-5 accent-[#00663f]" /></label><input ref={modalImageRef} type="file" accept="image/*" onChange={uploadModalImage} className="hidden" /><button type="button" onClick={() => modalImageRef.current?.click()} className="mt-5 flex min-h-28 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">{formData.bookingModalImage ? <Image src={formData.bookingModalImage} alt="Booking modal preview" width={640} height={180} unoptimized className="h-36 w-full object-cover" /> : "Add booking modal banner"}</button><div className="mt-5 grid gap-3 sm:grid-cols-3">{[["allowSpecialRequests", "Special requests"], ["allowOccasions", "Occasions"], ["allowNewsletterOptIn", "Newsletter opt-in"]].map(([key, label]) => <label key={key} className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm"><input type="checkbox" checked={config[key as keyof typeof config] as boolean} onChange={(e) => update({ [key]: e.target.checked })} className="accent-[#00663f]" />{label}</label>)}</div><div className="mt-6 flex justify-between border-t border-slate-100 pt-5"><div className="flex gap-4"><Link href="/onboarding/showCase" className="flex items-center gap-2 text-sm font-semibold text-slate-500"><FiArrowLeft />Back</Link><button type="button" onClick={saveDraft} className="text-sm font-semibold text-slate-500">Save Draft</button></div><Link href="/onboarding/review" className="flex items-center gap-2 rounded-xl bg-[#00663f] px-5 py-2.5 text-sm font-semibold text-white">Review <FiArrowRight /></Link></div></div>;
}
