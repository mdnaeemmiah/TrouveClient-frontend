"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiGlobe, FiMail, FiMapPin, FiPhone, FiSave } from "react-icons/fi";
import { useOnboarding } from "@/src/context/OnboardingContext";

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-xl bg-slate-100" /> });
const inputClass = "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#00875a] focus:bg-white focus:ring-4 focus:ring-[#00875a]/10";

export default function Contact() {
  const { formData, updateFormData, saveDraft } = useOnboarding();
  const contact = formData.contactInfo;
  const location = formData.location;
  const [locationQuery, setLocationQuery] = useState(location.address);
  const [suggestions, setSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string; address?: Record<string, string> }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const updateContact = (key: keyof typeof contact, value: string) => updateFormData({ contactInfo: { ...contact, [key]: value } });
  const updateLocation = (key: keyof typeof location, value: string) => updateFormData({ location: { ...location, [key]: value } });

  useEffect(() => {
    if (!locationQuery && location.address) setLocationQuery(location.address);
  }, [location.address, locationQuery]);

  useEffect(() => {
    const query = [locationQuery.trim(), location.postalCode.trim(), location.city.trim()].filter(Boolean).join(", ");
    if (query.length < 3) {
      setSuggestions([]);
      setSearchMessage("");
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchMessage("");
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`, { signal: controller.signal, headers: { Accept: "application/json" } });
        if (response.ok) {
          const results = await response.json();
          setSuggestions(results);
          const firstResult = results[0];
          if (firstResult) {
            updateFormData({ location: { ...location, latitude: Number(firstResult.lat), longitude: Number(firstResult.lon) } });
            setSearchMessage("Map updated for this location.");
          } else {
            setSearchMessage("No matching location found.");
          }
        } else {
          setSearchMessage("Location search is unavailable right now.");
        }
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setSearchMessage("Location search is unavailable right now.");
        }
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 650);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [locationQuery, location.postalCode, location.city]);

  const selectLocation = (result: { display_name: string; lat: string; lon: string; address?: Record<string, string> }) => {
    const address = result.address || {};
    const street = [address.house_number, address.road].filter(Boolean).join(" ") || result.display_name;
    const city = address.city || address.town || address.village || address.municipality || "";
    const nextLocation = { ...location, address: street, city, postalCode: address.postcode || "", latitude: Number(result.lat), longitude: Number(result.lon) };
    updateFormData({ location: nextLocation });
    setLocationQuery(street);
    setSuggestions([]);
  };

  return (
    <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(28,73,53,0.08)] sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-5">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00663f]">Step 2 of 6</p><h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Contact &amp; address</h2><p className="mt-1 text-sm text-slate-600">Help customers reach you and find your business location.</p></div>
        <span className="rounded-full bg-[#edf7f2] px-3 py-1 text-xs font-bold text-[#00663f]">Your details</span>
      </div>
      <section className="mt-6"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e4f3ec] text-[#00663f]"><FiPhone /></span><div><h3 className="font-bold text-slate-950">Contact information</h3><p className="text-xs text-slate-500">These details will be visible to potential customers.</p></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Phone number<input value={contact.phone} onChange={(e) => updateContact("phone", e.target.value)} className={inputClass} placeholder="+33 1 23 45 67 89" /></label><label className="text-sm font-semibold text-slate-700">Email address<input type="email" value={contact.email} onChange={(e) => updateContact("email", e.target.value)} className={inputClass} placeholder="contact@bistrot.fr" /></label></div><label className="mt-4 block text-sm font-semibold text-slate-700">Website <span className="font-normal text-slate-400">(optional)</span><span className="relative block"><FiGlobe className="pointer-events-none absolute left-3 top-3 text-slate-400" /><input value={contact.website} onChange={(e) => updateContact("website", e.target.value)} className={`${inputClass} pl-9`} placeholder="https://bistrot.fr" /></span></label></section>
      <section className="mt-7 border-t border-slate-100 pt-6"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e4f3ec] text-[#00663f]"><FiMapPin /></span><div><h3 className="font-bold text-slate-950">Location details</h3><p className="text-xs text-slate-500">Type an address or select a result to place your business precisely.</p></div></div><div className="relative"><label className="mt-5 block text-sm font-semibold text-slate-700">Street address<input value={locationQuery} onChange={(e) => { setLocationQuery(e.target.value); updateLocation("address", e.target.value); }} className={inputClass} placeholder="15 Rue de Rivoli" autoComplete="off" /></label>{(isSearching || suggestions.length > 0) && <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">{isSearching && <p className="px-4 py-3 text-xs text-slate-500">Searching locations...</p>}{suggestions.map((result) => <button key={`${result.lat}-${result.lon}`} type="button" onClick={() => selectLocation(result)} className="block w-full border-b border-slate-100 px-4 py-3 text-left text-xs text-slate-700 transition last:border-0 hover:bg-[#edf7f2]">{result.display_name}</button>)}</div>}</div><div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.4fr]"><label className="text-sm font-semibold text-slate-700">Postal code<input value={location.postalCode} onChange={(e) => updateLocation("postalCode", e.target.value)} className={inputClass} placeholder="75001" /></label><label className="text-sm font-semibold text-slate-700">City<input value={location.city} onChange={(e) => updateLocation("city", e.target.value)} className={inputClass} placeholder="Paris" /></label></div><div className="mt-5 overflow-hidden rounded-xl"><MapPicker latitude={location.latitude} longitude={location.longitude} onChange={(latitude, longitude) => updateFormData({ location: { ...location, latitude, longitude } })} /></div><p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><FiMail /> {searchMessage || "Type an address to search, or click the map and drag the pin to adjust it."}</p></section>
      <div className="mt-7 flex flex-col-reverse gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><Link href="/onboarding/grow" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#00663f]"><FiArrowLeft />Previous step</Link><button type="button" onClick={saveDraft} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#00663f]"><FiSave />Save draft</button></div><Link href="/onboarding/details" className="flex items-center justify-center gap-2 rounded-xl bg-[#00663f] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#00663f]/20 transition hover:bg-[#005333]">Continue to step 3 <FiArrowRight /></Link></div>
    </div>
  );
}
