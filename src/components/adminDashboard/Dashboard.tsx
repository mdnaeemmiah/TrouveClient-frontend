import type { IconType } from "react-icons";
import {
  FiAlertTriangle,
  FiBriefcase,
  FiMessageSquare,
  FiSettings,
  FiShield,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";

type StatCard = {
  label: string;
  value: string;
  icon: IconType;
  badge?: string;
  highlight?: boolean;
  iconBg: string;
  iconColor: string;
};

const stats: StatCard[] = [
  {
    label: "Total Businesses",
    value: "2,845",
    icon: FiBriefcase,
    badge: "+12.5%",
    iconBg: "bg-[#e4f3ec]",
    iconColor: "text-[#00663f]",
  },
  {
    label: "Total Users",
    value: "14,202",
    icon: FiUsers,
    badge: "+3.2%",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
  },
  {
    label: "Pending Approvals",
    value: "48",
    icon: FiSettings,
    highlight: true,
    iconBg: "bg-white/20",
    iconColor: "text-white",
  },
  {
    label: "Platform Inquiries",
    value: "156",
    icon: FiMessageSquare,
    iconBg: "bg-[#fdf1e2]",
    iconColor: "text-[#d99a3d]",
  },
];

type Registration = {
  initials: string;
  name: string;
  category: string;
  date: string;
  status: "Pending" | "Approved";
};

const registrations: Registration[] = [
  { initials: "LB", name: "Le Bistro Lyon", category: "Restaurant", date: "May 24, 2024", status: "Pending" },
  { initials: "ES", name: "Eco-Soin Paris", category: "Wellness", date: "May 23, 2024", status: "Approved" },
  { initials: "AM", name: "Auto-Mecha Marseille", category: "Automotive", date: "May 23, 2024", status: "Pending" },
  { initials: "TC", name: "Tech-Conseil", category: "IT Services", date: "May 22, 2024", status: "Approved" },
];

type Activity = {
  icon: IconType;
  iconBg: string;
  iconColor: string;
  title: string;
  meta: string;
};

const activity: Activity[] = [
  {
    icon: FiShield,
    iconBg: "bg-[#e4f3ec]",
    iconColor: "text-[#00663f]",
    title: "L'Atelier Floral approved",
    meta: "By Admin (M. Lefevre) · 2m ago",
  },
  {
    icon: FiAlertTriangle,
    iconBg: "bg-[#fdf1e2]",
    iconColor: "text-[#d99a3d]",
    title: "Security Alert: Multiple login attempts",
    meta: "IP 192.168.1.45 · 45m ago",
  },
  {
    icon: FiUserPlus,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
    title: "50 new users joined",
    meta: "Global Campaign · 2h ago",
  },
  {
    icon: FiSettings,
    iconBg: "bg-[#e4f3ec]",
    iconColor: "text-[#00663f]",
    title: "System Backup Completed",
    meta: "Automatic · 5h ago",
  },
];

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#00663f]">Welcome Admin,</h1>
        <p className="mt-1 text-sm text-slate-500">{today}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-2xl p-5 shadow-sm ${
                stat.highlight ? "bg-[#00663f] text-white" : "bg-white text-slate-900"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  <Icon className={`text-[18px] ${stat.iconColor}`} />
                </span>
                {stat.badge && (
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      stat.highlight ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {stat.badge}
                  </span>
                )}
              </div>
              <p className={`mt-4 text-sm ${stat.highlight ? "text-white/85" : "text-slate-500"}`}>
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#00663f]">Recent Registrations</h2>
            <button type="button" className="text-sm font-medium text-[#00663f] hover:underline">
              View All
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                  <th className="pb-3 font-medium">Business Name</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Date Joined</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.name} className="border-b border-slate-50 last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e4f3ec] text-xs font-semibold text-[#00663f]">
                          {reg.initials}
                        </span>
                        <span className="font-medium text-slate-800">{reg.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-500">{reg.category}</td>
                    <td className="py-3 text-slate-500">{reg.date}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          reg.status === "Approved"
                            ? "bg-[#e4f3ec] text-[#00663f]"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#00663f]">Recent Activity</h2>

          <ul className="mt-4 space-y-4">
            {activity.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="flex items-start gap-3">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}>
                    <Icon className={`text-[14px] ${item.iconColor}`} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{item.meta}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
