"use client";

import { useState } from "react";
import { BadgeCheck, Calendar, MapPin, Utensils, X } from "lucide-react";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import { useAuth } from "@/src/context/AuthContext";
import { useProfileTracking } from "@/src/hooks/useProfileTracking";

type FieldVisibility = "REQUIRED" | "OPTIONAL" | "HIDDEN";

type BookingConfig = {
  isEnabled: boolean;
  showModalImage: boolean;
  modalImage?: string;
  templateType?: string;
  standardFields: {
    fullName?: FieldVisibility;
    email?: FieldVisibility;
    phone?: FieldVisibility;
    guestCount?: FieldVisibility;
  };
  customFields: { fieldName: string; isRequired: boolean }[];
  allowSpecialRequests: boolean;
  allowOccasions: boolean;
  allowNewsletterOptIn: boolean;
};

type BookTableButtonProps = {
  businessId?: string;
  businessName: string;
  location: string;
  category: string;
  modalImage?: string;
  services?: string[];
  bookingConfig?: BookingConfig;
};

const inputClass =
  "w-full rounded-xl border border-[#e1e3e6] px-3.5 py-2.5 text-[13px] text-[#1c1d22] outline-none placeholder:text-[#9a9da1] focus:ring-2 focus:ring-[#00663f]/30";

function show(v?: FieldVisibility) { return v === "REQUIRED" || v === "OPTIONAL"; }
function req(v?: FieldVisibility) { return v === "REQUIRED"; }

