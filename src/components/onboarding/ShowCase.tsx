"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiImage,
  FiInfo,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import img1 from "@/src/assets/details/img1.png";
import img2 from "@/src/assets/details/img2.png";
import img3 from "@/src/assets/details/img3.png";
import img4 from "@/src/assets/details/img4.png";

const INITIAL_PHOTOS: StaticImageData[] = [img1, img2, img3, img4];

export default function ShowCase() {
  const [photos, setPhotos] = useState<StaticImageData[]>(INITIAL_PHOTOS);

  const previewThumbs = photos.slice(0, 3);
  const overlayCount = photos.length - previewThumbs.length;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h2 className="text-lg font-bold text-slate-900">Showcase your business</h2>
        <p className="mt-1 text-sm text-slate-500">
          Add high-quality photos of your services, storefront, or work samples. Verified profiles with gallery
          items receive 4x more leads.
        </p>

        <button
          type="button"
          className="mt-5 flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-12 text-center transition-colors hover:border-[#00663f]/40 hover:bg-slate-50"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e4f3ec] text-[#00663f]">
            <FiImage className="text-[18px]" />
          </span>
          <span className="text-sm font-semibold text-slate-700">Drag &amp; drop your photos here</span>
          <span className="text-xs text-slate-400">
            or <span className="font-medium text-[#00663f]">browse files</span> from your computer
          </span>
          <span className="text-[11px] text-slate-400">Supported: JPG, PNG, WebP (Max 10MB each)</span>
        </button>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Your Gallery ({photos.length} photos)
          </span>
          <button
            type="button"
            onClick={() => setPhotos([])}
            className="flex items-center gap-1 text-xs font-medium text-[#c0524d] hover:text-[#a5423d]"
          >
            <FiTrash2 className="text-[12px]" />
            Clear all
          </button>
        </div>

        {photos.length > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                <Image src={photo} alt="" fill className="object-cover" />
                {index === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded-md bg-[#00663f] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                    Cover Photo
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">
            No photos yet — add some to build your gallery.
          </p>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/onboarding/details"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <FiArrowLeft className="text-[13px]" />
            Back to services
          </Link>
          <Link
            href="/onboarding/bookings"
            className="flex items-center gap-2 rounded-full bg-[#00663f] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004f31]"
          >
            Continue to Step 5
            <FiArrowRight className="text-[14px]" />
          </Link>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl bg-slate-50 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Live Card Preview</h3>
            <span className="flex items-center gap-1 rounded-full bg-[#e4f3ec] px-2.5 py-1 text-[10px] font-semibold text-[#00663f]">
              <FiCheck className="text-[10px]" />
              Verified View
            </span>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="relative h-28 w-full">
              {photos[0] && <Image src={photos[0]} alt="" fill className="object-cover" />}
              <span className="absolute left-2 top-2 rounded-full bg-slate-900/80 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-white">
                Verified Pro
              </span>
            </div>

            <div className="space-y-2.5 p-3.5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Atelier Design Paris</h4>
                <span className="flex items-center gap-1 text-xs font-semibold text-[#00663f]">
                  <FiStar className="fill-current text-[12px]" />
                  4.9
                </span>
              </div>
              <p className="text-xs text-slate-400">Interior Design • Paris 08</p>

              <div className="grid grid-cols-3 gap-1.5">
                {previewThumbs.map((photo, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                    <Image src={photo} alt="" fill className="object-cover" />
                    {index === previewThumbs.length - 1 && overlayCount > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 text-xs font-semibold text-white">
                        +{overlayCount}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="w-full rounded-lg bg-[#e4f3ec] py-2 text-sm font-semibold text-[#00663f]/60"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <FiInfo className="mt-0.5 shrink-0 text-[14px] text-amber-600" />
          <p className="text-xs text-amber-800">
            Photos are reviewed by our team. Ensure they are well-lit and represent your actual work environment.
          </p>
        </div>
      </div>
    </div>
  );
}
