import type { IconType } from "react-icons";
import {
  FiArrowUpRight,
  FiCamera,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiImage,
  FiMessageCircle,
  FiPhone,
  FiShare2,
  FiStar,
} from "react-icons/fi";

const profileViews = { value: "1,482", change: "+12%" };
const viewsSparkline = [30, 45, 38, 55, 48, 78];

const contactAttempts = [
  { label: "WhatsApp", value: 42, icon: FiMessageCircle },
  { label: "Calls", value: 28, icon: FiPhone },
];

const rating = { value: "4.8", reviews: 124, strength: 90 };

type Activity = {
  title: string;
  meta: string;
  time: string;
  icon?: IconType;
  initials?: string;
  iconBg: string;
  iconColor: string;
};

const activity: Activity[] = [
  {
    title: "Marc Dubois left a 5-star review",
    meta: '"Excellent food and impeccable service. A true hidden gem in the city!"',
    time: "2 hours ago",
    initials: "MD",
    iconBg: "bg-[#e4f3ec]",
    iconColor: "text-[#00663f]",
  },
  {
    title: "New call attempt from +33 6 12 34 XX XX",
    meta: "",
    time: "Today at 11:30 AM",
    icon: FiPhone,
    iconBg: "bg-[#e4f3ec]",
    iconColor: "text-[#00663f]",
  },
  {
    title: "Your profile photo was updated successfully",
    meta: "",
    time: "Yesterday",
    icon: FiImage,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, Jean-Pierre</h1>
          <p className="mt-1 text-sm text-slate-500">
            Here is how your business &lsquo;Le Petit Bistro Paris&rsquo; is performing this week.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <FiClock className="text-[14px]" />
            Last 7 Days
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-[#00663f] px-3.5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
          >
            <FiShare2 className="text-[14px]" />
            Share Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Profile Views</p>
            <span className="flex items-center gap-1 rounded-full bg-[#e4f3ec] px-2 py-0.5 text-xs font-semibold text-[#00663f]">
              <FiArrowUpRight className="text-[12px]" />
              {profileViews.change}
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{profileViews.value}</p>

          <div className="mt-4 flex h-16 items-end gap-1.5">
            {viewsSparkline.map((height, index) => (
              <div
                key={index}
                className={`flex-1 rounded-t-[3px] ${
                  index === viewsSparkline.length - 1 ? "bg-[#00663f]" : "bg-[#00663f]/20"
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Contact Attempts</p>

          <div className="mt-3 space-y-3">
            {contactAttempts.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e4f3ec] text-[#00663f]">
                      <Icon className="text-[13px]" />
                    </span>
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{item.value}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-sm font-semibold text-slate-700">Total Enquiries</span>
            <span className="text-lg font-bold text-slate-900">
              {contactAttempts.reduce((sum, item) => sum + item.value, 0)}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Average Rating</p>

          <div className="mt-2 flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-900">{rating.value}</p>
            <div className="mb-1 flex gap-0.5 text-[#d99a3d]">
              {Array.from({ length: 5 }).map((_, index) => (
                <FiStar key={index} className="text-[14px]" fill="currentColor" />
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400">Based on {rating.reviews} reviews</p>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-[#d99a3d]" style={{ width: `${rating.strength}%` }} />
          </div>

          <button
            type="button"
            className="mt-3 flex items-center gap-1 text-sm font-medium text-[#00663f] hover:underline"
          >
            View all reviews
            <FiChevronRight className="text-[13px]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>

          <ul className="mt-4 space-y-4">
            {activity.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${item.iconBg} ${item.iconColor}`}>
                  {item.icon ? <item.icon className="text-[16px]" /> : item.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  {item.meta && <p className="mt-0.5 text-sm italic text-slate-500">{item.meta}</p>}
                  <p className="mt-0.5 text-xs text-slate-400">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-[#00663f] p-5 shadow-sm">
            <h2 className="text-base font-bold text-white">Quick Actions</h2>

            <div className="mt-4 space-y-2.5">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 rounded-xl bg-white/12 px-3.5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                <span className="flex items-center gap-2">
                  <FiClock className="text-[15px]" />
                  Update Hours
                </span>
                <FiChevronRight className="text-[14px]" />
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 rounded-xl bg-white/12 px-3.5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                <span className="flex items-center gap-2">
                  <FiCamera className="text-[15px]" />
                  Add Photos
                </span>
                <FiChevronRight className="text-[14px]" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Profile Strength</p>
              <FiCheckCircle className="text-[16px] text-[#00663f]" />
            </div>
            <p className="mt-2 text-sm font-bold text-slate-800">85% Complete</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[85%] rounded-full bg-[#00663f]" />
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Add a detailed description to reach 100% and get 2x more visibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
