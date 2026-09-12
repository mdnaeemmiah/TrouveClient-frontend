"use client";

import { useEffect, useState } from "react";
import { FiArchive, FiEye, FiLoader, FiRefreshCw, FiRotateCcw, FiX } from "react-icons/fi";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import { toast } from "sonner";

type TrashRecord = {
  _id: string;
  id?: string;
  recordType?: string;
  documentType?: string;
  modelName?: string;
  deletedAt?: string;
  expiresAt?: string;
  deletedBy?: string | { name?: string; email?: string };
  deletedByEmail?: string;
  entityType?: string;
  originalId?: string;
  data?: Record<string, unknown>;
  originalData?: Record<string, unknown>;
  snapshot?: Record<string, unknown>;
  [key: string]: unknown;
};

type TrashResponse = {
  data?: { items?: TrashRecord[]; records?: TrashRecord[]; meta?: { total?: number } } | TrashRecord[];
  items?: TrashRecord[];
  records?: TrashRecord[];
  meta?: { total?: number };
};

function parseTrash(payload: unknown) {
  if (Array.isArray(payload)) return payload as TrashRecord[];
  if (!payload || typeof payload !== "object") return [];
  const response = payload as TrashResponse;
  if (Array.isArray(response.data)) return response.data;
  if (response.data && typeof response.data === "object") return response.data.items || response.data.records || [];
  return response.items || response.records || [];
}

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function getSnapshot(record: TrashRecord) {
  return record.data || record.snapshot || record.originalData || {};
}

function getRecordImage(snapshot: Record<string, unknown>) {
  const attachments = snapshot.attachments;
  if (Array.isArray(attachments) && typeof attachments[0] === "string") {
    return attachments[0];
  }

  for (const key of ["logo", "icon", "coverImage", "image"]) {
    if (typeof snapshot[key] === "string" && snapshot[key]) {
      return snapshot[key] as string;
    }
  }

  return undefined;
}

function getRecordTitle(record: TrashRecord, snapshot: Record<string, unknown>) {
  return String(
    snapshot.name ||
      snapshot.title ||
      snapshot.comment ||
      record.entityType ||
      "Deleted record",
  );
}

function getRecordSubtitle(snapshot: Record<string, unknown>) {
  if (typeof snapshot.comment === "string") return snapshot.comment;
  if (typeof snapshot.description === "string") return snapshot.description;
  if (typeof snapshot.slug === "string") return snapshot.slug;
  return "Archived item";
}

