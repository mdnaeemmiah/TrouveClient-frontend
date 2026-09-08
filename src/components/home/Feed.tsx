"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  Calendar,
  Download,
  FileText,
  Flag,
  Leaf,
  Loader2,
  MapPin,
  Rocket,
  TrendingUp,
  ThumbsUp,
  UtensilsCrossed,
  X,
} from "lucide-react";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import { useAuth } from "@/src/context/AuthContext";

type FeedPost = {
  _id: string;
  businessId?: string | { _id?: string; id?: string };
  title?: string;
  content?: string;
  attachments?: string[];
  likes?: (string | { _id?: string })[];
  status?: string;
  viewsCount?: number;
  likeCount?: number;
  reportsCount?: number;
  isFollowing?: boolean;
  createdAt?: string;
};
type ReportCategory = "INAPPROPRIATE" | "SPAM" | "MISCATEGORIZED" | "HARASSMENT" | "COPYRIGHT" | "OTHER";
const reportCategories: ReportCategory[] = ["INAPPROPRIATE", "SPAM", "MISCATEGORIZED", "HARASSMENT", "COPYRIGHT", "OTHER"];

const categories = [
  "Restaurants",
  "Artisans",
  "Tech",
  "Boutiques",
  "Wellness",
  "Home Decor",
];
const tabs = ["Recent Updates", "Following"] as const;
const fallbackIcons = [Leaf, Rocket, UtensilsCrossed];

function extractPosts(payload: unknown): FeedPost[] {
  const response = payload as { data?: FeedPost[] | { posts?: FeedPost[] } };
  if (Array.isArray(response.data)) return response.data;
  return response.data?.posts || (Array.isArray(payload) ? payload : []);
}

