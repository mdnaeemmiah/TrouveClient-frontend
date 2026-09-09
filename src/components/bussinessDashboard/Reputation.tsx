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
import { useEffect, useState } from "react";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

// Shape expected from API at /reviews/reputation-center
type ReputationCenterApi = {
  trustScore: {
    currentScore: number;
    growthPercentage: number;
    percentileRank: string;
  };
  trustScoreHistory: { month: string; score: number }[];
  aiSentiment: {
    positiveTags: string[];
    negativeTags: string[];
    recentHighlight?: { author: string; rating: number; comment: string; timestamp: string } | null;
  };
  recentReviews: {
    _id: string;
    customerId?: string | { _id?: string; fullName?: string; name?: string; email?: string } | Record<string, unknown>;
    businessId: string;
    rating: number;
    comment: string;
    createdAt: string;
    ownerReply?: string;
    ownerRepliedAt?: string;
  }[];
};

// Fallback default shapes (used when API is unavailable)
const defaultData: ReputationCenterApi = {
  trustScore: { currentScore: 92, growthPercentage: 4.2, percentileRank: "Top 5% of local competitors" },
  trustScoreHistory: [{ month: "Jan", score: 85 }],
  aiSentiment: {
    positiveTags: ["😊 Excellent Service", "😊 Friendly Staff", "🌿 Eco-friendly", "€ Fair Pricing"],
    negativeTags: ["⚠️ Slow Response"],
    recentHighlight: { author: "Martine D.", rating: 5, comment: "The service was impeccable and the team really knows their craft.", timestamp: "2 days ago" },
  },
  recentReviews: [
    {
      _id: "0",
      customerId: "cust-0",
      businessId: "biz-0",
      rating: 5,
      comment: "Amazing service! The team was super helpful and fast.",
      createdAt: new Date().toISOString(),
      ownerReply: undefined,
    },
  ],
};

