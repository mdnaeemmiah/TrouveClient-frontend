"use client";
/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  FiBriefcase, FiCamera, FiCheckCircle, FiClock, FiEdit2, FiEye, FiEyeOff, FiGlobe,
  FiImage, FiInfo, FiLoader, FiMapPin, FiPhone, FiShield, FiUser, FiX,
} from "react-icons/fi";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import { useAuth } from "@/src/context/AuthContext";
import type { OnboardingFormData } from "@/src/context/OnboardingContext";

// ── types ─────────────────────────────────────────────────────────────────────
type BusinessProfile = Omit<Partial<OnboardingFormData>, "location"> & {
  _id?: string;
  slug?: string;
  status?: string;
  isApproved?: boolean;
  averageRating?: number;
  reviewCount?: number;
  totalViews?: number;
  uniqueVisitors?: number;
  location?: Partial<OnboardingFormData["location"]> & { coordinates?: unknown };
};

type Tab = "business" | "account" | "security";

// ── helpers ───────────────────────────────────────────────────────────────────
function extractBusinesses(response: unknown): BusinessProfile[] {
  const p = response as { businesses?: BusinessProfile[]; data?: { businesses?: BusinessProfile[] } };
  return p.businesses || p.data?.businesses || [];
}
function val(v: unknown) { return v ? String(v) : "Not provided"; }
function mediaUrl(v: string | undefined) {
  if (!v) return "";
  if (/^(https?:|data:|blob:)/i.test(v)) return v;
  try { return new URL(v, process.env.NEXT_PUBLIC_API_URL).toString(); } catch { return v; }
}
function formatCoords(location: BusinessProfile["location"]) {
  const c = location?.coordinates;
  if (Array.isArray(c)) return c.join(", ");
  if (c && typeof c === "object") {
    const n = (c as { coordinates?: unknown }).coordinates;
    if (Array.isArray(n)) return n.join(", ");
  }
  if (typeof c === "string") return c;
  if (location?.latitude != null && location?.longitude != null) return `${location.latitude}, ${location.longitude}`;
  return "Not provided";
}

