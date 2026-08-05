"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";

const RATING_LABELS = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

export default function GiveReviewButton({ businessName }: { businessName: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [recommend, setRecommend] = useState(true);
  const [comment, setComment] = useState("");

  const displayRating = hoverRating || rating;

  const closeAndReset = () => {
    setOpen(false);
    setRating(0);
    setHoverRating(0);
    setRecommend(true);
    setComment("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 rounded-lg border border-[#d7d9db] py-2.5 text-[13px] font-bold text-[#3a3d40] hover:bg-[#f7f7fa]"
      >
        <Star size={16} /> Give Review
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeAndReset}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eef0f1] px-5 py-4">
              <h3 className="text-[15px] font-bold text-[#1c1d22]">
                Share your experience at {businessName}
              </h3>
              <button
                type="button"
                onClick={closeAndReset}
                className="text-[#5c6168] transition-colors hover:text-[#1c1d22]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-5">
              <p className="text-center text-[11px] font-bold uppercase tracking-wide text-[#8a8d91]">
                Tap to Rate
              </p>
              <div className="mt-2 flex justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-[#d7d9db] transition-colors"
                  >
                    <Star
                      size={30}
                      className={star <= displayRating ? "fill-[#f4ac00] text-[#f4ac00]" : "fill-transparent"}
                    />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-center text-[13px] font-semibold text-[#00663f]">
                {displayRating ? RATING_LABELS[displayRating - 1] : "Select a rating"}
              </p>

              <div className="mt-5">
                <label className="text-[13px] font-semibold text-[#1c1d22]">Tell us more about your visit</label>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={3}
                  placeholder="What was the atmosphere like? How was the service and the food?"
                  className="mt-2 w-full resize-none rounded-xl bg-[#f7f7fa] px-3.5 py-3 text-[13px] text-[#1c1d22] outline-none placeholder:text-[#9a9da1] focus:ring-2 focus:ring-[#00663f]/30"
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[#f7f7fa] px-3.5 py-3">
                <div>
                  <p className="text-[13px] font-semibold text-[#1c1d22]">Would you recommend this business?</p>
                  <p className="text-[11px] text-[#8a8d91]">Your answer helps others find great places</p>
                </div>
                <div className="flex shrink-0 items-center gap-1 rounded-full bg-white p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setRecommend(true)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      recommend ? "bg-[#00663f] text-white" : "text-[#5c6168]"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecommend(false)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      !recommend ? "bg-[#00663f] text-white" : "text-[#5c6168]"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-[#eef0f1] px-5 py-4">
              <button
                type="button"
                onClick={closeAndReset}
                className="text-[13px] font-semibold text-[#5c6168] hover:text-[#1c1d22]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={closeAndReset}
                className="rounded-lg bg-[#00663f] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#00552f]"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
