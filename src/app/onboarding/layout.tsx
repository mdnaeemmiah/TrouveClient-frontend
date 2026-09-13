import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/src/components/Footer";
import OnboardingPreview from "@/src/components/onboarding/OnboardingPreview";
import OnboardingStepper from "@/src/components/onboarding/OnboardingStepper";
import { OnboardingProvider } from "@/src/context/OnboardingContext";
import logo from "@/src/assets/auth/image.png";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <OnboardingProvider>
      <div className="flex min-h-screen flex-col bg-[#f4f8f6]">
        <header className="flex h-18 shrink-0 items-center border-b border-[#dcebe4] bg-white px-6 lg:px-[max(30px,calc((100vw-1400px)/2))]">
          <Link href="/" className="flex h-12 w-[210px] items-center" aria-label="TrouveClients.fr home">
            <Image src={logo} alt="TrouveClients.fr" width={280} height={130} className="h-full w-full object-contain" priority unoptimized />
          </Link>
        </header>

        <main className="relative flex-1 overflow-hidden px-6 py-8 lg:px-[max(30px,calc((100vw-1400px)/2))]">
          <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-[#dff2e9] opacity-70 blur-3xl" />
          <div className="relative">
          <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-slate-600">
              Home
            </Link>
            <span aria-hidden="true">&rsaquo;</span>
            <span className="font-semibold text-[#00663f]">Add Your Business</span>
          </nav>

          <div className="mt-5 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00663f]">Business onboarding</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Let&apos;s grow your business together
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            Join thousands of French professionals discovering new local customers every day.
          </p>
          </div>

          <div className="mt-9 rounded-2xl border border-[#dcebe4] bg-white/80 px-4 py-5 shadow-[0_14px_40px_rgba(28,73,53,0.06)] backdrop-blur sm:px-7">
            <OnboardingStepper />
          </div>
          <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_330px]">
            <div className="min-w-0">{children}</div>
            <OnboardingPreview />
          </div>
          </div>
        </main>

        <Footer />
      </div>
    </OnboardingProvider>
  );
}
