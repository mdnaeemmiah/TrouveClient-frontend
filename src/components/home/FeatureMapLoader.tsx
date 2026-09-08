"use client";

import dynamic from "next/dynamic";

const FeatureMap = dynamic(() => import("./FeatureMap"), {
  ssr: false,
  loading: () => <div className="h-[220px] rounded-2xl bg-[#e3e5e8]" />,
});

type FeatureMapLoaderProps = { latitude?: number; longitude?: number; label: string };

export default function FeatureMapLoader(props: FeatureMapLoaderProps) {
  return <FeatureMap {...props} />;
}
