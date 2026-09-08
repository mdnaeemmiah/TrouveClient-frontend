"use client";

import { Mail, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useProfileTracking } from "@/src/hooks/useProfileTracking";

type BusinessActionsProps = {
  businessId?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
};

export default function BusinessActions({ businessId, phone, email, whatsapp }: BusinessActionsProps) {
  const { track } = useProfileTracking(businessId);

  return (
    <>
      <a
        href={`tel:${phone || ""}`}
        onClick={() => track("PHONE")}
        className="flex items-center justify-center gap-2 rounded-lg bg-[#00663f] py-2.5 text-[13px] font-bold text-white hover:bg-[#00552f]"
      >
        <Phone size={16} /> Call Now
      </a>

      <a
        href={`mailto:${email || ""}`}
        onClick={() => track("EMAIL")}
        className="flex items-center justify-center gap-2 rounded-lg border border-[#c7d8cd] bg-[#eaf6f0] py-2.5 text-[13px] font-bold text-[#00663f] hover:bg-[#dcf0e6]"
      >
        <Mail size={16} /> Send Email
      </a>

      <a
        href={`https://wa.me/${(whatsapp || phone || "").replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("WHATSAPP")}
        className="flex items-center justify-center gap-2 rounded-lg border border-[#d7d9db] py-2.5 text-[13px] font-bold text-[#3a3d40] hover:bg-[#f7f7fa]"
      >
        <FaWhatsapp size={16} /> WhatsApp
      </a>
    </>
  );
}

