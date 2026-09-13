"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/src/context/AuthContext";

const BUSINESS_SUBMISSION_KEY = "business_submission";

function hasSubmittedBusiness() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return localStorage.getItem(`${BUSINESS_SUBMISSION_KEY}:${user?.email || "guest"}`) === "true";
  } catch {
    return false;
  }
}

type AddBusinessButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export default function AddBusinessButton({ className, children }: AddBusinessButtonProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleAddBusiness = () => {
    if (!user) {
      toast.info("Please log in before adding your business.");
      router.push("/auth/login");
      return;
    }

    if (hasSubmittedBusiness()) {
      toast.info("You have already submitted a business profile. Checking its approval status.");
      router.push("/business-submitted");
      return;
    }

    router.push("/onboarding/grow");
  };

  return (
    <button type="button" onClick={handleAddBusiness} className={className}>
      {children}
    </button>
  );
}
