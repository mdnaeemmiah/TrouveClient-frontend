"use client";

import { useRef, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCamera, FiImage, FiX } from "react-icons/fi";
import { useOnboarding } from "@/src/context/OnboardingContext";

export default function Grow() {
  const { formData, updateFormData, categories, isCategoriesLoading, saveDraft } = useOnboarding();
  const inputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const options = categories;

  const uploadLogo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" && updateFormData({ logo: reader.result });
    reader.readAsDataURL(file);
  };

  const uploadCover = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" && updateFormData({ coverImage: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(28,73,53,0.08)] sm:p-7">
      <div className="border-b border-slate-100 pb-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00663f]">Step 1 of 6</p><h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Basic information</h2><p className="mt-1 text-sm text-slate-600">Tell customers what makes your business worth discovering.</p></div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">Business name *<input value={formData.name} onChange={(e) => updateFormData({ name: e.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal text-slate-900 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-4 focus:ring-[#00663f]/10" placeholder="Le Bistrot Parisien" /></label>
        <label className="text-sm font-semibold text-slate-700">Category *<select value={formData.categoryId} onChange={(e) => { const category = options.find((item) => item._id === e.target.value); updateFormData({ categoryId: e.target.value, categoryName: category?.name || "" }); }} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal text-slate-900 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-4 focus:ring-[#00663f]/10"><option value="">{isCategoriesLoading ? "Loading categories..." : "Select a category"}</option>{options.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select></label>
      </div>
      <label className="mt-5 block text-sm font-semibold text-slate-700">Description *<textarea value={formData.description} maxLength={250} onChange={(e) => updateFormData({ description: e.target.value })} rows={4} className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal text-slate-900 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-4 focus:ring-[#00663f]/10" placeholder="Tell customers what makes your business unique..." /><span className="block text-right text-xs font-normal text-slate-400">{formData.description.length} / 250</span></label>
      <input ref={inputRef} type="file" accept="image/*" onChange={uploadLogo} className="hidden" />
      <button type="button" onClick={() => inputRef.current?.click()} className="mt-5 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-8 text-sm text-slate-500"><FiCamera className="text-xl" />{formData.logo ? <><Image src={formData.logo} alt="Logo preview" width={80} height={80} unoptimized className="rounded-lg object-cover" /><span>Replace image</span><span onClick={(e) => { e.stopPropagation(); updateFormData({ logo: "" }); }}><FiX /></span></> : "Click to upload a logo"}</button>
      <input ref={coverInputRef} type="file" accept="image/*" onChange={uploadCover} className="hidden" />
      <button type="button" onClick={() => coverInputRef.current?.click()} className="mt-4 flex min-h-28 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
        {formData.coverImage ? <Image src={formData.coverImage} alt="Cover preview" width={640} height={180} unoptimized className="h-36 w-full object-cover" /> : <span className="flex items-center gap-2"><FiImage />Upload cover photo</span>}
      </button>
      <div className="mt-6 flex justify-between border-t border-slate-100 pt-5"><button type="button" onClick={saveDraft} className="text-sm font-semibold text-slate-500">Save Draft</button><Link href="/onboarding/contact" className="flex items-center gap-2 rounded-xl bg-[#00663f] px-5 py-2.5 text-sm font-semibold text-white">Next Step <FiArrowRight /></Link></div>
    </div>
  );
}
