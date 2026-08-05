"use client";

import type { IconType } from "react-icons";
import {
  FiAlertTriangle,
  FiChevronRight,
  FiInfo,
  FiMail,
  FiSettings,
  FiSmartphone,
} from "react-icons/fi";

type Action = {
  icon: IconType;
  iconBg: string;
  iconColor: string;
  tag: string;
  tagStyle: string;
  time: string;
  title: string;
  body: string;
  cta: string;
  ctaIcon: IconType;
};

const actions: Action[] = [
  {
    icon: FiAlertTriangle,
    iconBg: "bg-[#fdf1e2]",
    iconColor: "text-[#b17a3a]",
    tag: "High Priority",
    tagStyle: "bg-[#fdf1e2] text-[#b17a3a]",
    time: "2 mins to complete",
    title: "Your profile is missing photos of your new services",
    body: 'Listings with updated photos receive 42% more inquiries. You recently added "Organic Sourdough" but haven\'t uploaded images for it yet.',
    cta: "Take Action",
    ctaIcon: FiChevronRight,
  },
  {
    icon: FiInfo,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
    tag: "Opportunity",
    tagStyle: "bg-slate-100 text-slate-500",
    time: "5 mins to complete",
    title: "Response rate is below 80% for new inquiries",
    body: "I noticed 3 messages from potential customers that haven't been answered in 24 hours. Quick responses significantly boost your directory ranking.",
    cta: "Manage Messages",
    ctaIcon: FiMail,
  },
  {
    icon: FiSettings,
    iconBg: "bg-[#e4f3ec]",
    iconColor: "text-[#00663f]",
    tag: "Optimization",
    tagStyle: "bg-[#e4f3ec] text-[#00663f]",
    time: "3 mins to complete",
    title: "Enable 'Direct Booking' to reduce phone load",
    body: "Many users are looking for your services after 7 PM. Enabling online booking allows you to capture customers while your shop is closed.",
    cta: "Activate Booking",
    ctaIcon: FiSmartphone,
  },
];

const impactWeeks = [
  { label: "Week 1", value: 30 },
  { label: "Week 2", value: 48 },
  { label: "Week 3", value: 38 },
  { label: "Week 4 (Current)", value: 82 },
];

export default function AiCoach() {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#00663f] to-[#004f31] p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">Weekly Analysis</span>
            <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              3 actions to grow your business this week
            </h1>
            <p className="mt-2 text-sm text-green-100/85">
              I&rsquo;ve analyzed your listing and local search trends in Lyon. Here are the highest impact actions
              you can take today to increase your visibility by up to 24%.
            </p>
          </div>

          <div className="w-full max-w-xs shrink-0 rounded-xl bg-white/10 p-4">
            <p className="text-xs font-medium text-white/80">Coach Status</p>
            <div className="mt-2 flex items-center justify-between text-xs text-white/80">
              <span>Weekly Progress</span>
              <span className="font-semibold text-white">2/3 Tasks</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-2/3 rounded-full bg-white" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/10 p-3">
                <p className="text-xl font-bold text-white">12</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-white/70">Tips Applied</p>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <p className="text-xl font-bold text-white">+18%</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-white/70">Reach Growth</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900">Recommended Actions</h2>

        <div className="mt-3 space-y-4">
          {actions.map((action) => {
            const Icon = action.icon;
            const CtaIcon = action.ctaIcon;
            return (
              <div key={action.title} className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${action.iconBg}`}>
                  <Icon className={`text-[18px] ${action.iconColor}`} />
                </span>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${action.tagStyle}`}>
                      {action.tag}
                    </span>
                    <span className="text-xs text-slate-400">{action.time}</span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-slate-900">{action.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{action.body}</p>
                </div>

                <button
                  type="button"
                  className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
                >
                  {action.cta}
                  <CtaIcon className="text-[14px]" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Impact Analytics</h2>
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50"
            >
              Last 30 Days ⌄
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-500">How my tips are transforming your business</p>

          <div className="mt-6 flex h-40 items-end justify-between gap-3">
            {impactWeeks.map((week, index) => (
              <div key={week.label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={`w-full max-w-[56px] rounded-t-[4px] ${
                    index === impactWeeks.length - 1 ? "bg-[#00663f]" : "bg-[#00663f]/25"
                  }`}
                  style={{ height: `${week.value}%` }}
                />
                <span className="text-xs text-slate-400">{week.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#00663f] p-5 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-lg">🧠</span>
          <h2 className="mt-3 text-base font-bold text-white">AI Training Lab</h2>
          <p className="mt-1 text-sm text-green-100/80">
            Help me coach you better by sharing your specific goals for this month.
          </p>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              className="w-full rounded-xl border border-white/25 px-3.5 py-2.5 text-left text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Get more local reviews
            </button>
            <button
              type="button"
              className="w-full rounded-xl border border-white/25 px-3.5 py-2.5 text-left text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Rank higher for &ldquo;Bakery&rdquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
