"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiChevronLeft, FiChevronRight, FiEye, FiFileText, FiFlag, FiLoader, FiSearch, FiTrash2, FiUser, FiX } from "react-icons/fi";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import { toast } from "sonner";

type Report = { _id: string; post?: { _id?: string; postIdFormatted?: string; title?: string; content?: string; postType?: string; thumbnail?: string; postedTimeAgo?: string }; author?: { name?: string; email?: string; role?: string }; reporter?: { name?: string; email?: string; rank?: string }; reason?: { category?: string; categoryLabel?: string; details?: string }; status?: string; statusLabel?: string; actionTaken?: string; adminNote?: string };
type ApiResponse = { data?: { items?: Report[]; meta?: { total?: number; totalPages?: number } } | Report[]; items?: Report[]; meta?: { total?: number; totalPages?: number } };

function parseReports(payload: unknown) {
  if (Array.isArray(payload)) return { items: payload, total: payload.length, pages: 1 };
  const response = payload as ApiResponse;
  if (Array.isArray(response.data)) return { items: response.data, total: response.data.length, pages: 1 };
  return { items: response.data?.items || response.items || [], total: response.data?.meta?.total ?? response.meta?.total ?? 0, pages: response.data?.meta?.totalPages ?? response.meta?.totalPages ?? 1 };
}

function normalizeReport(payload: Record<string, unknown>): Report {
  if (payload.post || payload.author || payload.reporter) return payload as Report;
  const post = payload.postId as Record<string, unknown> | undefined;
  const author = payload.authorId as Record<string, unknown> | undefined;
  const reporter = payload.reporterId as Record<string, unknown> | undefined;
  return {
    _id: String(payload._id || ""),
    post: {
      _id: typeof post?._id === "string" ? post._id : undefined,
      title: typeof post?.title === "string" ? post.title : "Reported post",
      content: typeof post?.content === "string" ? post.content : "",
      postType: typeof post?.postType === "string" ? post.postType : "POST",
      thumbnail: typeof post?.thumbnail === "string" ? post.thumbnail : Array.isArray(post?.attachments) && typeof post.attachments[0] === "string" ? post.attachments[0] : undefined,
      postIdFormatted: typeof post?.postIdFormatted === "string" ? post.postIdFormatted : undefined,
    },
    author: { name: String(author?.fullName || "Unknown author"), email: String(author?.email || ""), role: String(author?.role || "") },
    reporter: { name: String(payload.reporterName || reporter?.fullName || "Unknown reporter"), email: String(reporter?.email || ""), rank: String(payload.reporterRank || "") },
    reason: { category: String(payload.reasonCategory || "OTHER"), categoryLabel: String(payload.reasonCategory || "OTHER"), details: String(payload.reasonDetails || "") },
    status: typeof payload.status === "string" ? payload.status : "PENDING",
    statusLabel: typeof payload.status === "string" ? statusName(payload.status) : "Pending",
    actionTaken: typeof payload.actionTaken === "string" ? payload.actionTaken : "NONE",
    adminNote: typeof payload.adminNote === "string" ? payload.adminNote : undefined,
  };
}

const statusName = (value?: string) => String(value || "UNKNOWN").replaceAll("_", " ");

