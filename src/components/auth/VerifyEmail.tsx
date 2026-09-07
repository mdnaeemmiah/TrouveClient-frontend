"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiMail } from 'react-icons/fi';
import VerifyEmailForm from './VerifyEmailForm';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div className="min-h-screen bg-[#f6f6f8] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-[0_10px_30px_rgba(15,23,42,0.08)] border border-[#ececec] text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-[#e8f1ec] flex items-center justify-center">
          <FiMail className="text-[#035f3a] text-2xl" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-[#222]">Verify your email</h1>
        <p className="mt-2 text-sm leading-6 text-[#6f6f6f] max-w-sm mx-auto">
          We&apos;ve sent a 6-digit code to{' '}
          {email ? <span className="font-medium text-[#2a2a2a]">{email}</span> : 'your email address'}.
          Please enter it below to secure your account.
        </p>

        <div className="mt-8">
          <VerifyEmailForm email={email} />
        </div>

        <p className="mt-4 text-xs text-[#6f6f6f]">
          <Link href="/auth/login" className="text-[#035f3a] font-medium">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
