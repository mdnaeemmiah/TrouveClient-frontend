import Image from "next/image";
import Link from "next/link";
import {
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiImage,
  FiLifeBuoy,
  FiMapPin,
  FiPlus,
} from "react-icons/fi";
import img1 from "@/src/assets/details/img1.png";
import img2 from "@/src/assets/details/img2.png";
import img3 from "@/src/assets/details/img3.png";
import img4 from "@/src/assets/details/img4.png";

function EditLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Edit"
      className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#00663f]"
    >
      <FiEdit2 className="text-[14px]" />
    </Link>
  );
}

function CardHeader({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
        {icon}
        {title}
      </h3>
      <EditLink href={href} />
    </div>
  );
}

export default function Review() {
  return (
    <div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Review your information</h2>
        <p className="mt-1.5 text-sm text-slate-500">
          One last step! Make sure everything is correct before submitting your business to our moderation team.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <CardHeader
              icon={<FiCheckCircle className="text-[15px] text-[#00663f]" />}
              title="Basic Information"
              href="/onboarding/grow"
            />

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Business Name</p>
                <p className="mt-1 text-sm font-medium text-slate-800">Le Jardin de Provence</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Category</p>
                <p className="mt-1 text-sm font-medium text-slate-800">Gourmet Restaurant</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Description</p>
              <p className="mt-1 text-sm text-slate-600">
                Located in the heart of the city, we offer authentic Provençal cuisine with fresh and local
                products from the market. A unique culinary experience in a green setting.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <CardHeader
              icon={<FiMapPin className="text-[15px] text-[#00663f]" />}
              title="Contact & Location"
              href="/onboarding/contact"
            />

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Address</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">15 Rue des Lilas, 75001 Paris, France</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Phone</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">+33 1 23 45 67 89</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Website</p>
                  <p className="mt-1 text-sm font-medium text-[#00663f]">www.lejardindeprovence.fr</p>
                </div>
              </div>

              <div className="relative h-32 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 bg-[linear-gradient(to_right,rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.35)_1px,transparent_1px)] bg-[size:20px_20px]">
                <div className="flex h-full items-center justify-center">
                  <FiMapPin className="text-[26px] text-[#00663f] drop-shadow-md" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <CardHeader
              icon={<FiClock className="text-[15px] text-[#00663f]" />}
              title="Opening Hours"
              href="/onboarding/bookings"
            />

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-center">
                <p className="text-xs font-semibold text-slate-700">Mon - Fri</p>
                <p className="mt-0.5 text-xs text-slate-500">09:00 - 22:00</p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-center">
                <p className="text-xs font-semibold text-slate-700">Saturday</p>
                <p className="mt-0.5 text-xs text-slate-500">10:00 - 23:30</p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-center">
                <p className="text-xs font-semibold text-slate-700">Sunday</p>
                <p className="mt-0.5 text-xs font-medium text-[#c0524d]">Closed</p>
              </div>
              <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#e4f3ec] px-3 py-2.5 text-xs font-semibold text-[#00663f]">
                <FiCheck className="text-[12px]" />
                Verified
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <CardHeader
              icon={<FiImage className="text-[15px] text-[#00663f]" />}
              title="Photo Gallery"
              href="/onboarding/showCase"
            />

            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
              {[img1, img2, img3, img4].map((photo, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                  <Image src={photo} alt="" fill className="object-cover" />
                </div>
              ))}
              <Link
                href="/onboarding/showCase"
                className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-slate-200 text-slate-400 hover:border-[#00663f]/40 hover:text-[#00663f]"
              >
                <FiPlus className="text-[18px]" />
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-[#00663f] p-5 text-white shadow-sm">
            <h3 className="text-base font-bold">Finalize Registration</h3>
            <p className="mt-1.5 text-xs text-white/75">
              By submitting this form, you confirm that all information provided is accurate and that you accept
              our terms of use.
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                <FiCheck className="text-[13px]" />
                Profile 100% complete
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                <FiCheck className="text-[13px]" />
                Security verification OK
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                <FiCheck className="text-[13px]" />
                24/7 Support available
              </div>
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-[#4a8f6f] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#57a07e]"
            >
              Submit My Business
            </button>

            <p className="mt-3 text-center text-[11px] text-white/60">Average validation time: 24h to 48h</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs text-slate-500">Our teams here to support you in your digital visibility.</p>
            <Link
              href="/contact"
              className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#00663f] hover:text-[#004f31]"
            >
              <FiLifeBuoy className="text-[13px]" />
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