function formatDate(date?: string) {
  if (!date) return "Recently";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function mediaUrl(value: string) {
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return apiUrl ? new URL(value, apiUrl).toString() : value;
}

function getBusinessId(value: FeedPost["businessId"]) {
  return typeof value === "string" ? value : value?._id || value?.id;
}

export default function Feed() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]>("Recent Updates");
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [reportedPosts, setReportedPosts] = useState<Record<string, boolean>>(
    {},
  );
  const [followedBusinesses, setFollowedBusinesses] = useState<
    Record<string, boolean>
  >({});
  const [reminderPost, setReminderPost] = useState<FeedPost | null>(null);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [isSavingReminder, setIsSavingReminder] = useState(false);
  const [reportPostTarget, setReportPostTarget] = useState<FeedPost | null>(null);
  const [reportCategory, setReportCategory] = useState<ReportCategory>("INAPPROPRIATE");
  const [reportDetails, setReportDetails] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const loadPosts = useCallback(
    async (nextPage = 1, append = false) => {
      if (append) setIsLoadingMore(true);
      else setIsLoading(true);
      try {
        const endpoint =
          activeTab === "Following"
            ? ENDPOINTS.followingPosts
            : ENDPOINTS.getNewsFeed;
        const response = await baseApi.get(endpoint, {
          params: { page: nextPage, limit: 10, sort: "recent" },
        });
        const nextPosts = extractPosts(response.data);
        if (user?.id) {
          const hydratedLikes = Object.fromEntries(
            nextPosts.map((post) => [
              post._id,
              Boolean(
                post.likes?.some((like) =>
                  typeof like === "string"
                    ? like === user.id
                    : like._id === user.id,
                ),
              ),
            ]),
          );
          setLikedPosts((current) => ({ ...current, ...hydratedLikes }));
        }
        setPosts((current) =>
          append ? [...current, ...nextPosts] : nextPosts,
        );
        setPage(nextPage);
        const pagination = response.data?.data || response.data;
        setHasMore(
          Boolean(
            pagination?.totalPages
              ? nextPage < pagination.totalPages
              : nextPosts.length === 10,
          ),
        );
      } catch {
        toast.error("Unable to load the news feed.");
        if (!append) setPosts([]);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [activeTab, user],
  );

  useEffect(() => {
    // Hydrate feed data when the selected feed changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPosts();
  }, [loadPosts]);

  const likePost = async (post: FeedPost) => {
    const wasLiked = likedPosts[post._id] || false;
    setLikedPosts((current) => ({ ...current, [post._id]: !wasLiked }));
    setPosts((current) =>
      current.map((item) =>
        item._id === post._id
          ? {
              ...item,
              likeCount: Math.max(
                0,
                (item.likeCount || 0) + (wasLiked ? -1 : 1),
              ),
            }
          : item,
      ),
    );
    try {
      await baseApi.post(ENDPOINTS.likePost(post._id));
    } catch {
      setLikedPosts((current) => ({ ...current, [post._id]: wasLiked }));
      toast.error("Unable to update this like.");
    }
  };

  const openReport = (post: FeedPost) => {
    if (reportedPosts[post._id]) return;
    setReportPostTarget(post);
    setReportCategory("INAPPROPRIATE");
    setReportDetails("");
  };

  const closeReport = () => {
    setReportPostTarget(null);
    setReportDetails("");
  };

  const reportPost = async () => {
    if (!reportPostTarget || reportDetails.trim().length < 5) {
      toast.error("Please provide at least 5 characters explaining the report.");
      return;
    }
    setIsSubmittingReport(true);
    try {
      await baseApi.post(ENDPOINTS.reportPost(reportPostTarget._id), {
        reasonCategory: reportCategory,
        reasonDetails: reportDetails.trim(),
      });
      setReportedPosts((current) => ({ ...current, [reportPostTarget._id]: true }));
      closeReport();
      toast.success("Post reported.");
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string | string[] } } }).response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(" ") : message || "Unable to report this post.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const openReminder = (post: FeedPost) => {
    setReminderPost(post);
    setReminderDate("");
    setReminderTime("");
  };

  const closeReminder = () => {
    setReminderPost(null);
    setReminderDate("");
    setReminderTime("");
  };

  const remindPost = async () => {
    if (!reminderPost || !reminderDate || !reminderTime) {
      toast.error("Please select a reminder date and time.");
      return;
    }
    const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
    if (Number.isNaN(reminderDateTime.getTime()) || reminderDateTime <= new Date()) {
      toast.error("Please choose a future date and time.");
      return;
    }
    setIsSavingReminder(true);
    try {
      await baseApi.post(ENDPOINTS.remindPost, {
        postId: reminderPost._id,
        reminderDate: reminderDateTime.toISOString(),
      });
      closeReminder();
      toast.success("Reminder added.");
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string | string[] } } }).response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(" ") : message || "Unable to add a reminder.");
    } finally {
      setIsSavingReminder(false);
    }
  };

  const toggleFollow = async (post: FeedPost) => {
    const businessId = getBusinessId(post.businessId);
    if (!businessId)
      return toast.error("This post has no business profile.");
    if (user?.role !== "customer") {
      return toast.error("Only customer accounts can follow businesses.");
    }
    const wasFollowing =
      followedBusinesses[businessId] ?? Boolean(post.isFollowing);
    setFollowedBusinesses((current) => ({
      ...current,
      [businessId]: !wasFollowing,
    }));
    try {
      await baseApi.post(ENDPOINTS.followBusiness(businessId));
      toast.success(
        wasFollowing ? "Unfollowed business." : "Following business.",
      );
    } catch (error: unknown) {
      setFollowedBusinesses((current) => ({
        ...current,
        [businessId]: wasFollowing,
      }));
      const message = (error as { response?: { data?: { message?: string | string[] } } }).response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(" ") : message || "Unable to update following status.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7fa]">
      <div className="mx-auto grid grid-cols-1 gap-5 px-5 py-8 md:px-6 lg:grid-cols-[240px_1fr_260px] lg:px-[max(30px,calc((100vw-1400px)/2))] lg:py-10">
        <aside className="space-y-5 lg:order-1">
          <div className="rounded-2xl border border-[#eef0f1] bg-white p-5">
            <h2 className="text-[15px] font-bold text-[#00663f]">
              Categories to Follow
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className="rounded-full bg-[#f1f2f4] px-3 py-1.5 text-[12px] font-medium text-[#3a3d40] hover:bg-[#e7e8eb]"
                >
                  {category}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="mt-3 text-[12px] font-semibold text-[#00663f] hover:underline"
            >
              See all categories
            </button>
          </div>
          <div className="rounded-2xl border border-[#eef0f1] bg-white p-5">
            <h2 className="text-[15px] font-bold text-[#00663f]">
              France News
            </h2>
            <p className="mt-2 text-[12px] text-[#5c6168]">
              Check out local market updates and new business laws in France.
            </p>
          </div>
        </aside>
        <main className="lg:order-2">
          <div className="flex items-center gap-6 border-b border-[#eef0f1]">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 text-[14px] font-semibold ${activeTab === tab ? "text-[#00663f]" : "text-[#9a9da1]"}`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#00663f]" />
                )}
              </button>
            ))}
          </div>
          <div className="mt-5 space-y-5">
            {isLoading ? (
              <div className="flex justify-center rounded-2xl bg-white p-12 text-[#00663f]">
                <Loader2 className="animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">
                No published updates found.
              </div>
            ) : (
              posts.map((post, index) => {
                const Icon = fallbackIcons[index % fallbackIcons.length];
                const attachment = post.attachments?.[0];
                const liked = likedPosts[post._id] || false;
                const businessId = getBusinessId(post.businessId);
                const isFollowing = businessId
                  ? (followedBusinesses[businessId] ?? Boolean(post.isFollowing))
                  : false;
                return (
                  <article
                    key={post._id}
                    className="rounded-2xl border border-[#eef0f1] bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e4f3ec] text-[#00663f]">
                          <Icon size={18} />
                        </span>
                        <div>
                          <p className="text-[14px] font-bold text-[#1c1d22]">
                            Business update
                          </p>
                          <p className="text-[12px] text-[#8a8d91]">
                            {formatDate(post.createdAt)} ·{" "}
                            {post.status || "Published"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#edf7f2] px-3 py-1 text-[11px] font-bold text-[#00663f]">
                          Live
                        </span>
                        <button
                          type="button"
                          onClick={() => void toggleFollow(post)}
                          className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${isFollowing ? "bg-[#00663f] text-white" : "border border-[#c7d8cd] bg-white text-[#00663f] hover:bg-[#edf7f2]"}`}
                        >
                          {isFollowing ? "Following" : "Follow"}
                        </button>
                      </div>
                    </div>
                    <h2 className="mt-4 text-lg font-bold text-slate-900">
                      {post.title || "Business update"}
                    </h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#3a3d40]">
                      {post.content || "No description provided."}
                    </p>
                    {attachment &&
                      (/\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(attachment) ? (
                        <div className="mt-4 overflow-hidden rounded-xl bg-slate-100">
                          <img
                            src={mediaUrl(attachment)}
                            alt={post.title || "Post attachment"}
                            className="max-h-80 w-full object-cover"
                          />
                        </div>
                      ) : (
                        <a
                          href={mediaUrl(attachment)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 flex items-center gap-3 rounded-xl border border-[#eef0f1] bg-[#f7f7fa] p-3"
                        >
                          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#00663f] text-white">
                            <FileText size={20} />
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">
                            Open attachment
                          </span>
                          <Download size={16} className="text-[#00663f]" />
                        </a>
                      ))}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => void likePost(post)}
                        aria-label={liked ? "Unlike post" : "Like post"}
                        aria-pressed={liked}
                        className={`flex items-center gap-1.5 text-[13px] font-medium ${liked ? "text-[#00663f]" : "text-[#5c6168]"}`}
                      >
                        <ThumbsUp
                          size={15}
                          fill={liked ? "currentColor" : "none"}
                        />{" "}
                        {post.likeCount || 0}
                      </button>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">
                          {post.viewsCount || 0} views
                        </span>
                        <button
                          type="button"
                          onClick={() => openReminder(post)}
                          className="text-xs font-semibold text-[#00663f]"
                        >
                          Remind me
                        </button>
                        <button
                          type="button"
                          onClick={() => openReport(post)}
                          disabled={reportedPosts[post._id]}
                          className="text-slate-400 hover:text-red-500 disabled:text-red-500"
                        >
                          <Flag size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
          {hasMore && !isLoading && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                disabled={isLoadingMore}
                onClick={() => void loadPosts(page + 1, true)}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-[#5c6168]"
              >
                {isLoadingMore ? (
                  <Loader2 className="animate-spin" size={15} />
                ) : (
                  <ChevronDown size={15} />
                )}{" "}
                Load more updates
              </button>
            </div>
          )}
        </main>
        <aside className="lg:order-3">
          <div className="rounded-2xl border border-[#eef0f1] bg-white p-5">
            <h2 className="text-[15px] font-bold text-[#00663f]">
              Feed summary
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <MapPin size={15} className="text-[#00663f]" /> {posts.length}{" "}
                updates loaded
              </p>
              <p className="flex items-center gap-2">
                <TrendingUp size={15} className="text-[#00663f]" /> Live
                business news
              </p>
            </div>
          </div>
        </aside>
      </div>
      {reminderPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeReminder}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Set a reminder</h2>
                <p className="mt-1 text-sm text-slate-500">Choose when you want to be reminded about this update.</p>
              </div>
              <button type="button" onClick={closeReminder} aria-label="Close reminder dialog" className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
            </div>
            <p className="mt-4 truncate rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">{reminderPost.title || "Business update"}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700"><span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#00663f]" />Date</span><input type="date" min={new Date().toISOString().slice(0, 10)} value={reminderDate} onChange={(event) => setReminderDate(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/10" /></label>
              <label className="text-sm font-semibold text-slate-700">Time<input type="time" value={reminderTime} onChange={(event) => setReminderTime(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/10" /></label>
            </div>
            <div className="mt-5 flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" onClick={closeReminder} disabled={isSavingReminder} className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-60">Cancel</button><button type="button" onClick={() => void remindPost()} disabled={isSavingReminder} className="flex items-center gap-2 rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{isSavingReminder && <Loader2 size={15} className="animate-spin" />}Save reminder</button></div>
          </div>
        </div>
      )}
      {reportPostTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeReport}>
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div><h2 className="text-lg font-bold text-slate-900">Report post</h2><p className="mt-1 text-sm text-slate-500">Tell us why this post should be reviewed.</p></div>
              <button type="button" onClick={closeReport} aria-label="Close report dialog" className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
            </div>
            <p className="mt-4 truncate rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">{reportPostTarget.title || "Business update"}</p>
            <label className="mt-4 block text-sm font-semibold text-slate-700">Reason<select value={reportCategory} onChange={(event) => setReportCategory(event.target.value as ReportCategory)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/10">{reportCategories.map((category) => <option key={category} value={category}>{category.replace("_", " ")}</option>)}</select></label>
            <label className="mt-4 block text-sm font-semibold text-slate-700">Details<textarea value={reportDetails} onChange={(event) => setReportDetails(event.target.value)} maxLength={1000} minLength={5} rows={4} placeholder="Please explain the issue..." className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/10" /></label>
            <div className="mt-5 flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" onClick={closeReport} disabled={isSubmittingReport} className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-60">Cancel</button><button type="button" onClick={() => void reportPost()} disabled={isSubmittingReport || reportDetails.trim().length < 5} className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{isSubmittingReport && <Loader2 size={15} className="animate-spin" />}Submit report</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
