"use client";

import { useState } from "react";
import { useEffect } from "react";
import type { IconType } from "react-icons";
import {
  FiCoffee,
  FiCreditCard,
  FiEdit3,
  FiEye,
  FiHome,
  FiMoreVertical,
  FiShoppingBag,
  FiTrendingUp,
} from "react-icons/fi";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type Range = "Last 30 Days" | "Quarterly" | "Yearly";
type Timeframe = "30d" | "quarter" | "year";

const ranges: Range[] = ["Last 30 Days", "Quarterly", "Yearly"];
const timeframeByRange: Record<Range, Timeframe> = { "Last 30 Days": "30d", Quarterly: "quarter", Yearly: "year" };

type StatCard = {
  label: string;
  value: string;
  badge: string;
  icon: IconType;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeColor: string;
};

const fallbackGrowthMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const fallbackGrowthValues = [38, 30, 42, 58, 82, 66, 88];

const CHART_WIDTH = 600;
const CHART_TOP = 16;
const CHART_BASELINE = 170;

function buildPoints(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = CHART_BASELINE - CHART_TOP;
  return values.map((value, index) => ({
    x: (index / (values.length - 1)) * CHART_WIDTH,
    y: CHART_BASELINE - ((value - min) / (max - min || 1)) * span,
  }));
}

function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

type CategorySlice = { label: string; pct: number; color: string };

const fallbackCategories: CategorySlice[] = [
  { label: "Restaurants", pct: 45, color: "#00663f" },
  { label: "Boutiques", pct: 30, color: "#d99a3d" },
  { label: "Services", pct: 25, color: "#4a5fa5" },
];

const DONUT_R = 70;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_R;
const DONUT_GAP = 4;

const fallbackWeekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fallbackWeeklyViews = [55, 70, 88, 62, 78, 42, 30];
const fallbackWeeklyActions = [35, 50, 64, 46, 55, 30, 48];

type AnalyticsData = {
  timeframe?: string;
  stats?: {
    monthlyGrowth?: { count?: number; growthPercentage?: number; growthBadge?: string };
    activeBusinesses?: { count?: number; newCount?: number; badge?: string };
    userEngagement?: { count?: number; formatted?: string; growthCount?: number; growthBadge?: string };
    platformInquiries?: { count?: number; growthPercentage?: number; growthBadge?: string };
  };
  growthTimeline?: { month: string; fullDate: string; users: number; businesses: number; total: number }[];
  categoryDistribution?: { 
    totalBusinesses?: number; 
    categories?: { 
      categoryId: string; 
      name: string; 
      count: number; 
      percentage: number; 
      color: string 
    }[] 
  };
  weeklyEngagement?: { day: string; date: string; views: number; actions: number }[];
};

type Transaction = {
  name: string;
  meta: string;
  amount: string;
  time: string;
  icon: IconType;
  iconBg: string;
  iconColor: string;
};

const transactions: Transaction[] = [
  {
    name: "Le Petit Bistrot",
    meta: "Premium Plan · Annual",
    amount: "+€599.00",
    time: "2 mins ago",
    icon: FiCoffee,
    iconBg: "bg-[#e4f3ec]",
    iconColor: "text-[#00663f]",
  },
  {
    name: "Studio Grafik",
    meta: "Basic Plan · Monthly",
    amount: "+€49.00",
    time: "1 hour ago",
    icon: FiEdit3,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
  },
  {
    name: "Maison de Mode",
    meta: "Premium Plan · Annual",
    amount: "+€599.00",
    time: "3 hours ago",
    icon: FiShoppingBag,
    iconBg: "bg-[#fdf1e2]",
    iconColor: "text-[#b17a3a]",
  },
  {
    name: "L'Hôtel Riviera",
    meta: "Premium Plan · Monthly",
    amount: "+€89.00",
    time: "Yesterday",
    icon: FiHome,
    iconBg: "bg-[#e4f3ec]",
    iconColor: "text-[#00663f]",
  },
];

