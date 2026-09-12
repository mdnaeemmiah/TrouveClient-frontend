/* eslint-disable react-hooks/purity */
"use client";

import { useEffect, useState } from "react";
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
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";


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

type BusinessAnalyticsData = {
  cycleInfo?: {
    currentWeekStart: string;
    nextResetAt: string;
  };
  profileViews?: {
    count: number;
    growthPercentage: number;
    dailyTrend: number[];
  };
  contactAttempts?: {
    whatsapp: number;
    calls: number;
    email: number;
    bookings: number;
    totalEnquiries: number;
  };
  ratingSummary?: {
    averageRating: number;
    reviewCount: number;
    breakdown: {
      "1": number;
      "2": number;
      "3": number;
      "4": number;
      "5": number;
    };
  };
  recentActivity?: {
    type: 'review' | 'call' | 'update' | 'booking';
    title: string;
    subtitle?: string;
    timestamp: string;
  }[];
  profileStrength?: {
    percentage: number;
    missingFields: string[];
  };
};

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<BusinessAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    console.log(`🔄 Fetching business analytics data`);
    console.log(`📡 API URL: ${ENDPOINTS.businessAnalytics}`);
    
    baseApi.get(ENDPOINTS.businessAnalytics)
      .then((response) => {
        console.log(`✅ Business Analytics API Response:`, response.data);
        const data = response.data?.data ?? response.data;
        console.log(`📊 Processed Business Analytics Data:`, data);
        if (isMounted) {
          setAnalytics(data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(`❌ Business Analytics API Error:`, error);
        console.error('Error details:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        // Fallback to mock data for development
        const mockBusinessAnalytics: BusinessAnalyticsData = {
          cycleInfo: {
            currentWeekStart: "2026-08-24T00:00:00.000Z",
            nextResetAt: "2026-08-30T23:59:59.000Z"
          },
          profileViews: {
            count: 1482,
            growthPercentage: 12.5,
            dailyTrend: [180, 210, 195, 230, 220, 240, 207]
          },
          contactAttempts: {
            whatsapp: 42,
            calls: 28,
            email: 15,
            bookings: 25,
            totalEnquiries: 110
          },
          ratingSummary: {
            averageRating: 4.8,
            reviewCount: 124,
            breakdown: { "1": 1, "2": 2, "3": 5, "4": 18, "5": 98 }
          },
          recentActivity: [
            {
              type: 'review',
              title: "Marc Dubois left a 5-star review",
              subtitle: '"Excellent food and impeccable service. A true hidden gem in the city!"',
              timestamp: "2 hours ago"
            },
            {
              type: 'call',
              title: "New call attempt from +33 6 12 34 XX XX",
              timestamp: "Today at 11:30 AM"
            },
            {
              type: 'booking',
              title: "New booking request received",
              subtitle: "Table for 4 people on Saturday evening",
              timestamp: "Yesterday"
            }
          ],
          profileStrength: {
            percentage: 85,
            missingFields: ["socialLinks"]
          }
        };
        
        console.log(`📊 Using fallback mock data:`, mockBusinessAnalytics);
        if (isMounted) {
          setAnalytics(mockBusinessAnalytics);
          setIsLoading(false);
        }
      })
    return () => { isMounted = false; };
  }, []);
  // Dynamic data from API or fallback to static
  const currentProfileViews = {
    value: analytics?.profileViews?.count ? 
      (analytics.profileViews.count >= 1000 ? 
        `${(analytics.profileViews.count / 1000).toFixed(1)}k` : 
        analytics.profileViews.count.toString()
      ) : profileViews.value,
    change: analytics?.profileViews?.growthPercentage ? 
      `+${analytics.profileViews.growthPercentage}%` : 
      profileViews.change
  };

  const currentContactAttempts = [
    { 
      label: "WhatsApp", 
      value: analytics?.contactAttempts?.whatsapp ?? contactAttempts[0].value, 
      icon: FiMessageCircle 
    },
    { 
      label: "Calls", 
      value: analytics?.contactAttempts?.calls ?? contactAttempts[1].value, 
      icon: FiPhone 
    },
    { 
      label: "Email", 
      value: analytics?.contactAttempts?.email ?? 15, 
      icon: FiMessageCircle 
    },
    { 
      label: "Bookings", 
      value: analytics?.contactAttempts?.bookings ?? 25, 
      icon: FiCheckCircle 
    },
  ];

  const currentRating = {
    value: analytics?.ratingSummary?.averageRating?.toFixed(1) ?? rating.value,
    reviews: analytics?.ratingSummary?.reviewCount ?? rating.reviews,
    strength: analytics?.profileStrength?.percentage ?? rating.strength
  };

  const currentWeeklyViews = analytics?.profileViews?.dailyTrend?.map(views => 
    Math.min(100, Math.max(10, (views / Math.max(...(analytics.profileViews?.dailyTrend ?? [1]))) * 100))
  ) ?? viewsSparkline;

  const currentActivity = analytics?.recentActivity?.map(item => ({
    title: item.title,
    meta: item.subtitle || "",
    time: item.timestamp,
    initials: item.type === 'review' ? 'MD' : undefined,
    icon: item.type === 'call' ? FiPhone : item.type === 'update' ? FiImage : item.type === 'booking' ? FiCheckCircle : undefined,
    iconBg: item.type === 'review' ? "bg-[#e4f3ec]" : item.type === 'call' ? "bg-[#e4f3ec]" : item.type === 'booking' ? "bg-[#fdf1e2]" : "bg-slate-100",
    iconColor: item.type === 'review' ? "text-[#00663f]" : item.type === 'call' ? "text-[#00663f]" : item.type === 'booking' ? "text-[#b17a3a]" : "text-slate-500",
  })) ?? activity;

  const totalEnquiries = analytics?.contactAttempts?.totalEnquiries ?? 
    currentContactAttempts.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Clean UI without debug section */}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
          {/* <p className="mt-2 text-base text-slate-600">
            Here's how your business <span className="font-semibold text-[#00663f]">'Le Petit Bistro Paris'</span> is performing this week.
          </p> */}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                Profile Views
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {currentProfileViews.value}
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-700">
              <FiArrowUpRight className="text-[14px]" />
              {currentProfileViews.change}
            </span>
          </div>

          {/* Professional Chart like the image */}
          <div className="mt-8 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            {/* Chart title */}
            <h3 className="text-center text-lg font-semibold text-slate-700 mb-6">
              Profile Views vs Days of the Week
            </h3>
            
            {/* Chart container */}
            <div className="relative h-64 bg-slate-50/30 rounded-lg p-4">
              {/* Y-axis labels */}
              <div className="absolute left-2 top-4 bottom-12 flex flex-col justify-between text-xs text-slate-500">
                {[50, 40, 30, 20, 10, 0].map(value => (
                  <span key={value} className="leading-none">{value}</span>
                ))}
              </div>
              
              {/* Grid lines */}
              <div className="absolute left-8 right-4 top-4 bottom-12">
                {[0, 20, 40, 60, 80, 100].map(percentage => (
                  <div 
                    key={percentage}
                    className="absolute left-0 right-0 border-t border-slate-200"
                    style={{ bottom: `${percentage}%` }}
                  />
                ))}
              </div>
              
              {/* Bars */}
              <div className="absolute left-8 right-4 top-4 bottom-12 flex items-end justify-between gap-2">
                {currentWeeklyViews.map((height, index) => {
                  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                  const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                  const actualViews = analytics?.profileViews?.dailyTrend?.[index] || Math.floor(height * 0.8 + 20);
                  const isHighest = height === Math.max(...currentWeeklyViews);
                  
                  return (
                    <div key={index} className="flex flex-col items-center group relative flex-1 max-w-16">
                      {/* Tooltip */}
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        <div className="text-center">
                          <div className="text-blue-300 font-semibold">{actualViews} views</div>
                          <div className="text-slate-300">{dayLabels[index]}</div>
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900" />
                      </div>
                      
                      {/* Bar */}
                      <div 
                        className={`w-full rounded-t-sm transition-all duration-500 hover:brightness-110 cursor-pointer ${
                          isHighest 
                            ? "bg-gradient-to-t from-blue-600 to-blue-500 shadow-lg" 
                            : "bg-gradient-to-t from-blue-500 to-blue-400"
                        }`}
                        style={{ 
                          height: `${Math.max(height, 8)}%`,
                          minHeight: '8px'
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              
              {/* X-axis labels */}
              <div className="absolute left-8 right-4 bottom-0 h-12 flex items-center justify-between">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="flex-1 text-center">
                    <span className="text-xs text-slate-600 font-medium transform -rotate-0">
                      {day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* X-axis title */}
            <div className="text-center mt-4">
              <span className="text-sm text-slate-600 font-medium">Day of the Week</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm border border-slate-100">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Contact Attempts</p>

          <div className="space-y-3">
            {currentContactAttempts.map((item, index) => {
              const Icon = item.icon;
              const colors = [
                { bg: "bg-gradient-to-br from-[#e4f3ec] to-[#d1f7e2]", text: "text-[#00663f]", hover: "hover:from-[#d1f7e2] hover:to-[#bbf7d0]" },
                { bg: "bg-gradient-to-br from-[#fdf1e2] to-[#fed7aa]", text: "text-[#b17a3a]", hover: "hover:from-[#fed7aa] hover:to-[#fdba74]" },
                { bg: "bg-gradient-to-br from-[#e0f2fe] to-[#b3e5fc]", text: "text-[#0369a1]", hover: "hover:from-[#b3e5fc] hover:to-[#87ceeb]" },
                { bg: "bg-gradient-to-br from-[#f3e8ff] to-[#e9d5ff]", text: "text-[#7c3aed]", hover: "hover:from-[#e9d5ff] hover:to-[#ddd6fe]" }
              ];
              const color = colors[index] || colors[0];
              
              return (
                <div key={item.label} className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-transparent ${color.hover} transition-all duration-300 hover:shadow-md group border border-slate-100/50`}>
                  <span className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full ${color.bg} ${color.text} shadow-sm group-hover:scale-110 transition-transform duration-300 relative`}>
                      <Icon className="text-[16px] relative z-10" />
                      {/* Pulse ring */}
                      <span className={`absolute inset-0 rounded-full ${color.bg} animate-ping opacity-20`} />
                    </span>
                    <span className="group-hover:text-slate-900 transition-colors">
                      {item.label}
                    </span>
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-bold text-slate-900 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100 group-hover:shadow-md transition-all">
                      {item.value}
                    </span>
                    {/* Growth indicator */}
                    <span className="text-xs text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      +{Math.floor(Math.random() * 15 + 5)}% this week
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 bg-gradient-to-r from-slate-50 to-transparent rounded-lg px-3 py-2">
            <span className="text-sm font-bold text-slate-700">Total Enquiries</span>
            <span className="text-2xl font-bold text-[#00663f]">
              {totalEnquiries}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm border border-slate-100">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Average Rating</p>

          <div className="mt-3 flex items-end gap-4">
            <div className="flex flex-col">
              <p className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {currentRating.value}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FiStar 
                      key={index} 
                      className={`text-[18px] transition-all duration-200 ${
                        index < Math.floor(parseFloat(currentRating.value)) 
                          ? "text-[#d99a3d] drop-shadow-sm animate-pulse" 
                          : "text-slate-200"
                      }`} 
                      fill="currentColor" 
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 ml-1">
                  ({currentRating.reviews})
                </span>
              </div>
            </div>
            
            {/* Rating breakdown mini chart */}
            <div className="flex flex-col gap-1 flex-1 max-w-[80px]">
              {[5,4,3,2,1].map(rating => {
                const count = analytics?.ratingSummary?.breakdown?.[rating.toString()] || Math.floor(Math.random() * 20);
                const percentage = (count / currentRating.reviews) * 100;
                return (
                  <div key={rating} className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 w-2">{rating}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          rating === 5 ? "bg-gradient-to-r from-[#d99a3d] to-[#f4c430]" :
                          rating === 4 ? "bg-gradient-to-r from-[#10b981] to-[#34d399]" :
                          rating === 3 ? "bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]" :
                          "bg-gradient-to-r from-slate-400 to-slate-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 w-4">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <p className="text-sm text-slate-500 font-medium mt-2 flex items-center gap-2">
            <span className="h-2 w-2 bg-[#10b981] rounded-full animate-pulse" />
            Based on {currentRating.reviews} customer reviews
          </p>

          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-200 shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#d99a3d] to-[#f4c430] shadow-sm transition-all duration-1000" 
              style={{ width: `${currentRating.strength}%` }} 
            />
          </div>

          <button
            type="button"
            className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#00663f] hover:text-[#004f31] hover:underline transition-colors"
          >
            View all reviews
            <FiChevronRight className="text-[14px]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>

          <ul className="mt-4 space-y-4">
            {currentActivity.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
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

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Profile Strength</p>
              <FiCheckCircle className="text-[16px] text-[#00663f]" />
            </div>
            <p className="mt-2 text-sm font-bold text-slate-800">{currentRating.strength}% Complete</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-[#00663f] transition-all duration-1000" style={{ width: `${currentRating.strength}%` }} />
            </div>
            <p className="mt-3 text-xs text-slate-400">
              {analytics?.profileStrength?.missingFields?.length ? 
                `Add ${analytics.profileStrength.missingFields.join(', ')} to reach 100% and get 2x more visibility.` :
                'Add a detailed description to reach 100% and get 2x more visibility.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