export default function BookTableButton({
  businessId,
  businessName,
  location,
  category,
  modalImage,
  services = [],
  bookingConfig,
}: BookTableButtonProps) {
  const { user } = useAuth();
  const { track } = useProfileTracking(businessId);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Standard fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [serviceName, setServiceName] = useState("");

  // Custom fields { fieldName: value }
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  // Extras
  const [specialRequests, setSpecialRequests] = useState("");
  const [occasion, setOccasion] = useState("");
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);

  // Date/time for backend
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");

  const sf = bookingConfig?.standardFields ?? {};
  const cf = bookingConfig?.customFields ?? [];
  const heroImage = bookingConfig?.modalImage || modalImage;
  const showImage = Boolean(heroImage);

  const closeAndReset = () => {
    setOpen(false);
    setFullName(""); setEmail(""); setPhone(""); setGuestCount("1");
    setCustomValues({}); setSpecialRequests(""); setOccasion(""); setNewsletterOptIn(false);
    setDate(""); setTime("09:00"); setServiceName("");
  };

  const handleSubmit = async () => {
    if (!user) return toast.error("Please log in to make a booking.");
    if (!businessId) return toast.error("Business ID is missing.");
    if (!serviceName.trim()) return toast.error("Please select a service.");
    if (!date) return toast.error("Please select a date.");

    // Validate standard fields
    if (req(sf.fullName) && !fullName.trim()) return toast.error("Full name is required.");
    if (req(sf.email) && !email.trim()) return toast.error("Email is required.");
    if (req(sf.phone) && !phone.trim()) return toast.error("Phone number is required.");

    // Validate custom fields
    for (const field of cf) {
      if (field.isRequired && !customValues[field.fieldName]?.trim()) {
        return toast.error(`${field.fieldName} is required.`);
      }
    }

    const dateTime = new Date(`${date}T${time}:00`).toISOString();

    setIsSubmitting(true);
    try {
      await baseApi.post(ENDPOINTS.bookings, { businessId, serviceName, dateTime });
      toast.success("Booking confirmed!");
      closeAndReset();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string | string[] } } }).response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(" ") : message || "Failed to confirm booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingConfig && !bookingConfig.isEnabled) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); track("BOOKING"); }}
        className="flex items-center justify-center gap-2 rounded-lg bg-[#00663f] py-2.5 text-[13px] font-bold text-white hover:bg-[#00552f]"
      >
        <Calendar size={16} /> Book Now
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4"
          onClick={closeAndReset}
        >
          <div
            className={`grid w-full overflow-hidden rounded-2xl bg-white shadow-xl ${
              showImage ? "max-w-3xl grid-cols-1 sm:grid-cols-[1fr_1.4fr]" : "max-w-md grid-cols-1"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left image */}
            {showImage && heroImage && (
              <div className="relative hidden min-h-[520px] sm:block">
                <img src={heroImage} alt={businessName} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-[#00663f] px-3 py-1 text-[11px] font-bold text-white">
                  <BadgeCheck size={13} /> Verified Premium Partner
                </span>
                <div className="absolute inset-x-4 bottom-4 text-white">
                  <p className="text-lg font-bold">{businessName}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[12px] text-white/85">
                    <span className="flex items-center gap-1"><MapPin size={13} /> {location}</span>
                    <span className="flex items-center gap-1"><Utensils size={13} /> {category}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Right form */}
            <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#1c1d22]">Book Now</h3>
                  <p className="mt-0.5 text-[13px] text-[#5c6168]">Confirm your reservation in seconds</p>
                </div>
                <button type="button" onClick={closeAndReset} className="text-[#5c6168] hover:text-[#1c1d22]">
                  <X size={18} />
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-3">

                {/* Full Name */}
                {show(sf.fullName) && (
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1c1d22]">
                      Full Name {req(sf.fullName) && <span className="text-red-500">*</span>}
                    </label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name" className={inputClass} />
                  </div>
                )}

                {/* Email */}
                {show(sf.email) && (
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1c1d22]">
                      Email {req(sf.email) && <span className="text-red-500">*</span>}
                    </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com" className={inputClass} />
                  </div>
                )}

                {/* Phone */}
                {show(sf.phone) && (
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1c1d22]">
                      Phone {req(sf.phone) && <span className="text-red-500">*</span>}
                    </label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+33 6 12 34 56 78" className={inputClass} />
                  </div>
                )}

                {/* Guest Count */}
                {show(sf.guestCount) && (
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1c1d22]">
                      Number of Guests {req(sf.guestCount) && <span className="text-red-500">*</span>}
                    </label>
                    <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className={inputClass}>
                      {[1,2,3,4,5,6,7,8].map((n) => (
                        <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Service — from business services list */}
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#1c1d22]">
                    Service <span className="text-red-500">*</span>
                  </label>
                  {services.length > 0 ? (
                    <select
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select a service...</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="e.g. Oil Change, Consultation..."
                      className={inputClass}
                    />
                  )}
                </div>

                {/* Custom Fields */}
                {cf.map((field) => (
                  <div key={field.fieldName}>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1c1d22]">
                      {field.fieldName} {field.isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={customValues[field.fieldName] ?? ""}
                      onChange={(e) => setCustomValues((prev) => ({ ...prev, [field.fieldName]: e.target.value }))}
                      placeholder={`Enter ${field.fieldName.toLowerCase()}`}
                      className={inputClass}
                    />
                  </div>
                ))}

                {/* Date */}
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#1c1d22]">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input type="date" value={date} min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(e.target.value)} className={inputClass} />
                </div>

                {/* Time */}
                <div>
                  <label className="mb-1.5 block text-[13px] font-semibold text-[#1c1d22]">Preferred Time</label>
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
                </div>

                {/* Special Requests */}
                {bookingConfig?.allowSpecialRequests && (
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1c1d22]">
                      Special Requests <span className="font-normal text-[#8a8d91]">(Optional)</span>
                    </label>
                    <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={2} placeholder="Any special requests or notes..."
                      className={`${inputClass} resize-none`} />
                  </div>
                )}

                {/* Occasion */}
                {bookingConfig?.allowOccasions && (
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold text-[#1c1d22]">
                      Occasion <span className="font-normal text-[#8a8d91]">(Optional)</span>
                    </label>
                    <input type="text" value={occasion} onChange={(e) => setOccasion(e.target.value)}
                      placeholder="e.g. Birthday, Anniversary..." className={inputClass} />
                  </div>
                )}

                {/* Newsletter */}
                {bookingConfig?.allowNewsletterOptIn && (
                  <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#3a3d40]">
                    <input type="checkbox" checked={newsletterOptIn}
                      onChange={(e) => setNewsletterOptIn(e.target.checked)}
                      className="h-4 w-4 rounded accent-[#00663f]" />
                    Subscribe to newsletter and updates
                  </label>
                )}

              </div>

              <div className="mt-5 flex items-center gap-4">
                <button type="button" onClick={() => void handleSubmit()} disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-[#00663f] py-3 text-[13px] font-bold text-white hover:bg-[#00552f] disabled:opacity-60">
                  {isSubmitting ? "Confirming..." : "Confirm Booking"}
                </button>
                <button type="button" onClick={closeAndReset}
                  className="text-[13px] font-semibold text-[#5c6168] hover:text-[#1c1d22]">
                  Cancel
                </button>
              </div>
              <p className="mt-3 text-center text-[11px] text-[#9a9da1]">
                By confirming, you agree to our{" "}
                <span className="text-[#00663f]">Terms</span> and{" "}
                <span className="text-[#00663f]">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
