"use client";

import { useProfileTracking } from "@/src/hooks/useProfileTracking";

/** Invisible client component — fires PROFILE_VIEW once on mount */
export default function ProfileViewTracker({ businessId }: { businessId?: string }) {
  useProfileTracking(businessId);
  return null;
}

