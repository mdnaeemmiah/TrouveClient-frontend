"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCamera, FiCheckCircle, FiClock, FiImage, FiLoader, FiX } from "react-icons/fi";
import CustomSelect from "@/src/components/ui/CustomSelect";
import { useOnboarding } from "@/src/context/OnboardingContext";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type MyRequest = {
  _id: string;
  requestedName?: string;
  name?: string;
  description?: string;
  status?: string;
  createdAt?: string;
};

function extractList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  for (const key of ["data", "result", "items", "list"]) {
    if (Array.isArray(d[key])) return d[key] as T[];
  }
  if (d.data && typeof d.data === "object") {
    const inner = d.data as Record<string, unknown>;
    for (const key of ["items", "result", "list", "data"]) {
      if (Array.isArray(inner[key])) return inner[key] as T[];
    }
  }
  return [];
}

export default function  Grow() {
  const { formData, updateFormData, categories, isCategoriesLoading, saveDraft } = useOnboarding();
  const inputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const options = categories;

  // Category request state
  const [showRequestBox, setShowRequestBox] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [requestDesc, setRequestDesc] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState("");

  // My requests state
  const [myRequests, setMyRequests] = useState<MyRequest[]>([]);
  const [reqsLoading, setReqsLoading] = useState(false);

  const uploadLogo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" && updateFormData({ logo: reader.result });
    reader.readAsDataURL(file);
  };

  const uploadCover = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" && updateFormData({ coverImage: reader.result });
    reader.readAsDataURL(file);
  };

  const loadMyRequests = async () => {
    setReqsLoading(true);
    try {
      const res = await baseApi.get(ENDPOINTS.requestCategory);
      const list = extractList<MyRequest>(res.data);
      setMyRequests(list);
      // prefill the input with the last requested name if field is empty
      if (list.length > 0 && !requestName) {
        const last = list[0];
        setRequestName(last.requestedName ?? last.name ?? "");
      }
    } catch {
      // silently ignore
    } finally {
      setReqsLoading(false);
    }
  };

  useEffect(() => {
    if (showRequestBox) void loadMyRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRequestBox]);

  const submitCategoryRequest = async () => {
    if (!requestName.trim()) {
      setRequestError("Category name is required.");
      return;
    }
    setRequesting(true);
    setRequestError("");
    try {
      await baseApi.post(ENDPOINTS.careteRequestCategory, {
        requestedName: requestName.trim(),
        description: requestDesc.trim() || undefined,
      });
      setRequestSuccess(true);
      // keep the values so user can see what they submitted
      // refresh the list
      void loadMyRequests();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setRequestError(msg || "Failed to submit request. Please try again.");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(28,73,53,0.08)] sm:p-7">
      <div className="border-b border-slate-100 pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00663f]">Step 1 of 6</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Basic information</h2>
        <p className="mt-1 text-sm text-slate-600">Tell customers what makes your business worth discovering.</p>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Business name *
          <input
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal text-slate-900 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-4 focus:ring-[#00663f]/10"
            placeholder="Le Bistrot Parisien"
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Category *
            <CustomSelect
              value={formData.categoryId}
              disabled={isCategoriesLoading}
              placeholder={isCategoriesLoading ? "Loading categories..." : "Select a category"}
              options={options.map((cat) => ({ value: cat._id, label: cat.name }))}
              onChange={(val) => {
                const category = options.find((item) => item._id === val);
                updateFormData({ categoryId: val, categoryName: category?.name || "" });
              }}
              className="mt-1.5"
            />
          </label>

          {/* Request link */}
          {!showRequestBox && (
            <button
              type="button"
              onClick={() => { setShowRequestBox(true); setRequestSuccess(false); setRequestError(""); }}
              className="self-start text-xs font-medium text-[#00663f] underline underline-offset-2 hover:text-[#004f31]"
            >
              Can&apos;t find your category? Request it
            </button>
          )}
        </div>
      </div>

      {/* ── Category Request Box ── */}
      {showRequestBox && (
        <div className="mt-4 rounded-xl border border-[#00663f]/20 bg-[#f0faf5] p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#00663f]">Request a new category</p>
            <button
              type="button"
              onClick={() => { setShowRequestBox(false); setRequestSuccess(false); setRequestError(""); }}
              className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            >
              <FiX className="text-xs" />
            </button>
          </div>

          {requestSuccess ? (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-[#00663f]">
                <FiCheckCircle className="text-base" />
                Request submitted! Admin will review it shortly.
              </div>
              <button
                type="button"
                onClick={() => { setRequestSuccess(false); setRequestName(""); setRequestDesc(""); }}
                className="text-xs font-medium text-slate-500 underline underline-offset-2 hover:text-slate-700"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Category name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={requestName}
                  onChange={(e) => setRequestName(e.target.value)}
                  placeholder="e.g. Solar Panel Installers"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Description <span className="text-slate-400">(optional)</span>
                </label>
                <textarea
                  value={requestDesc}
                  onChange={(e) => setRequestDesc(e.target.value)}
                  placeholder="Briefly describe what this category covers..."
                  rows={2}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#00663f] focus:ring-2 focus:ring-[#00663f]/20"
                />
              </div>
              {requestError && <p className="text-xs text-red-600">{requestError}</p>}
              <button
                type="button"
                disabled={requesting}
                onClick={() => void submitCategoryRequest()}
                className="flex items-center gap-2 rounded-lg bg-[#00663f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004f31] disabled:opacity-60"
              >
                {requesting && <FiLoader className="animate-spin text-xs" />}
                Submit Request
              </button>
            </div>
          )}

          {/* ── My previous requests ── */}
          {reqsLoading ? (
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <FiLoader className="animate-spin" /> Loading your requests...
            </div>
          ) : myRequests.length > 0 ? (
            <div className="mt-4 border-t border-[#00663f]/10 pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Your previous requests</p>
              <ul className="space-y-2">
                {myRequests.map((req) => {
                  const statusUpper = String(req.status ?? "PENDING").toUpperCase();
                  return (
                    <li key={req._id} className="flex items-start justify-between gap-3 rounded-lg bg-white px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {req.requestedName ?? req.name ?? "—"}
                        </p>
                        {req.description && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{req.description}</p>
                        )}
                        {req.createdAt && (
                          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                            <FiClock className="shrink-0" />
                            {new Date(req.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </p>
                        )}
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        statusUpper === "APPROVED"
                          ? "bg-[#e4f3ec] text-[#00663f]"
                          : statusUpper === "REJECTED"
                          ? "bg-[#fbeceb] text-[#c0524d]"
                          : "bg-[#fff4dc] text-[#b17a3a]"
                      }`}>
                        {statusUpper}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      <label className="mt-5 block text-sm font-semibold text-slate-700">
        Description *
        <textarea
          value={formData.description}
          maxLength={250}
          onChange={(e) => updateFormData({ description: e.target.value })}
          rows={4}
          className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-normal text-slate-900 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-4 focus:ring-[#00663f]/10"
          placeholder="Tell customers what makes your business unique..."
        />
        <span className="block text-right text-xs font-normal text-slate-400">{formData.description.length} / 250</span>
      </label>

      <input ref={inputRef} type="file" accept="image/*" onChange={uploadLogo} className="hidden" />
      <button type="button" onClick={() => inputRef.current?.click()} className="mt-5 flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-8 text-sm text-slate-500">
        <FiCamera className="text-xl" />
        {formData.logo ? (
          <>
            <Image src={formData.logo} alt="Logo preview" width={80} height={80} unoptimized className="rounded-lg object-cover" />
            <span>Replace image</span>
            <span onClick={(e) => { e.stopPropagation(); updateFormData({ logo: "" }); }}><FiX /></span>
          </>
        ) : "Click to upload a logo"}
      </button>

      <input ref={coverInputRef} type="file" accept="image/*" onChange={uploadCover} className="hidden" />
      <button type="button" onClick={() => coverInputRef.current?.click()} className="mt-4 flex min-h-28 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
        {formData.coverImage
          ? <Image src={formData.coverImage} alt="Cover preview" width={640} height={180} unoptimized className="h-36 w-full object-cover" />
          : <span className="flex items-center gap-2"><FiImage />Upload cover photo</span>}
      </button>

      <div className="mt-6 flex justify-between border-t border-slate-100 pt-5">
        <button type="button" onClick={saveDraft} className="text-sm font-semibold text-slate-500">Save Draft</button>
        <Link href="/onboarding/contact" className="flex items-center gap-2 rounded-xl bg-[#00663f] px-5 py-2.5 text-sm font-semibold text-white">
          Next Step <FiArrowRight />
        </Link>
      </div>
    </div>
  );
}
