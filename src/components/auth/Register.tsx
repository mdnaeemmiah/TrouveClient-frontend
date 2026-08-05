"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaFacebookF, FaStore, FaUser } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff, FiMail, FiShield, FiTrendingUp, FiUser as FiUserIcon } from 'react-icons/fi';

const Register: React.FC = () => {
  const [isCustomer, setIsCustomer] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ isCustomer, fullName, email, password, confirmPassword, acceptTerms });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <aside className="hidden lg:flex lg:w-1/2 bg-[#035f3a] text-white px-6 sm:px-10 xl:px-14 py-12 lg:py-14 flex-col items-start justify-center">
        <div className="max-w-md text-left">
          <h1 className="text-xl font-bold mb-10">TrouveClients.fr</h1>
          <h2 className="text-[28px] sm:text-[32px] font-bold leading-[1.2] tracking-tight max-w-sm">
            Join the largest service community in France.
          </h2>
          <p className="mt-6 text-sm leading-6 text-white/85 max-w-sm">
            Find qualified clients or the ideal professional for your projects in just a few clicks.
          </p>

          <div className="mt-8 space-y-5 flex flex-col items-start">
            <div className="flex items-start gap-3 text-left">
              <div className="h-6 w-6 rounded-md bg-white/15 flex items-center justify-center mt-0.5 shrink-0">
                <FiShield className="text-white text-sm" />
              </div>
              <div>
                <div className="text-sm font-semibold leading-5">Verified Profiles</div>
                <div className="text-[11px] text-white/75 leading-4">Trust above all for every transaction.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <div className="h-6 w-6 rounded-md bg-white/15 flex items-center justify-center mt-0.5 shrink-0">
                <FiTrendingUp className="text-white text-sm" />
              </div>
              <div>
                <div className="text-sm font-semibold leading-5">Business Growth</div>
                <div className="text-[11px] text-white/75 leading-4">Thousands of new opportunities every day.</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="w-full lg:w-1/2 bg-white px-4 sm:px-8 lg:px-12 xl:px-16 py-10 lg:py-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h3 className="text-[26px] font-semibold tracking-tight text-[#1f1f1f]">Create an account</h3>
          <p className="mt-1 text-sm text-[#6f6f6f]">Ready to start the adventure? It&apos;s free and fast.</p>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsCustomer(true)}
                className={`h-[70px] rounded-lg border px-4 flex flex-col items-center justify-center gap-2 transition ${
                  isCustomer ? 'bg-[#eef7f1] border-[#c7d8cd]' : 'bg-white border-[#d8e1da]'
                }`}
              >
                <span className="h-7 w-7 rounded-full bg-[#dbe9df] flex items-center justify-center text-[#035f3a]">
                  <FaUser className="text-[12px]" />
                </span>
                <span className="text-[11px] font-medium text-[#222]">I am a Customer</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCustomer(false)}
                className={`h-[70px] rounded-lg border px-4 flex flex-col items-center justify-center gap-2 transition ${
                  !isCustomer ? 'bg-[#eef7f1] border-[#c7d8cd]' : 'bg-white border-[#d8e1da]'
                }`}
              >
                <span className="h-7 w-7 rounded-full bg-[#dbe9df] flex items-center justify-center text-[#035f3a]">
                  <FaStore className="text-[12px]" />
                </span>
                <span className="text-[11px] font-medium text-[#222]">I am a Business Owner</span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-xs text-[#2c2c2c] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <FiUserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#808080]" />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Jean Dupont"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-9 rounded-md border border-[#d6d6d6] bg-[#f6f6f8] pl-10 pr-3 text-sm text-[#2a2a2a] placeholder:text-[#a6a6a6] focus:outline-none focus:ring-1 focus:ring-[#035f3a]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs text-[#2c2c2c] mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#808080]" />
                  <input
                    id="email"
                    type="email"
                    placeholder="jean.dupont@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-9 rounded-md border border-[#d6d6d6] bg-[#f6f6f8] pl-10 pr-3 text-sm text-[#2a2a2a] placeholder:text-[#a6a6a6] focus:outline-none focus:ring-1 focus:ring-[#035f3a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="password" className="block text-xs text-[#2c2c2c] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                      <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 text-[#808080]" />
                    <input
                      id="password"
                        type={showPassword ? 'text' : 'password'}
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-9 rounded-md border border-[#d6d6d6] bg-[#f6f6f8] pl-10 pr-10 text-sm text-[#2a2a2a] placeholder:text-[#a6a6a6] focus:outline-none focus:ring-1 focus:ring-[#035f3a]"
                    />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#808080]"
                        tabIndex={-1}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-xs text-[#2c2c2c] mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                      <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 text-[#808080]" />
                    <input
                      id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="********"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-9 rounded-md border border-[#d6d6d6] bg-[#f6f6f8] pl-10 pr-10 text-sm text-[#2a2a2a] placeholder:text-[#a6a6a6] focus:outline-none focus:ring-1 focus:ring-[#035f3a]"
                    />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#808080]"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-2 text-[11px] leading-4 text-[#4b4b4b] pt-1">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#cfcfcf] accent-[#035f3a]"
                />
                <span>
                  I accept the{' '}
                  <a href="#" className="text-[#035f3a]">
                    Terms of Service
                  </a>{' '}
                  and Privacy Policy of TrouveClients.fr.
                </span>
              </label>

              <button
                type="submit"
                className="mt-2 h-11 w-full rounded-md bg-[#035f3a] text-white text-sm font-semibold shadow-[0_4px_12px_rgba(3,95,58,0.18)] hover:bg-[#024d2f] transition flex items-center justify-center gap-2"
              >
                Create Account
              </button>

              <div className="flex items-center gap-3 py-2">
                <div className="h-px flex-1 bg-[#d9d9d9]" />
                <span className="text-[11px] text-[#8a8a8a]">Or sign up with</span>
                <div className="h-px flex-1 bg-[#d9d9d9]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  className="h-9 rounded-md border border-[#d7d7d7] bg-white text-[#363636] text-sm flex items-center justify-center gap-2 hover:bg-[#f7f7f7] transition"
                >
                  <FcGoogle className="text-lg" />
                  Google
                </button>

                <button
                  type="button"
                  className="h-9 rounded-md border border-[#d7d7d7] bg-white text-[#363636] text-sm flex items-center justify-center gap-2 hover:bg-[#f7f7f7] transition"
                >
                  <FaFacebookF className="text-[#1877f2] text-sm" />
                  Facebook
                </button>
              </div>

              <p className="pt-2 text-center text-[12px] text-[#7f7f7f]">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-[#035f3a]">
                  Sign in
                </Link>
              </p>
            </div>

            <footer className="mt-8 border-t border-[#e5e5e5] pt-4 text-[11px] text-[#8e8e8e] flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>© 2024 TrouveClients.fr. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#">Terms of service</a>
                <a href="#">Privacy policy</a>
                <a href="#">Contact</a>
              </div>
            </footer>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;