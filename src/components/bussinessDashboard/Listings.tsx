"use client";
/*   eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import {
  FiAlertCircle, FiArrowRight, FiBarChart2, FiEdit3,
  FiEye, FiFileText, FiHeart, FiImage, FiLoader,
  FiTrendingUp, FiUploadCloud, FiX,
} from "react-icons/fi";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import { useAuth } from "@/src/context/AuthContext";

const POSTS_PER_PAGE = 5;
type Post = { _id: string; businessId?: string; title?: string; content?: string; attachments?: string[]; status?: string; isDraft?: boolean; viewsCount?: number; likeCount?: number; reportsCount?: number; createdAt?: string };
type Business = { _id?: string; ownerId?: string | { _id?: string; id?: string }; userId?: string; owner?: { _id?: string; id?: string; email?: string }; contactInfo?: { email?: string } };

function getList(payload: unknown): Post[] {
  const r = payload as { data?: { posts?: Post[]; items?: Post[]; result?: { posts?: Post[]; items?: Post[] } } | Post[]; posts?: Post[]; items?: Post[] };
  if (Array.isArray(r.data)) return r.data;
  return r.data?.posts || r.data?.items || (r.data as { result?: { posts?: Post[]; items?: Post[] } })?.result?.posts || (r.data as { result?: { posts?: Post[]; items?: Post[] } })?.result?.items || r.posts || r.items || [];
}

function getBusinesses(payload: unknown): Business[] {
  const r = payload as { data?: { businesses?: Business[]; result?: { businesses?: Business[] } } | Business[]; businesses?: Business[]; result?: { businesses?: Business[] } };
  if (Array.isArray(r.data)) return r.data;
  return r.data?.businesses || (r.data as { result?: { businesses?: Business[] } })?.result?.businesses || r.businesses || r.result?.businesses || [];
}

function sameValue(a?: string, b?: string) { return Boolean(a && b && a.toLowerCase() === b.toLowerCase()); }

function mediaUrl(v: string) {
  if (/^(https?:|data:|blob:)/i.test(v)) return v;
  return process.env.NEXT_PUBLIC_API_URL ? new URL(v, process.env.NEXT_PUBLIC_API_URL).toString() : v;
}

function formatDate(v?: string) {
  return v ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(v)) : "Recently";
}

async function uploadPostAttachment(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", "posts");
  const r = await baseApi.post(ENDPOINTS.storageUpload, fd);
  const url = r.data?.data?.url || r.data?.data?.result?.url || r.data?.url || r.data?.result?.url;
  if (typeof url !== "string" || !url) throw new Error(`Upload failed for ${file.name}.`);
  return url;
}

export default function Listings() {
  const fileInput = useRef<HTMLInputElement>(null);
  const { user, loading: isAuthLoading } = useAuth();
  const [businessId, setBusinessId] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const viewPost = async (postId: string) => {
    try {
      await baseApi.get(ENDPOINTS.getView(postId));
      // Update local post view count
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, viewsCount: (p.viewsCount || 0) + 1 } : p
        )
      );
    } catch {
      // Silent fail - view tracking is not critical
    }
  };

  const toggleExpandPost = (postId: string) => {
    const isExpanding = expandedPostId !== postId;
    setExpandedPostId(isExpanding ? postId : null);
    
    // Track view when expanding
    if (isExpanding) {
      void viewPost(postId);
    }
  };

  const loadData = useCallback(async () => {
    if (isAuthLoading) return;
    setIsLoading(true);
    try {
      const [bRes, pRes] = await Promise.all([
        baseApi.get(ENDPOINTS.getBusinesses),
        baseApi.get(ENDPOINTS.getMyPosts),
      ]);
      const businesses = getBusinesses(bRes.data);
      const matched = user ? businesses.find((b) => {
        const oid = typeof b.ownerId === "string" ? b.ownerId : b.ownerId?._id || b.ownerId?.id;
        return oid === user.id || b.userId === user.id || b.owner?._id === user.id || b.owner?.id === user.id
          || sameValue(b.owner?.email, user.email) || sameValue(b.contactInfo?.email, user.email);
      }) : undefined;
      setBusinessId(matched?._id || "");
      setPosts(getList(pRes.data).filter((p) => !p.isDraft && p.status !== "DRAFT"));
      setCurrentPage(1);
      if (!matched?._id) toast.error("Your account does not own a business profile yet.");
    } catch { toast.error("Unable to load your posts."); }
    finally { setIsLoading(false); }
  }, [isAuthLoading, user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isAuthLoading) void loadData();
  }, [isAuthLoading, loadData]);

  const totalViews = posts.reduce((s, p) => s + (p.viewsCount || 0), 0);
  const totalLikes = posts.reduce((s, p) => s + (p.likeCount || 0), 0);
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const visiblePosts = posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const selectFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 3) { toast.error("You can upload up to 3 attachments."); return; }
    const valid = selected.filter((f) => f.type.startsWith("image/") || f.type === "application/pdf");
    if (valid.length !== selected.length) toast.error("Only images and PDF files are supported.");
    setAttachments(valid);
  };

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!businessId) return toast.error("Your account does not own a business profile yet.");
    if (!title.trim() || !content.trim()) return toast.error("Title and content are required.");
    setIsSubmitting(true);
    try {
      const urls = attachments.length > 0 ? await Promise.all(attachments.map(uploadPostAttachment)) : [];
      await baseApi.post(ENDPOINTS.postFeed, {
        businessId, title: title.trim(), content: content.trim(), isDraft: false,
        ...(urls.length > 0 ? { attachments: urls } : {}),
      });
      toast.success("Post published successfully.");
      setTitle(""); setContent(""); setAttachments([]);
      if (fileInput.current) fileInput.current.value = "";
      await loadData();
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Unable to create the post.");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#00663f]">Content Manager</h1>
        <p className="mt-1 text-sm text-slate-500">Publish updates and events for your business.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Create Post ── */}
        <form onSubmit={submitPost} className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <FiEdit3 className="text-[#00663f]" /> Create Post
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">Up to 3 files</span>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Title *
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={150}
                required
                placeholder="Special Weekend Discount!"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/10"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Content *
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={2000}
                required
                rows={5}
                placeholder="Share an update, event, or special offer..."
                className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/10"
              />
            </label>
          </div>

          <input ref={fileInput} type="file" multiple accept="image/*,.pdf,application/pdf" onChange={selectFiles} className="hidden" />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="mt-4 flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 py-6 text-center transition hover:border-[#00663f] hover:bg-[#f0faf5]"
          >
            <FiUploadCloud className="text-2xl text-[#00663f]" />
            <span className="text-sm font-semibold text-slate-700">Add attachments</span>
            <span className="text-xs text-slate-400">Images or PDFs, maximum 3</span>
          </button>

          {attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {attachments.map((file) => (
                <div key={`${file.name}-${file.size}`} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
                  <FiFileText className="text-[#00663f]" />
                  <span className="min-w-0 flex-1 truncate">{file.name}</span>
                  <button type="button" onClick={() => setAttachments((cur) => cur.filter((f) => f !== file))} aria-label={`Remove ${file.name}`}>
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#00663f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#004f31] disabled:opacity-60"
            >
              {isSubmitting && <FiLoader className="animate-spin" />}
              Publish Now <FiArrowRight />
            </button>
          </div>
        </form>

        {/* ── Performance Overview ── */}
        <div className="flex flex-col gap-4">
          {/* Stats card */}
          <div className="rounded-2xl bg-[#00663f] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Performance Overview</h2>
                <p className="mt-0.5 text-xs text-green-100/70">From your posts</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <FiBarChart2 className="text-xl text-white" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/10 p-3">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-green-100/70">
                  <FiEye className="text-xs" /> Total Views
                </div>
                <p className="mt-1.5 text-2xl font-bold text-white">{totalViews.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-green-100/70">
                  <FiHeart className="text-xs" /> Total Likes
                </div>
                <p className="mt-1.5 text-2xl font-bold text-white">{totalLikes.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 p-3">
              <FiTrendingUp className="shrink-0 text-green-200" />
              <div>
                <p className="text-xs font-semibold text-green-100">{posts.length} published post{posts.length !== 1 ? "s" : ""}</p>
                <p className="text-[10px] text-green-100/60">Keep publishing to grow your reach</p>
              </div>
            </div>
          </div>

          {/* Quick tips */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Quick Tips</p>
            <ul className="mt-3 space-y-2.5 text-xs text-slate-500">
              {[
                "Post regularly to stay visible",
                "Add images to boost engagement",
                "Highlight offers and events",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-[#e4f3ec] text-center text-[10px] font-bold leading-4 text-[#00663f]">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── My Updates ── */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">My Updates</h2>
          <span className="text-xs text-slate-400">{posts.length} post{posts.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="mt-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center rounded-2xl bg-white p-10 text-[#00663f] shadow-sm">
              <FiLoader className="animate-spin text-xl" />
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400 shadow-sm">
              No published posts found. Create your first post above!
            </div>
          ) : (
            visiblePosts.map((post) => {
              const isExpanded = expandedPostId === post._id;
              return (
              <article key={post._id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                <div className="flex flex-col gap-4 p-5 sm:flex-row">
                  {/* Thumbnail */}
                  {post.attachments?.[0] ? (
                    <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-32">
                      {/\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(post.attachments[0]) ? (
                        <img src={mediaUrl(post.attachments[0])} alt={post.title || "Post attachment"} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-1 text-slate-400">
                          <FiFileText className="text-xl" />
                          <span className="text-[10px]">Attachment</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-200 sm:w-32">
                      <FiImage className="text-3xl" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-400">{formatDate(post.createdAt)}</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{post.title || "Untitled post"}</p>
                    <p className={`mt-1 text-sm text-slate-500 ${isExpanded ? "" : "line-clamp-2"}`}>
                      {post.content || "No content"}
                    </p>

                    {/* View More/Less Button */}
                    {(post.content?.length || 0) > 100 && (
                      <button
                        type="button"
                        onClick={() => toggleExpandPost(post._id)}
                        className="mt-2 text-xs font-semibold text-[#00663f] hover:underline"
                      >
                        {isExpanded ? "View Less" : "View More"}
                      </button>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-5 border-t border-slate-100 pt-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium text-slate-600">
                        <FiEye className="text-[#00663f]" />{post.viewsCount || 0} Views
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-slate-600">
                        <FiHeart className="text-pink-400" />{post.likeCount || 0} Likes
                      </span>
                      {(post.reportsCount || 0) > 0 && (
                        <span className="flex items-center gap-1.5 font-medium text-[#c0524d]">
                          <FiAlertCircle />{post.reportsCount} Reports
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">{currentPage} / {totalPages}</span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