const insights: { icon: IconType; title: string; description: string; action: string }[] = [
  {
    icon: FiAlertTriangle,
    title: "Missing Information",
    description:
      "Your profile is missing opening hours — complete it to boost your Trust Score by up to +5 points.",
    action: "Update Now",
  },
  {
    icon: FiMessageSquare,
    title: "Response Rate",
    description:
      "You have 3 unanswered reviews from this week. Replying within 24h increases customer trust by 15%.",
    action: "View Reviews",
  },
  {
    icon: FiCamera,
    title: "Visual Impact",
    description:
      "Businesses with at least 10 high-quality photos get 2x more inquiries. You currently have 4.",
    action: "Add Photos",
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5 text-[#d99a3d]">
    {Array.from({ length: 5 }).map((_, i) => (
      <FiStar key={i} className="text-[13px]" fill={i < count ? "currentColor" : "none"} />
    ))}
  </div>
);

const CHART_WIDTH = 500; const CHART_TOP = 20; const CHART_BASELINE = 100;

function buildPoints(values: number[]) {
  if (values.length === 0) return [] as { x: number; y: number }[];
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

export default function Reputation() {
  const [data, setData] = useState<ReputationCenterApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    baseApi
      .get(ENDPOINTS.reputationCenter)
      .then((res) => {
        if (!mounted) return;
        const payload = res.data?.data ?? res.data;
        setData((payload as ReputationCenterApi) ?? null);
      })
      .catch(() => {
        if (!mounted) return;
        setData(defaultData);
        setError("Unable to load reputation data. Showing sample data.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const trust = data?.trustScore ?? defaultData.trustScore;
  const history = data?.trustScoreHistory ?? defaultData.trustScoreHistory;
  const aiSentiment = data?.aiSentiment ?? defaultData.aiSentiment;
  const recentReviews = data?.recentReviews ?? defaultData.recentReviews;

  const historyScores = history.map((h) => h.score);
  const historyMonths = history.map((h) => h.month);
  const historyPoints = buildPoints(historyScores);
  const historyPath = buildSmoothPath(historyPoints);
  const lastPoint = historyPoints[historyPoints.length - 1] ?? { x: 0, y: CHART_BASELINE };

  const growthLabel = `+${trust.growthPercentage.toFixed(1)}% since last month`;
  const reviewsToRender = recentReviews.length > 0 ? recentReviews : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Trust Score &amp; Reputation</h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor your customer credibility, AI sentiment, and verified reviews.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading reputation data...</div>
      ) : (
        <>
          {/* Top stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Trust Score</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{trust.currentScore}</span>
                <span className="text-sm font-medium text-slate-400">/ 100</span>
              </div>
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#00663f]">
                <FiArrowUpRight className="text-[14px]" />
                {growthLabel}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Verified Reviews</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{recentReviews.length}</span>
                <span className="text-xs font-semibold text-[#00663f]">★ 4.9</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Recent active reviews</p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">AI Sentiment</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">96%</span>
                <span className="text-xs font-semibold text-[#00663f]">Positive</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Based on verified reviews</p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Local Ranking</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">#3</span>
                <span className="text-xs text-slate-400">in Paris 8e</span>
              </div>
              <p className="mt-1 text-xs font-medium text-[#00663f]">{trust.percentileRank}</p>
            </div>
          </div>

          {/* Charts & AI Sentiment */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Trust Score Evolution</h2>
                  <p className="text-xs text-slate-400">Track your customer confidence trajectory over time</p>
                </div>
                <span className="rounded-full bg-[#e4f3ec] px-3 py-1 text-xs font-bold text-[#00663f]">
                  {trust.percentileRank}
                </span>
              </div>

              <div className="mt-6">
                <div className="relative h-40 w-full overflow-hidden">
                  <svg
                    viewBox={`0 0 ${CHART_WIDTH} ${CHART_BASELINE + 10}`}
                    className="h-full w-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00663f" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#00663f" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {historyPath && (
                      <>
                        <path
                          d={`${historyPath} L ${CHART_WIDTH} ${CHART_BASELINE + 10} L 0 ${CHART_BASELINE + 10} Z`}
                          fill="url(#chartGrad)"
                        />
                        <path
                          d={historyPath}
                          fill="none"
                          stroke="#00663f"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle
                          cx={lastPoint.x}
                          cy={lastPoint.y}
                          r="5"
                          fill="#00663f"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                      </>
                    )}
                  </svg>
                </div>
                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  {historyMonths.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Sentiment Analysis */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <FiZap className="text-[16px] text-[#00663f]" />
                <h2 className="text-base font-bold text-slate-900">AI Sentiment Analysis</h2>
              </div>
              <p className="mt-0.5 text-xs text-slate-400">Extracted from customer feedback</p>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Common Praises</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {aiSentiment.positiveTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#e4f3ec] px-2.5 py-1 text-xs font-medium text-[#00663f]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {aiSentiment.negativeTags.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Areas to Watch</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {aiSentiment.negativeTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {aiSentiment.recentHighlight && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      {aiSentiment.recentHighlight.author}
                    </span>
                    <Stars count={aiSentiment.recentHighlight.rating} />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">
                    &ldquo;{aiSentiment.recentHighlight.comment}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Insights & Recent Reviews */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Trust Improvement Actions</h2>
              <p className="mt-0.5 text-xs text-slate-400">Actionable steps to reach a 95+ score</p>

              <div className="mt-4 space-y-3">
                {insights.map((insight) => {
                  const Icon = insight.icon;
                  return (
                    <div
                      key={insight.title}
                      className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 p-3.5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-slate-50 p-2 text-slate-600">
                          <Icon className="text-[16px]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{insight.title}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{insight.description}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 text-xs font-semibold text-[#00663f] hover:underline"
                      >
                        {insight.action}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Recent Customer Reviews</h2>
              </div>

              <ul className="mt-4 divide-y divide-slate-100">
                {reviewsToRender.length > 0 ? (
                  reviewsToRender.map((review) => {
                    const customerObj =
                      typeof review.customerId === "object" && review.customerId !== null
                        ? (review.customerId as Record<string, unknown>)
                        : null;
                    const customerName =
                      customerObj?.fullName || customerObj?.name || customerObj?.username || customerObj?.email;
                    const customerIdStr =
                      typeof review.customerId === "string"
                        ? review.customerId
                        : typeof customerObj?._id === "string"
                        ? customerObj._id
                        : "";
                    const reviewIdStr = typeof review._id === "string" ? review._id : "";
                    const name =
                      typeof customerName === "string" && customerName.trim()
                        ? customerName.trim()
                        : customerIdStr
                        ? `Customer ${customerIdStr.slice(-6)}`
                        : reviewIdStr
                        ? `Customer ${reviewIdStr.slice(-6)}`
                        : "Guest";
                    return (
                      <li key={review._id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                          <div className="w-40 shrink-0">
                            <Stars count={review.rating} />
                            <p className="mt-1 text-sm font-semibold text-slate-800">{name}</p>
                            <p className="text-xs text-slate-400">Verified Client</p>
                          </div>

                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-800">{typeof review.comment === "string" ? review.comment.slice(0, 60) : "Review"}</p>
                            {review.ownerReply ? (
                              <div className="mt-3 rounded-xl border-l-2 border-[#00663f] bg-slate-50 p-3">
                                <p className="text-xs font-semibold text-[#00663f]">Your Reply:</p>
                                <p className="mt-1 text-sm italic text-slate-500">&ldquo;{review.ownerReply}&rdquo;</p>
                              </div>
                            ) : (
                              <div className="mt-3 flex items-center gap-4">
                                <button type="button" className="flex items-center gap-1.5 text-xs font-medium text-[#00663f] hover:underline">
                                  <FiCornerUpLeft className="text-[12px]" />
                                  Reply to review
                                </button>
                                <button type="button" className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:underline">
                                  <FiFlag className="text-[12px]" />
                                  Report
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className="py-4 text-sm text-slate-500">No reviews available</li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
      {error && <div className="p-3 rounded bg-yellow-100 text-yellow-800">{error}</div>}
    </div>
  );
}