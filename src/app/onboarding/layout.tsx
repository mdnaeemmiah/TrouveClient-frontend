import type { ReactNode } from "react";
import Link from "next/link";
import Footer from "@/src/components/Footer";
import OnboardingStepper from "@/src/components/onboarding/OnboardingStepper";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7fa]">
      <header className="flex h-[72px] shrink-0 items-center border-b border-[#f0f1f2] bg-white px-6 lg:px-[max(30px,calc((100vw-1400px)/2))]">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-[#00663f] lg:text-[22px]">
          TrouveClients.fr
        </Link>
      </header>

      <main className="flex-1 px-6 py-8 lg:px-[max(30px,calc((100vw-1400px)/2))]">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-600">
            Home
          </Link>
          <span>›</span>
          <span className="font-medium text-slate-600">Add Your Business</span>
        </nav>

        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
          Let&apos;s grow your business together
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Join thousands of French professionals discovering new local customers every day.
        </p>

        <div className="mt-8">
          <OnboardingStepper />
        </div>

        <div className="mt-8">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
