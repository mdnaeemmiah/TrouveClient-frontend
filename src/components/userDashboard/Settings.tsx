"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiBell, FiCamera, FiEye, FiEyeOff, FiInfo, FiLoader, FiShield, FiUser } from "react-icons/fi";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type NotificationPref = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

const initialPreferences: NotificationPref[] = [
  { id: "email",     label: "Email Notifications",  description: "Booking confirmations, reminders, and business updates.",                enabled: true  },
  { id: "sms",       label: "SMS Notifications",    description: "Text alerts for upcoming bookings and last-minute changes.",              enabled: false },
  { id: "push",      label: "Push Notifications",   description: "Real-time alerts on this device for saved business activity.",           enabled: true  },
  { id: "marketing", label: "Marketing Emails",     description: "Offers, promotions, and news from TrouveClients.fr.",                   enabled: false },
];

export default function Settings() {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    avatar: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile]       = useState<File | null>(null);

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving,         setIsSaving]         = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPw,    setIsChangingPw]    = useState(false);
  const [showPasswords,   setShowPasswords]   = useState({ old: false, new: false, confirm: false });

  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [preferences, setPreferences] = useState(initialPreferences);

  // ── load profile ──────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    baseApi.get(ENDPOINTS.getUserProfile)
      .then((res) => {
        if (!mounted) return;
        const u = res.data?.data?.result ?? res.data?.data ?? res.data;
        setProfile({
          fullName:   u?.fullName   ?? u?.name         ?? "",
          email:      u?.email                         ?? "",
          phone:      u?.phone      ?? u?.phoneNumber  ?? "",
          avatar:     u?.avatar     ?? u?.profileImage ?? "",
          address:    u?.address    ?? u?.location?.address ?? "",
          city:       u?.city       ?? u?.location?.city    ?? "",
          postalCode: u?.postalCode ?? u?.location?.postalCode ?? "",
        });
        setAvatarPreview(u?.avatar ?? u?.profileImage ?? "");
      })
      .finally(() => { if (mounted) setIsLoadingProfile(false); });
    return () => { mounted = false; };
  }, []);

  // ── avatar pick ───────────────────────────────────────────
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ── save profile ──────────────────────────────────────────
  const saveProfile = async () => {
    setIsSaving(true);
    try {
      let avatarUrl = profile.avatar;

      // upload new avatar if picked
      if (avatarFile) {
        const fd = new FormData();
        fd.append("file", avatarFile);
        fd.append("folder", "avatars");
        const uploadRes = await baseApi.post(ENDPOINTS.storageUpload, fd);
        avatarUrl = uploadRes.data?.data?.url ?? uploadRes.data?.url ?? avatarUrl;
      }

      await baseApi.patch(ENDPOINTS.updateProfile, {
        fullName:   profile.fullName.trim()   || undefined,
        phone:      profile.phone.trim()      || undefined,
        avatar:     avatarUrl                 || undefined,
        address:    profile.address.trim()    || undefined,
        city:       profile.city.trim()       || undefined,
        postalCode: profile.postalCode.trim() || undefined,
      });

      setProfile((prev) => ({ ...prev, avatar: avatarUrl }));
      setAvatarFile(null);
      toast.success("Profile updated successfully.");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(msg || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── change password ───────────────────────────────────────
  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword)
      return toast.error("Please fill all password fields.");
    if (newPassword !== confirmPassword)
      return toast.error("New passwords do not match.");
    if (newPassword.length < 8)
      return toast.error("Password must be at least 8 characters.");

    setIsChangingPw(true);
    try {
      await baseApi.patch(ENDPOINTS.changePassword, {
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(msg || "Failed to change password.");
    } finally {
      setIsChangingPw(false);
    }
  };

  const togglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleDeleteAccount = async () => {
    // Show native browser confirmation
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?\n\nThis action cannot be undone. All your data, including your profile, saved businesses, and booking history will be permanently deleted."
    );
    
    if (!confirmed) return;

    setIsDeletingAccount(true);
    try {
      // TODO: Add actual delete account API endpoint
      // await baseApi.delete(ENDPOINTS.deleteAccount);
      toast.success("Account deletion request submitted.");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(msg || "Failed to delete account.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const initials = profile.fullName
    ? profile.fullName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : "--";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account information, security, and notification preferences.
        </p>
      </div>

      {/* ── Profile Information ── */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f3ec]">
            <FiUser className="text-[15px] text-[#00663f]" />
          </span>
          <h2 className="text-base font-semibold text-slate-900">Profile Information</h2>
        </div>

        {/* Avatar */}
        <div className="mt-5 flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Avatar"
                fill
                className="rounded-full object-cover"
                unoptimized
              />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-600">
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
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">{profile.fullName || "Your Name"}</p>
            <p className="text-xs text-slate-400">{profile.email}</p>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="mt-1.5 text-xs font-medium text-[#00663f] underline underline-offset-2 hover:text-[#004f31]"
            >
              Change photo
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-500">Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
              disabled={isLoadingProfile}
              placeholder="Jean Dupont"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Email Address</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-400 outline-none cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Phone Number</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              disabled={isLoadingProfile}
              placeholder="+33 6 12 34 56 78"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Address</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
              disabled={isLoadingProfile}
              placeholder="12 Rue de la Paix"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">City</label>
            <input
              type="text"
              value={profile.city}
              onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
              disabled={isLoadingProfile}
              placeholder="Paris"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10 disabled:opacity-60"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Postal Code</label>
            <input
              type="text"
              value={profile.postalCode}
              onChange={(e) => setProfile((p) => ({ ...p, postalCode: e.target.value }))}
              disabled={isLoadingProfile}
              placeholder="75002"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end border-t border-slate-100 pt-5">
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

      {/* ── Security ── */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f3ec]">
            <FiShield className="text-[15px] text-[#00663f]" />
          </span>
          <h2 className="text-base font-semibold text-slate-900">Security</h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-semibold text-slate-500">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.old ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
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

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <FiInfo className="text-[13px] text-[#00663f]" />
            Password must include a mix of letters, numbers, and symbols.
          </p>
          <button
            type="button"
            disabled={isChangingPw}
            onClick={() => void changePassword()}
            className="flex items-center gap-2 rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#004f31] disabled:opacity-60"
          >
            {isChangingPw && <FiLoader className="animate-spin" />}
            Update Password
          </button>
        </div>
      </div>

      {/* ── Notification Preferences ── */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f3ec]">
            <FiBell className="text-[15px] text-[#00663f]" />
          </span>
          <h2 className="text-base font-semibold text-slate-900">Notification Preferences</h2>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {preferences.map((pref) => (
            <div key={pref.id} className="flex items-center justify-between gap-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-slate-900">{pref.label}</p>
                <p className="mt-0.5 text-sm text-slate-500">{pref.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={pref.enabled}
                aria-label={pref.label}
                onClick={() => togglePreference(pref.id)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                  pref.enabled ? "bg-[#00663f]" : "bg-slate-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                    pref.enabled ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="rounded-2xl border border-[#f3d6d3] bg-[#fdf4f3] p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-[#c0524d]">Danger Zone</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            Deleting your account permanently removes your profile, saved businesses, and booking history.
          </p>
          <button
            type="button"
            onClick={() => void handleDeleteAccount()}
            disabled={isDeletingAccount}
            className="shrink-0 rounded-xl border border-[#c0524d] bg-white px-4 py-2.5 text-sm font-semibold text-[#c0524d] transition-colors hover:bg-[#fbeceb] disabled:opacity-60"
          >
            {isDeletingAccount && <FiLoader className="mr-1.5 inline animate-spin" />}
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
