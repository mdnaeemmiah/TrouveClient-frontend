import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  Globe,
  MapPin,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import { notFound } from "next/navigation";
import { businesses, getBusinessById } from "@/src/data/businesses";
import { ENDPOINTS } from "@/src/api/endPoints";
import businessOneImage from "@/src/assets/landing/img1.svg";
import detailOneImage from "@/src/assets/details/img1.png";
import GiveReviewButton from "@/src/components/GiveReviewButton";
import BookTableButton from "@/src/components/BookTableButton";
import FeatureMap from "@/src/components/home/FeatureMapLoader";
import FollowBusinessButton from "@/src/components/home/FollowBusinessButton";
import ContactActions from "@/src/components/home/ContactActions";
import ProfileViewTracker from "@/src/components/home/ProfileViewTracker";

export function generateStaticParams() {
  return businesses.map((business) => ({ id: business.id }));
}

async function getApiBusiness(slug: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.getBusinessById(encodeURIComponent(slug))}`, { cache: "no-store" });
  if (!response.ok) return null;
  const payload = await response.json() as { data?: { business?: Record<string, unknown> } | Record<string, unknown>; business?: Record<string, unknown> };
  const raw = (payload.data && !Array.isArray(payload.data) && "_id" in payload.data ? payload.data : payload.data?.business || payload.business) as Record<string, unknown> | undefined;
  if (!raw) return null;
  const category = raw.categoryId as { name?: string } | string | undefined;
  const location = raw.location as { address?: string; city?: string; postalCode?: string; coordinates?: { coordinates?: number[] } } | undefined;
  const coordinates = location?.coordinates?.coordinates;
  const contactInfo = raw.contactInfo as { website?: string; phone?: string; email?: string; whatsapp?: string; whatsApp?: string } | undefined;
  const hours = raw.openingHours as { day: string; open: string; close: string; isClosed?: boolean }[] | undefined;
  const bc = raw.bookingConfig as {
    isEnabled?: boolean;
    showModalImage?: boolean;
    modalImage?: string;
    templateType?: string;
    standardFields?: { fullName?: string; email?: string; phone?: string; guestCount?: string };
    customFields?: { fieldName: string; isRequired: boolean }[];
    allowSpecialRequests?: boolean;
    allowOccasions?: boolean;
    allowNewsletterOptIn?: boolean;
  } | undefined;
  return {
    id: String(raw.slug || raw._id || slug),
    businessId: typeof raw._id === "string" ? raw._id : undefined,
    name: String(raw.name || "Business"),
    category: typeof category === "string" ? category : category?.name || "Business",
    location: [location?.address, location?.city, location?.postalCode].filter(Boolean).join(", ") || "Location not provided",
    details: "Business",
    rating: `${Number(raw.averageRating || 0).toFixed(1)} (${Number(raw.reviewCount || 0)} reviews)`,
    trustScore: 0,
    image: businessOneImage,
    detailImage: detailOneImage,
    gallery: [raw.coverImage, raw.logo, ...(Array.isArray(raw.gallery) ? raw.gallery : [])].filter((image): image is string => typeof image === "string"),
    additionalPhotosCount: Array.isArray(raw.gallery) ? raw.gallery.length : 0,
    description: String(raw.description || "No description provided."),
    amenities: Array.isArray(raw.services) ? raw.services.map(String) : [],
    services: Array.isArray(raw.services) ? raw.services.map(String) : [],
    website: String(contactInfo?.website || ""),
    phone: String(contactInfo?.phone || raw.phone || ""),
    email: String(contactInfo?.email || raw.email || ""),
    whatsapp: String(contactInfo?.whatsapp || contactInfo?.whatsApp || raw.whatsapp || ""),
    status: "Open Now" as const,
    priceRange: "Not provided",
    latitude: coordinates?.[1],
    longitude: coordinates?.[0],
    openingHours: (hours || []).map((entry) => ({ day: entry.day, hours: entry.isClosed ? "Closed" : `${entry.open} - ${entry.close}`, closed: entry.isClosed })),
    isFollowing: Boolean(raw.isFollowing ?? raw.following ?? raw.followed ?? raw.isFollowed),
    bookingConfig: bc ? {
      isEnabled: bc.isEnabled ?? true,
      showModalImage: bc.showModalImage ?? false,
      modalImage: bc.modalImage,
      templateType: bc.templateType,
      standardFields: {
        fullName: (bc.standardFields?.fullName ?? "OPTIONAL") as "REQUIRED" | "OPTIONAL" | "HIDDEN",
        email: (bc.standardFields?.email ?? "OPTIONAL") as "REQUIRED" | "OPTIONAL" | "HIDDEN",
        phone: (bc.standardFields?.phone ?? "OPTIONAL") as "REQUIRED" | "OPTIONAL" | "HIDDEN",
        guestCount: (bc.standardFields?.guestCount ?? "OPTIONAL") as "REQUIRED" | "OPTIONAL" | "HIDDEN",
      },
      customFields: bc.customFields ?? [],
      allowSpecialRequests: bc.allowSpecialRequests ?? false,
      allowOccasions: bc.allowOccasions ?? false,
      allowNewsletterOptIn: bc.allowNewsletterOptIn ?? false,
    } : undefined,
  };
}

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const business = getBusinessById(id) || await getApiBusiness(id);

  if (!business) {
    notFound();
  }

  const resolvedBusiness = business as typeof business & {
    coverImage?: string;
    logo?: string;
    gallery?: string[];
    services?: string[];
    additionalPhotosCount?: number;
    latitude?: number;
    longitude?: number;
    phone?: string;
    email?: string;
    whatsapp?: string;
    isFollowing?: boolean;
    bookingConfig?: {
      isEnabled: boolean;
      showModalImage: boolean;
      modalImage?: string;
      templateType?: string;
      standardFields: { fullName?: "REQUIRED" | "OPTIONAL" | "HIDDEN"; email?: "REQUIRED" | "OPTIONAL" | "HIDDEN"; phone?: "REQUIRED" | "OPTIONAL" | "HIDDEN"; guestCount?: "REQUIRED" | "OPTIONAL" | "HIDDEN" };
      customFields: { fieldName: string; isRequired: boolean }[];
      allowSpecialRequests: boolean;
      allowOccasions: boolean;
      allowNewsletterOptIn: boolean;
    };
  };

  const apiImages = [resolvedBusiness.coverImage, resolvedBusiness.logo, ...(resolvedBusiness.gallery || [])].filter((image): image is string => Boolean(image));
  const hasApiMedia = resolvedBusiness.gallery !== undefined;

  return (
    <div className="min-h-screen bg-[#f7f7fa]">
      <ProfileViewTracker businessId={resolvedBusiness.businessId} />
      <div className="mx-auto px-5 py-8 md:px-6 lg:px-[max(30px,calc((100vw-1400px)/2))] lg:py-10">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.6fr_1fr] md:grid-rows-1">
          <div className="relative h-[260px] overflow-hidden rounded-2xl md:h-[380px]">
            {apiImages[0] ? <img className="h-full w-full object-cover" src={apiImages[0]} alt={business.name} /> : hasApiMedia ? <div className="grid h-full place-items-center bg-[#e7e8eb] text-sm font-semibold text-[#5c6168]">No image available</div> : <Image className="object-cover" src={business.detailImage} alt={business.name} fill priority />}
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-3">
            <div className="relative overflow-hidden rounded-2xl">
              {apiImages[1] ? <img className="h-full w-full object-cover" src={apiImages[1]} alt={`${business.name} gallery image 1`} /> : hasApiMedia ? <div className="h-full bg-[#e7e8eb]" /> : <Image className="object-cover" src={business.image} alt="" fill />}
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              {apiImages[2] ? <img className="h-full w-full object-cover" src={apiImages[2]} alt={`${business.name} gallery image 2`} /> : hasApiMedia ? <div className="h-full bg-[#e7e8eb]" /> : <Image className="object-cover" src={business.detailImage} alt="" fill />}
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              {apiImages[3] ? <img className="h-full w-full object-cover" src={apiImages[3]} alt={`${business.name} gallery image 3`} /> : hasApiMedia ? <div className="h-full bg-[#e7e8eb]" /> : <Image className="object-cover" src={business.image} alt="" fill />}
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
              <FeatureMap label={business.name.toUpperCase()} latitude={"latitude" in business ? business.latitude : undefined} longitude={"longitude" in business ? business.longitude : undefined} />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-[#eef0f1] bg-white p-5">
              <h3 className="mb-4 text-[15px] font-bold text-[#1c1d22]">Contact this business</h3>
              <div className="flex flex-col gap-2.5">
                {/* <FollowBusinessButton businessId={business.businessId} businessName={business.name} initialFollowing={Boolean((business as { isFollowing?: boolean }).isFollowing)} /> */}
                <FollowBusinessButton
                  businessId={resolvedBusiness.businessId || (business as { businessId?: string }).businessId || id}
                  slug={id}
                  businessName={business.name}
                  initialFollowing={Boolean(resolvedBusiness.isFollowing ?? (business as { isFollowing?: boolean }).isFollowing)}
                />
                <GiveReviewButton
                  businessName={business.name}
                  businessId={resolvedBusiness.businessId || (business as { businessId?: string }).businessId}
                />
                <BookTableButton
                  businessId={resolvedBusiness.businessId}
                  businessName={business.name}
                  location={business.location}
                  category={business.category}
                  services={resolvedBusiness.services ?? business.amenities}
                  modalImage={resolvedBusiness.bookingConfig?.modalImage}
                  bookingConfig={resolvedBusiness.bookingConfig}
                />
                <ContactActions
                  businessId={resolvedBusiness.businessId}
                  phone={resolvedBusiness.phone}
                  email={resolvedBusiness.email}
                  whatsapp={resolvedBusiness.whatsapp || resolvedBusiness.phone}
                  businessName={business.name}
                />
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
                  <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eceef0] text-[#3a3d40] hover:bg-[#1877f2] hover:text-white transition-colors">
                    <FaFacebookF size={13} />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eceef0] text-[#3a3d40] hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white transition-colors">
                    <FaInstagram size={13} />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eceef0] text-[#3a3d40] hover:bg-[#ff0000] hover:text-white transition-colors">
                    <FaYoutube size={13} />
                  </a>
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
