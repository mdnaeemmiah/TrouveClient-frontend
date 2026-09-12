"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiInbox,
  FiList,
  FiLoader,
  FiPlus,
  FiSearch,
  FiStar,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type Category = {
  _id: string;
  name: string;
  icon?: string;
  description?: string;
  isPopular?: boolean;
};

type CategoryRequest = {
  _id: string;
  requestedName?: string;
  name?: string;
  categoryName?: string;
  description?: string;
  requestedBy?: string | { fullName?: string; email?: string; name?: string };
  requesterId?: { _id?: string; fullName?: string; email?: string; role?: string } | string;
  status?: string;
  createdAt?: string;
  adminNotes?: string;
};

type FormState = {
  name: string;
  icon: string;
  description: string;
  isPopular: boolean;
};

type Tab = "categories" | "requests";

const emptyForm: FormState = { name: "", icon: "", description: "", isPopular: false };
const PAGE_SIZE = 12;
const REQ_PAGE_SIZE = 10;

function getRequesterName(req: CategoryRequest) {
  const val = req.requesterId ?? req.requestedBy;
  if (!val) return "Unknown";
  if (typeof val === "string") return val;
  return (val as { fullName?: string; name?: string; email?: string }).fullName
    ?? (val as { name?: string }).name
    ?? (val as { email?: string }).email
    ?? "Unknown";
}

function getRequestedName(req: CategoryRequest) {
  return req.requestedName ?? req.categoryName ?? req.name ?? "—";
}

function extractList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  for (const key of ["data", "result", "items", "categories", "list"]) {
    if (Array.isArray(d[key])) return d[key] as T[];
  }
  if (d.data && typeof d.data === "object") {
    const inner = d.data as Record<string, unknown>;
    for (const key of ["items", "result", "categories", "list", "data"]) {
      if (Array.isArray(inner[key])) return inner[key] as T[];
    }
  }
  return [];
}

