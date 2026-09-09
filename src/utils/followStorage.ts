export const FOLLOW_STORAGE_KEY = "followed-businesses";
export const FOLLOW_CHANGE_EVENT = "followed-businesses-changed";

export function getStoredFollowMap(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(FOLLOW_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function getStoredFollowState(businessId?: string, fallbackId?: string): boolean | null {
  if (typeof window === "undefined") return null;
  const map = getStoredFollowMap();
  if (businessId && typeof map[businessId] === "boolean") {
    return map[businessId];
  }
  if (fallbackId && typeof map[fallbackId] === "boolean") {
    return map[fallbackId];
  }
  return null;
}

export function setStoredFollowState(businessId: string, isFollowing: boolean, aliasId?: string) {
  if (typeof window === "undefined" || !businessId) return;
  try {
    const map = getStoredFollowMap();
    map[businessId] = isFollowing;
    if (aliasId && aliasId !== businessId) {
      map[aliasId] = isFollowing;
    }
    localStorage.setItem(FOLLOW_STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(
      new CustomEvent(FOLLOW_CHANGE_EVENT, {
        detail: { businessId, aliasId, isFollowing },
      })
    );
  } catch {
    // ignore
  }
}

export function subscribeToFollowChanges(
  onChange: (businessId: string, isFollowing: boolean, aliasId?: string) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = (event: Event) => {
    const detail = (event as CustomEvent<{ businessId?: string; aliasId?: string; isFollowing?: boolean }>).detail;
    if (detail?.businessId && typeof detail.isFollowing === "boolean") {
      onChange(detail.businessId, detail.isFollowing, detail.aliasId);
    }
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === FOLLOW_STORAGE_KEY && event.newValue) {
      try {
        const newMap = JSON.parse(event.newValue) as Record<string, boolean>;
        Object.entries(newMap).forEach(([id, val]) => {
          onChange(id, val);
        });
      } catch {
        // ignore
      }
    }
  };

  window.addEventListener(FOLLOW_CHANGE_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(FOLLOW_CHANGE_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
