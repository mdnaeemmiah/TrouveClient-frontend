"use client";

import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiBriefcase, FiCheck, FiClipboard, FiRotateCcw, FiZap } from "react-icons/fi";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type Platform = "Facebook" | "Instagram" | "LinkedIn";

const platforms: { label: Platform; icon: IconType }[] = [
  { label: "Facebook", icon: FaFacebookF },
  { label: "Instagram", icon: FaInstagram },
  { label: "LinkedIn", icon: FaLinkedinIn },
];

function getPlatformIcon(platformName: string): IconType {
  const p = (platformName || "").toLowerCase();
  if (p.includes("instagram")) return FaInstagram;
  if (p.includes("linkedin")) return FiBriefcase;
  if (p.includes("face")) return FaFacebookF;
  return FiZap;
}

type MarketingHistoryItem = {
  _id?: string;
  businessId?: string;
  ownerId?: string;
  platform: string;
  prompt?: string;
  post_or_instruction?: string;
  title?: string;
  generatedText?: string;
  post?: string;
  hashtags?: string[];
  createdAt?: string;
  relativeTime?: string;
};

// Helper to safely extract clean post text from generatedText (which might be a JSON string)
function extractPostText(item: MarketingHistoryItem): string {
  if (item.post) return item.post;

  if (item.generatedText) {
    try {
      const parsed = JSON.parse(item.generatedText);
      if (parsed && typeof parsed === "object") {
        if (parsed.post) return parsed.post;
        if (parsed.result) return parsed.result;
      }
    } catch {
      // not a JSON string, return plain text
    }
    return item.generatedText;
  }

  return item.prompt || item.post_or_instruction || "";
}

// Helper to extract business name from parsed item
function extractBusinessName(item: MarketingHistoryItem): string | undefined {
  if (item.generatedText) {
    try {
      const parsed = JSON.parse(item.generatedText);
      if (parsed && typeof parsed === "object" && parsed.business_name) {
        return parsed.business_name;
      }
    } catch {
      // ignore
    }
  }
  return undefined;
}