export default function Analytics() {
  const [range, setRange] = useState<Range>("Last 30 Days");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    let isMounted = true;
    console.log(`🔄 Fetching analytics data for timeframe: ${timeframeByRange[range]}`);
    console.log(`📡 API URL: ${ENDPOINTS.adminAnalytics}`);
    
    baseApi.get(ENDPOINTS.adminAnalytics, { params: { timeframe: timeframeByRange[range] } })
      .then((response) => {
        console.log(`✅ Analytics API Response:`, response.data);
        const data = response.data?.data ?? response.data;
        console.log(`📊 Processed Analytics Data:`, data);
        if (isMounted) setAnalytics(data);
      })
      .catch((error) => {
        console.error(`❌ Analytics API Error:`, error);
        console.error('Error details:', error.response?.data);
        console.error('Error status:', error.response?.status);
        if (isMounted) setAnalytics(null);
      })
    return () => { isMounted = false; };
  }, [range]);

  const stats: StatCard[] = [
    { label: "Monthly Growth", value: String(analytics?.stats?.monthlyGrowth?.count ?? 0), badge: analytics?.stats?.monthlyGrowth?.growthBadge ?? "", icon: FiTrendingUp, iconBg: "bg-[#e4f3ec]", iconColor: "text-[#00663f]", badgeBg: "bg-[#e4f3ec]", badgeColor: "text-[#00663f]" },
    { label: "Active Businesses", value: String(analytics?.stats?.activeBusinesses?.count ?? 0), badge: analytics?.stats?.activeBusinesses?.badge ?? "", icon: FiHome, iconBg: "bg-[#fdf1e2]", iconColor: "text-[#b17a3a]", badgeBg: "bg-[#fdf1e2]", badgeColor: "text-[#b17a3a]" },
    { label: "User Engagement", value: analytics?.stats?.userEngagement?.formatted ?? "0", badge: analytics?.stats?.userEngagement?.growthBadge ?? "", icon: FiEye, iconBg: "bg-slate-100", iconColor: "text-slate-500", badgeBg: "bg-slate-100", badgeColor: "text-slate-500" },
    { label: "Platform Inquiries", value: String(analytics?.stats?.platformInquiries?.count ?? 0), badge: analytics?.stats?.platformInquiries?.growthBadge ?? "", icon: FiCreditCard, iconBg: "bg-[#fbe2e2]", iconColor: "text-[#c0524d]", badgeBg: "bg-[#fbe2e2]", badgeColor: "text-[#c0524d]" },
  ];
  const growthMonths = analytics?.growthTimeline?.map((item) => item.month) ?? fallbackGrowthMonths;
  const growthValues = analytics?.growthTimeline?.map((item) => item.total) ?? fallbackGrowthValues;
  const growthPoints = buildPoints(growthValues);
  const growthLinePath = buildSmoothPath(growthPoints);
  const growthAreaPath = growthPoints.length ? `${growthLinePath} L ${growthPoints[growthPoints.length - 1].x} ${CHART_BASELINE} L ${growthPoints[0].x} ${CHART_BASELINE} Z` : "";
  const categories: CategorySlice[] = analytics?.categoryDistribution?.categories?.map((category) => ({ 
    label: category.name, 
    pct: category.percentage, 
    color: category.color 
  })) ?? fallbackCategories;
  
  const totalBusinesses = analytics?.categoryDistribution?.totalBusinesses ?? 1200;
  const donutSlices = categories.map((slice, index) => {
    const cumulative = categories.slice(0, index).reduce((sum, item) => sum + (item.pct / 100) * DONUT_CIRCUMFERENCE, 0);
    const length = (slice.pct / 100) * DONUT_CIRCUMFERENCE;
    const offset = -cumulative;
    return { ...slice, dasharray: `${Math.max(length - DONUT_GAP, 0)} ${DONUT_CIRCUMFERENCE}`, dashoffset: offset };
  });
  const weekDays = analytics?.weeklyEngagement?.map((item) => item.day) ?? fallbackWeekDays;
  const weeklyViews = analytics?.weeklyEngagement?.map((item) => item.views) ?? fallbackWeeklyViews;
  const weeklyActions = analytics?.weeklyEngagement?.map((item) => item.actions) ?? fallbackWeeklyActions;
  const weeklyMax = Math.max(...weeklyViews, ...weeklyActions, 1);

  return (
    <div className="space-y-6">
      {/* Remove DEBUG section for clean UI */}
      {/* DEBUG Section removed for production look */}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="mt-2 text-base text-slate-600">
            Comprehensive platform insights and performance metrics
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
          {ranges.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                range === item ? "bg-white text-[#00663f] shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="group relative rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`text-[20px] ${stat.iconColor}`} />
                </div>
                <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${stat.badgeBg} ${stat.badgeColor} shadow-sm`}>
                  {stat.badge}
                </span>
              </div>
              <div className="mt-5">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00663f]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm border border-slate-100 xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Growth Timeline</h2>
              <p className="text-sm text-slate-500 mt-1">Monthly user and business growth trends</p>
            </div>
            <button type="button" className="text-slate-400 transition-colors hover:text-slate-600">
              <FiMoreVertical className="text-[18px]" />
            </button>
          </div>

          <svg viewBox={`0 0 ${CHART_WIDTH} 200`} className="mt-2 w-full overflow-visible">
            <defs>
              <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00663f" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#00663f" stopOpacity="0.02" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {[0, 1, 2].map((step) => (
              <line
                key={step}
                x1={0}
                x2={CHART_WIDTH}
                y1={CHART_TOP + step * ((CHART_BASELINE - CHART_TOP) / 2)}
                y2={CHART_TOP + step * ((CHART_BASELINE - CHART_TOP) / 2)}
                stroke="#f1f5f9"
                strokeWidth={1}
                strokeDasharray="2,4"
              />
            ))}

            <path d={growthAreaPath} fill="url(#growth-fill)" />
            <path 
              d={growthLinePath} 
              fill="none" 
              stroke="#00663f" 
              strokeWidth={3} 
              strokeLinecap="round" 
              strokeLinejoin="round"
              filter="url(#glow)"
            />

            {growthPoints.map((point, index) => (
              <g key={growthMonths[index]} className="group cursor-pointer">
                <circle cx={point.x} cy={point.y} r={20} fill="transparent" />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={5}
                  fill="#00663f"
                  stroke="#ffffff"
                  strokeWidth={3}
                  className="opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:r-6"
                />
                <g
                  className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  transform={`translate(${Math.min(Math.max(point.x, 40), CHART_WIDTH - 40)}, ${Math.max(point.y - 40, 15)})`}
                >
                  <rect x={-35} y={-20} width={70} height={32} rx={8} fill="#1e293b" />
                  <text x={0} y={-8} textAnchor="middle" fontSize={11} fontWeight={600} fill="#ffffff">
                    {growthMonths[index]}
                  </text>
                  <text x={0} y={6} textAnchor="middle" fontSize={13} fontWeight={700} fill="#10b981">
                    {growthValues[index]}
                  </text>
                </g>
              </g>
            ))}

            {growthMonths.map((month, index) => (
              <text
                key={month}
                x={growthPoints[index].x}
                y={190}
                textAnchor="middle"
                fontSize={12}
                fontWeight={500}
                fill="#64748b"
              >
                {month}
              </text>
            ))}
          </svg>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Category Distribution</h2>
              <p className="text-sm text-slate-500 mt-1">Business categories breakdown</p>
            </div>
          </div>

          <div className="relative mx-auto mt-2 h-[200px] w-[200px]">
            <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
              <circle cx={100} cy={100} r={DONUT_R} fill="none" stroke="#f8fafc" strokeWidth={24} />
              {donutSlices.map((slice, index) => (
                <circle
                  key={slice.label}
                  cx={100}
                  cy={100}
                  r={DONUT_R}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={24}
                  strokeDasharray={slice.dasharray}
                  strokeDashoffset={slice.dashoffset}
                  className="transition-all duration-300 hover:opacity-80 hover:stroke-width-26"
                  style={{
                    filter: `drop-shadow(0 2px 4px ${slice.color}20)`
                  }}
                >
                  <title>
                    {slice.label}: {slice.pct}%
                  </title>
                </circle>
              ))}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-slate-900">{totalBusinesses >= 1000 ? `${(totalBusinesses/1000).toFixed(1)}k` : totalBusinesses}</p>
              <p className="text-sm text-slate-500 font-medium">Total Businesses</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {categories.map((cat) => (
              <div key={cat.label} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent hover:from-slate-100 transition-colors">
                <span className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <span 
                    className="h-3 w-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.label}
                </span>
                <span className="font-bold text-slate-900 bg-white px-2 py-1 rounded-full text-sm shadow-sm">
                  {cat.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm border border-slate-100 xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Weekly Engagement</h2>
              <p className="text-sm text-slate-500 mt-1">Daily views and user actions</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#00663f] shadow-sm" />
                Views
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#4fa87d] shadow-sm" />
                Actions
              </span>
            </div>
          </div>

          <div className="mt-4 flex h-48 items-end justify-between gap-3 p-4 bg-gradient-to-t from-slate-50 to-transparent rounded-xl">
            {weekDays.map((day, index) => (
              <div key={day} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-40 items-end gap-1.5">
                  <div className="group/bar relative flex h-full w-4 items-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-[#00663f] to-[#10b981] transition-all duration-300 group-hover/bar:opacity-80 group-hover/bar:scale-105 shadow-sm"
                      style={{ height: `${(weeklyViews[index] / weeklyMax) * 100}%` }}
                    />
                    <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover/bar:opacity-100 shadow-lg">
                      Views: {weeklyViews[index]}
                    </div>
                  </div>
                  <div className="group/bar relative flex h-full w-4 items-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-[#4fa87d] to-[#6ee7b7] transition-all duration-300 group-hover/bar:opacity-80 group-hover/bar:scale-105 shadow-sm"
                      style={{ height: `${(weeklyActions[index] / weeklyMax) * 100}%` }}
                    />
                    <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover/bar:opacity-100 shadow-lg">
                      Actions: {weeklyActions[index]}
                    </div>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-600 bg-white px-2 py-1 rounded-full shadow-sm">
                  {day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
            <button type="button" className="text-sm font-medium text-[#00663f] hover:underline">
              View All
            </button>
          </div>

          <ul className="mt-4 space-y-4">
            {transactions.map((tx) => {
              const Icon = tx.icon;
              return (
                <li key={tx.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full ${tx.iconBg}`}>
                      <Icon className={`text-[15px] ${tx.iconColor}`} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{tx.name}</p>
                      <p className="text-xs text-slate-400">{tx.meta}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#00663f]">{tx.amount}</p>
                    <p className="text-xs text-slate-400">{tx.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div> */}
      </div>
    </div>
  );
}
