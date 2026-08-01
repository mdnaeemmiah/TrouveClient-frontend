"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FiMail } from 'react-icons/fi';

export default function VerifyCode() {
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleChange = (index: number, value: string) => {
    const nextCode = [...code];
    nextCode[index] = value.slice(-1);
    setCode(nextCode);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ code: code.join('') });
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-[0_10px_30px_rgba(15,23,42,0.08)] border border-[#ececec] text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-[#e8f1ec] flex items-center justify-center">
          <FiMail className="text-[#035f3a] text-2xl" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-[#222]">Verify your email</h1>
        <p className="mt-2 text-sm leading-6 text-[#6f6f6f] max-w-sm mx-auto">
          We&apos;ve sent a 6-digit code to your email address. Please enter it below to secure your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex justify-center gap-2 sm:gap-3">
            {code.map((value, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg border border-[#d6d6d6] bg-[#f6f6f8] text-center text-lg font-semibold text-[#2a2a2a] focus:outline-none focus:ring-1 focus:ring-[#035f3a]"
              />
            ))}
          </div>

<Link href="/auth/setPass">
          <button
            type="submit"
            className="mt-6 h-11 w-full rounded-lg bg-[#035f3a] text-white text-sm font-semibold shadow-[0_4px_12px_rgba(3,95,58,0.18)] hover:bg-[#024d2f] transition"
          >
            Verify Account
          </button>
</Link>
        </form>

        <p className="mt-5 text-xs text-[#6f6f6f]">
          Didn&apos;t receive the code?{' '}
          <Link href="#" className="text-[#035f3a] font-medium">
            Resend Code
          </Link>
        </p>
      </div>
    </div>
  );
}
