"use client";

import { useState } from "react";
import { FiEye, FiEyeOff, FiLoader, FiShield } from "react-icons/fi";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

export default function SecuritySection() {
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });

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

  return (
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
  );
}
