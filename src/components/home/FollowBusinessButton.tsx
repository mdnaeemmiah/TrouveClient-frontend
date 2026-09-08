"use client";

import { useEffect, useRef, useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import { useAuth } from "@/src/context/AuthContext";

type FollowBusinessButtonProps = { businessId?: string; businessName: string; initialFollowing?: boolean };

const FOLLOW_STORAGE_KEY = "followed-businesses";

function getStoredFollowState(businessId: string): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = JSON.parse(localStorage.getItem(FOLLOW_STORAGE_KEY) || "{}") as Record<string, boolean>;
    return businessId in saved ? saved[businessId] : null;
  } catch {
    return null;
  }
}

function setStoredFollowState(businessId: string, value: boolean) {
  if (typeof window === "undefined") return;
  try {
    const saved = JSON.parse(localStorage.getItem(FOLLOW_STORAGE_KEY) || "{}") as Record<string, boolean>;
    saved[businessId] = value;
    localStorage.setItem(FOLLOW_STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // ignore
  }
}

export default function FollowBusinessButton({ businessId, businessName, initialFollowing = false }: FollowBusinessButtonProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState<boolean>(() => {
    // On first render: prefer localStorage over server-rendered prop
    if (!businessId) return Boolean(initialFollowing);
    const stored = getStoredFollowState(businessId);
    return stored !== null ? stored : Boolean(initialFollowing);
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasFetchedRef = useRef(false);

  // Fetch real follow status from API once (after login)
  useEffect(() => {
    if (!businessId || hasFetchedRef.current || !user) return;
    hasFetchedRef.current = true;

    baseApi
      .get<{ data?: { isFollowing?: boolean }; isFollowing?: boolean }>(ENDPOINTS.getBusinessById(businessId))
      .then((res) => {
        const serverFollowing = res.data?.data?.isFollowing ?? res.data?.isFollowing;
        if (typeof serverFollowing === "boolean") {
          setIsFollowing(serverFollowing);
          setStoredFollowState(businessId, serverFollowing);
        }
      })
      .catch(() => {
        // silently ignore - keep localStorage/initialFollowing state
      });
  }, [businessId, user]);

  const toggleFollow = async () => {
    if (!businessId) return toast.error("This business profile has no valid ID.");
    if (user?.role !== "customer") return toast.error("Only customer accounts can follow businesses.");
    const previous = isFollowing;
    const next = !previous;
    setIsFollowing(next);
    if (businessId) setStoredFollowState(businessId, next);
    setIsSubmitting(true);
    try {
      await baseApi.post(ENDPOINTS.followBusiness(businessId));
      toast.success(previous ? `Unfollowed ${businessName}.` : `Following ${businessName}.`);
    } catch (error: unknown) {
      setIsFollowing(previous);
      if (businessId) setStoredFollowState(businessId, previous);
      const message = (error as { response?: { data?: { message?: string | string[] } } }).response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(" ") : message || "Unable to update following status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void toggleFollow()}
      disabled={isSubmitting}
      className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-[13px] font-bold disabled:opacity-60 ${
        isFollowing ? "border-[#00663f] bg-[#00663f] text-white" : "border-[#d7d9db] text-[#3a3d40] hover:bg-[#f7f7fa]"
      }`}
    >
      <UserPlus size={16} />
      {isFollowing ? "Following" : "Follow Business"}
    </button>
  );
}
