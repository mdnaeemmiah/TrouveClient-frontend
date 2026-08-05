"use client";
import React, { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

const Login: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const user = login(email, password);
    if (!user) {
      setError('Invalid email or password.');
      return;
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <h1 className="text-green-900 font-bold text-xl mb-2">TrouveClients.fr</h1>
      <h2 className="text-center text-xl font-semibold mb-1 text-black">Welcome back</h2>
      <p className="text-center mb-6 text-black">Manage your business listings with ease.</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm"
      >
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-black">
            Email Address
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              className="pl-10 pr-3 py-2 w-full rounded-md border border-gray-300 bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-900 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1 text-black">
            Password
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="pl-10 pr-10 py-2 w-full rounded-md border border-gray-300 bg-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-900 text-black"
              value={password}
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-xs text-black">
              Remember me
            </label>
          </div>
          <Link href="/auth/forget" className="text-green-900 text-xs">
            Forgot password?
          </Link>
        </div>

        {error && <p className="mb-4 text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-900 text-white py-2 rounded-md hover:bg-green-800 transition-colors flex items-center justify-center gap-2"
          style={{color: 'white'}}
        >
          Sign In
          <span>&rarr;</span>
        </button>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-xs text-gray-600">Or continue with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition text-black"
          >
            <FcGoogle className="w-5 h-5" />
            Google
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition text-black"
          >
            <FaApple className="w-5 h-5" />
            Apple
          </button>
        </div>

        <p className="text-center text-xs mt-6 text-black">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-green-900 font-semibold">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
