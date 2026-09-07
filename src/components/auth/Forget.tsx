"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMail } from 'react-icons/fi';
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

export default function Forget() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      await baseApi.post(ENDPOINTS.forgetPassword, { email });
      toast.success("A verification code has been sent to your email.");
      router.push(`/auth/verifyCode?email=${encodeURIComponent(email)}`);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not send the reset code. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-[0_10px_30px_rgba(15,23,42,0.08)] border border-[#ececec] text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-[#e8f1ec] flex items-center justify-center">
          <FiMail className="text-[#035f3a] text-2xl" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-[#222]">Forgot your password?</h1>
        <p className="mt-2 text-sm leading-6 text-[#6f6f6f] max-w-sm mx-auto">
          Enter your email address below and we&apos;ll send you a reset link to secure your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 text-left">
          <label htmlFor="email" className="block text-xs text-[#2c2c2c] mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#808080]" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-11 rounded-lg border border-[#d6d6d6] bg-[#f6f6f8] pl-10 pr-4 text-sm text-[#2a2a2a] placeholder:text-[#a6a6a6] focus:outline-none focus:ring-1 focus:ring-[#035f3a]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 h-11 w-full rounded-lg bg-[#035f3a] text-white text-sm font-semibold shadow-[0_4px_12px_rgba(3,95,58,0.18)] hover:bg-[#024d2f] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Reset Code"}
          </button>
        </form>

        <p className="mt-5 text-xs text-[#6f6f6f]">
          Remembered your password?{' '}
          <Link href="/auth/login" className="text-[#035f3a] font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
