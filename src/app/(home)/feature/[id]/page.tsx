import {
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Globe,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  UserPlus,
  Wrench,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import { notFound } from "next/navigation";
import { businesses, getBusinessById } from "@/src/data/businesses";

export function generateStaticParams() {
  return businesses.map((business) => ({ id: business.id }));
}

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const business = getBusinessById(id);

  if (!business) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f7f7fa]">
      <div className="mx-auto px-5 py-8 md:px-6 lg:px-[max(30px,calc((100vw-1400px)/2))] lg:py-10">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.6fr_1fr] md:grid-rows-1">
          <div className="relative h-[260px] overflow-hidden rounded-2xl md:h-[380px]">
            <Image className="object-cover" src={business.detailImage} alt={business.name} fill priority />
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-3">
            <div className="relative overflow-hidden rounded-2xl">
              <Image className="object-cover" src={business.image} alt="" fill />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image className="object-cover" src={business.detailImage} alt="" fill />
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image className="object-cover" src={business.image} alt="" fill />
            </div>
            <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-[#e7e8eb] text-sm font-bold text-[#5c6168]">
              +{business.additionalPhotosCount} photos
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-[#00663f] px-3 py-1 text-[11px] font-bold text-white">
                <BadgeCheck size={13} /> Featured
              </span>
              <span className="rounded-full bg-[#eceef0] px-3 py-1 text-[11px] font-bold text-[#3a3d40]">{business.category}</span>
            </div>

            <h1 className="mt-4 text-[28px] font-bold tracking-tight text-[#1c1d22] md:text-[34px]">{business.name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-[#5c6168]">
              <span className="flex items-center gap-1.5">
                <Star size={15} className="fill-[#f4ac00] text-[#f4ac00]" /> {business.rating}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={15} /> {business.location}
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-[#c7d8cd] px-3 py-1 font-semibold text-[#00663f]">
                <ShieldCheck size={14} /> Trust Score: {business.trustScore}/100
              </span>
            </div>

            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[#3a3d40]">{business.description}</p>

            <div className="mt-10">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#1c1d22]">
                <Wrench size={18} /> Services &amp; Amenities
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {business.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 rounded-lg border border-[#eef0f1] bg-white px-3.5 py-2.5 text-[13px] text-[#3a3d40]">
                    <CheckCircle2 size={16} className="shrink-0 text-[#00663f]" /> {amenity}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#1c1d22]">
                <MapPin size={18} /> Location
              </h2>
              <div className="relative h-[220px] overflow-hidden rounded-2xl bg-[#e3e5e8]">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00663f] text-white shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                    <MapPin size={18} />
                  </span>
                  <span className="rounded-md bg-white px-3 py-1 text-[11px] font-bold tracking-wide text-[#1c1d22] shadow-sm">
                    {business.name.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-[#eef0f1] bg-white p-5">
              <h3 className="mb-4 text-[15px] font-bold text-[#1c1d22]">Contact this business</h3>
              <div className="flex flex-col gap-2.5">
                <button type="button" className="flex items-center justify-center gap-2 rounded-lg border border-[#d7d9db] py-2.5 text-[13px] font-bold text-[#3a3d40] hover:bg-[#f7f7fa]">
                  <UserPlus size={16} /> Follow Business
                </button>
                <button type="button" className="flex items-center justify-center gap-2 rounded-lg border border-[#d7d9db] py-2.5 text-[13px] font-bold text-[#3a3d40] hover:bg-[#f7f7fa]">
                  <Star size={16} /> Give Review
                </button>
                <button type="button" className="flex items-center justify-center gap-2 rounded-lg bg-[#00663f] py-2.5 text-[13px] font-bold text-white hover:bg-[#00552f]">
                  <Calendar size={16} /> Book Now
                </button>
                <button type="button" className="flex items-center justify-center gap-2 rounded-lg bg-[#00663f] py-2.5 text-[13px] font-bold text-white hover:bg-[#00552f]">
                  <Phone size={16} /> Call Now
                </button>
                <button type="button" className="flex items-center justify-center gap-2 rounded-lg border border-[#c7d8cd] bg-[#eaf6f0] py-2.5 text-[13px] font-bold text-[#00663f] hover:bg-[#dcf0e6]">
                  <Mail size={16} /> Send Email
                </button>
                <button type="button" className="flex items-center justify-center gap-2 rounded-lg border border-[#d7d9db] py-2.5 text-[13px] font-bold text-[#3a3d40] hover:bg-[#f7f7fa]">
                  <FaWhatsapp size={16} /> WhatsApp
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#eef0f1] pt-4 text-[12px] text-[#5c6168]">
                <span>Status</span>
                <span className="flex items-center gap-1.5 font-semibold text-[#1c9a5b]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1c9a5b]" /> {business.status}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[12px] text-[#5c6168]">
                <span>Price Range</span>
                <span className="font-semibold text-[#1c1d22]">{business.priceRange}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#eef0f1] bg-white p-5">
              <h3 className="mb-4 text-[15px] font-bold text-[#1c1d22]">Business Info</h3>
              <div className="flex items-center gap-2.5 text-[13px] text-[#00663f]">
                <Globe size={16} />
                <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
                  {business.website}
                </a>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[12px] text-[#5c6168]">Social Networks</span>
                <div className="flex gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eceef0] text-[#3a3d40]">
                    <FaFacebookF size={13} />
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eceef0] text-[#3a3d40]">
                    <FaInstagram size={13} />
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eceef0] text-[#3a3d40]">
                    <FaYoutube size={13} />
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#eef0f1] bg-white p-5">
              <h3 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-[#1c1d22]">
                <Clock size={16} /> Opening Hours
              </h3>
              <div className="flex flex-col gap-2 text-[13px]">
                {business.openingHours.map((entry) => (
                  <div key={entry.day} className="flex items-center justify-between">
                    <span className={entry.day === "Thursday" ? "font-bold text-[#00663f]" : "text-[#3a3d40]"}>{entry.day}</span>
                    <span className={entry.closed ? "font-semibold text-[#d0432a]" : entry.day === "Thursday" ? "font-bold text-[#00663f]" : "text-[#3a3d40]"}>
                      {entry.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
