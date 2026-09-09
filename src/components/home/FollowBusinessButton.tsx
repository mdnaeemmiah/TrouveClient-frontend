"use client";

import { useEffect, useRef, useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import { useAuth } from "@/src/context/AuthContext";
import {
  getStoredFollowState,
  setStoredFollowState,
  subscribeToFollowChanges,
} from "@/src/utils/followStorage";

type FollowBusinessButtonProps = {
  businessId?: string;
  slug?: string;
  businessName: string;
  initialFollowing?: boolean;
};

export default function FollowBusinessButton({
  businessId,
  slug,
  businessName,
  initialFollowing = false,
}: FollowBusinessButtonProps) {
  const { user } = useAuth();
  const effectiveId = businessId || slug || businessName.toLowerCase().replace(/\s+/g, "-");

  const [isFollowing, setIsFollowing] = useState<boolean>(() => {
    const stored = getStoredFollowState(businessId, slug || effectiveId);
    return stored !== null ? stored : Boolean(initialFollowing);
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasFetchedRef = useRef(false);

  // Sync state if businessId or slug changes or stored state exists
  useEffect(() => {
    const stored = getStoredFollowState(businessId, slug || effectiveId);
    if (stored !== null) {
      setIsFollowing(stored);
    }
  }, [businessId, slug, effectiveId]);

  // Subscribe to changes across components and storage
  useEffect(() => {
    const unsubscribe = subscribeToFollowChanges((changedId, nextFollowing, aliasId) => {
      if (
        changedId === businessId ||
        changedId === slug ||
        changedId === effectiveId ||
        aliasId === businessId ||
        aliasId === slug ||
        aliasId === effectiveId
      ) {
        setIsFollowing(nextFollowing);
      }
    });
    return unsubscribe;
  }, [businessId, slug, effectiveId]);

  // Fetch real follow status from API once per business mount when user is authenticated
  useEffect(() => {
    if (!businessId || hasFetchedRef.current || !user) return;
    hasFetchedRef.current = true;

    baseApi
      .get(ENDPOINTS.getBusinessById(businessId))
      .then((res) => {
        const payload = res.data?.data ?? res.data;
        const raw = (payload && !Array.isArray(payload) && "_id" in payload ? payload : payload?.business || payload) as Record<string, unknown> | undefined;
        const serverFollowing = raw?.isFollowing ?? raw?.following ?? raw?.followed ?? raw?.isFollowed;
        // Only update if server specifically confirms true, or if no local preference has been stored yet
        if (typeof serverFollowing === "boolean") {
          const stored = getStoredFollowState(businessId, slug || effectiveId);
          if (stored === null || serverFollowing === true) {
            setIsFollowing(serverFollowing);
            setStoredFollowState(effectiveId, serverFollowing, businessId);
          }
        }
      })
      .catch(() => {
        // keep current localStorage state on error
      });
  }, [businessId, slug, effectiveId, user]);

  const toggleFollow = async () => {
    const targetId = businessId || effectiveId;
    if (!targetId) return toast.error("This business profile has no valid ID.");
    if (user?.role !== "customer") return toast.error("Only customer accounts can follow businesses.");
    
    const previous = isFollowing;
    const next = !previous;
    
    setIsFollowing(next);
    setStoredFollowState(effectiveId, next, businessId);
    setIsSubmitting(true);

    try {
      const res = await baseApi.post(ENDPOINTS.followBusiness(targetId));
      const resData = res.data?.data ?? res.data;
      const serverState = resData?.isFollowing;
      const finalState = typeof serverState === "boolean" ? serverState : next;
      
      setIsFollowing(finalState);
      setStoredFollowState(effectiveId, finalState, businessId);
      toast.success(finalState ? `Following ${businessName}.` : `Unfollowed ${businessName}.`);
    } catch (error: unknown) {
      setIsFollowing(previous);
      setStoredFollowState(effectiveId, previous, businessId);
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
      className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-[13px] font-bold disabled:opacity-60 transition ${
        isFollowing ? "border-[#00663f] bg-[#00663f] text-white" : "border-[#d7d9db] text-[#3a3d40] hover:bg-[#f7f7fa]"
      }`}
    >
      <UserPlus size={16} />
      {isFollowing ? "Following" : "Follow Business"}
    </button>
  );
}
