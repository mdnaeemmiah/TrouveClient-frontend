"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  Maximize2,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type PostBusiness = {
  _id?: string;
  name?: string;
  slug?: string;
  logo?: string;
};

type ReminderPost = {
  _id?: string;
  title?: string;
  content?: string;
  attachments?: string[];
  createdAt?: string;
  status?: string;
  viewsCount?: number;
  likes?: (string | { _id?: string })[];
  businessId?: PostBusiness;
  business?: PostBusiness;
};

type Reminder = {
  _id?: string;
  id?: string;
  customerId?: string;
  reminderDate?: string;
  isDispatched?: boolean;
  createdAt?: string;
  updatedAt?: string;
  postId?: ReminderPost;
  post?: ReminderPost;
  business?: PostBusiness;
  title?: string;
  content?: string;
  attachments?: string[];
};

type ReminderResponse = {
  data?: { reminders?: Reminder[]; items?: Reminder[]; result?: Reminder[] } | Reminder[];
  reminders?: Reminder[];
  items?: Reminder[];
};

function extractReminders(payload: unknown): Reminder[] {
  const response = payload as ReminderResponse;
  if (Array.isArray(response.data)) return response.data;
  return (
    response.data?.reminders ||
    response.data?.items ||
    response.data?.result ||
    response.reminders ||
    response.items ||
    (Array.isArray(payload) ? (payload as Reminder[]) : [])
  );
}

