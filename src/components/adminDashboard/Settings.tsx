"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAtSign,
  FiBell,
  FiCamera,
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiLoader,
  FiMessageSquare,
  FiShield,
  FiSliders,
  FiUser,
  FiZap,
} from "react-icons/fi";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import { useAuth } from "@/src/context/AuthContext";
import CustomSelect from "@/src/components/ui/CustomSelect";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? "bg-[#00663f]" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function SectionCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  children,
  action,
}: {
  icon: IconType;
  iconBg: string;
  iconColor: string;
  title: string;
  children: React.ReactNode;
  action: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`text-[15px] ${iconColor}`} />
        </span>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>

      <div className="mt-5 space-y-5">{children}</div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          className="rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
        >
          {action}
        </button>
      </div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: IconType;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-2.5">
        <Icon className="mt-0.5 text-[15px] text-slate-400" />
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="mt-0.5 text-xs text-slate-400">{description}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [profileEmail, setProfileEmail] = useState("");
  const [require2fa, setRequire2fa] = useState(true);
  const [autoApprove, setAutoApprove] = useState(true);
  const [aiReview, setAiReview] = useState(true);
  const [hideInactive, setHideInactive] = useState(false);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [emailDigests, setEmailDigests] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Profile settings
  const [profile, setProfile] = useState({ fullName: "", phone: "", avatar: "", address: "", city: "", postalCode: "" });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Password change
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });

  // Security settings
  const [sessionTimeout, setSessionTimeout] = useState("60 Minutes");
  const [passwordExpiry, setPasswordExpiry] = useState("90 Days");

  useEffect(() => {
    baseApi.get(ENDPOINTS.getUserProfile)
      .then((response) => {
        const u = response.data?.data?.result ?? response.data?.data ?? response.data;
        setProfileEmail(u?.email ?? "");
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
      .catch(() => setProfileEmail(""))
      .finally(() => setIsLoadingProfile(false));
  }, []);

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
      // dispatch event so headers pick up the change immediately
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

  const initials = profile.fullName
    ? profile.fullName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : (user?.email?.charAt(0).toUpperCase() ?? "?");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure global platform controls and security protocols for the Motor Bridge directory.
        </p>
      </div>

      {/* Admin Profile Section */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f3ec]">
            <FiUser className="text-[15px] text-[#00663f]" />
          </span>
          <h2 className="text-base font-semibold text-slate-900">Admin Profile</h2>
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

      {/* Security Section - Password Change */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f3ec]">
            <FiShield className="text-[15px] text-[#00663f]" />
          </span>
          <h2 className="text-base font-semibold text-slate-900">Security</h2>
        </div>

        <p className="mt-2 text-sm text-slate-500">Update your password to keep your account secure.</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                placeholder="Min. 8 characters"
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
                placeholder="Repeat new password"
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

      <SectionCard icon={FiGlobe} iconBg="bg-[#e4f3ec]" iconColor="text-[#00663f]" title="General Settings" action="Save Changes">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-500">Site Title</label>
            <input
              type="text"
              defaultValue="Motor Bridge French Business Directory"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#00663f]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Contact Email</label>
            <input
              type="email"
              value={profileEmail}
              onChange={(event) => setProfileEmail(event.target.value)}
              placeholder="Loading current user email..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#00663f]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500">Platform Description</label>
          <textarea
            defaultValue="The premier curated directory for trusted French enterprises and professional services."
            rows={3}
            className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#00663f]"
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={FiShield}
        iconBg="bg-[#fbe2e2]"
        iconColor="text-[#c0524d]"
        title="Security & Authentication"
        action="Update Security Policy"
      >
        <ToggleRow
          icon={FiShield}
          title="Two-Factor Authentication (2FA)"
          description="Require 2FA for all administrator accounts."
          checked={require2fa}
          onChange={() => setRequire2fa((prev) => !prev)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-500">Session Timeout (Minutes)</label>
            <CustomSelect
              value={sessionTimeout}
              onChange={setSessionTimeout}
              options={[
                { value: "15 Minutes", label: "15 Minutes" },
                { value: "30 Minutes", label: "30 Minutes" },
                { value: "60 Minutes", label: "60 Minutes" },
                { value: "120 Minutes", label: "120 Minutes" },
              ]}
              className="mt-1.5 w-full"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">Password Expiry Policy</label>
            <CustomSelect
              value={passwordExpiry}
              onChange={setPasswordExpiry}
              options={[
                { value: "30 Days", label: "30 Days" },
                { value: "60 Days", label: "60 Days" },
                { value: "90 Days", label: "90 Days" },
                { value: "Never", label: "Never" },
              ]}
              className="mt-1.5 w-full"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={FiSliders}
        iconBg="bg-[#fdf1e2]"
        iconColor="text-[#b17a3a]"
        title="Content Moderation"
        action="Save Moderation Rules"
      >
        <ToggleRow
          icon={FiZap}
          title="Auto-approve Verified Listings"
          description="Bypasses manual review for businesses with validated SIRET numbers."
          checked={autoApprove}
          onChange={() => setAutoApprove((prev) => !prev)}
        />
        <ToggleRow
          icon={FiEye}
          title="AI Review Sentiment Analysis"
          description="Flag reviews with high toxic probability for immediate manual review."
          checked={aiReview}
          onChange={() => setAiReview((prev) => !prev)}
        />
        <ToggleRow
          icon={FiEyeOff}
          title="Hide Inactive Profiles"
          description="Automatically delist businesses that haven't updated in 12 months."
          checked={hideInactive}
          onChange={() => setHideInactive((prev) => !prev)}
        />
      </SectionCard>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5ecfb]">
            <FiBell className="text-[15px] text-[#4a5fa5]" />
          </span>
          <h2 className="text-base font-bold text-slate-900">Notification Preferences</h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: FiBell,
              title: "In-App Alerts",
              description: "Real-time admin dashboard notifications.",
              checked: inAppAlerts,
              onChange: () => setInAppAlerts((prev) => !prev),
            },
            {
              icon: FiAtSign,
              title: "Email Digests",
              description: "Weekly summary of platform activity.",
              checked: emailDigests,
              onChange: () => setEmailDigests((prev) => !prev),
            },
            {
              icon: FiMessageSquare,
              title: "SMS Critical Alerts",
              description: "Text alerts for high-severity security issues.",
              checked: smsAlerts,
              onChange: () => setSmsAlerts((prev) => !prev),
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 p-4 text-center">
              <item.icon className="text-[18px] text-slate-500" />
              <p className="text-sm font-semibold text-slate-800">{item.title}</p>
              <p className="text-xs text-slate-400">{item.description}</p>
              <Toggle checked={item.checked} onChange={item.onChange} />
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
          >
            Save Notification Settings
          </button>
        </div>
      </div>
    </div>
  );
}
