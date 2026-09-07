"use client";

import { useRef, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight, FiImage, FiX } from "react-icons/fi";
import { useOnboarding } from "@/src/context/OnboardingContext";

export default function ShowCase() {
  const { formData, updateFormData, saveDraft } = useOnboarding();
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = (event: ChangeEvent<HTMLInputElement>) => { const files = Array.from(event.target.files || []); Promise.all(files.map((file) => new Promise<string>((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.readAsDataURL(file); }))).then((images) => updateFormData({ gallery: [...formData.gallery, ...images], coverImage: images[0] || formData.coverImage })); };
  return <div className="max-w-3xl rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-lg font-bold text-slate-900">Step 4: Photo Gallery</h2><input ref={inputRef} type="file" multiple accept="image/*" onChange={upload} className="hidden" /><button type="button" onClick={() => inputRef.current?.click()} className="mt-5 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-10 text-sm text-slate-500"><FiImage className="text-xl" />Add photos</button><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{formData.gallery.map((photo, index) => <div key={`${photo}-${index}`} className="relative aspect-square overflow-hidden rounded-lg"><Image src={photo} alt="Gallery" fill unoptimized className="object-cover" /><button type="button" aria-label="Remove photo" onClick={() => updateFormData({ gallery: formData.gallery.filter((_, itemIndex) => itemIndex !== index) })} className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"><FiX /></button></div>)}</div><div className="mt-6 flex justify-between border-t border-slate-100 pt-5"><div className="flex gap-4"><Link href="/onboarding/details" className="flex items-center gap-2 text-sm font-semibold text-slate-500"><FiArrowLeft />Back</Link><button type="button" onClick={saveDraft} className="text-sm font-semibold text-slate-500">Save Draft</button></div><Link href="/onboarding/bookings" className="flex items-center gap-2 rounded-xl bg-[#00663f] px-5 py-2.5 text-sm font-semibold text-white">Continue <FiArrowRight /></Link></div></div>;
}