function Pagination({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-xs text-slate-400">
        Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-[#00663f] hover:text-[#00663f] disabled:opacity-40"
        >
          <FiChevronLeft className="text-sm" />
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-1 text-xs text-slate-400">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p as number)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                p === page
                  ? "bg-[#00663f] text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#00663f] hover:text-[#00663f]"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-[#00663f] hover:text-[#00663f] disabled:opacity-40"
        >
          <FiChevronRight className="text-sm" />
        </button>
      </div>
    </div>
  );
}

export default function Categories() {
  const [activeTab, setActiveTab] = useState<Tab>("categories");

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [catsError, setCatsError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [catPage, setCatPage] = useState(1);

  // Requests state
  const [requests, setRequests] = useState<CategoryRequest[]>([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqError, setReqError] = useState("");
  const [reqPage, setReqPage] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Request status update
  const [updatingReqId, setUpdatingReqId] = useState("");

  // ── loaders ──────────────────────────────────────────────
  const loadCategories = async () => {
    setCatsLoading(true);
    setCatsError("");
    try {
      const res = await baseApi.get(ENDPOINTS.createCategory);
      setCategories(extractList<Category>(res.data));
    } catch {
      setCatsError("Unable to load categories.");
    } finally {
      setCatsLoading(false);
    }
  };

  const loadRequests = async () => {
    setReqLoading(true);
    setReqError("");
    try {
      const res = await baseApi.get(ENDPOINTS.requestCategory);
      setRequests(extractList<CategoryRequest>(res.data));
    } catch {
      setReqError("Unable to load category requests.");
    } finally {
      setReqLoading(false);
    }
  };

  useEffect(() => { void loadCategories(); }, []);

  useEffect(() => {
    if (activeTab === "requests" && requests.length === 0 && !reqLoading) {
      void loadRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const updateRequestStatus = async (reqId: string, status: "APPROVED" | "REJECTED") => {
    setUpdatingReqId(reqId);
    try {
      await baseApi.patch(ENDPOINTS.CategoryReview(reqId), { status });
      setRequests((prev) =>
        prev.map((r) => r._id === reqId ? { ...r, status } : r)
      );
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setReqError(msg || "Failed to update request status.");
    } finally {
      setUpdatingReqId("");
    }
  };

  // reset page when search changes
  useEffect(() => { setCatPage(1); }, [searchQuery]);

  // ── category CRUD ─────────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setForm({ name: cat.name, icon: cat.icon || "", description: cat.description || "", isPopular: cat.isPopular ?? false });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError("Name is required."); return; }
    setSaving(true);
    setFormError("");
    try {
      if (editTarget) {
        const res = await baseApi.patch(ENDPOINTS.updateCategory(editTarget._id), {
          name: form.name.trim(),
          icon: form.icon.trim() || undefined,
          description: form.description.trim() || undefined,
          isPopular: form.isPopular,
        });
        const updated: Category = res.data?.data ?? res.data;
        setCategories((prev) => prev.map((c) => c._id === editTarget._id ? { ...c, ...updated } : c));
      } else {
        const res = await baseApi.post(ENDPOINTS.createCategory, {
          name: form.name.trim(),
          icon: form.icon.trim() || undefined,
          description: form.description.trim() || undefined,
          isPopular: form.isPopular,
        });
        const created: Category = res.data?.data ?? res.data;
        // new item at top, go to page 1
        setCategories((prev) => [created, ...prev]);
        setCatPage(1);
      }
      setModalOpen(false);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setFormError(msg || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await baseApi.delete(ENDPOINTS.deleteCategory(deleteTarget._id));
      setCategories((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setCatsError(msg || "Failed to delete category.");
    } finally {
      setDeleting(false);
    }
  };

  // ── derived data ──────────────────────────────────────────
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const pagedCats = filtered.slice((catPage - 1) * PAGE_SIZE, catPage * PAGE_SIZE);
  const pagedReqs = requests.slice((reqPage - 1) * REQ_PAGE_SIZE, reqPage * REQ_PAGE_SIZE);

  // ── render ────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="mt-1 text-sm text-slate-500">Manage categories and review user requests.</p>
        </div>
        {activeTab === "categories" && (
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#004f31]"
          >
            <FiPlus className="text-base" /> Add Category
          </button>
        )}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
              activeTab === "categories" ? "bg-white text-[#00663f] shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <FiList />
            Categories
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
              {categories.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
              activeTab === "requests" ? "bg-white text-[#00663f] shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <FiInbox />
            Requests
            {requests.length > 0 && (
              <span className="rounded-full bg-[#fff4dc] px-2 py-0.5 text-xs text-[#b17a3a]">
                {requests.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === "categories" && (
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/20"
            />
          </div>
        )}
      </div>

      {/* ── CATEGORIES TAB ── */}
      {activeTab === "categories" && (
        <>
          {catsError && <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{catsError}</div>}

          {catsLoading ? (
            <div className="flex justify-center rounded-2xl bg-white p-12 text-[#00663f] shadow-sm">
              <FiLoader className="animate-spin text-2xl" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
              {searchQuery ? "No categories match your search." : "No categories found."}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pagedCats.map((cat) => (
                  <div key={cat._id} className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e4f3ec]">
                      {cat.icon && cat.icon.startsWith("http") ? (
                        <Image
                          src={cat.icon}
                          alt={cat.name}
                          width={28}
                          height={28}
                          className="object-contain"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <span className="text-lg font-bold text-[#00663f]">{cat.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-bold text-slate-900">{cat.name}</p>
                        {cat.isPopular && <FiStar className="shrink-0 text-xs text-amber-400" title="Popular" />}
                      </div>
                      {cat.description && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{cat.description}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(cat)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-[#e4f3ec] hover:text-[#00663f]"
                        aria-label={`Edit ${cat.name}`}
                      >
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(cat)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-[#fde8e8] hover:text-[#d9534f]"
                        aria-label={`Delete ${cat.name}`}
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination
                page={catPage}
                total={filtered.length}
                pageSize={PAGE_SIZE}
                onChange={setCatPage}
              />
            </>
          )}
        </>
      )}

      {/* ── REQUESTS TAB ── */}
      {activeTab === "requests" && (
        <>
          {reqError && <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{reqError}</div>}

          {reqLoading ? (
            <div className="flex justify-center rounded-2xl bg-white p-12 text-[#00663f] shadow-sm">
              <FiLoader className="animate-spin text-2xl" />
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
              No category requests found.
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                      <th className="px-5 py-3 font-medium">Category Name</th>
                      <th className="px-5 py-3 font-medium">Description</th>
                      <th className="px-5 py-3 font-medium">Requested By</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedReqs.map((req) => {
                      const statusUpper = String(req.status ?? "PENDING").toUpperCase();
                      const isApproved = statusUpper === "APPROVED";
                      const isRejected = statusUpper === "REJECTED";
                      return (
                        <tr key={req._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                          <td className="px-5 py-3 font-semibold text-slate-800">
                            {getRequestedName(req)}
                          </td>
                          <td className="px-5 py-3 text-slate-500">
                            <span className="line-clamp-2 max-w-xs">{req.description || "—"}</span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                <FiUser className="text-xs" />
                              </div>
                              <div>
                                <p className="text-sm text-slate-700">{getRequesterName(req)}</p>
                                {typeof req.requesterId === "object" && req.requesterId?.email && (
                                  <p className="text-xs text-slate-400">{req.requesterId.email}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                              isApproved
                                ? "bg-[#e4f3ec] text-[#00663f]"
                                : isRejected
                                ? "bg-[#fbeceb] text-[#c0524d]"
                                : "bg-[#fff4dc] text-[#b17a3a]"
                            }`}>
                              {statusUpper}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-xs text-slate-400">
                            {req.createdAt
                              ? new Date(req.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                              : "—"}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                disabled={updatingReqId === req._id || isApproved}
                                onClick={() => void updateRequestStatus(req._id, "APPROVED")}
                                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
                                  isApproved
                                    ? "bg-[#e4f3ec] text-[#00663f] cursor-default"
                                    : "bg-[#00663f] text-white hover:bg-[#004f31]"
                                }`}
                              >
                                {updatingReqId === req._id ? <FiLoader className="animate-spin" /> : null}
                                {isApproved ? "Approved" : "Approve"}
                              </button>
                              <button
                                type="button"
                                disabled={updatingReqId === req._id || isRejected}
                                onClick={() => void updateRequestStatus(req._id, "REJECTED")}
                                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
                                  isRejected
                                    ? "bg-[#fbeceb] text-[#c0524d] cursor-default"
                                    : "bg-[#fde8e8] text-[#d9534f] hover:bg-[#fbd4d4]"
                                }`}
                              >
                                {isRejected ? "Rejected" : "Reject"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={reqPage}
                total={requests.length}
                pageSize={REQ_PAGE_SIZE}
                onChange={setReqPage}
              />
            </>
          )}
        </>
      )}

      {/* ── Create / Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editTarget ? "Edit Category" : "Add Category"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Plumbers"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Icon URL</label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/20"
                />
                {form.icon && form.icon.startsWith("http") && (
                  <div className="mt-2 flex items-center gap-2">
                    <Image
                      src={form.icon}
                      alt="preview"
                      width={32}
                      height={32}
                      className="rounded-lg object-contain"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                    <span className="text-xs text-slate-400">Preview</span>
                  </div>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Short description..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/20"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-3">
                <div
                  onClick={() => setForm((f) => ({ ...f, isPopular: !f.isPopular }))}
                  className={`relative h-5 w-9 rounded-full transition-colors ${form.isPopular ? "bg-[#00663f]" : "bg-slate-200"}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.isPopular ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm font-medium text-slate-700">Mark as Popular</span>
              </label>
              {formError && <p className="text-xs text-red-600">{formError}</p>}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void handleSave()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00663f] py-2.5 text-sm font-semibold text-white hover:bg-[#004f31] disabled:opacity-60"
              >
                {saving && <FiLoader className="animate-spin" />}
                {editTarget ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fde8e8]">
                <FiTrash2 className="text-2xl text-[#d9534f]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Category?</h3>
                <p className="mt-0.5 text-sm text-slate-500">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-700">{deleteTarget.name}</span>?
                  This cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => void handleDelete()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#d9534f] py-2.5 text-sm font-semibold text-white hover:bg-[#c0392b] disabled:opacity-60"
              >
                {deleting ? <FiLoader className="animate-spin" /> : <FiTrash2 />}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
