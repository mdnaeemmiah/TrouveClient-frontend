/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Loader2, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import { useAuth } from "@/src/context/AuthContext";

const RATING_LABELS = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

type GiveReviewButtonProps = {
  businessName: string;
  businessId?: string;
};

type ReviewItem = {
  _id: string;
  customerId?: string | { _id?: string; fullName?: string; name?: string; email?: string; role?: string };
  businessId: string;
  rating: number;
  comment: string;
  recommend?: boolean;
  createdAt?: string;
  ownerReply?: string;
  ownerRepliedAt?: string;
};

function formatReviewDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
    }).format(new Date(dateStr));
  } catch {
    return "";
  }
}

function getReviewerName(review: ReviewItem): string {
  if (typeof review.customerId === "object" && review.customerId !== null) {
    const name = review.customerId.fullName || review.customerId.name || review.customerId.email;
    if (name) return name;
    if (review.customerId._id) return `Customer ${review.customerId._id.slice(-6)}`;
  }
  if (typeof review.customerId === "string" && review.customerId) {
    return `Customer ${review.customerId.slice(-6)}`;
  }
  return "Customer";
}

export default function GiveReviewButton({ businessName, businessId }: GiveReviewButtonProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [recommend, setRecommend] = useState(true);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [myReviewId, setMyReviewId] = useState<string | null>(null);

  const displayRating = hoverRating || rating;

  const loadReviews = async () => {
    if (!businessId) return;
    setIsLoadingReviews(true);
    try {
      const res = await baseApi.get(ENDPOINTS.getReviewById(businessId));
      const payload = res.data?.data ?? res.data;
      const list: ReviewItem[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.reviews)
        ? payload.reviews
        : [];

      let userReview: ReviewItem | undefined;
      const otherReviews: ReviewItem[] = [];

      list.forEach((r) => {
        const custId = typeof r.customerId === "object" ? r.customerId?._id : r.customerId;
        if (user?.id && custId === user.id) {
          userReview = r;
        } else {
          otherReviews.push(r);
        }
      });

      if (userReview) {
        setMyReviewId(userReview._id);
        // By default fill up takhbe jodi review diye thake
        setRating(userReview.rating);
        setComment(userReview.comment || "");
        setRecommend(userReview.recommend ?? true);
        setReviews([userReview, ...otherReviews]);
      } else {
        setMyReviewId(null);
        setReviews(list);
      }
    } catch {
      setReviews([]);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (open && businessId) {
      void loadReviews();
    }
  }, [open, businessId]);

  const closeAndReset = () => {
    setOpen(false);
    if (!myReviewId) {
      setRating(0);
      setHoverRating(0);
      setRecommend(true);
      setComment("");
    }
  };

  const handleSubmit = async () => {
    if (!user) return toast.error("Please log in to submit a review.");
    if (!businessId) return toast.error("Business ID is missing.");
    if (rating === 0) return toast.error("Please select a rating.");
    if (!comment.trim()) return toast.error("Please write a comment.");

    setIsSubmitting(true);
    try {
      if (myReviewId) {
        // UPDATE existing review via PATCH
        await baseApi.patch(ENDPOINTS.updateReviews(myReviewId), {
          rating,
          comment: comment.trim(),
          recommend,
        });
        toast.success("Review updated successfully!");
      } else {
        // CREATE new review
        await baseApi.post(ENDPOINTS.postReview, {
          businessId,
          rating,
          comment: comment.trim(),
          recommend,
        });
        toast.success("Review submitted successfully!");
      }
      await loadReviews();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string | string[] } } }).response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(" ") : message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMyReview = async (reviewId: string) => {
    if (!reviewId) return;
    if (!confirm("Are you sure you want to delete your review?")) return;

    setIsDeleting(true);
    try {
      await baseApi.delete(ENDPOINTS.deleteReview(reviewId));
      toast.success("Review deleted successfully.");
      setMyReviewId(null);
      setRating(0);
      setHoverRating(0);
      setComment("");
      setRecommend(true);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string | string[] } } }).response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(" ") : message || "Failed to delete review.");
    } finally {
      setIsDeleting(false);
    }
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
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
          onClick={closeAndReset}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#eef0f1] px-5 py-4">
              <div>
                <h3 className="text-[15px] font-bold text-[#1c1d22]">
                  Share your experience at {businessName}
                </h3>
                {myReviewId && (
                  <p className="text-[11px] font-semibold text-[#00663f] mt-0.5">
                    ✓ You have already reviewed this business. You can edit or delete it below.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeAndReset}
                className="text-[#5c6168] transition-colors hover:text-[#1c1d22]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              {/* Review Input Section */}
              <div>
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
                  <label className="text-[13px] font-semibold text-[#1c1d22]">
                    Tell us more about your visit
                  </label>
                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    rows={3}
                    placeholder="What was the atmosphere like? How was the service and quality?"
                    className="mt-2 w-full resize-none rounded-xl bg-[#f7f7fa] px-3.5 py-3 text-[13px] text-[#1c1d22] outline-none placeholder:text-[#9a9da1] focus:ring-2 focus:ring-[#00663f]/30"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[#f7f7fa] px-3.5 py-3">
                  <div>
                    <p className="text-[13px] font-semibold text-[#1c1d22]">
                      Would you recommend this business?
                    </p>
                    <p className="text-[11px] text-[#8a8d91]">
                      Your answer helps others find great places
                    </p>
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

                <div className="mt-4 flex items-center justify-end gap-3">
                  {myReviewId && (
                    <button
                      type="button"
                      disabled={isDeleting || isSubmitting}
                      onClick={() => void handleDeleteMyReview(myReviewId)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2.5 text-[13px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
                    >
                      {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      Delete My Review
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void handleSubmit()}
                    disabled={isSubmitting || isDeleting}
                    className="flex items-center gap-1.5 rounded-lg bg-[#00663f] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#00552f] disabled:opacity-60 transition"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Submitting...
                      </>
                    ) : myReviewId ? (
                      "Update Review"
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </div>
              </div>

              {/* Customer Reviews Section */}
              <div className="border-t border-[#eef0f1] pt-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[14px] font-bold text-[#1c1d22]">
                    Customer Reviews ({reviews.length})
                  </h4>
                  {isLoadingReviews && (
                    <Loader2 size={15} className="animate-spin text-[#00663f]" />
                  )}
                </div>

                {isLoadingReviews ? (
                  <div className="flex justify-center py-8 text-[#00663f]">
                    <Loader2 className="animate-spin" size={24} />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#d7d9db] bg-[#f7f7fa] p-6 text-center text-xs text-[#8a8d91]">
                    No reviews yet. Be the first to share your experience!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((r) => {
                      const isMyReview =
                        (user?.id && (typeof r.customerId === "object" ? r.customerId?._id : r.customerId) === user.id) ||
                        r._id === myReviewId;
                      const reviewerName = getReviewerName(r);

                      return (
                        <div
                          key={r._id}
                          className={`rounded-xl p-4 transition ${
                            isMyReview
                              ? "border-2 border-[#00663f] bg-[#f2f9f5]"
                              : "border border-[#eef0f1] bg-[#f7f7fa]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-[13px] font-bold text-[#1c1d22]">
                                  {isMyReview ? `${reviewerName} (You)` : reviewerName}
                                </p>
                                {isMyReview && (
                                  <span className="rounded-full bg-[#00663f] px-2 py-0.5 text-[10px] font-bold text-white">
                                    Your Review
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 flex items-center gap-1.5">
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={12}
                                      className={
                                        star <= r.rating
                                          ? "fill-[#f4ac00] text-[#f4ac00]"
                                          : "fill-slate-200 text-slate-200"
                                      }
                                    />
                                  ))}
                                </div>
                                {r.createdAt && (
                                  <span className="text-[11px] text-[#8a8d91]">
                                    · {formatReviewDate(r.createdAt)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {isMyReview && (
                              <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => void handleDeleteMyReview(r._id)}
                                className="flex items-center gap-1 rounded-md p-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                                title="Delete review"
                              >
                                <Trash2 size={14} />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>

                          <p className="mt-2.5 text-[13px] leading-relaxed text-[#3a3d40] whitespace-pre-line">
                            {r.comment}
                          </p>

                          {r.ownerReply && (
                            <div className="mt-3 rounded-lg border-l-2 border-[#00663f] bg-white p-3 shadow-xs">
                              <p className="text-[11px] font-bold text-[#00663f]">Response from Owner:</p>
                              <p className="mt-1 text-xs italic text-slate-600">&ldquo;{r.ownerReply}&rdquo;</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end border-t border-[#eef0f1] px-5 py-3 bg-slate-50">
              <button
                type="button"
                onClick={closeAndReset}
                className="rounded-lg border border-[#d7d9db] bg-white px-4 py-2 text-[13px] font-semibold text-[#5c6168] hover:text-[#1c1d22]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
