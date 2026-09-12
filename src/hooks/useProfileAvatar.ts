"use client";

import { useEffect, useState } from "react";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

type ProfileInfo = {
  name: string;
  avatar: string;
  initials: string;
};

export function useProfileAvatar(): ProfileInfo {
  const [info, setInfo] = useState<ProfileInfo>({ name: "", avatar: "", initials: "" });

  useEffect(() => {
    // try localStorage first for instant display
    const storedName   = localStorage.getItem("profile_name")  ?? "";
    const storedAvatar = localStorage.getItem("profile_image") ?? "";
    const initials = storedName
      ? storedName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
      : "";
    if (storedName || storedAvatar) {
      setInfo({ name: storedName, avatar: storedAvatar, initials });
    }

    // then fetch fresh from API
    baseApi.get(ENDPOINTS.getUserProfile)
      .then((res) => {
        const u = res.data?.data?.result ?? res.data?.data ?? res.data;
        const name   = String(u?.fullName ?? u?.name ?? "");
        const avatar = String(u?.avatar ?? u?.profileImage ?? "");
        const fresh  = name.split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase();
        if (name)   localStorage.setItem("profile_name",  name);
        if (avatar) localStorage.setItem("profile_image", avatar);
        setInfo({ name, avatar, initials: fresh || initials });
      })
      .catch(() => {/* keep localStorage values */});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return info;
}
