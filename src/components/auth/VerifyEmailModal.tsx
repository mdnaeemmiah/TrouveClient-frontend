"use client";

import React from 'react';
import { FiMail, FiX } from 'react-icons/fi';
import VerifyEmailForm from './VerifyEmailForm';

interface VerifyEmailModalProps {
  open: boolean;
  email: string;
  onClose: () => void;
  onVerified: () => void;
}

const VerifyEmailModal: React.FC<VerifyEmailModalProps> = ({ open, email, onClose, onVerified }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-xl relative text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#8a8a8a] hover:text-[#2a2a2a] transition-colors"
          aria-label="Close"
        >
          <FiX size={18} />
        </button>

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
          <VerifyEmailForm email={email} onVerified={onVerified} />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailModal;
