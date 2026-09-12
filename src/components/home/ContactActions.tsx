"use client";

import { useState, type MouseEvent } from "react";
import { Mail, Phone, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import { useProfileTracking } from "@/src/hooks/useProfileTracking";

type ContactActionsProps = {
  businessId?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  businessName: string;
};

function getWhatsAppUrl(value: string) {
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://wa.me/${value.replace(/\D/g, "")}`;
}

export default function ContactActions({ businessId, phone, email, whatsapp, businessName }: ContactActionsProps) {
  const { track } = useProfileTracking(businessId);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const whatsappUrl = whatsapp ? getWhatsAppUrl(whatsapp) : "";
  const emailUrl = email
    ? `mailto:${email}?subject=${encodeURIComponent("Inquiry about " + businessName)}&body=${encodeURIComponent("Hello " + businessName + ",\n\n")}`
    : undefined;

  const closeOnOverlay = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setIsWhatsAppOpen(false);
  };

  return (
    <>
      <a
        href={phone ? ("tel:" + phone) : undefined}
        aria-disabled={!phone}
        onClick={() => phone && track("PHONE")}
        className="flex items-center justify-center gap-2 rounded-lg bg-[#00663f] py-2.5 text-[13px] font-bold text-white hover:bg-[#00552f]"
      >
        <Phone size={16} /> Call Now
      </a>
      <a
        href={emailUrl}
        aria-disabled={!email}
        onClick={() => email && track("EMAIL")}
        className="flex items-center justify-center gap-2 rounded-lg border border-[#c7d8cd] bg-[#eaf6f0] py-2.5 text-[13px] font-bold text-[#00663f] hover:bg-[#dcf0e6]"
      >
        <Mail size={16} /> Send Email
      </a>
      <button
        type="button"
        onClick={() => { if (whatsappUrl) { setIsWhatsAppOpen(true); track("WHATSAPP"); } }}
        disabled={!whatsappUrl}
        className="flex items-center justify-center gap-2 rounded-lg border border-[#d7d9db] py-2.5 text-[13px] font-bold text-[#3a3d40] hover:bg-[#f7f7fa] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaWhatsapp size={16} /> WhatsApp
      </button>

      {isWhatsAppOpen && (
        <div
          role="presentation"
          onClick={closeOnOverlay}
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="whatsapp-qr-title"
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setIsWhatsAppOpen(false)}
              aria-label="Close WhatsApp QR code"
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <X size={19} />
            </button>
            <h2 id="whatsapp-qr-title" className="pr-6 text-lg font-bold text-slate-900">Chat on WhatsApp</h2>
            <p className="mt-1 text-sm text-slate-500">Scan this QR code to contact {businessName}.</p>
            <div className="mx-auto mt-5 flex w-fit rounded-xl border border-slate-200 bg-white p-3">
              <QRCodeSVG value={whatsappUrl} size={220} includeMargin aria-label={"WhatsApp QR code for " + businessName} />
            </div>
            <p className="mt-4 break-all text-xs text-slate-400">{whatsappUrl}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("WHATSAPP")}
              className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
            >
              Open in WhatsApp
              {/* Gradient external link icon */}
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" aria-hidden="true">
                <defs>
                  <linearGradient id="ext-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#93c5fd" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#f0abfc" />
                  </linearGradient>
                </defs>
                <path
                  d="M4 4h6M4 4v16h16v-6M4 4l16 16M14 4h6v6"
                  stroke="url(#ext-grad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <button
              type="button"
              onClick={() => setIsWhatsAppOpen(false)}
              className="mt-5 w-full rounded-lg bg-[#00663f] py-2.5 text-sm font-bold text-white hover:bg-[#00552f]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}