export default function Moderations() {
  const [reports, setReports] = useState<Report[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [details, setDetails] = useState<Report | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  const loadReports = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await baseApi.get(ENDPOINTS.ModerationPosts, { params: { page, limit: 10, ...(status ? { status } : {}), ...(reason ? { reason } : {}), ...(search ? { search } : {}) } });
      const result = parseReports(response.data?.data ?? response.data);
      setReports(result.items);
      setTotal(result.total);
      setTotalPages(result.pages);
    } catch (requestError: unknown) {
      const message = (requestError as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || "Unable to load moderation reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadReports();
  }, [page, status, reason, search]);

  const openDetails = async (id: string, fallback?: Report) => {
    setDetailsLoading(true);
    try {
      const response = await baseApi.get(ENDPOINTS.singleGetReport(id));
      const root = response.data;
      const payload = root?.data?.data ?? root?.data ?? root;
      const report = payload?.report ?? payload?.item ?? (payload?._id ? payload : fallback) ?? {};
      setDetails(normalizeReport(report as Record<string, unknown>));
    } catch { toast.error("Unable to load report details."); } finally { setDetailsLoading(false); }
  };

  const executeAction = async (report: Report, action: "REMOVE_POST" | "AUTHOR_WARNED" | "DISMISSED") => {
    setActionLoading(report._id);
    try {
      if (action === "REMOVE_POST") {
        setReportToDelete(report);
        setActionLoading("");
        return;
      }
      await baseApi.patch(ENDPOINTS.actionReport(report._id), { action, adminNote: `Action taken by admin: ${action}` });
      setReports((current) => current.map((item) => item._id === report._id ? { ...item, status: action === "DISMISSED" ? "DISMISSED" : "RESOLVED", statusLabel: action === "DISMISSED" ? "Dismissed" : "Resolved", actionTaken: action } : item));
      setDetails(null);
      toast.success("Moderation action completed.");
    } catch { toast.error("Unable to complete moderation action."); } finally { setActionLoading(""); }
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;
    setActionLoading(reportToDelete._id);
    try {
      await baseApi.delete(ENDPOINTS.deleteReport(reportToDelete._id));
      setReports((current) => current.filter((item) => item._id !== reportToDelete._id));
      setTotal((current) => Math.max(0, current - 1));
      setReportToDelete(null);
      setDetails(null);
      toast.success("Post deleted and report resolved.");
    } catch {
      toast.error("Unable to delete the reported post.");
    } finally {
      setActionLoading("");
    }
  };

  return <div className="space-y-6">
    <div><h1 className="text-2xl font-bold text-slate-900">Post Moderation Queue</h1><p className="mt-1 text-sm text-slate-500">Review flagged community content and take moderation actions.</p></div>
    <form onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(searchInput.trim()); }} className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-[minmax(220px,1fr)_180px_210px_auto]">
      <label className="relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search post, author, or reporter" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#00663f]" /></label>
      <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="">All statuses</option><option value="PENDING">Pending</option><option value="CRITICAL">Critical</option><option value="LOW_PRIORITY">Low priority</option><option value="RESOLVED">Resolved</option><option value="DISMISSED">Dismissed</option></select>
      <select value={reason} onChange={(event) => { setReason(event.target.value); setPage(1); }} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="">All reasons</option><option value="INAPPROPRIATE">Inappropriate</option><option value="SPAM">Spam</option><option value="MISCATEGORIZED">Miscategorized</option><option value="HARASSMENT">Harassment</option><option value="COPYRIGHT">Copyright</option><option value="OTHER">Other</option></select>
      <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white"><FiSearch /> Search</button>
    </form>
    {loading ? <div className="flex justify-center rounded-2xl bg-white p-12 text-[#00663f]"><FiLoader className="animate-spin text-xl" /></div> : error ? <div className="rounded-2xl bg-red-50 p-5 text-sm text-red-700">{error}</div> : reports.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No reports found.</div> : <div className="overflow-hidden rounded-2xl bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead><tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400"><th className="px-5 py-3">Post</th><th className="px-5 py-3">Author / Reporter</th><th className="px-5 py-3">Reason</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr></thead><tbody>{reports.map((report) => <tr key={report._id} className="border-b border-slate-50 align-top last:border-0"><td className="px-5 py-4"><div className="flex gap-3"><div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">{report.post?.thumbnail ? <Image src={report.post.thumbnail} alt={report.post.title || "Reported post"} fill className="object-cover" /> : <div className="grid h-full place-items-center text-slate-400"><FiFileText /></div>}</div><div><p className="max-w-xs truncate font-semibold text-slate-800">{report.post?.title || report.post?.content || "Reported post"}</p><p className="mt-1 text-xs text-slate-400">{report.post?.postIdFormatted || report.post?._id} · {report.post?.postedTimeAgo}</p><span className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">{report.post?.postType || "POST"}</span></div></div></td><td className="px-5 py-4"><p className="flex items-center gap-1.5 font-medium"><FiUser />{report.author?.name || "Unknown author"}</p><p className="text-xs text-slate-400">{report.author?.email}</p><p className="mt-3 flex items-center gap-1.5 font-medium text-[#c0524d]"><FiFlag />{report.reporter?.name || "Unknown reporter"}</p><p className="text-xs text-slate-400">{report.reporter?.rank || report.reporter?.email}</p></td><td className="px-5 py-4"><span className="rounded-full bg-[#fbe2e2] px-2.5 py-1 text-[10px] font-semibold text-[#c0524d]">{report.reason?.categoryLabel || report.reason?.category || "OTHER"}</span><p className="mt-2 max-w-xs text-sm text-slate-500">{report.reason?.details || "No details provided."}</p></td><td className="px-5 py-4 font-semibold text-[#b17a3a]">{report.statusLabel || statusName(report.status)}</td><td className="px-5 py-4"><button type="button" onClick={() => void openDetails(report._id)} className="flex items-center gap-1.5 font-semibold text-[#00663f]"><FiEye /> View</button><div className="mt-3 flex gap-2"><button type="button" disabled={Boolean(actionLoading)} onClick={() => void executeAction(report, "REMOVE_POST")} className="rounded-lg bg-red-50 p-2 text-red-600 disabled:opacity-50"><FiTrash2 /></button><button type="button" disabled={Boolean(actionLoading)} onClick={() => void executeAction(report, "DISMISSED")} className="rounded-lg bg-slate-100 p-2 text-slate-600 disabled:opacity-50"><FiCheckCircle /></button></div></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm text-slate-500"><span>Showing {(page - 1) * 10 + 1} to {(page - 1) * 10 + reports.length} of {total}</span><div className="flex items-center gap-2"><button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="rounded-lg border p-2 disabled:opacity-40"><FiChevronLeft /></button><span>Page {page} of {totalPages}</span><button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-lg border p-2 disabled:opacity-40"><FiChevronRight /></button></div></div></div>}
    {(details || detailsLoading) && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !detailsLoading && setDetails(null)}><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6" onClick={(event) => event.stopPropagation()}><div className="flex justify-between"><h2 className="text-lg font-bold">Reported Post Details</h2><button type="button" onClick={() => setDetails(null)}><FiX /></button></div>{detailsLoading ? <p className="py-8 text-center text-slate-500">Loading details...</p> : details && <div className="mt-5 space-y-4 text-sm"><h3 className="text-xl font-bold">{details.post?.title}</h3><p>{details.post?.content}</p><p><b>Author:</b> {details.author?.name} ({details.author?.email})</p><p><b>Reporter:</b> {details.reporter?.name} · {details.reporter?.rank}</p><p><b>Reason:</b> {details.reason?.details || details.reason?.categoryLabel}</p><div className="flex flex-wrap gap-2 border-t pt-4"><button type="button" onClick={() => void executeAction(details, "REMOVE_POST")} className="rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white">Remove post</button><button type="button" onClick={() => void executeAction(details, "AUTHOR_WARNED")} className="rounded-xl bg-[#00663f] px-4 py-2.5 font-semibold text-white">Warn author</button><button type="button" onClick={() => void executeAction(details, "DISMISSED")} className="rounded-xl border px-4 py-2.5 font-semibold">Dismiss</button></div></div>}</div></div>}
    {reportToDelete && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !actionLoading && setReportToDelete(null)}><div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}><h2 className="text-lg font-bold text-slate-900">Delete reported post?</h2><p className="mt-2 text-sm leading-6 text-slate-500">Are you sure you want to delete this post? This action cannot be undone.</p><div className="mt-6 flex justify-end gap-3"><button type="button" disabled={Boolean(actionLoading)} onClick={() => setReportToDelete(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-50">Cancel</button><button type="button" disabled={Boolean(actionLoading)} onClick={() => void confirmDelete()} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{actionLoading ? "Deleting..." : "Delete"}</button></div></div></div>}
  </div>;
}
