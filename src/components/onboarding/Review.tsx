"use client";

import Link from "next/link";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { useOnboarding } from "@/src/context/OnboardingContext";

export default function Review() {
  const { formData, submitBusiness, isSubmitting } = useOnboarding();
  const valueOrFallback = (value: string) => value.trim() || "Not provided";
  const address = [formData.location.address, formData.location.postalCode, formData.location.city]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ");

  return (
    <div className="max-w-3xl rounded-2xl border border-[#dcebe4] bg-white p-5 shadow-[0_14px_40px_rgba(28,73,53,0.08)] sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00663f]">Almost there</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Review your information</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Check the details below before sending your business for approval.</p>
        </div>
        <span className="rounded-full bg-[#e4f3ec] px-3 py-1 text-xs font-bold text-[#00663f]">Ready to submit</span>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 sm:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">01</p>
              <h3 className="mt-1 font-bold text-slate-950">Basic information</h3>
            </div>
            <Link href="/onboarding/grow" aria-label="Edit basic information" className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-[#00663f]"><FiEdit2 /></Link>
          </div>
          <p className="mt-5 text-xl font-bold text-slate-950">{valueOrFallback(formData.name)}</p>
          <p className="mt-1 text-sm font-medium text-[#00663f]">{valueOrFallback(formData.categoryName)}</p>
          <p className="mt-4 text-sm leading-6 text-slate-700">{valueOrFallback(formData.description)}</p>
        </section>

        <section className="rounded-xl border border-slate-200 p-5 sm:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">01A</p><h3 className="mt-1 font-bold text-slate-950">Brand assets &amp; social links</h3></div>
            <Link href="/onboarding/grow" aria-label="Edit brand assets" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-50 hover:text-[#00663f]"><FiEdit2 /></Link>
          </div>
          <div className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Logo</p><p className="mt-1 font-medium text-slate-800">{formData.logo ? "Uploaded" : "Not provided"}</p></div>
            <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cover image</p><p className="mt-1 font-medium text-slate-800">{formData.coverImage ? "Uploaded" : "Not provided"}</p></div>
            <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Gallery</p><p className="mt-1 font-medium text-slate-800">{formData.gallery.length} photo{formData.gallery.length === 1 ? "" : "s"}</p></div>
          </div>
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Social links</p>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {(["facebook", "instagram", "linkedin", "x"] as const).map((platform) => formData.socialLinks[platform] ? <span key={platform} className="font-medium text-slate-800">{platform}: {formData.socialLinks[platform]}</span> : null)}
              {formData.socialLinks.customLinks?.map((link) => <span key={`${link.platformName}-${link.url}`} className="font-medium text-slate-800">{link.platformName}: {link.url}</span>)}
              {!formData.socialLinks.facebook && !formData.socialLinks.instagram && !formData.socialLinks.linkedin && !formData.socialLinks.x && !formData.socialLinks.customLinks?.length ? <span className="text-slate-500">Not provided</span> : null}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">02</p><h3 className="mt-1 font-bold text-slate-950">Contact</h3></div>
            <Link href="/onboarding/contact" aria-label="Edit contact information" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-50 hover:text-[#00663f]"><FiEdit2 /></Link>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</dt><dd className="mt-1 font-medium text-slate-800">{valueOrFallback(formData.contactInfo.phone)}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</dt><dd className="mt-1 wrap-break-word font-medium text-slate-800">{valueOrFallback(formData.contactInfo.email)}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Website</dt><dd className="mt-1 wrap-break-word font-medium text-slate-800">{valueOrFallback(formData.contactInfo.website)}</dd></div>
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">03</p><h3 className="mt-1 font-bold text-slate-950">Location</h3></div>
            <Link href="/onboarding/contact" aria-label="Edit location information" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-50 hover:text-[#00663f]"><FiEdit2 /></Link>
          </div>
          <p className="mt-5 text-sm leading-6 font-medium text-slate-800">{address || "Not provided"}</p>
          <p className="mt-3 text-xs text-slate-500">
            Coordinates: {formData.location.latitude === 48.8566 && formData.location.longitude === 2.3522 ? "Not provided" : `${formData.location.latitude}, ${formData.location.longitude}`}
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">04</p><h3 className="mt-1 font-bold text-slate-950">Services &amp; hours</h3></div>
            <Link href="/onboarding/details" aria-label="Edit services and hours" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-50 hover:text-[#00663f]"><FiEdit2 /></Link>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-700">{formData.services.length ? formData.services.join(", ") : "Not provided"}</p>
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs">
            {formData.openingHours.map((hour) => <div key={hour.day} className="flex items-center justify-between gap-3"><span className="font-semibold text-slate-600">{hour.day}</span><span className={hour.isClosed ? "text-slate-400" : "font-medium text-slate-800"}>{hour.isClosed ? "Closed" : `${hour.open} - ${hour.close}`}</span></div>)}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">05</p><h3 className="mt-1 font-bold text-slate-950">Photos &amp; bookings</h3></div>
            <Link href="/onboarding/bookings" aria-label="Edit photos and booking settings" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-50 hover:text-[#00663f]"><FiEdit2 /></Link>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Online bookings</dt><dd className="font-bold text-slate-800">{formData.bookingConfig.isEnabled ? "Enabled" : "Disabled"}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Template</dt><dd className="text-right font-bold text-slate-800">{valueOrFallback(formData.bookingConfig.templateType)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Modal image</dt><dd className="font-bold text-slate-800">{formData.bookingModalImage ? "Uploaded" : "Not provided"}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Special requests</dt><dd className="font-bold text-slate-800">{formData.bookingConfig.allowSpecialRequests ? "Allowed" : "Off"}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Occasions</dt><dd className="font-bold text-slate-800">{formData.bookingConfig.allowOccasions ? "Allowed" : "Off"}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Newsletter opt-in</dt><dd className="font-bold text-slate-800">{formData.bookingConfig.allowNewsletterOptIn ? "Allowed" : "Off"}</dd></div>
          </dl>
          <div className="mt-5 border-t border-slate-100 pt-4 text-xs">
            <p className="font-semibold uppercase tracking-wide text-slate-500">Booking form fields</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {Object.entries(formData.bookingConfig.standardFields).map(([field, setting]) => <div key={field} className="flex justify-between gap-3"><span className="capitalize text-slate-600">{field.replace(/([A-Z])/g, " $1")}</span><span className="font-bold text-slate-800">{setting}</span></div>)}
            </div>
            <p className="mt-4 font-semibold uppercase tracking-wide text-slate-500">Custom fields</p>
            <div className="mt-2 space-y-2">
              {formData.bookingConfig.customFields.length ? formData.bookingConfig.customFields.map((field) => <div key={`${field.fieldName}-${field.placeholder || ""}`} className="flex justify-between gap-3"><span className="text-slate-600">{field.fieldName}{field.placeholder ? ` (${field.placeholder})` : ""}</span><span className="font-bold text-slate-800">{field.isRequired ? "Required" : "Optional"}</span></div>) : <span className="text-slate-500">Not provided</span>}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-7 flex flex-col-reverse gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/onboarding/bookings" className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#00663f] sm:justify-start"><FiArrowLeft />Back</Link>
        <button type="button" onClick={submitBusiness} disabled={isSubmitting} className="rounded-xl bg-[#00663f] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#00663f]/20 transition hover:bg-[#005333] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Submitting..." : "Submit My Business"}</button>
      </div>
    </div>
  );
}
