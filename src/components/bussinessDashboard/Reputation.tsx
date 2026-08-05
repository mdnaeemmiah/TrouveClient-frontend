"use client";

import type { IconType } from "react-icons";
import {
  FiAlertTriangle,
  FiArrowUpRight,
  FiCamera,
  FiChevronRight,
  FiCornerUpLeft,
  FiFlag,
  FiMessageSquare,
  FiShare2,
  FiStar,
  FiZap,
} from "react-icons/fi";

const trustScore = { value: 92, change: "+4.2% since last month" };

const historyMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const historyValues = [75, 78, 80, 79, 85, 92];

const CHART_WIDTH = 500;
const CHART_TOP = 20;
const CHART_BASELINE = 100;

function buildPoints(values: number[]) {
  const min = Math.min(...values) - 10;
  const max = Math.max(...values) + 4;
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

const historyPoints = buildPoints(historyValues);
const historyPath = buildSmoothPath(historyPoints);
const lastPoint = historyPoints[historyPoints.length - 1];

type Sentiment = { label: string; tone: "positive" | "negative" | "neutral" };

const sentiments: Sentiment[] = [
  { label: "😊 Excellent Service", tone: "positive" },
  { label: "🙂 Friendly Staff", tone: "positive" },
  { label: "🌿 Eco-friendly", tone: "positive" },
  { label: "€ Fair Pricing", tone: "positive" },
  { label: "⚠ Slow Response", tone: "negative" },
  { label: "🅿 Easy Parking", tone: "neutral" },
];

const sentimentStyles: Record<Sentiment["tone"], string> = {
  positive: "bg-[#e4f3ec] text-[#00663f]",
  negative: "bg-[#fbe2e2] text-[#c0524d]",
  neutral: "bg-slate-100 text-slate-500",
};

type Insight = {
  icon: IconType;
  title: string;
  description: string;
  action: string;
};

const insights: Insight[] = [
  {
    icon: FiAlertTriangle,
    title: "Missing Information",
    description: "Your profile is missing opening hours — complete it to boost your Trust Score by up to +5 points.",
    action: "Update Now",
  },
  {
    icon: FiMessageSquare,
    title: "Response Rate",
    description: "You have 3 unanswered reviews from this week. Replying within 24h increases customer trust by 15%.",
    action: "View Reviews",
  },
  {
    icon: FiCamera,
    title: "Visual Impact",
    description: "Businesses with at least 10 high-quality photos get 2x more inquiries. You currently have 4.",
    action: "Add Photos",
  },
];

type Review = {
  name: string;
  rating: number;
  title: string;
  body: string;
  reply?: string;
};

const reviews: Review[] = [
  {
    name: "Thomas Leroy",
    rating: 5,
    title: "Excellent travail sur la toiture !",
    body: "L'équipe a été extrêmement professionnelle du début à la fin. Le chantier a été laissé impeccable chaque soir. Je recommande vivement pour tous vos travaux de rénovation.",
  },
  {
    name: "Sophie Girard",
    rating: 4,
    title: "Très satisfait de l'intervention",
    body: "Un peu difficile de les joindre au téléphone au début, mais une fois le contact établi, tout s'est très bien passé. Ponctuels et efficaces.",
    reply:
      "Merci pour votre retour Sophie ! Nous travaillons sur l'amélioration de notre accueil téléphonique.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-[#d99a3d]">
      {Array.from({ length: 5 }).map((_, index) => (
        <FiStar key={index} className="text-[13px]" fill={index < count ? "currentColor" : "none"} />
      ))}
    </div>
  );
}

export default function Reputation() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reputation Center</h1>
        <p className="mt-1 text-sm text-slate-500">Track your trust score and manage customer feedback.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-[#e4f3ec] to-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Trust Score</p>
          <p className="mt-2">
            <span className="text-4xl font-bold text-[#00663f]">{trustScore.value}</span>
            <span className="text-lg font-medium text-slate-400"> /100</span>
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#00663f]">
            <FiArrowUpRight className="text-[13px]" />
            {trustScore.change}
          </p>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-[#00663f]" style={{ width: `${trustScore.value}%` }} />
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Your business is ranked in the top 5% of local competitors.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Trust Score History</h2>
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50"
            >
              Last 6 Months ⌄
            </button>
          </div>

          <svg viewBox={`0 0 ${CHART_WIDTH} 120`} className="mt-4 w-full overflow-visible">
            <line x1={0} x2={CHART_WIDTH} y1={CHART_TOP} y2={CHART_TOP} stroke="#e1e0d9" strokeWidth={1} />
            <line x1={0} x2={CHART_WIDTH} y1={CHART_BASELINE} y2={CHART_BASELINE} stroke="#e1e0d9" strokeWidth={1} />

            <path d={historyPath} fill="none" stroke="#00663f" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

            <circle cx={lastPoint.x} cy={lastPoint.y} r={4} fill="#00663f" stroke="#ffffff" strokeWidth={2} />

            <g transform={`translate(${lastPoint.x - 42}, ${lastPoint.y - 34})`}>
              <rect width={30} height={20} rx={5} fill="#0b0b0b" />
              <text x={15} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
                {historyValues[historyValues.length - 1]}
              </text>
            </g>

            {historyMonths.map((month, index) => (
              <text key={month} x={historyPoints[index].x} y={116} textAnchor="middle" fontSize={11} fill="#898781">
                {month}
              </text>
            ))}
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f3ec] text-[#00663f]">
              <FiZap className="text-[15px]" />
            </span>
            <h2 className="text-base font-bold text-slate-900">AI Sentiment Analysis</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            We&rsquo;ve analyzed 48 recent reviews to extract recurring customer feedback themes.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {sentiments.map((item) => (
              <span
                key={item.label}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${sentimentStyles[item.tone]}`}
              >
                {item.label}
              </span>
            ))}
          </div>

          <div className="mt-4 rounded-xl border-l-2 border-[#00663f] bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Recent Review Highlight</p>
            <div className="mt-2 flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e4f3ec] text-xs font-semibold text-[#00663f]">
                MD
              </span>
              <div>
                <p className="text-sm italic text-slate-600">
                  &ldquo;The service was impeccable and the team really knows their craft. A bit of a wait for the
                  quote, but worth it for the quality.&rdquo;
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Stars count={4} />
                  <span className="text-xs text-slate-400">Martine D. · 2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-[#00663f] p-5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white">
                <FiZap className="text-[13px]" />
              </span>
              <h2 className="text-base font-bold text-white">Coach Insights</h2>
            </div>

            <div className="mt-4 space-y-4">
              {insights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                      <Icon className="text-[14px]" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-0.5 text-xs text-green-100/85">{item.description}</p>
                      <button type="button" className="mt-1 text-xs font-semibold text-white underline underline-offset-2">
                        {item.action}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <FiShare2 className="text-[15px]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">Reputation Badge</p>
                <p className="text-xs text-slate-400">Showcase your {trustScore.value}/100 score on your site.</p>
              </div>
            </div>
            <FiChevronRight className="text-[16px] text-slate-400" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Customer Reviews</h2>
          <button type="button" className="text-sm font-medium text-[#00663f] hover:underline">
            See all reviews
          </button>
        </div>

        <ul className="mt-4 divide-y divide-slate-100">
          {reviews.map((review) => (
            <li key={review.name} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                <div className="w-40 shrink-0">
                  <Stars count={review.rating} />
                  <p className="mt-1 text-sm font-semibold text-slate-800">{review.name}</p>
                  <p className="text-xs text-slate-400">Verified Client</p>
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{review.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{review.body}</p>

                  {review.reply ? (
                    <div className="mt-3 rounded-xl border-l-2 border-[#00663f] bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-[#00663f]">Your Reply:</p>
                      <p className="mt-1 text-sm italic text-slate-500">&ldquo;{review.reply}&rdquo;</p>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-4">
                      <button
                        type="button"
                        className="flex items-center gap-1.5 text-xs font-medium text-[#00663f] hover:underline"
                      >
                        <FiCornerUpLeft className="text-[12px]" />
                        Reply to review
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:underline"
                      >
                        <FiFlag className="text-[12px]" />
                        Report
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