function formatDate(value?: string) {
  if (!value) return "Date not provided";
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function mediaUrl(value: string) {
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return apiUrl ? new URL(value, apiUrl).toString() : value;
}

function isImageAttachment(url: string): boolean {
  return (
    /\.(png|jpe?g|webp|gif|svg|avif)(\?.*)?$/i.test(url) ||
    url.startsWith("data:image")
  );
}

export default function Notification() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [viewingPost, setViewingPost] = useState<ReminderPost | null>(null);

  const loadReminders = () => {
    setIsLoading(true);
    setError("");
    baseApi
      .get(ENDPOINTS.myReminders)
      .then((response) => {
        setReminders(extractReminders(response.data));
      })
      .catch((requestError: unknown) => {
        const message = (requestError as { response?: { data?: { message?: string } } })
          .response?.data?.message;
        setError(message || "Unable to load your reminders.");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleDeleteReminder = async (reminderId: string) => {
    if (!reminderId) return;
    if (!confirm("Are you sure you want to delete this reminder?")) return;

    setDeletingId(reminderId);
    try {
      if (ENDPOINTS.deleteReminder) {
        await baseApi.delete(ENDPOINTS.deleteReminder(reminderId));
      } else {
        await baseApi.delete(`/posts/reminders/${reminderId}`);
      }
      toast.success("Reminder deleted successfully.");
      setReminders((prev) => prev.filter((r) => (r._id || r.id) !== reminderId));
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      toast.error(message || "Unable to delete this reminder.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className=" pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Reminders &amp; Alerts
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your saved post updates, business announcements, and scheduled alerts.
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2 md:mt-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e4f3ec] px-3.5 py-1.5 text-xs font-bold text-[#00663f]">
            <Bell size={13} />
            {reminders.length} {reminders.length === 1 ? "Reminder" : "Reminders"}
          </span>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-16 shadow-xs">
          <Loader2 className="animate-spin text-[#00663f]" size={36} />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading your reminders...</p>
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          <p className="font-semibold">Failed to load reminders</p>
          <p className="mt-1">{error}</p>
          <button
            type="button"
            onClick={loadReminders}
            className="mt-3 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : reminders.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center shadow-xs">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#edf7f2] text-[#00663f]">
            <Bell size={28} />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800">No reminders scheduled</h3>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
            When you tap &ldquo;Remind me&rdquo; on any business update in your news feed, it will
            appear here.
          </p>
          <Link
            href="/feed"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#00663f] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#00552f]"
          >
            Browse News Feed
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {reminders.map((reminder) => {
            const reminderId = reminder._id || reminder.id || "";
            const post = reminder.postId || reminder.post;
            const business =
              post?.businessId || post?.business || reminder.business;
            const businessName = business?.name || "Business update";
            const businessLogo = business?.logo;
            const businessSlug = business?.slug;

            const title = post?.title || reminder.title || "Business announcement";
            const content = post?.content || reminder.content || "";
            const attachments = post?.attachments || reminder.attachments || [];

            const isUpcoming =
              reminder.reminderDate && new Date(reminder.reminderDate) > new Date();

            return (
              <div
                key={reminderId}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#eef0f1] bg-white shadow-xs transition hover:shadow-md"
              >
                <div className="p-5">
                  {/* Business Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {businessLogo ? (
                        <img
                          src={mediaUrl(businessLogo)}
                          alt={businessName}
                          className="h-11 w-11 shrink-0 rounded-xl border border-slate-100 object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e4f3ec] text-[#00663f]">
                          <Bell size={18} />
                        </div>
                      )}
                      <div className="min-w-0">
                        {businessSlug ? (
                          <Link
                            href={`/feature/${businessSlug}`}
                            className="block truncate text-[14px] font-bold text-slate-900 transition hover:text-[#00663f] hover:underline"
                          >
                            {businessName}
                          </Link>
                        ) : (
                          <p className="truncate text-[14px] font-bold text-slate-900">
                            {businessName}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00663f]">
                          <CheckCircle2 size={12} className="fill-[#00663f] text-white" />
                          Verified Business
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={deletingId === reminderId}
                      onClick={() => void handleDeleteReminder(reminderId)}
                      title="Delete reminder"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      {deletingId === reminderId ? (
                        <Loader2 size={16} className="animate-spin text-red-600" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>

                  {/* Reminder Alert Badge */}
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f7f9f8] px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                      <Clock size={15} className="text-[#00663f]" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#00663f]">
                          {isUpcoming ? "Scheduled Alert" : "Reminder Passed"}
                        </p>
                        <p className="text-[13px] font-semibold text-slate-800">
                          {formatDate(reminder.reminderDate)}
                        </p>
                      </div>
                    </div>
                    {reminder.isDispatched ? (
                      <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                        Delivered
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#00663f] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Post Title & Content */}
                  <div className="mt-4">
                    <h3 className="text-[15px] font-bold leading-snug text-slate-900">
                      {title}
                    </h3>
                    {content && (
                      <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-slate-600 whitespace-pre-line">
                        {content}
                      </p>
                    )}
                  </div>

                  {/* Post Attachments Section */}
                  {attachments.length > 0 && (
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Attachments ({attachments.length})
                        </span>
                      </div>

                      {/* If single image */}
                      {attachments.length === 1 && isImageAttachment(attachments[0]) ? (
                        <div
                          onClick={() => setPreviewImage(mediaUrl(attachments[0]))}
                          className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-100 bg-slate-100"
                        >
                          <img
                            src={mediaUrl(attachments[0])}
                            alt={title}
                            className="max-h-64 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                              <Maximize2 size={13} /> View full photo
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Multiple attachments or documents */
                        <div className="space-y-2">
                          {attachments.map((att, idx) => {
                            const isImg = isImageAttachment(att);
                            const url = mediaUrl(att);

                            if (isImg) {
                              return (
                                <div
                                  key={idx}
                                  onClick={() => setPreviewImage(url)}
                                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-100 bg-slate-100"
                                >
                                  <img
                                    src={url}
                                    alt={`${title} attachment ${idx + 1}`}
                                    className="max-h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
                                    <span className="flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                                      <Maximize2 size={13} /> View photo {idx + 1}
                                    </span>
                                  </div>
                                </div>
                              );
                            }

                            // Document attachment
                            return (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 rounded-xl border border-[#eef0f1] bg-[#f7f7fa] p-3 transition hover:bg-[#eef0f1]"
                              >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00663f] text-white">
                                  <FileText size={18} />
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-bold text-slate-800">
                                    {att.split("/").pop() || "Document attachment"}
                                  </p>
                                  <p className="text-[11px] text-slate-400">
                                    Click to view or download
                                  </p>
                                </div>
                                <ExternalLink size={15} className="text-[#00663f]" />
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between border-t border-[#eef0f1] bg-slate-50/50 px-5 py-3">
                  {post ? (
                    <button
                      type="button"
                      onClick={() => setViewingPost(post)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00663f] transition hover:underline"
                    >
                      <Eye size={14} />
                      View Full Details
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">Original post</span>
                  )}

                  <Link
                    href="/feed"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-[#00663f]"
                  >
                    Go to Feed ↗
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-h-[92vh] max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black"
            >
              <X size={20} />
            </button>
            <img
              src={previewImage}
              alt="Full preview"
              className="max-h-[85vh] w-auto max-w-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Full Post Details Modal */}
      {viewingPost && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setViewingPost(null)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#eef0f1] px-5 py-4">
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">
                  {viewingPost.businessId?.name || viewingPost.business?.name || "Post Details"}
                </h3>
                {viewingPost.createdAt && (
                  <p className="text-[11px] text-slate-400">
                    Posted on {formatDate(viewingPost.createdAt)}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setViewingPost(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <h4 className="text-base font-bold text-slate-900">
                {viewingPost.title || "Business Announcement"}
              </h4>
              <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                {viewingPost.content || "No details provided."}
              </p>

              {viewingPost.attachments && viewingPost.attachments.length > 0 && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Attachments
                  </p>
                  {viewingPost.attachments.map((att, index) => {
                    const url = mediaUrl(att);
                    if (isImageAttachment(att)) {
                      return (
                        <img
                          key={index}
                          src={url}
                          alt="Attachment"
                          className="max-h-80 w-full rounded-xl object-cover"
                        />
                      );
                    }
                    return (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-[#00663f]"
                      >
                        <FileText size={18} />
                        <span className="truncate">{att.split("/").pop()}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end border-t border-[#eef0f1] bg-slate-50 px-5 py-3">
              <button
                type="button"
                onClick={() => setViewingPost(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
