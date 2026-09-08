"use client";
/*   eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { FiAlertCircle, FiArrowRight, FiEdit3, FiEye, FiFileText, FiHeart, FiImage, FiLoader, FiUploadCloud, FiX } from "react-icons/fi";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import { useAuth } from "@/src/context/AuthContext";

const POSTS_PER_PAGE = 5;
type Post = { _id: string; businessId?: string; title?: string; content?: string; attachments?: string[]; status?: string; isDraft?: boolean; viewsCount?: number; likeCount?: number; reportsCount?: number; createdAt?: string };
type Business = { _id?: string; ownerId?: string | { _id?: string; id?: string }; userId?: string; owner?: { _id?: string; id?: string; email?: string }; contactInfo?: { email?: string } };

function getList(payload: unknown): Post[] {
  const response = payload as { data?: { posts?: Post[]; items?: Post[]; businesses?: Post[]; result?: { posts?: Post[]; items?: Post[] } } | Post[]; posts?: Post[]; items?: Post[] };
  if (Array.isArray(response.data)) return response.data;
  return response.data?.posts || response.data?.items || response.data?.result?.posts || response.data?.result?.items || response.posts || response.items || [];
}

function getBusinesses(payload: unknown): Business[] {
  const response = payload as { data?: { businesses?: Business[]; result?: { businesses?: Business[] } } | Business[]; businesses?: Business[]; result?: { businesses?: Business[] } };
  if (Array.isArray(response.data)) return response.data;
  return response.data?.businesses || response.data?.result?.businesses || response.businesses || response.result?.businesses || [];
}

function sameValue(first?: string, second?: string) {
  return Boolean(first && second && first.toLowerCase() === second.toLowerCase());
}

function mediaUrl(value: string) {
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return process.env.NEXT_PUBLIC_API_URL ? new URL(value, process.env.NEXT_PUBLIC_API_URL).toString() : value;
}

function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Recently";
}

async function uploadPostAttachment(file: File) {
  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append("folder", "posts");
  const response = await baseApi.post(ENDPOINTS.storageUpload, uploadData);
  const url = response.data?.data?.url || response.data?.data?.result?.url || response.data?.url || response.data?.result?.url;
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

  const loadData = useCallback(async () => {
    if (isAuthLoading) return;
    setIsLoading(true);
    try {
      const [businessResponse, postsResponse] = await Promise.all([
        baseApi.get(ENDPOINTS.getBusinesses),
        baseApi.get(ENDPOINTS.getMyPosts),
      ]);
      const businesses = getBusinesses(businessResponse.data);
      const matchedBusiness = user ? businesses.find((business) => {
        const ownerId = typeof business.ownerId === "string" ? business.ownerId : business.ownerId?._id || business.ownerId?.id;
        return ownerId === user.id
          || business.userId === user.id
          || business.owner?._id === user.id
          || business.owner?.id === user.id
          || sameValue(business.owner?.email, user.email)
          || sameValue(business.contactInfo?.email, user.email);
      }) : undefined;
      const ownedBusiness = matchedBusiness;
      const ownedBusinessId = ownedBusiness?._id || "";
      setBusinessId(ownedBusinessId);
      setPosts(getList(postsResponse.data).filter((post) => !post.isDraft && post.status !== "DRAFT"));
      setCurrentPage(1);
      if (!ownedBusinessId) toast.error("Your account does not own a business profile yet.");
    } catch {
      toast.error("Unable to load your posts.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthLoading, user]);

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const visiblePosts = posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  useEffect(() => {
    // This effect intentionally hydrates API data into the screen when the account changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isAuthLoading) void loadData();
  }, [isAuthLoading, loadData]);

  const selectFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    if (selected.length > 3) {
      toast.error("You can upload up to 3 attachments.");
      return;
    }
    const valid = selected.filter((file) => file.type.startsWith("image/") || file.type === "application/pdf");
    if (valid.length !== selected.length) toast.error("Only images and PDF files are supported.");
    setAttachments(valid);
  };

  const submitPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!businessId) return toast.error("Your account does not own a business profile yet.");
    if (!title.trim() || !content.trim()) return toast.error("Title and content are required.");
    setIsSubmitting(true);
    try {
      const attachmentUrls = attachments.length > 0
        ? await Promise.all(attachments.map((file) => uploadPostAttachment(file)))
        : [];
      await baseApi.post(ENDPOINTS.postFeed, {
        businessId,
        title: title.trim(),
        content: content.trim(),
        isDraft: false,
        ...(attachmentUrls.length > 0 ? { attachments: attachmentUrls } : {}),
      });
      toast.success("Post published successfully.");
      setTitle(""); setContent(""); setAttachments([]);
      if (fileInput.current) fileInput.current.value = "";
      await loadData();
    } catch (error: unknown) {
      const response = (error as { response?: { data?: { message?: string } } }).response;
      toast.error(response?.data?.message || "Unable to create the post.");
    } finally { setIsSubmitting(false); }
  };

  return <div className="space-y-6">
    <div><h1 className="text-2xl font-bold text-[#00663f]">Content Manager</h1><p className="mt-1 text-sm text-slate-500">Publish updates and events for your business.</p></div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <form onSubmit={submitPost} className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
        <div className="flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-base font-bold text-slate-900"><FiEdit3 className="text-[#00663f]" /> Create Post</h2><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">Up to 3 files</span></div>
        <label className="mt-4 block text-sm font-semibold text-slate-700">Title *<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={150} required placeholder="Special Weekend Discount!" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/10" /></label>
        <label className="mt-4 block text-sm font-semibold text-slate-700">Content *<textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={2000} required rows={5} placeholder="Share an update, event, or special offer..." className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/10" /></label>
        <input ref={fileInput} type="file" multiple accept="image/*,.pdf,application/pdf" onChange={selectFiles} className="hidden" />
        <button type="button" onClick={() => fileInput.current?.click()} className="mt-4 flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 py-6 text-center hover:border-[#00663f]"><FiUploadCloud className="text-2xl text-[#00663f]" /><span className="text-sm font-semibold text-slate-700">Add attachments</span><span className="text-xs text-slate-400">Images or PDFs, maximum 3</span></button>
        {attachments.length > 0 && <div className="mt-3 space-y-2">{attachments.map((file) => <div key={`${file.name}-${file.size}`} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700"><FiFileText className="text-[#00663f]" /><span className="min-w-0 flex-1 truncate">{file.name}</span><button type="button" onClick={() => setAttachments((current) => current.filter((item) => item !== file))} aria-label={`Remove ${file.name}`}><FiX /></button></div>)}</div>}
        <div className="mt-5 flex justify-end border-t border-slate-100 pt-4"><button disabled={isSubmitting} type="submit" className="flex items-center gap-2 rounded-xl bg-[#00663f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#004f31] disabled:opacity-60">{isSubmitting ? <FiLoader className="animate-spin" /> : null}Publish Now<FiArrowRight /></button></div>
      </form>
      <div className="flex flex-col rounded-2xl bg-[#00663f] p-5 shadow-sm"><h2 className="text-base font-bold text-white">Performance Overview</h2><p className="text-sm text-green-100/80">From your posts</p><div className="mt-5 space-y-4"><div><p className="text-xs uppercase tracking-wide text-green-100/70">Total views</p><p className="mt-1 text-2xl font-bold text-white">{posts.reduce((total, post) => total + (post.viewsCount || 0), 0).toLocaleString()}</p></div><div><p className="text-xs uppercase tracking-wide text-green-100/70">Total likes</p><p className="mt-1 text-2xl font-bold text-white">{posts.reduce((total, post) => total + (post.likeCount || 0), 0).toLocaleString()}</p></div></div></div>
    </div>
    <div><h2 className="text-lg font-bold text-slate-900">My Updates</h2><div className="mt-4 space-y-4">{isLoading ? <div className="flex justify-center rounded-2xl bg-white p-10 text-[#00663f]"><FiLoader className="animate-spin" /></div> : posts.length === 0 ? <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">No published posts found.</div> : visiblePosts.map((post) => <article key={post._id} className="rounded-2xl bg-white p-4 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row">{post.attachments?.[0] ? <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-32">{/\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(post.attachments[0]) ? <img src={mediaUrl(post.attachments[0])} alt={post.title || "Post attachment"} className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center gap-1 text-slate-500"><FiFileText /><span className="max-w-full truncate px-2 text-[10px]">Attachment</span></div>}</div> : <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-300 sm:w-32"><FiImage className="text-2xl" /></div>}<div className="min-w-0 flex-1"><p className="text-xs text-slate-400">{formatDate(post.createdAt)}</p><p className="mt-1 text-sm font-semibold text-slate-900">{post.title || "Untitled post"}</p><p className="mt-1 text-sm text-slate-500">{post.content || "No content"}</p><div className="mt-3 flex flex-wrap items-center gap-5 border-t border-slate-100 pt-3 text-xs text-slate-500"><span className="flex items-center gap-1.5"><FiEye />{post.viewsCount || 0} Views</span><span className="flex items-center gap-1.5"><FiHeart />{post.likeCount || 0} Likes</span><span className="flex items-center gap-1.5 text-[#c0524d]"><FiAlertCircle />{post.reportsCount || 0} Reports</span></div></div></div></article>)}</div></div>
    {totalPages > 1 && <div className="mt-4 flex items-center justify-center gap-3"><button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">Previous</button><span className="text-sm text-slate-500">{currentPage} / {totalPages}</span><button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">Next</button></div>}
  </div>;
}
