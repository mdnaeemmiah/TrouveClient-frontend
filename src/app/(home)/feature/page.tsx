import { ArrowRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { businesses } from "@/src/data/businesses";

export default function FeaturePage() {
  return (
    <div className="min-h-screen bg-[#f2f2f5] px-5 py-12 md:px-6 md:py-[72px] lg:px-[max(30px,calc((100vw-1400px)/2))]">
      <div className="mb-6 flex items-start justify-between gap-4 md:mb-9 md:items-end">
        <div>
          <h1 className="mb-2.5 text-[25px] font-bold leading-none tracking-tight md:text-[29px] lg:text-[34px]">Featured Businesses</h1>
          <p className="text-[13px] text-[#5c6168] lg:text-[15px]">The highest rated professionals in your region</p>
        </div>
        <Link className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[11px] font-bold text-[#00663f] md:text-[13px] lg:text-sm" href="/#businesses">
          View all businesses <ArrowRight size={17} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {businesses.map((business) => (
          <article className="overflow-hidden rounded-[15px] bg-white" key={business.id}>
            <div className="relative h-[205px] lg:h-[183px]">
              <Image className="object-cover" src={business.image} alt={business.name} fill />
              <span className="absolute top-3 left-3 rounded-md bg-[#00663f] px-2 py-1 text-[8px] font-extrabold uppercase text-white">Featured</span>
            </div>
            <div className="px-[18px] pt-[15px] pb-[17px]">
              <p className="mb-1.5 text-[10px] lg:text-[11px]"><b className="text-sm text-[#f4ac00]">★</b> {business.rating}</p>
              <h3 className="mb-2 text-xl leading-none font-bold tracking-tight lg:text-[22px]">{business.name}</h3>
              <p className="mb-4 text-[11px] text-[#656a6f] lg:text-xs">{business.details}</p>
              <div className="flex gap-2">
                <Link className="grid flex-1 place-items-center rounded-lg bg-[#00663f] py-2.5 text-[11px] font-bold text-white lg:text-xs" href={`/feature/${business.id}`}>
                  Contact
                </Link>
                <button className="grid w-9 place-items-center rounded-lg border border-[#dfe2e4] text-[#85908e]" type="button" aria-label={`Save ${business.name}`}>
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
