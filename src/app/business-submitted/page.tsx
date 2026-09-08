"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type ProfileStatus = "loading" | "APPROVED" | "PENDING" | "REJECTED" | "UNKNOWN";

export default function BusinessSubmittedPage() {
  const [status, setStatus] = useState<ProfileStatus>("loading");

  useEffect(() => {
    let isMounted = true;

    baseApi.get(ENDPOINTS.getMyProfileBusinesses)
      .then((response) => {
        if (!isMounted) return;
        const payload = response.data?.data ?? response.data;
        const profile = Array.isArray(payload) ? payload[0] : payload?.business ?? payload;
        const nextStatus = String(profile?.status ?? "").toUpperCase();
        const profileStatus = nextStatus === "APPROVED" || nextStatus === "PENDING" || nextStatus === "REJECTED" ? nextStatus : "UNKNOWN";
        setStatus(profileStatus);
        if (profileStatus === "APPROVED") toast.success("Your business profile is approved.");
        if (profileStatus === "REJECTED") toast.error("Your business profile needs attention.");
      })
      .catch(() => {
        if (isMounted) setStatus("UNKNOWN");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const isApproved = status === "APPROVED";
  const isRejected = status === "REJECTED";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7fa] px-5 py-12">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm sm:p-10">
        <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${isApproved ? "bg-[#e4f3ec] text-[#00663f]" : isRejected ? "bg-[#fbeceb] text-[#c0524d]" : "bg-[#fff4dc] text-[#b17a3a]"}`}>
          <CheckCircle2 size={34} strokeWidth={2.2} />
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#00663f]">
          {status === "loading" ? "Checking status" : isApproved ? "Admin approved" : isRejected ? "Needs attention" : "Submission received"}
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
          {status === "loading" ? "Checking your business profile" : isApproved ? "Your business profile is approved" : isRejected ? "Your business profile needs attention" : "Your business profile was created successfully"}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600">
          {status === "loading" ? "We are checking the latest approval status." : isApproved ? "Great news! An admin has approved your business profile. It is now ready to appear on the platform." : isRejected ? "Please review your business profile and contact support for the next steps." : "Your profile is now waiting for admin approval. We will notify you by email as soon as your business is approved."}
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
