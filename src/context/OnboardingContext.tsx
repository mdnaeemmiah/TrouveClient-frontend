"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import { useAuth } from "@/src/context/AuthContext";

export interface ContactInfo {
  phone: string;
  email: string;
  website: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  x?: string;
  customLinks?: Array<{ platformName: string; url: string }>;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  postalCode: string;
}

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface BookingConfig {
  isEnabled: boolean;
  showModalImage: boolean;
  templateType: string;
  standardFields: {
    fullName: "REQUIRED" | "OPTIONAL" | "HIDDEN";
    email: "REQUIRED" | "OPTIONAL" | "HIDDEN";
    phone: "REQUIRED" | "OPTIONAL" | "HIDDEN";
    guestCount: "REQUIRED" | "OPTIONAL" | "HIDDEN";
  };
  allowSpecialRequests: boolean;
  allowOccasions: boolean;
  allowNewsletterOptIn: boolean;
  customFields: Array<{
    fieldName: string;
    placeholder?: string;
    isRequired: boolean;
  }>;
}

export interface OnboardingCategory {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface OnboardingFormData {
  name: string;
  categoryId: string;
  categoryName: string;
  description: string;
  logo: string;
  coverImage: string;
  bookingModalImage: string;
  gallery: string[];
  contactInfo: ContactInfo;
  socialLinks: SocialLinks;
  location: LocationData;
  services: string[];
  openingHours: OpeningHour[];
  bookingConfig: BookingConfig;
}

const DEFAULT_OPENING_HOURS: OpeningHour[] = [
  { day: "Monday", open: "09:00", close: "18:00", isClosed: false },
  { day: "Tuesday", open: "09:00", close: "18:00", isClosed: false },
  { day: "Wednesday", open: "09:00", close: "18:00", isClosed: false },
  { day: "Thursday", open: "09:00", close: "18:00", isClosed: false },
  { day: "Friday", open: "09:00", close: "18:00", isClosed: false },
  { day: "Saturday", open: "10:00", close: "14:00", isClosed: false },
  { day: "Sunday", open: "00:00", close: "00:00", isClosed: true },
];

const DEFAULT_BOOKING_CONFIG: BookingConfig = {
  isEnabled: true,
  showModalImage: true,
  templateType: "General Template",
  standardFields: {
    fullName: "REQUIRED",
    email: "REQUIRED",
    phone: "OPTIONAL",
    guestCount: "OPTIONAL",
  },
  allowSpecialRequests: true,
  allowOccasions: false,
  allowNewsletterOptIn: true,
  customFields: [
    { fieldName: "Service Type", isRequired: true },
    { fieldName: "Urgency Level", isRequired: false },
  ],
};

const INITIAL_FORM_DATA: OnboardingFormData = {
  name: "",
  categoryId: "",
  categoryName: "",
  description: "",
  logo: "",
  coverImage: "",
  bookingModalImage: "",
  gallery: [],
  contactInfo: {
    phone: "",
    email: "",
    website: "",
  },
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    x: "",
    customLinks: [],
  },
  location: {
    latitude: 48.8566,
    longitude: 2.3522,
    address: "",
    city: "",
    postalCode: "",
  },
  services: ["Private Dining Room", "Outdoor Seating"],
  openingHours: DEFAULT_OPENING_HOURS,
  bookingConfig: DEFAULT_BOOKING_CONFIG,
};

const DRAFT_STORAGE_KEY = "onboarding_draft";
const BUSINESS_SUBMISSION_KEY = "business_submission";
const BACKEND_RESTAURANT_CATEGORY_ID = "6a9ea5ddb4170e3c31ade4bf";

const MAX_UPLOAD_FILE_BYTES = 500 * 1024;

function getBusinessSubmissionKey() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return `${BUSINESS_SUBMISSION_KEY}:${user?.email || "guest"}`;
  } catch {
    return `${BUSINESS_SUBMISSION_KEY}:guest`;
  }
}

function getDraftKey(email?: string | null) {
  return `${DRAFT_STORAGE_KEY}:${email || "guest"}`;
}

function normalizeCustomFields(fields: unknown): BookingConfig["customFields"] {
  if (!Array.isArray(fields)) return DEFAULT_BOOKING_CONFIG.customFields;
  return fields.map((field) => {
    const item = field as Record<string, unknown>;
    return {
      fieldName: String(item.fieldName || item.name || "").trim(),
      isRequired: typeof item.isRequired === "boolean" ? item.isRequired : Boolean(item.required),
      ...(item.placeholder ? { placeholder: String(item.placeholder) } : {}),
    };
  }).filter((field) => field.fieldName.length > 0);
}

async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File | null> {
  if (!dataUrl.startsWith("data:")) return null;

  const image = new Image();
  image.src = dataUrl;
  await image.decode();

  const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.72),
  );
  if (!blob) return null;
  if (blob.size > MAX_UPLOAD_FILE_BYTES) return null;
  return new File([blob], fileName, { type: "image/jpeg" });
}

