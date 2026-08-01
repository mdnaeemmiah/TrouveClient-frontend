"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FiEye, FiEyeOff, FiLock, FiRefreshCw } from 'react-icons/fi';

export default function SetPass() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ newPassword, confirmPassword });
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-[0_10px_30px_rgba(15,23,42,0.08)] border border-[#ececec] text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-[#e8f1ec] flex items-center justify-center">
          <FiRefreshCw className="text-[#035f3a] text-2xl" />
        </div>

        <h1 className="mt-6 text-[30px] font-semibold tracking-tight text-[#222]">
          Set New Password
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#6f6f6f] max-w-sm mx-auto">
          Your new password must be different from previously used passwords.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 text-left">
          <div>
            <label htmlFor="newPassword" className="block text-xs font-semibold text-[#2c2c2c] mb-1.5">
              New Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b1b1b1]" />
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 rounded-lg border border-[#e1e1e1] bg-[#f6f6f8] pl-10 pr-10 text-sm text-[#2a2a2a] placeholder:text-[#a6a6a6] focus:outline-none focus:ring-1 focus:ring-[#035f3a]"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d7d7d]"
                tabIndex={-1}
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {/* <div className="mt-1 h-px w-full bg-[#e6e6e6]" /> */}
            {/* <p className="mt-1 text-[10px] text-[#c0c0c0]">Enter your new password</p> */}
          </div>

          <div className="mt-4">
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-[#2c2c2c] mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b1b1b1]" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 rounded-lg border border-[#e1e1e1] bg-[#f6f6f8] pl-10 pr-10 text-sm text-[#2a2a2a] placeholder:text-[#a6a6a6] focus:outline-none focus:ring-1 focus:ring-[#035f3a]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d7d7d]"
                tabIndex={-1}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 h-11 w-full rounded-lg bg-[#035f3a] text-white text-sm font-semibold shadow-[0_4px_12px_rgba(3,95,58,0.18)] hover:bg-[#024d2f] transition"
          >
            Reset Password
          </button>
        </form>

        <Link href="/auth/login" className="mt-4 inline-flex items-center gap-2 text-sm text-[#4a4a4a] hover:text-[#035f3a]">
          <span>←</span>
          <span>Back to login</span>
        </Link>
      </div>
    </div>
  );
}
