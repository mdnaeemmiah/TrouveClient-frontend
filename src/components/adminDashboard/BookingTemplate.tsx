"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiChevronDown, FiLoader, FiSearch, FiX } from "react-icons/fi";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type Category = {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
};

type TemplateConfig = {
  templateName: string;
  standardFields?: Record<string, "REQUIRED" | "OPTIONAL" | "HIDDEN" | string>;
  customFields?: { fieldName: string; isRequired?: boolean }[];
  allowSpecialRequests: boolean;
  allowOccasions: boolean;
  allowNewsletterOptIn: boolean;
};

type TemplateStatus = {
  slug: string;
  name: string;
  loading: boolean;
  config: TemplateConfig | null;
  error: string | null;
};

export default function BookingTemplate() {
  const [templates, setTemplates] = useState<TemplateStatus[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  // Load categories first, then load their booking templates
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoadingCategories(true);
      try {
        // Fetch all categories
        const categoriesResponse = await baseApi.get(ENDPOINTS.categories);
        const categoriesData = categoriesResponse.data?.data ?? categoriesResponse.data;
        const categories = Array.isArray(categoriesData)
          ? categoriesData
          : (categoriesData as { categories?: Category[] })?.categories || [];

        if (categories.length === 0) {
          toast.error("No categories found");
          setIsLoadingCategories(false);
          return;
        }

        // Initialize templates with categories
        const statuses: TemplateStatus[] = categories.map((cat: Category) => ({
          slug: cat.slug,
          name: cat.name,
          loading: true,
          config: null,
          error: null,
        }));
        setTemplates(statuses);
        setSelectedSlug(statuses[0]?.slug || "");

        // Load booking template for each category
        for (const category of categories) {
          try {
            const response = await baseApi.get(ENDPOINTS.getBookingTemplete(category.slug));
            const data = response.data?.data ?? response.data;

            setTemplates((prev) =>
              prev.map((t) =>
                t.slug === category.slug
                  ? {
                      ...t,
                      loading: false,
                      config: data,
                      error: null,
                    }
                  : t
              )
            );
          } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
            // Initialize with default config if not found
            setTemplates((prev) =>
              prev.map((t) =>
                t.slug === category.slug
                  ? {
                      ...t,
                      loading: false,
                      config: {
                        templateName: category.name,
                        allowSpecialRequests: false,
                        allowOccasions: false,
                        allowNewsletterOptIn: false,
                      },
                      error: null, // Don't show error, just use defaults
                    }
                  : t
              )
            );
          }
        }
      } catch (err: unknown) {
        const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
        toast.error(message || "Failed to load categories");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadTemplates();
  }, []);

  const updateTemplate = async (slug: string) => {
    const template = templates.find((t) => t.slug === slug);
    if (!template?.config) return;

    setSavingSlug(slug);
    try {
      await baseApi.post(ENDPOINTS.createBookingTemplete(slug), {
        templateName: template.config.templateName,
        allowSpecialRequests: template.config.allowSpecialRequests,
        allowOccasions: template.config.allowOccasions,
        allowNewsletterOptIn: template.config.allowNewsletterOptIn,
      });

      setTemplates((prev) =>
        prev.map((t) =>
          t.slug === slug
            ? {
                ...t,
                error: null,
              }
            : t
        )
      );
      toast.success(`${template.config.templateName} updated successfully.`);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setTemplates((prev) =>
        prev.map((t) =>
          t.slug === slug
            ? {
                ...t,
                error: message || "Failed to update template",
              }
            : t
        )
      );
      toast.error(message || "Failed to update template");
    } finally {
      setSavingSlug(null);
    }
  };

  const toggleOption = (slug: string, option: "allowSpecialRequests" | "allowOccasions" | "allowNewsletterOptIn") => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.slug === slug && t.config
          ? {
              ...t,
              config: {
                ...t.config,
                [option]: !t.config[option],
              },
            }
          : t
      )
    );
  };

  const matchingTemplates = templates.filter((template) => {
    const search = categorySearch.trim().toLowerCase();
    return !search || template.name.toLowerCase().includes(search) || template.slug.toLowerCase().includes(search);
  });

  const selectedTemplate = templates.find((template) => template.slug === selectedSlug) || matchingTemplates[0];

  if (isLoadingCategories) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-slate-500">
        <FiLoader className="animate-spin" size={20} />
        <span className="text-sm">Loading categories...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Booking Templates</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage booking templates for different business categories.
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          No categories found.
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#dcebe3] bg-white p-5 shadow-[0_8px_25px_rgba(0,102,63,0.06)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <label className="min-w-0 flex-1">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Search category</span>
                <div className="relative mt-2">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input
                    type="search"
                    value={categorySearch}
                    onChange={(event) => setCategorySearch(event.target.value)}
                    placeholder="Search by category name or slug..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
                  />
                </div>
              </label>
              <label className="w-full lg:max-w-sm">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Choose category</span>
                <div className="relative mt-2">
                  <select
                    value={selectedTemplate?.slug || ""}
                    onChange={(event) => setSelectedSlug(event.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#00663f] focus:bg-white focus:ring-2 focus:ring-[#00663f]/10"
                  >
                    {matchingTemplates.map((template) => (
                      <option key={template.slug} value={template.slug}>{template.name}</option>
                    ))}
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#00663f]" size={17} />
                </div>
              </label>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {matchingTemplates.length} categor{matchingTemplates.length === 1 ? "y" : "ies"} found. Select one to view its complete booking setup.
            </p>
          </div>

          {selectedTemplate ? (
            <div key={selectedTemplate.slug} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_25px_rgba(15,23,42,0.05)]">
              {(() => {
                const template = selectedTemplate;
                return <>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e4f3ec] text-lg font-bold text-[#00663f]">{template.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{template.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Category slug: <span className="font-medium text-slate-700">{template.slug}</span>
                  </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {template.error && (
                    <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600">
                      <FiX size={14} /> Error
                    </span>
                  )}
                  {!template.error && template.config && (
                    <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600">
                      <FiCheck size={14} /> Saved
                    </span>
                  )}
                </div>
              </div>

              {template.loading ? (
                <div className="mt-4 flex items-center justify-center gap-2 py-6 text-slate-500">
                  <FiLoader className="animate-spin" size={18} />
                  <span className="text-sm">Loading template...</span>
                </div>
              ) : template.config ? (
                <>
                  <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <h3 className="text-sm font-bold text-slate-900">Standard fields</h3>
                      <div className="mt-3 space-y-2">
                        {Object.entries(template.config.standardFields || {}).map(([field, status]) => (
                          <div key={field} className="flex items-center justify-between rounded-lg bg-white px-3 py-2.5">
                            <span className="text-sm font-medium capitalize text-slate-700">{field.replace(/([A-Z])/g, " $1")}</span>
                            <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${status === "REQUIRED" ? "bg-amber-50 text-amber-700" : status === "HIDDEN" ? "bg-slate-100 text-slate-500" : "bg-[#eaf6f0] text-[#00663f]"}`}>{status}</span>
                          </div>
                        ))}
                        {Object.keys(template.config.standardFields || {}).length === 0 && <p className="text-xs text-slate-500">No standard fields configured.</p>}
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <h3 className="text-sm font-bold text-slate-900">Custom fields</h3>
                      <div className="mt-3 space-y-2">
                        {(template.config.customFields || []).map((field) => (
                          <div key={field.fieldName} className="flex items-center justify-between rounded-lg bg-white px-3 py-2.5">
                            <span className="text-sm font-medium text-slate-700">{field.fieldName}</span>
                            <span className="rounded-full bg-[#eaf6f0] px-2 py-1 text-[10px] font-bold text-[#00663f]">{field.isRequired ? "REQUIRED" : "OPTIONAL"}</span>
                          </div>
                        ))}
                        {(template.config.customFields || []).length === 0 && <p className="text-xs text-slate-500">No custom fields configured.</p>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                      <label className="text-sm font-medium text-slate-700">Allow Special Requests</label>
                      <button
                        type="button"
                        onClick={() => toggleOption(template.slug, "allowSpecialRequests")}
                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                          template.config.allowSpecialRequests ? "bg-[#00663f]" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            template.config.allowSpecialRequests ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                      <label className="text-sm font-medium text-slate-700">Allow Occasions</label>
                      <button
                        type="button"
                        onClick={() => toggleOption(template.slug, "allowOccasions")}
                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                          template.config.allowOccasions ? "bg-[#00663f]" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            template.config.allowOccasions ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                      <label className="text-sm font-medium text-slate-700">Allow Newsletter Opt-In</label>
                      <button
                        type="button"
                        onClick={() => toggleOption(template.slug, "allowNewsletterOptIn")}
                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                          template.config.allowNewsletterOptIn ? "bg-[#00663f]" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            template.config.allowNewsletterOptIn ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      disabled={savingSlug === template.slug}
                      onClick={() => void updateTemplate(template.slug)}
                      className="flex items-center gap-2 rounded-xl bg-[#00663f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#004f31] disabled:opacity-60"
                    >
                      {savingSlug === template.slug && <FiLoader className="animate-spin" />}
                      Save Template
                    </button>
                  </div>
                </>
              ) : null}
                </>;
              })()}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No matching category found.</div>
          )}
        </div>
      )}
    </div>
  );
}