async function uploadImage(dataUrl: string, fileName: string, folder: string): Promise<string> {
  const file = await dataUrlToFile(dataUrl, fileName);
  if (!file) throw new Error(`${fileName} is missing or larger than 500 KB.`);

  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append("folder", folder);
  const response = await baseApi.post(ENDPOINTS.storageUpload, uploadData);
  const url =
    response.data?.data?.url ||
    response.data?.data?.result?.url ||
    response.data?.url ||
    response.data?.result?.url;
  if (typeof url !== "string" || !url) throw new Error(`Upload failed for ${fileName}.`);
  return url;
}

interface OnboardingContextValue {
  formData: OnboardingFormData;
  updateFormData: (patch: Partial<OnboardingFormData>) => void;
  categories: OnboardingCategory[];
  isCategoriesLoading: boolean;
  saveDraft: () => void;
  submitBusiness: () => Promise<void>;
  isSubmitting: boolean;
  resetForm: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading: isAuthLoading } = useAuth();
  const [formData, setFormData] = useState<OnboardingFormData>(INITIAL_FORM_DATA);
  const [categories, setCategories] = useState<OnboardingCategory[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;

    const draftKey = getDraftKey(user?.email);
    // Reset the previous account's draft before restoring this account's draft.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(INITIAL_FORM_DATA);

    try {
      // The old unscoped key could leak one account's draft into another account.
      if (user) localStorage.removeItem(DRAFT_STORAGE_KEY);
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        const parsedLocation = parsed.location || {};
        const coordinates = Array.isArray(parsedLocation.coordinates)
          ? parsedLocation.coordinates
          : [];
        const parsedBookingConfig = parsed.bookingConfig || {};
        // Draft restoration is the one-time synchronization from localStorage.
        const migratedDraft = {
          ...INITIAL_FORM_DATA,
          ...parsed,
          contactInfo: { ...INITIAL_FORM_DATA.contactInfo, ...(parsed.contactInfo || {}) },
          socialLinks: { ...INITIAL_FORM_DATA.socialLinks, ...(parsed.socialLinks || {}) },
          location: {
            ...INITIAL_FORM_DATA.location,
            latitude: Number(parsedLocation.latitude ?? coordinates[1] ?? INITIAL_FORM_DATA.location.latitude),
            longitude: Number(parsedLocation.longitude ?? coordinates[0] ?? INITIAL_FORM_DATA.location.longitude),
            address: parsedLocation.address ?? INITIAL_FORM_DATA.location.address,
            city: parsedLocation.city ?? INITIAL_FORM_DATA.location.city,
            postalCode: parsedLocation.postalCode ?? INITIAL_FORM_DATA.location.postalCode,
          },
          bookingConfig: {
            ...INITIAL_FORM_DATA.bookingConfig,
            ...parsedBookingConfig,
            customFields: normalizeCustomFields(parsedBookingConfig.customFields),
          },
        };
        setFormData(migratedDraft);
        localStorage.setItem(draftKey, JSON.stringify(migratedDraft));
      }
    } catch {
      // Ignore parse error
    }
  }, [isAuthLoading, user]);

  // Fetch categories from backend
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      setIsCategoriesLoading(true);
      try {
        const res = await baseApi.get(ENDPOINTS.categories);
        const list =
          res.data?.data?.categories ||
          res.data?.data ||
          res.data?.categories ||
          [];
        if (isMounted && Array.isArray(list) && list.length > 0) {
          setCategories(list);
        }
      } catch {
        // Keep the selector empty when the categories endpoint is unavailable.
      } finally {
        if (isMounted) setIsCategoriesLoading(false);
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateFormData = useCallback((patch: Partial<OnboardingFormData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...patch };
      try {
        localStorage.setItem(getDraftKey(user?.email), JSON.stringify(updated));
      } catch {
        // Ignore localStorage error
      }
      return updated;
    });
  }, [user]);

  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(getDraftKey(user?.email), JSON.stringify(formData));
      toast.success("Draft saved successfully!");
    } catch {
      toast.error("Failed to save draft to storage.");
    }
  }, [formData, user]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    try {
      localStorage.removeItem(getDraftKey(user?.email));
    } catch {
      // ignore
    }
  }, [user]);

  const submitBusiness = useCallback(async () => {
    if (localStorage.getItem(getBusinessSubmissionKey()) === "true") {
      toast.info("You have already submitted a business profile. Checking its approval status.");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Please enter a Business Name (Step 1).");
      router.push("/onboarding/grow");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Please select a Category (Step 1).");
      router.push("/onboarding/grow");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please provide a description (Step 1).");
      router.push("/onboarding/grow");
      return;
    }

    if (!formData.contactInfo.phone.trim() || !formData.contactInfo.email.trim()) {
      toast.error("Please provide a phone number and email address (Step 2).");
      router.push("/onboarding/contact");
      return;
    }

    if (
      !formData.location.address.trim() ||
      !formData.location.city.trim() ||
      !formData.location.postalCode.trim()
    ) {
      toast.error("Please complete the business address (Step 2).");
      router.push("/onboarding/contact");
      return;
    }

    // The categories endpoint can return legacy seed IDs that do not exist in
    // the businesses database. Use the current restaurant category ID for
    // those stale IDs so the create request passes category validation.
    const categoryId = formData.categoryId.startsWith("6a95e8c18a18c75cd4248f")
      ? BACKEND_RESTAURANT_CATEGORY_ID
      : formData.categoryId;
    if (categories.length > 0 && !categories.some((category) => category._id === categoryId)) {
      toast.error("The selected category is no longer available. Please select a category again.");
      router.push("/onboarding/grow");
      return;
    }

    setIsSubmitting(true);
    try {
      const logo = await uploadImage(formData.logo, "logo.jpg", "logos");
      const coverImage = formData.coverImage
        ? await uploadImage(formData.coverImage, "cover.jpg", "covers")
        : undefined;
      const bookingModalImage = formData.bookingModalImage
        ? await uploadImage(formData.bookingModalImage, "booking-modal.jpg", "booking-modals")
        : undefined;
      const images = await Promise.all(
        formData.gallery.map((image, index) =>
          uploadImage(image, `gallery-${index + 1}.jpg`, "gallery"),
        ),
      );

      const requestData = {
        name: formData.name.trim(),
        categoryId,
        description: formData.description.trim(),
        logo,
        ...(coverImage ? { coverImage } : {}),
        ...(bookingModalImage ? { bookingModalImage } : {}),
        images,
        contactInfo: {
          phone: formData.contactInfo.phone.trim(),
          email: formData.contactInfo.email.trim(),
          website: formData.contactInfo.website.trim() || "https://trouveclients.fr",
        },
        socialLinks: formData.socialLinks,
        location: {
          latitude: Number.isFinite(formData.location.latitude)
            ? formData.location.latitude
            : 48.8566,
          longitude: Number.isFinite(formData.location.longitude)
            ? formData.location.longitude
            : 2.3522,
          address: formData.location.address.trim(),
          city: formData.location.city.trim(),
          postalCode: formData.location.postalCode.trim(),
        },
        services: formData.services.length > 0 ? formData.services : ["General Service"],
        openingHours: formData.openingHours.length > 0 ? formData.openingHours : DEFAULT_OPENING_HOURS,
        bookingConfig: {
          isEnabled: Boolean(formData.bookingConfig.isEnabled),
          showModalImage: Boolean(formData.bookingConfig.showModalImage),
          templateType: formData.bookingConfig.templateType || "General Template",
          standardFields: {
            fullName: formData.bookingConfig.standardFields.fullName,
            email: formData.bookingConfig.standardFields.email,
            phone: formData.bookingConfig.standardFields.phone,
            guestCount: formData.bookingConfig.standardFields.guestCount,
          },
          customFields: normalizeCustomFields(formData.bookingConfig.customFields),
          allowSpecialRequests: Boolean(formData.bookingConfig.allowSpecialRequests),
          allowOccasions: Boolean(formData.bookingConfig.allowOccasions),
          allowNewsletterOptIn: Boolean(formData.bookingConfig.allowNewsletterOptIn),
        },
      };

      const response = await baseApi.post(ENDPOINTS.businessRegistration, requestData);
      localStorage.setItem(getBusinessSubmissionKey(), "true");
      toast.success("Business created successfully. You will be notified by email after admin approval.");
      resetForm();
      router.push("/");
      return response.data;
    } catch (error: unknown) {
      const err = error as {
        response?: {
          status?: number;
          data?: {
            message?: string;
            error?: string;
            detail?: string;
            data?: { message?: string; error?: string };
            errors?: Array<{ message?: string }>;
          };
        };
      };
      if (err.response?.status === 401) {
        toast.error("Please log in before registering a business.");
        router.push("/auth/login");
        return;
      }
      const validationMessages = Array.isArray(err.response?.data?.message)
        ? err.response.data.message
        : [];
      const isBusinessContractMismatch = validationMessages.some((message) =>
        /property (logo|coverImage|bookingModalImage|images) should not exist/i.test(message),
      );
      if (isBusinessContractMismatch) {
        toast.error(
          "Business registration API is out of sync with the app. Please refresh the app and use the latest backend deployment.",
        );
        return;
      }
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.response?.data?.data?.message ||
        err.response?.data?.data?.error ||
        err.response?.data?.errors?.map((item) => item.message).filter(Boolean).join(", ") ||
        "Failed to register business. Please verify all details and try again.";
      toast.error(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [categories, formData, resetForm, router]);

  return (
    <OnboardingContext.Provider
      value={{
        formData,
        updateFormData,
        categories,
        isCategoriesLoading,
        saveDraft,
        submitBusiness,
        isSubmitting,
        resetForm,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}

