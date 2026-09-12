"use client";
/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  FiCamera, FiCheckCircle, FiClock, FiGlobe, FiImage, FiLoader,
  FiMapPin, FiPhone, FiSave, FiShield, FiX,
} from "react-icons/fi";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type BusinessProfileForm = {
  name: string;
  categoryId: string;
  description: string;
  logo?: string;
  coverImage?: string;
  bookingModalImage?: string;
  images: string[];
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
  };
  location: {
    address: string;
    city: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  services: string[];
  openingHours: Array<{
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }>;
  bookingConfig: {
    isEnabled: boolean;
    allowSpecialRequests: boolean;
    allowOccasions: boolean;
    allowNewsletterOptIn: boolean;
  };
};

export default function BusinessProfileEditor() {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<BusinessProfileForm>({
    name: "Le Bistrot Parisien",
    categoryId: "",
    description: "Authentic French restaurant in the heart of Paris.",
    logo: "",
    coverImage: "",
    bookingModalImage: "",
    images: [],
    contactInfo: {
      phone: "+33123456789",
      email: "contact@bistrotparis.com",
      website: "https://bistrotparis.com",
    },
    socialLinks: {
      facebook: "https://facebook.com/bistrot",
      instagram: "https://instagram.com/bistrot",
      linkedin: "https://linkedin.com/company/bistrot",
      x: "https://x.com/bistrot",
    },
    location: {
      address: "15 Rue de Rivoli",
      city: "Paris",
      postalCode: "75001",
      latitude: 48.8566,
      longitude: 2.3522,
    },
    services: ["Lunch Specials", "Private Dining Room", "Outdoor Seating"],
    openingHours: [
      { day: "Monday", open: "09:00", close: "19:00", isClosed: false },
      { day: "Tuesday", open: "09:00", close: "19:00", isClosed: false },
      { day: "Wednesday", open: "09:00", close: "19:00", isClosed: false },
      { day: "Thursday", open: "09:00", close: "19:00", isClosed: false },
      { day: "Friday", open: "09:00", close: "22:00", isClosed: false },
      { day: "Saturday", open: "10:00", close: "23:00", isClosed: false },
      { day: "Sunday", open: "10:00", close: "20:00", isClosed: true },
    ],
    bookingConfig: {
      isEnabled: true,
      allowSpecialRequests: true,
      allowOccasions: false,
      allowNewsletterOptIn: true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "logo" | "coverImage" | "bookingModalImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }));
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", fieldName);
      const response = await baseApi.post(ENDPOINTS.storageUpload, fd);
      const url = response.data?.data?.url ?? response.data?.url;
      
      setForm((prev) => ({
        ...prev,
        [fieldName]: url,
      }));
      toast.success(`${fieldName} uploaded successfully.`);
    } catch {
      toast.error(`Failed to upload ${fieldName}.`);
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingFiles((prev) => ({ ...prev, gallery: true }));
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "gallery");
        const response = await baseApi.post(ENDPOINTS.storageUpload, fd);
        const url = response.data?.data?.url ?? response.data?.url;
        if (url) urls.push(url);
      }
      
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
      toast.success(`${urls.length} images uploaded successfully.`);
    } catch {
      toast.error("Failed to upload gallery images.");
    } finally {
      setUploadingFiles((prev) => ({ ...prev, gallery: false }));
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      await baseApi.patch(ENDPOINTS.updateBusinessProfile, {
        name: form.name,
        categoryId: form.categoryId,
        description: form.description,
        logo: form.logo || undefined,
        coverImage: form.coverImage || undefined,
        bookingModalImage: form.bookingModalImage || undefined,
        images: form.images.length > 0 ? form.images : undefined,
        contactInfo: form.contactInfo,
        socialLinks: form.socialLinks,
        location: form.location,
        services: form.services,
        openingHours: form.openingHours,
        bookingConfig: form.bookingConfig,
      });

      window.dispatchEvent(new Event("profile-updated"));
      toast.success("Business profile updated successfully.");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(msg || "Failed to update business profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Business Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Update your business information and settings.</p>
      </div>

      {/* Basic Info */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><FiShield size={18} /> Basic Information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-500">Business Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Category ID</label>
            <input
              type="text"
              value={form.categoryId}
              onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
              placeholder="60d5ec49f1b2c81234567890"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-500">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={3}
            className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
          />
        </div>
      </div>

      {/* Media */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><FiImage size={18} /> Media Assets</h2>
        
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {/* Logo */}
          <div>
            <label className="text-xs font-semibold text-slate-500">Logo</label>
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={uploadingFiles.logo}
              className="mt-2 flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-[#00663f] disabled:opacity-60"
            >
              {uploadingFiles.logo ? (
                <FiLoader className="animate-spin text-[#00663f]" />
              ) : form.logo ? (
                <img src={form.logo} alt="Logo" className="h-full w-full object-contain" />
              ) : (
                <FiCamera className="text-slate-400" />
              )}
            </button>
            <input ref={logoInputRef} type="file" accept="image/*" onChange={(e) => void handleImageUpload(e, "logo")} className="hidden" />
          </div>

          {/* Cover Image */}
          <div>
            <label className="text-xs font-semibold text-slate-500">Cover Image</label>
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingFiles.coverImage}
              className="mt-2 flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-[#00663f] disabled:opacity-60"
            >
              {uploadingFiles.coverImage ? (
                <FiLoader className="animate-spin text-[#00663f]" />
              ) : form.coverImage ? (
                <img src={form.coverImage} alt="Cover" className="h-full w-full object-cover" />
              ) : (
                <FiCamera className="text-slate-400" />
              )}
            </button>
            <input ref={coverInputRef} type="file" accept="image/*" onChange={(e) => void handleImageUpload(e, "coverImage")} className="hidden" />
          </div>

          {/* Booking Modal Image */}
          <div>
            <label className="text-xs font-semibold text-slate-500">Booking Modal</label>
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploadingFiles.bookingModalImage}
              className="mt-2 flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-[#00663f] disabled:opacity-60"
            >
              {uploadingFiles.bookingModalImage ? (
                <FiLoader className="animate-spin text-[#00663f]" />
              ) : form.bookingModalImage ? (
                <img src={form.bookingModalImage} alt="Modal" className="h-full w-full object-cover" />
              ) : (
                <FiCamera className="text-slate-400" />
              )}
            </button>
            <input ref={galleryInputRef} type="file" accept="image/*" onChange={(e) => void handleImageUpload(e, "bookingModalImage")} className="hidden" />
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-500">Gallery Images</label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {form.images.map((img, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl bg-slate-100">
                <img src={img} alt={`Gallery ${i + 1}`} className="h-24 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 transition hover:bg-black/50"
                >
                  <FiX className="text-white opacity-0 transition hover:opacity-100" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploadingFiles.gallery}
              className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-[#00663f] disabled:opacity-60"
            >
              {uploadingFiles.gallery ? <FiLoader className="animate-spin text-[#00663f]" /> : <FiCamera className="text-slate-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><FiPhone size={18} /> Contact Information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-semibold text-slate-500">Phone</label>
            <input
              type="tel"
              value={form.contactInfo.phone}
              onChange={(e) => setForm((p) => ({ ...p, contactInfo: { ...p.contactInfo, phone: e.target.value } }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Email</label>
            <input
              type="email"
              value={form.contactInfo.email}
              onChange={(e) => setForm((p) => ({ ...p, contactInfo: { ...p.contactInfo, email: e.target.value } }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Website</label>
            <input
              type="url"
              value={form.contactInfo.website}
              onChange={(e) => setForm((p) => ({ ...p, contactInfo: { ...p.contactInfo, website: e.target.value } }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><FiMapPin size={18} /> Location</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-500">Address</label>
            <input
              type="text"
              value={form.location.address}
              onChange={(e) => setForm((p) => ({ ...p, location: { ...p.location, address: e.target.value } }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">City</label>
            <input
              type="text"
              value={form.location.city}
              onChange={(e) => setForm((p) => ({ ...p, location: { ...p.location, city: e.target.value } }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Postal Code</label>
            <input
              type="text"
              value={form.location.postalCode}
              onChange={(e) => setForm((p) => ({ ...p, location: { ...p.location, postalCode: e.target.value } }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={form.location.latitude}
              onChange={(e) => setForm((p) => ({ ...p, location: { ...p.location, latitude: parseFloat(e.target.value) } }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={form.location.longitude}
              onChange={(e) => setForm((p) => ({ ...p, location: { ...p.location, longitude: parseFloat(e.target.value) } }))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
            />
          </div>
        </div>
      </div>

      {/* Booking Config */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><FiCheckCircle size={18} /> Booking Configuration</h2>
        <div className="mt-4 space-y-3">
          {[
            { key: "isEnabled", label: "Enable Online Bookings" },
            { key: "allowSpecialRequests", label: "Allow Special Requests" },
            { key: "allowOccasions", label: "Allow Occasions" },
            { key: "allowNewsletterOptIn", label: "Allow Newsletter Opt-In" },
          ].map((opt) => (
            <label key={opt.key} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={form.bookingConfig[opt.key as keyof typeof form.bookingConfig] as boolean}
                onChange={(e) => setForm((p) => ({
                  ...p,
                  bookingConfig: { ...p.bookingConfig, [opt.key]: e.target.checked },
                }))}
                className="h-5 w-5 rounded border-slate-300 text-[#00663f] focus:ring-[#00663f]"
              />
              <span className="text-sm font-medium text-slate-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => void saveProfile()}
          className="flex items-center gap-2 rounded-xl bg-[#00663f] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#004f31] disabled:opacity-60"
        >
          {isSaving && <FiLoader className="animate-spin" />}
          <FiSave size={16} />
          Save Business Profile
        </button>
      </div>
    </div>
  );
}