// ── component ─────────────────────────────────────────────────────────────────
export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("business");

  // ── Business Profile tab ──
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [isLoadingBiz, setIsLoadingBiz] = useState(true);
  const [bizError, setBizError] = useState("");
  const [isSavingBiz, setIsSavingBiz] = useState(false);

  // Edit mode states for each section
  const [editingSections, setEditingSections] = useState({
    basic: false,
    media: false,
    contact: false,
    location: false,
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const bookingModalInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

  // ── Account Settings tab ──
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState({ fullName: "", phone: "", avatar: "", address: "", city: "", postalCode: "" });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ── Security tab ──
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });

  // load business
  useEffect(() => {
    let mounted = true;
    baseApi.get(ENDPOINTS.getBusinesses)
      .then((res) => {
        if (!mounted) return;
        const list = extractBusinesses(res.data);
        const match = list.find((b) => b.contactInfo?.email === user?.email) || list[0];
        setBusiness(match || null);
      })
      .catch(() => { if (mounted) setBizError("Unable to load business profile."); })
      .finally(() => { if (mounted) setIsLoadingBiz(false); });
    return () => { mounted = false; };
  }, [user?.email]);

  // load user profile
  useEffect(() => {
    let mounted = true;
    baseApi.get(ENDPOINTS.getUserProfile)
      .then((res) => {
        if (!mounted) return;
        const u = res.data?.data?.result ?? res.data?.data ?? res.data;
        setProfile({
          fullName:   u?.fullName   ?? u?.name         ?? "",
          phone:      u?.phone      ?? u?.phoneNumber  ?? "",
          avatar:     u?.avatar     ?? u?.profileImage ?? "",
          address:    u?.address    ?? u?.location?.address   ?? "",
          city:       u?.city       ?? u?.location?.city      ?? "",
          postalCode: u?.postalCode ?? u?.location?.postalCode ?? "",
        });
        setAvatarPreview(u?.avatar ?? u?.profileImage ?? "");
      })
      .finally(() => { if (mounted) setIsLoadingProfile(false); });
    return () => { mounted = false; };
  }, []);

  const handleImageUpload = async (file: File, fieldName: "logo" | "coverImage" | "bookingModalImage") => {
    setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }));
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", fieldName);
      const response = await baseApi.post(ENDPOINTS.storageUpload, fd);
      const url = response.data?.data?.url ?? response.data?.url;
      setBusiness((prev) => prev ? { ...prev, [fieldName]: url } : null);
      return url;
    } catch {
      toast.error(`Failed to upload ${fieldName}.`);
      return null;
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleGalleryUpload = async (files: FileList) => {
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
      setBusiness((prev) => prev ? { ...prev, gallery: [...(prev.gallery || []), ...urls] } : null);
      toast.success(`${urls.length} images uploaded successfully.`);
    } catch {
      toast.error("Failed to upload gallery images.");
    } finally {
      setUploadingFiles((prev) => ({ ...prev, gallery: false }));
    }
  };

  const removeGalleryImage = (index: number) => {
    setBusiness((prev) => prev ? { ...prev, gallery: prev.gallery?.filter((_, i) => i !== index) || [] } : null);
  };

  const saveBusinessProfile = async () => {
    if (!business) return;
    setIsSavingBiz(true);
    try {
      // Clean bookingConfig - remove modalImage property if exists
      const cleanBookingConfig = business.bookingConfig ? {
        ...business.bookingConfig,
        modalImage: undefined, // Remove this property
      } : undefined;

      // Remove undefined/null values from cleanBookingConfig
      const finalBookingConfig = cleanBookingConfig ? 
        Object.fromEntries(
          Object.entries(cleanBookingConfig).filter(([_, v]) => v !== undefined && v !== null)
        ) : undefined;

      // Fix location structure - ensure coordinates are in correct format
      let locationToSend = business.location;
      if (locationToSend) {
        const lat = locationToSend.latitude;
        const lng = locationToSend.longitude;
        
        // Validate coordinates
        const isValidLat = lat != null && lat >= -90 && lat <= 90;
        const isValidLng = lng != null && lng >= -180 && lng <= 180;

        if (isValidLat && isValidLng) {
          locationToSend = {
            address: locationToSend.address,
            city: locationToSend.city,
            postalCode: locationToSend.postalCode,
            latitude: lat,
            longitude: lng,
            coordinates: [lng, lat], // MongoDB format: [longitude, latitude]
          } as any;
        } else {
          // If coordinates are invalid, send location without coordinates
          locationToSend = {
            address: locationToSend.address,
            city: locationToSend.city,
            postalCode: locationToSend.postalCode,
          };
        }
      }

      await baseApi.patch(ENDPOINTS.updateBusinessProfile, {
        name: business.name,
        description: business.description,
        logo: business.logo || undefined,
        coverImage: business.coverImage || undefined,
        bookingModalImage: business.bookingModalImage || undefined,
        images: business.gallery?.length ? business.gallery : undefined,
        contactInfo: business.contactInfo,
        socialLinks: business.socialLinks,
        location: locationToSend,
        services: business.services,
        openingHours: business.openingHours,
        bookingConfig: finalBookingConfig,
      });
      window.dispatchEvent(new Event("profile-updated"));
      toast.success("Business profile updated successfully.");
      // Close all editing modes after successful save
      setEditingSections({ basic: false, media: false, contact: false, location: false });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(msg || "Failed to update business profile.");
    } finally {
      setIsSavingBiz(false);
    }
  };

  const toggleEditSection = (section: keyof typeof editingSections) => {
    setEditingSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      let avatarUrl = profile.avatar;
      if (avatarFile) {
        const fd = new FormData();
        fd.append("file", avatarFile);
        fd.append("folder", "avatars");
        const up = await baseApi.post(ENDPOINTS.storageUpload, fd);
        avatarUrl = up.data?.data?.url ?? up.data?.url ?? avatarUrl;
      }
      await baseApi.patch(ENDPOINTS.updateProfile, {
        fullName:   profile.fullName.trim()   || undefined,
        phone:      profile.phone.trim()      || undefined,
        avatar:     avatarUrl                 || undefined,
        address:    profile.address.trim()    || undefined,
        city:       profile.city.trim()       || undefined,
        postalCode: profile.postalCode.trim() || undefined,
      });
      setProfile((p) => ({ ...p, avatar: avatarUrl }));
      setAvatarFile(null);
      if (avatarUrl) localStorage.setItem("profile_image", avatarUrl);
      if (profile.fullName) localStorage.setItem("profile_name", profile.fullName);
      // dispatch event so Navbar picks up the change immediately
      window.dispatchEvent(new Event("profile-updated"));
      toast.success("Profile updated successfully.");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(msg || "Failed to update profile.");
    } finally { setIsSaving(false); }
  };

  const changePassword = async () => {
    // Validation
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await baseApi.patch(ENDPOINTS.changePassword, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully.");
      // Clear form
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(msg || "Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const biz = business;
  const location = biz?.location;
  const contact  = biz?.contactInfo;
  const hours    = biz?.openingHours || [];
  const booking  = biz?.bookingConfig;

  const initials = profile.fullName
    ? profile.fullName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : (user?.email?.charAt(0).toUpperCase() ?? "?");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your business profile and account preferences.</p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        {(["business", "account", "security"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all ${
              activeTab === tab
                ? "bg-white text-[#00663f] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "business" ? "Business Profile" : tab === "account" ? "Account Settings" : "Security"}
          </button>
        ))}
      </div>

      {/* ══════════════════ BUSINESS PROFILE TAB ══════════════════ */}
      {activeTab === "business" && (
        <>
          {isLoadingBiz ? (
            <div className="rounded-2xl bg-white p-8 text-sm text-slate-500 shadow-sm">Loading business profile...</div>
          ) : bizError ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">{bizError}</div>
          ) : !biz ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">No business profile found.</div>
          ) : (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-bold text-slate-900">
                    <FiBriefcase size={18} /> Basic Information
                  </h2>
                  <button
                    type="button"
                    onClick={() => toggleEditSection("basic")}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-[#00663f] hover:bg-[#f0faf5] transition"
                  >
                    <FiEdit2 size={14} />
                    {editingSections.basic ? "Cancel" : "Edit"}
                  </button>
                </div>

                {editingSections.basic ? (
                  <>
                    <div className="mt-4">
                      <label className="text-xs font-semibold text-slate-500">Business Name</label>
                      <input
                        type="text"
                        value={biz.name || ""}
                        onChange={(e) => setBusiness((p) => p ? { ...p, name: e.target.value } : null)}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="text-xs font-semibold text-slate-500">Description</label>
                      <textarea
                        value={biz.description || ""}
                        onChange={(e) => setBusiness((p) => p ? { ...p, description: e.target.value } : null)}
                        rows={3}
                        className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
                      />
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        disabled={isSavingBiz}
                        onClick={() => void saveBusinessProfile()}
                        className="flex items-center gap-2 rounded-xl bg-[#00663f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004f31] disabled:opacity-60"
                      >
                        {isSavingBiz && <FiLoader className="animate-spin" />}
                        Save Changes
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 space-y-3 text-sm">
                    <div>
                      <span className="block text-xs text-slate-500">Business Name</span>
                      <span className="font-semibold text-slate-900">{biz.name || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500">Description</span>
                      <span className="text-slate-700">{biz.description || "Not provided"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Media */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-bold text-slate-900">
                    <FiImage size={18} /> Media Assets
                  </h2>
                  <button
                    type="button"
                    onClick={() => toggleEditSection("media")}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-[#00663f] hover:bg-[#f0faf5] transition"
                  >
                    <FiEdit2 size={14} />
                    {editingSections.media ? "Cancel" : "Edit"}
                  </button>
                </div>

                {editingSections.media ? (
                  <>
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
                          ) : biz.logo ? (
                            <img src={mediaUrl(biz.logo)} alt="Logo" className="h-full w-full object-contain" />
                          ) : (
                            <FiCamera className="text-slate-400" />
                          )}
                        </button>
                        <input ref={logoInputRef} type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) void handleImageUpload(file, "logo"); }} className="hidden" />
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
                          ) : biz.coverImage ? (
                            <img src={mediaUrl(biz.coverImage)} alt="Cover" className="h-full w-full object-cover" />
                          ) : (
                            <FiCamera className="text-slate-400" />
                          )}
                        </button>
                        <input ref={coverInputRef} type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) void handleImageUpload(file, "coverImage"); }} className="hidden" />
                      </div>

                      {/* Booking Modal Image */}
                      <div>
                        <label className="text-xs font-semibold text-slate-500">Booking Modal</label>
                        <button
                          type="button"
                          onClick={() => bookingModalInputRef.current?.click()}
                          disabled={uploadingFiles.bookingModalImage}
                          className="mt-2 flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-[#00663f] disabled:opacity-60"
                        >
                          {uploadingFiles.bookingModalImage ? (
                            <FiLoader className="animate-spin text-[#00663f]" />
                          ) : biz.bookingModalImage ? (
                            <img src={mediaUrl(biz.bookingModalImage)} alt="Modal" className="h-full w-full object-cover" />
                          ) : (
                            <FiCamera className="text-slate-400" />
                          )}
                        </button>
                        <input ref={bookingModalInputRef} type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) void handleImageUpload(file, "bookingModalImage"); }} className="hidden" />
                      </div>
                    </div>

                    {/* Gallery */}
                    <div className="mt-4">
                      <label className="text-xs font-semibold text-slate-500">Gallery Images</label>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {biz.gallery?.map((img, i) => (
                          <div key={i} className="group relative overflow-hidden rounded-xl bg-slate-100">
                            <img src={mediaUrl(img)} alt={`Gallery ${i + 1}`} className="h-24 w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(i)}
                              className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/50"
                            >
                              <FiX className="text-white opacity-0 transition group-hover:opacity-100" size={20} />
                            </button>
                          </div>
                        ))}
                        <input ref={galleryInputRef} type="file" multiple accept="image/*" onChange={(e) => { if (e.target.files) void handleGalleryUpload(e.target.files); }} className="hidden" />
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

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        disabled={isSavingBiz}
                        onClick={() => void saveBusinessProfile()}
                        className="flex items-center gap-2 rounded-xl bg-[#00663f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004f31] disabled:opacity-60"
                      >
                        {isSavingBiz && <FiLoader className="animate-spin" />}
                        Save Changes
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="grid grid-cols-3 gap-3">
                      {biz.logo && (
                        <div>
                          <span className="block text-xs text-slate-500 mb-2">Logo</span>
                          <img src={mediaUrl(biz.logo)} alt="Logo" className="h-20 w-full object-contain rounded-lg border border-slate-200" />
                        </div>
                      )}
                      {biz.coverImage && (
                        <div>
                          <span className="block text-xs text-slate-500 mb-2">Cover</span>
                          <img src={mediaUrl(biz.coverImage)} alt="Cover" className="h-20 w-full object-cover rounded-lg border border-slate-200" />
                        </div>
                      )}
                      {biz.bookingModalImage && (
                        <div>
                          <span className="block text-xs text-slate-500 mb-2">Booking Modal</span>
                          <img src={mediaUrl(biz.bookingModalImage)} alt="Modal" className="h-20 w-full object-cover rounded-lg border border-slate-200" />
                        </div>
                      )}
                    </div>
                    {biz.gallery && biz.gallery.length > 0 && (
                      <div>
                        <span className="block text-xs text-slate-500 mb-2">Gallery ({biz.gallery.length} images)</span>
                        <div className="grid grid-cols-4 gap-2">
                          {biz.gallery.slice(0, 4).map((img, i) => (
                            <img key={i} src={mediaUrl(img)} alt={`Gallery ${i + 1}`} className="h-16 w-full object-cover rounded-lg border border-slate-200" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-bold text-slate-900">
                    <FiPhone size={18} /> Contact Information
                  </h2>
                  <button
                    type="button"
                    onClick={() => toggleEditSection("contact")}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-[#00663f] hover:bg-[#f0faf5] transition"
                  >
                    <FiEdit2 size={14} />
                    {editingSections.contact ? "Cancel" : "Edit"}
                  </button>
                </div>

                {editingSections.contact ? (
                  <>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-500">Phone</label>
                        <input
                          type="tel"
                          value={contact?.phone || ""}
                          onChange={(e) => setBusiness((p) => p ? { ...p, contactInfo: { phone: e.target.value, email: contact?.email || "", website: contact?.website } as any } : null)}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500">Email</label>
                        <input
                          type="email"
                          value={contact?.email || ""}
                          onChange={(e) => setBusiness((p) => p ? { ...p, contactInfo: { phone: contact?.phone || "", email: e.target.value, website: contact?.website } as any } : null)}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500">Website</label>
                        <input
                          type="url"
                          value={contact?.website || ""}
                          onChange={(e) => setBusiness((p) => p ? { ...p, contactInfo: { phone: contact?.phone || "", email: contact?.email || "", website: e.target.value } as any } : null)}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        disabled={isSavingBiz}
                        onClick={() => void saveBusinessProfile()}
                        className="flex items-center gap-2 rounded-xl bg-[#00663f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004f31] disabled:opacity-60"
                      >
                        {isSavingBiz && <FiLoader className="animate-spin" />}
                        Save Changes
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <span className="block text-xs text-slate-500">Phone</span>
                      <span className="font-semibold text-slate-900">{contact?.phone || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500">Email</span>
                      <span className="font-semibold text-slate-900">{contact?.email || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500">Website</span>
                      <span className="font-semibold text-slate-900">{contact?.website || "Not provided"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-bold text-slate-900">
                    <FiMapPin size={18} /> Location
                  </h2>
                  <button
                    type="button"
                    onClick={() => toggleEditSection("location")}
                    className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-[#00663f] hover:bg-[#f0faf5] transition"
                  >
                    <FiEdit2 size={14} />
                    {editingSections.location ? "Cancel" : "Edit"}
                  </button>
                </div>

                {editingSections.location ? (
                  <>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-slate-500">Address</label>
                        <input
                          type="text"
                          value={location?.address || ""}
                          onChange={(e) => setBusiness((p) => p ? { ...p, location: { ...location, address: e.target.value } } : null)}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500">City</label>
                        <input
                          type="text"
                          value={location?.city || ""}
                          onChange={(e) => setBusiness((p) => p ? { ...p, location: { ...location, city: e.target.value } } : null)}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500">Postal Code</label>
                        <input
                          type="text"
                          value={location?.postalCode || ""}
                          onChange={(e) => setBusiness((p) => p ? { ...p, location: { ...location, postalCode: e.target.value } } : null)}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500">Latitude</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={location?.latitude || ""}
                          onChange={(e) => setBusiness((p) => p ? { ...p, location: { ...location, latitude: parseFloat(e.target.value) } } : null)}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500">Longitude</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={location?.longitude || ""}
                          onChange={(e) => setBusiness((p) => p ? { ...p, location: { ...location, longitude: parseFloat(e.target.value) } } : null)}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        disabled={isSavingBiz}
                        onClick={() => void saveBusinessProfile()}
                        className="flex items-center gap-2 rounded-xl bg-[#00663f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004f31] disabled:opacity-60"
                      >
                        {isSavingBiz && <FiLoader className="animate-spin" />}
                        Save Changes
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <span className="block text-xs text-slate-500">Address</span>
                      <span className="font-semibold text-slate-900">{location?.address || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500">City</span>
                      <span className="font-semibold text-slate-900">{location?.city || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500">Postal Code</span>
                      <span className="font-semibold text-slate-900">{location?.postalCode || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500">Coordinates</span>
                      <span className="font-semibold text-slate-900">
                        {location?.latitude && location?.longitude 
                          ? `${location.latitude}, ${location.longitude}` 
                          : "Not provided"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ══════════════════ ACCOUNT SETTINGS TAB ══════════════════ */}
      {activeTab === "account" && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f3ec]">
              <FiUser className="text-[15px] text-[#00663f]" />
            </span>
            <h2 className="text-base font-semibold text-slate-900">Account Settings</h2>
          </div>

          {/* Avatar */}
          <div className="mt-5 flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0">
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Avatar" fill className="rounded-full object-cover" unoptimized />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e4f3ec] text-xl font-bold text-[#00663f]">
                  {initials}
                </span>
              )}
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#00663f] text-white shadow"
                aria-label="Change avatar"
              >
                <FiCamera className="text-[11px]" />
              </button>
              <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{profile.fullName || user?.name || "Your Name"}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="mt-1 text-xs font-medium text-[#00663f] underline underline-offset-2 hover:text-[#004f31]"
              >
                Change photo
              </button>
            </div>
          </div>

          {/* Fields */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "Full Name",    key: "fullName",   type: "text",  placeholder: "Jean Dupont" },
              { label: "Phone Number", key: "phone",      type: "tel",   placeholder: "+33 6 12 34 56 78" },
              { label: "Address",      key: "address",    type: "text",  placeholder: "12 Rue de la Paix" },
              { label: "City",         key: "city",       type: "text",  placeholder: "Paris" },
              { label: "Postal Code",  key: "postalCode", type: "text",  placeholder: "75002" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-slate-500">{label}</label>
                <input
                  type={type}
                  value={profile[key as keyof typeof profile]}
                  onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                  disabled={isLoadingProfile}
                  placeholder={placeholder}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10 disabled:opacity-60"
                />
              </div>
            ))}

            {/* Email — read only */}
            <div>
              <label className="text-xs font-semibold text-slate-500">Email Address</label>
              <input
                type="email"
                value={user?.email ?? ""}
                disabled
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-400 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
            <button
              type="button"
              disabled={isSaving || isLoadingProfile}
              onClick={() => void saveProfile()}
              className="flex items-center gap-2 rounded-xl bg-[#00663f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#004f31] disabled:opacity-60"
            >
              {isSaving && <FiLoader className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════ SECURITY TAB ══════════════════ */}
      {activeTab === "security" && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f3ec]">
              <FiShield className="text-[15px] text-[#00663f]" />
            </span>
            <h2 className="text-base font-semibold text-slate-900">Change Password</h2>
          </div>

          <p className="mt-2 text-sm text-slate-500">Update your password to keep your account secure.</p>

          <div className="mt-6 space-y-4 max-w-md">
            <div>
              <label className="text-xs font-semibold text-slate-500">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords.old ? "text" : "password"}
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData((p) => ({ ...p, oldPassword: e.target.value }))}
                  placeholder="Enter current password"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((p) => ({ ...p, old: !p.old }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPasswords.old ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                  placeholder="Enter new password (min 8 characters)"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPasswords.new ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Re-enter new password"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPasswords.confirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
            <button
              type="button"
              disabled={isChangingPassword}
              onClick={() => void changePassword()}
              className="flex items-center gap-2 rounded-xl bg-[#00663f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#004f31] disabled:opacity-60"
            >
              {isChangingPassword && <FiLoader className="animate-spin" />}
              Change Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
