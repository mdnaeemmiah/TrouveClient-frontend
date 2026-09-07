"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiCheck } from "react-icons/fi";

export type OnboardingStep = {
  label: string;
  href: string;
};

export const onboardingSteps: OnboardingStep[] = [
  { label: "Basic Info", href: "/onboarding/grow" },
  { label: "Contact", href: "/onboarding/contact" },
  { label: "Details", href: "/onboarding/details" },
  { label: "Photos", href: "/onboarding/showCase" },
  { label: "Booking Configuration", href: "/onboarding/bookings" },
  { label: "Review", href: "/onboarding/review" },
];

export default function OnboardingStepper() {
  const pathname = usePathname();
  const activeIndex = Math.max(
    0,
    onboardingSteps.findIndex((step) => pathname?.startsWith(step.href))
  );

  return (
    <div className="relative flex items-start justify-between gap-1 overflow-x-auto pb-1">
      <div className="absolute left-4 right-4 top-4 h-0.5 bg-[#dcebe4]" />

      {onboardingSteps.map((step, index) => {
        const isActive = index === activeIndex;
        const isCompleted = index < activeIndex;

        return (
          <Link
            key={step.href}
            href={step.href}
            className="relative z-10 flex min-w-[78px] flex-1 flex-col items-center gap-2 last:flex-none"
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-xs font-semibold transition-colors ${
                isCompleted
                  ? "border-[#00663f] bg-[#00663f] text-white"
                  : isActive
                    ? "border-[#00663f] text-[#00663f]"
                    : "border-slate-300 text-slate-500"
              }`}
            >
              {isCompleted ? <FiCheck className="text-[14px]" /> : index + 1}
            </span>
            <span
              className={`whitespace-nowrap text-center text-xs font-medium ${
                isActive || isCompleted ? "text-[#00663f]" : "text-slate-500"
              }`}
            >
              {step.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