export default function AiMarketing() {
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [instruction, setInstruction] = useState("");
  const [businessId, setBusinessId] = useState<string>("");
  const [generatedResult, setGeneratedResult] = useState<{
    business_name?: string;
    platform?: string;
    post?: string;
  } | null>(null);

  const [history, setHistory] = useState<MarketingHistoryItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [copied, setCopied] = useState(false);

  // Fetch business profile to get businessId
  useEffect(() => {
    baseApi
      .get(ENDPOINTS.getMyProfileBusinesses)
      .then((res) => {
        const payload = res.data?.data ?? res.data;
        const profile = Array.isArray(payload) ? payload[0] : payload?.business ?? payload;
        if (profile?._id || profile?.id) {
          setBusinessId(profile._id || profile.id);
        }
      })
      .catch(() => {
        // ignore
      });
  }, []);

  // Fetch marketing history
  const loadHistory = () => {
    setIsLoadingHistory(true);
    baseApi
      .get<{ data: MarketingHistoryItem[] }>(ENDPOINTS.marketingHistory)
      .then((res) => {
        const list = res.data?.data ?? (Array.isArray(res.data) ? (res.data as MarketingHistoryItem[]) : []);
        setHistory(list);
      })
      .catch(() => {
        // history fetch failed gracefully
      })
      .finally(() => {
        setIsLoadingHistory(false);
      });
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleGenerate = async () => {
    if (!instruction.trim()) {
      toast.error("Please enter what you want the AI to write.");
      return;
    }

    setIsGenerating(true);
    try {
      const payload: {
        businessId?: string;
        platform: string;
        post_or_instruction: string;
      } = {
        platform,
        post_or_instruction: instruction.trim(),
      };

      if (businessId) {
        payload.businessId = businessId;
      }

      const res = await baseApi.post(ENDPOINTS.aiMarketing, payload);
      const data = res.data?.data ?? res.data;

      let postContent = "";
      let bizName = data?.business_name;

      if (data?.post) {
        postContent = data.post;
      } else if (data?.generatedText) {
        try {
          const parsed = JSON.parse(data.generatedText);
          postContent = parsed.post || parsed.result || data.generatedText;
          if (parsed.business_name) bizName = parsed.business_name;
        } catch {
          postContent = data.generatedText;
        }
      } else if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          postContent = parsed.post || parsed.result || data;
          if (parsed.business_name) bizName = parsed.business_name;
        } catch {
          postContent = data;
        }
      }

      const postResult = {
        business_name: bizName,
        platform: data?.platform || platform,
        post: postContent,
      };

      setGeneratedResult(postResult);
      toast.success("Content generated successfully!");
      loadHistory();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message ||
        "Failed to generate content. Please try again.";
      toast.error(Array.isArray(message) ? message.join(" ") : message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Marketing Assistant</h1>
        <p className="mt-1 text-sm text-slate-500">
          Generate ready-to-post social content tailored to your business.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Create New Content</h2>
          <p className="mt-1 text-sm text-slate-500">Describe what you need and select your target platform.</p>

          <p className="mt-5 text-sm font-semibold text-slate-700">Select Platform</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {platforms.map((item) => {
              const Icon = item.icon;
              const active = platform === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setPlatform(item.label)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-[#00663f] bg-[#00663f] text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="text-[13px]" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <p className="mt-5 text-sm font-semibold text-slate-700">Your Requirement</p>
          <textarea
            rows={5}
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g., Write a post announcing our new weekend brunch menu with 15% off!"
            className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#00663f]"
          />

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00663f] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#004f31] disabled:opacity-60"
          >
            <FiZap className="text-[15px]" />
            {isGenerating ? "Generating Content..." : "Generate Content"}
          </button>
        </div>

        {/* Output Preview */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {generatedResult?.platform ?? platform}
              </span>
              <span className="text-sm font-medium text-[#00663f]">
                {generatedResult ? "Ready to use" : "Waiting for prompt"}
              </span>
            </div>
            {generatedResult?.post && (
              <button
                type="button"
                onClick={() => handleCopy(generatedResult.post || "")}
                className="flex items-center gap-2 rounded-full border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                {copied ? <FiCheck className="text-[13px] text-[#00663f]" /> : <FiClipboard className="text-[13px]" />}
                {copied ? "Copied!" : "Copy to Clipboard"}
              </button>
            )}
          </div>

          {generatedResult?.post ? (
            <div className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
              {generatedResult.post}
            </div>
          ) : (
            <div className="mt-4 flex min-h-[170px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 p-6 text-center text-slate-400">
              <p className="text-sm">No content generated yet.</p>
              <p className="mt-1 text-xs text-slate-400">
                Type your requirement on the left and click &ldquo;Generate Content&rdquo; or select a post from history.
              </p>
            </div>
          )}

          {generatedResult?.post && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 p-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00663f]" />
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Pro-tip:</span> You can copy and edit the generated caption before sharing on {generatedResult?.platform ?? platform}.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History section */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Past Generations</h2>
          <button
            type="button"
            onClick={loadHistory}
            className="text-xs font-semibold text-[#00663f] hover:underline"
          >
            Refresh
          </button>
        </div>

        {isLoadingHistory ? (
          <div className="mt-4 rounded-2xl bg-white p-8 text-center text-sm text-slate-400">
            Loading past generations...
          </div>
        ) : history.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-white p-8 text-center text-sm text-slate-400">
            No marketing content generated yet. Create your first post above!
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((item, idx) => {
              const Icon = getPlatformIcon(item.platform || "Instagram");
              const postContent = extractPostText(item);
              const bizName = extractBusinessName(item);
              const titleDisplay = item.title || `${item.platform} Post`;
              const timeDisplay =
                item.relativeTime ||
                (item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })
                  : "RECENT");

              return (
                <div key={item._id || idx} className="flex flex-col justify-between rounded-2xl bg-white p-4 shadow-sm">
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e4f3ec] text-[#00663f]">
                        <Icon className="text-[15px]" />
                      </span>
                      <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        {timeDisplay}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-800 line-clamp-1">
                      {titleDisplay}
                    </p>
                    <p className="mt-1 line-clamp-4 whitespace-pre-wrap text-xs text-slate-600">
                      &ldquo;{postContent}&rdquo;
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setGeneratedResult({
                          business_name: bizName,
                          platform: item.platform,
                          post: postContent,
                        });
                        if (
                          item.platform === "Facebook" ||
                          item.platform === "LinkedIn" ||
                          item.platform === "Instagram"
                        ) {
                          setPlatform(item.platform as Platform);
                        }
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#00663f] hover:underline"
                    >
                      <FiRotateCcw className="text-[12px]" />
                      View / Re-use
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(postContent)}
                      className="text-xs font-medium text-slate-400 hover:text-slate-600"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}