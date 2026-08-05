"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import type { IconType } from "react-icons";
import {
  FiAlertTriangle,
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDownload,
  FiFileText,
  FiFilter,
  FiFlag,
  FiUser,
} from "react-icons/fi";
import detailOneImage from "@/src/assets/details/img1.png";

type Status = "Pending" | "Critical" | "Low Priority";

type Report = {
  title: string;
  postId: string;
  postedAgo: string;
  tag: string;
  preview: "image" | "text" | "event";
  image?: StaticImageData;
  author: string;
  authorRole: string;
  reporter: string;
  reporterRole: string;
  reasonTag: string;
  reasonTagStyle: string;
  reason: string;
  status: Status;
};

const reports: Report[] = [
  {
    title: '"Check out our new artisanal loaves..."',
    postId: "#FEED-88219",
    postedAgo: "Posted 2h ago",
    tag: "BUSINESS POST",
    preview: "image",
    image: detailOneImage,
    author: "Le Boulangerie Paris",
    authorRole: "Author",
    reporter: "Marc_Dupont88",
    reporterRole: "Reporter (Rank: Trusted)",
    reasonTag: "INAPPROPRIATE",
    reasonTagStyle: "bg-[#fbe2e2] text-[#c0524d]",
    reason: '"Image contains hidden text that violates community standards..."',
    status: "Pending",
  },
  {
    title: '"FREE CRYPTO FOR ALL BUSINESS OWNERS..."',
    postId: "#FEED-90112",
    postedAgo: "Posted 5h ago",
    tag: "TEXT ONLY",
    preview: "text",
    author: "Bot_User_992",
    authorRole: "Author",
    reporter: "System_Auto_Mod",
    reporterRole: "Reporter (AI Guard)",
    reasonTag: "SPAM",
    reasonTagStyle: "bg-slate-100 text-slate-500",
    reason: '"Repeated keywords and external phishing links detected."',
    status: "Critical",
  },
  {
    title: '"Tech Meetup in Lyon - Join us!"',
    postId: "#FEED-77510",
    postedAgo: "Posted 1d ago",
    tag: "EVENT POST",
    preview: "event",
    author: "LyonTech Hub",
    authorRole: "Author",
    reporter: "Alice_Vidal",
    reporterRole: "Reporter (New User)",
    reasonTag: "MISCATEGORIZED",
    reasonTagStyle: "bg-slate-100 text-slate-500",
    reason: '"This belongs in Events, not General Feed."',
    status: "Low Priority",
  },
];

const statusStyles: Record<Status, { dot: string; text: string }> = {
  Pending: { dot: "bg-slate-800", text: "text-slate-800" },
  Critical: { dot: "bg-[#c0524d]", text: "text-[#c0524d]" },
  "Low Priority": { dot: "bg-slate-300", text: "text-slate-600" },
};

const stats: { label: string; value: string; icon: IconType; iconBg: string; iconColor: string }[] = [
  { label: "Awaiting Review", value: "142", icon: FiClock, iconBg: "bg-[#fbe2e2]", iconColor: "text-[#c0524d]" },
  { label: "Resolved Today", value: "58", icon: FiCheckCircle, iconBg: "bg-[#e4f3ec]", iconColor: "text-[#00663f]" },
  { label: "Avg. Response", value: "1.2h", icon: FiClock, iconBg: "bg-slate-100", iconColor: "text-slate-500" },
  { label: "Priority Issues", value: "09", icon: FiAlertTriangle, iconBg: "bg-[#fdf1e2]", iconColor: "text-[#b17a3a]" },
];

const totalReports = 142;
const totalPages = 15;

export default function Moderations() {
  const [page, setPage] = useState(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Post Moderation Queue</h1>
          <p className="mt-1 text-sm text-slate-500">Review flagged community content for violations of service terms.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <FiFilter className="text-[14px]" />
            Filter
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <FiDownload className="text-[14px]" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${stat.iconBg}`}>
                <Icon className={`text-[18px] ${stat.iconColor}`} />
              </span>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-sm font-semibold text-slate-600">
                <th className="px-5 py-3">Post Preview</th>
                <th className="px-5 py-3">Author / Reporter</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.postId} className="border-b border-slate-50 align-top last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex gap-3">
                      {report.preview === "image" && report.image && (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                          <Image src={report.image} alt={report.title} fill className="object-cover" />
                        </div>
                      )}
                      {report.preview === "text" && (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <FiFileText className="text-[22px]" />
                        </div>
                      )}
                      {report.preview === "event" && (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#e4f3ec] text-[#00663f]">
                          <FiCalendar className="text-[22px]" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">{report.title}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          Post ID: {report.postId} · {report.postedAgo}
                        </p>
                        <span className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          {report.tag}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-1.5">
                        <FiUser className="mt-0.5 text-[13px] text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-800">{report.author}</p>
                          <p className="text-xs text-slate-400">{report.authorRole}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <FiFlag className="mt-0.5 text-[13px] text-[#c0524d]" />
                        <div>
                          <p className="text-sm font-medium text-[#c0524d]">{report.reporter}</p>
                          <p className="text-xs text-slate-400">{report.reporterRole}</p>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${report.reasonTagStyle}`}>
                      {report.reasonTag}
                    </span>
                    <p className="mt-2 max-w-[220px] text-sm text-slate-500">{report.reason}</p>
                  </td>

                  <td className="px-5 py-4">
                    <span className={`flex items-center gap-1.5 text-sm font-semibold ${statusStyles[report.status].text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${statusStyles[report.status].dot}`} />
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
          <p className="text-sm text-slate-400">
            Showing 1 to {reports.length} of {totalReports} reports
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
            >
              <FiChevronLeft className="text-[14px]" />
            </button>

            {[1, 2, 3].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPage(num)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === num ? "bg-[#00663f] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {num}
              </button>
            ))}

            <span className="px-1 text-sm text-slate-400">...</span>

            <button
              type="button"
              onClick={() => setPage(totalPages)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                page === totalPages ? "bg-[#00663f] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {totalPages}
            </button>

            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
            >
              <FiChevronRight className="text-[14px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