export default function TrashArchive() {
  const [records, setRecords] = useState<TrashRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<TrashRecord | null>(null);
  const [recordToRestore, setRecordToRestore] = useState<TrashRecord | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const loadTrash = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await baseApi.get(ENDPOINTS.adminTrash);
      setRecords(parseTrash(response.data?.data ?? response.data));
    } catch (requestError: unknown) {
      const message = (requestError as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || "Unable to load trash archive.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTrash();
  }, []);

  const viewRecord = async (record: TrashRecord) => {
    try {
      const response = await baseApi.get(ENDPOINTS.trashDetails(record._id || record.id || ""));
      const payload = response.data?.data ?? response.data;
      setSelectedRecord((payload?.record ?? payload?.item ?? payload) as TrashRecord);
    } catch {
      toast.error("Unable to load trash record details.");
    }
  };

  const restoreRecord = async () => {
    if (!recordToRestore) return;
    setIsRestoring(true);
    try {
      await baseApi.post(ENDPOINTS.restoreTrash(recordToRestore._id || recordToRestore.id || ""));
      setRecords((current) => current.filter((record) => (record._id || record.id) !== (recordToRestore._id || recordToRestore.id)));
      setRecordToRestore(null);
      toast.success("Record restored successfully.");
    } catch {
      toast.error("Unable to restore this record.");
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trash Archive</h1>
          <p className="mt-1 text-sm text-slate-500">Review soft-deleted records retained for 30 days and restore them when needed.</p>
        </div>
        <button type="button" onClick={() => void loadTrash()} disabled={isLoading} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-[#00663f] hover:text-[#00663f] disabled:opacity-60"><FiRefreshCw className={isLoading ? "animate-spin" : ""} /> Refresh</button>
      </div>

      {isLoading ? <div className="flex justify-center rounded-2xl bg-white p-12 text-[#00663f]"><FiLoader className="animate-spin text-xl" /></div> : error ? <div className="rounded-2xl bg-red-50 p-5 text-sm text-red-700">{error}</div> : records.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500"><FiArchive className="mx-auto text-3xl text-slate-300" /><p className="mt-3">Trash archive is empty.</p></div> : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.06)]">
          <div className="border-b border-slate-100 bg-gradient-to-r from-[#f1faf5] to-white px-5 py-4">
            <p className="text-sm font-bold text-slate-900">Archived records</p>
            <p className="mt-1 text-xs text-slate-500">{records.length} deleted items available for review or restoration.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                  <th className="px-5 py-3">Record</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Deleted by</th>
                  <th className="px-5 py-3">Deleted</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const id = record._id || record.id || "";
                  const snapshot = getSnapshot(record);
                  const image = getRecordImage(snapshot);
                  const entity = record.entityType || record.recordType || record.documentType || record.modelName || "Record";
                  const title = getRecordTitle(record, snapshot);

                  return (
                    <tr key={id} className="border-b border-slate-50 transition-colors last:border-0 hover:bg-[#fbfefc]">
                      <td className="px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[#f1faf5]">
                            {image ? (
                              <img src={image} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <FiArchive className="text-xl text-[#00663f]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800">{title}</p>
                            <p className="mt-1 truncate text-xs text-slate-400">{getRecordSubtitle(snapshot)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#eaf6f0] px-2.5 py-1 text-[11px] font-bold text-[#00663f]">{entity}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{record.deletedByEmail || displayValue(record.deletedBy)}</td>
                      <td className="px-5 py-4 text-slate-500">{record.deletedAt ? new Date(record.deletedAt).toLocaleString() : "Not provided"}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => void viewRecord(record)} aria-label="View trash record" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"><FiEye /></button>
                          <button type="button" onClick={() => setRecordToRestore(record)} aria-label="Restore trash record" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e4f3ec] text-[#00663f] transition hover:bg-[#d5ebe0]"><FiRotateCcw /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedRecord && (() => { const snapshot = getSnapshot(selectedRecord); const template = snapshot.bookingTemplate as { templateName?: string; standardFields?: Record<string, string>; allowSpecialRequests?: boolean; allowOccasions?: boolean; allowNewsletterOptIn?: boolean } | undefined; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedRecord(null)}><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-[#00663f]">{selectedRecord.entityType || "Archived record"}</p><h2 className="mt-1 text-xl font-bold text-slate-900">{String(snapshot.name || snapshot.title || "Deleted record")}</h2></div><button type="button" onClick={() => setSelectedRecord(null)} aria-label="Close details"><FiX /></button></div>{typeof snapshot.icon === "string" && <img src={snapshot.icon} alt="Archived icon" className="mt-5 h-20 w-20 rounded-xl object-cover" />}<p className="mt-5 text-sm leading-6 text-slate-600">{String(snapshot.description || "No description provided.")}</p><div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Slug</p><p className="mt-1 text-sm text-slate-700">{String(snapshot.slug || "Not provided")}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Deleted by</p><p className="mt-1 text-sm text-slate-700">{selectedRecord.deletedByEmail || displayValue(selectedRecord.deletedBy)}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Deleted at</p><p className="mt-1 text-sm text-slate-700">{selectedRecord.deletedAt ? new Date(selectedRecord.deletedAt).toLocaleString() : "Not provided"}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Business count</p><p className="mt-1 text-sm text-slate-700">{String(snapshot.businessCount ?? 0)}</p></div></div>{template && <div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-sm font-bold text-slate-800">{template.templateName || "Booking template"}</p><p className="mt-2 text-xs text-slate-500">Special requests: {template.allowSpecialRequests ? "Allowed" : "Off"} · Occasions: {template.allowOccasions ? "Allowed" : "Off"} · Newsletter: {template.allowNewsletterOptIn ? "Allowed" : "Off"}</p></div>}</div></div>; })()}

      {recordToRestore && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !isRestoring && setRecordToRestore(null)}><div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}><h2 className="text-lg font-bold text-slate-900">Restore record?</h2><p className="mt-2 text-sm leading-6 text-slate-500">Are you sure you want to restore this deleted record to the active database?</p><div className="mt-6 flex justify-end gap-3"><button type="button" disabled={isRestoring} onClick={() => setRecordToRestore(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-50">Cancel</button><button type="button" disabled={isRestoring} onClick={() => void restoreRecord()} className="rounded-xl bg-[#00663f] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{isRestoring ? "Restoring..." : "Restore"}</button></div></div></div>}
    </div>
  );
}
