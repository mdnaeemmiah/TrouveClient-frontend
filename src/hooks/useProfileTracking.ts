"use client";

import { useCallback, useEffect, useRef } from "react";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

export type TrackAction = "PROFILE_VIEW" | "WHATSAPP" | "PHONE" | "EMAIL" | "BOOKING";

// Backend enum values
type ApiActionType = "VIEW" | "WHATSAPP" | "CALL" | "EMAIL" | "BOOKING_CLICK";

const ACTION_MAP: Record<TrackAction, ApiActionType> = {
  PROFILE_VIEW: "VIEW",
  WHATSAPP: "WHATSAPP",
  PHONE: "CALL",
  EMAIL: "EMAIL",
  BOOKING: "BOOKING_CLICK",
};

function getWeekKey(businessId: string, action: TrackAction): string {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return "track_" + businessId + "_" + action + "_" + weekNumber;
}

function hasTracked(businessId: string, action: TrackAction): boolean {
  if (typeof window === "undefined") return false;
  try { return localStorage.getItem(getWeekKey(businessId, action)) === "1"; }
  catch { return false; }
}

function markTracked(businessId: string, action: TrackAction) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(getWeekKey(businessId, action), "1"); }
  catch { /* ignore */ }
}

async function sendTrackAction(businessId: string, action: TrackAction) {
  if (hasTracked(businessId, action)) return;
  try {
    await baseApi.post(ENDPOINTS.profileTracking(businessId), { actionType: ACTION_MAP[action] });
    markTracked(businessId, action);
  } catch {
    // silently ignore tracking errors - never block UX
  }
}

export function useProfileTracking(businessId?: string) {
  const fired = useRef(false);

  useEffect(() => {
    if (!businessId || fired.current) return;
    fired.current = true;
    void sendTrackAction(businessId, "PROFILE_VIEW");
  }, [businessId]);

  const track = useCallback(
    (action: TrackAction) => {
      if (businessId) void sendTrackAction(businessId, action);
    },
    [businessId],
  );

  return { track };
}