"use client";

import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";

export default function BusinessSubmittedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7fa] px-5 py-12">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e4f3ec] text-[#00663f]">
          <CheckCircle2 size={34} strokeWidth={2.2} />
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#00663f]">
          Submission received
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
          Your business profile was created successfully
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600">
          Your profile is now waiting for admin approval. We will notify you by email as soon as your business is approved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#00663f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005333]"
        >
          <Home size={17} />
          Back to home
        </Link>
      </section>
    </main>
  );
}
