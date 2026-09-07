"use client";

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

interface VerifyEmailFormProps {
  email: string;
  onVerified?: () => void;
}

const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({ email, onVerified }) => {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, rawValue: string) => {
    const value = rawValue.replace(/\D/g, '');

    if (value.length > 1) {
      // Handle pasting the full code into one box
      const digits = value.slice(0, 6).split('');
      const nextCode = [...code];
      digits.forEach((digit, offset) => {
        if (index + offset < 6) nextCode[index + offset] = digit;
      });
      setCode(nextCode);
      const lastFilled = Math.min(index + digits.length, 5);
      inputRefs.current[lastFilled]?.focus();
      return;
    }

    const nextCode = [...code];
    nextCode[index] = value;
    setCode(nextCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const otp = code.join('');
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }

    setIsSubmitting(true);
    try {
      await baseApi.post(ENDPOINTS.verifyEmail, { email, otpCode: otp });
      toast.success("Email verified! You can now sign in.");
      if (onVerified) {
        onVerified();
      } else {
        router.push('/auth/login');
      }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Verification failed. Please check the code and try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await baseApi.post(ENDPOINTS.resentCode, { email });
      toast.success("A new code has been sent to your email.");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not resend the code. Please try again.";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center gap-2 sm:gap-3">
        {code.map((value, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg border border-[#d6d6d6] bg-[#f6f6f8] text-center text-lg font-semibold text-[#2a2a2a] focus:outline-none focus:ring-1 focus:ring-[#035f3a]"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 h-11 w-full rounded-lg bg-[#035f3a] text-white text-sm font-semibold shadow-[0_4px_12px_rgba(3,95,58,0.18)] hover:bg-[#024d2f] transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Verifying..." : "Verify Account"}
      </button>

      <p className="mt-5 text-xs text-[#6f6f6f] text-center">
        Didn&apos;t receive the code?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="text-[#035f3a] font-medium disabled:opacity-60"
        >
          {isResending ? "Sending..." : "Resend Code"}
        </button>
      </p>
    </form>
  );
};

export default VerifyEmailForm;
