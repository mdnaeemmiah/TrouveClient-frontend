import {
  ArrowRight,
  Heart,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Store,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CategoriesSection, { type Category } from "./CategoriesSection";
import { businesses } from "@/src/data/businesses";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";
import heroImage from "../assets/landing/hero.svg";

const assetsOrigin = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api\/v1\/?$/, "");

async function getPopularCategories(): Promise<Category[]> {
  try {
    const res = await baseApi.get<{ data: { categories: Category[] } }>(ENDPOINTS.popularCategories);
    return res.data?.data?.categories ?? [];
  } catch {
    return [];
  }
}

const benefits: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Search, title: "Easy Search", description: "Find what you need quickly and easily" },
  { icon: ShieldCheck, title: "Verified Businesses", description: "Trusted and vetted local businesses" },
  { icon: MapPin, title: "Near You", description: "Find businesses close to you" },
  { icon: Phone, title: "Direct Contact", description: "Contact by phone or WhatsApp" },
];

export default async function Landing() {
  const categories = await getPopularCategories();

  return (
    <main className="min-h-screen bg-[#f7f7fa] font-[family-name:var(--font-geist-sans)] text-[#1c1d22]">
      <Navbar />

      <section className="grid min-h-[430px] items-center gap-12 px-5 py-12 md:grid-cols-[minmax(390px,1fr)_minmax(420px,630px)] md:px-6 md:py-[72px] lg:px-[max(30px,calc((100vw-1400px)/2))]" id="top">
        <div className="max-w-[580px]">
          <p className="mb-5 w-fit rounded-full bg-[#e1eee8] px-3 py-1 text-[10px] font-extrabold uppercase text-[#00663f]">Find the best local businesses near you</p>
          <h1 className="text-[39px] font-bold leading-[1.08] tracking-tight md:text-[clamp(39px,4vw,54px)] lg:text-[60px]">Find trusted local<br />businesses with ease</h1>
          <p className="my-6 max-w-[470px] text-sm leading-relaxed text-[#50545a] md:text-[15px] lg:max-w-[520px] lg:text-[17px]">Discover the best local businesses, services and professionals near you and get in touch in just a few clicks.</p>
          <form className="flex h-[58px] items-center rounded-[11px] bg-white py-2 pr-2 pl-3.5 text-[#94999c] shadow-[0_5px_17px_#21212a10]" action="/search" method="get">
            <Search size={17} strokeWidth={2} />
            <input name="query" className="min-w-0 flex-1 border-0 px-2.5 text-[13px] text-[#1c1d22] outline-0" aria-label="Search local businesses" placeholder="What are you looking for?" />
            <button className="h-11 min-w-[83px] rounded-[9px] bg-[#00663f] text-[13px] font-bold text-white md:min-w-28" type="submit">Search</button>
          </form>
          <div className="mt-6 flex flex-wrap items-center gap-2.5 text-[11px] lg:text-xs">
            <span className="mr-1">Popular searches:</span>
            {["Restaurants", "Hair Salons", "Plumbers", "Dentists"].map((item) => <a className="rounded-full bg-[#eceef0] px-3 py-1.5" href="#categories" key={item}>{item}</a>)}
          </div>
        </div>
        <div className="relative ml-3 h-[245px] w-[calc(100%-25px)] max-w-[620px] shadow-[0_15px_25px_#1720181e] md:ml-0 md:h-[325px] md:w-full" aria-label="Local business owner in his cafe">
          <Image className="object-cover object-center" src={heroImage} alt="Local business owner in his cafe" fill priority />
          <div className="absolute -top-4 -right-2 grid origin-top-right scale-[.86] grid-cols-[59px_auto] items-center gap-x-2 rounded-xl bg-white px-4 py-3.5 text-[11px] shadow-[0_8px_22px_#1a1a1a14] md:-right-4 md:scale-100"><span className="flex"><i className="h-[21px] w-[21px] rounded-full border-2 border-white bg-[#83ddbc]" /><i className="-ml-2 h-[21px] w-[21px] rounded-full border-2 border-white bg-[#b5ead1]" /><i className="-ml-2 h-[21px] w-[21px] rounded-full border-2 border-white bg-[#69c8a3]" /></span><span className="text-xs tracking-widest text-[#ffa800]">★★★★★</span><strong className="col-start-2 whitespace-nowrap text-[10px]">4.8/5 (2,340 reviews)</strong></div>
          <div className="absolute -bottom-5 -left-3 flex origin-bottom-left scale-[.86] items-center gap-3 rounded-xl bg-white py-3.5 pr-5 pl-3.5 shadow-[0_8px_22px_#1a1a1a14] md:-left-8 md:scale-100"><span className="grid rounded-md bg-[#a3f5ca] p-2 text-[#00663f]"><Store size={19} /></span><strong className="text-xl text-[#00663f]">+12,000<small className="block text-[9px] font-medium text-[#222]">Businesses listed</small></strong></div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 bg-white px-5 py-7 sm:grid-cols-2 md:px-6 lg:grid-cols-4 lg:gap-8 lg:px-[max(30px,calc((100vw-1400px)/2))]" aria-label="Platform benefits">
        {benefits.map(({ icon: Icon, title, description }) => <article className="flex items-center gap-4" key={title}><span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-[#e3eee9] text-[#00663f]"><Icon size={18} /></span><div><h2 className="mb-1 text-[13px] font-bold tracking-tight lg:text-sm">{title}</h2><p className="text-[10px] text-[#555b60] lg:text-[11px]">{description}</p></div></article>)}
      </section>

      <CategoriesSection categories={categories} assetsOrigin={assetsOrigin} />

      {/* <section className="bg-[#f2f2f5] px-5 pt-12 pb-12 md:px-6 md:pt-[67px] md:pb-[72px] lg:px-[max(30px,calc((100vw-1400px)/2))]" id="businesses">
        <div className="mb-6 flex items-start justify-between gap-4 md:mb-9 md:items-end"><div><h2 className="mb-2.5 text-[25px] font-bold leading-none tracking-tight md:text-[29px] lg:text-[34px]">Featured Businesses</h2><p className="text-[13px] text-[#5c6168] lg:text-[15px]">The highest rated professionals in your region</p></div><Link className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[11px] font-bold text-[#00663f] md:text-[13px] lg:text-sm" href="/feature">View all businesses <ArrowRight size={17} /></Link></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {businesses.map((business) => <article className="overflow-hidden rounded-[15px] bg-white" key={business.id}>
            <div className="relative h-[205px] lg:h-[183px]"><Image className="object-cover" src={business.image} alt={business.name} fill /><span className="absolute top-3 left-3 rounded-md bg-[#00663f] px-2 py-1 text-[8px] font-extrabold uppercase text-white">Featured</span></div>
            <div className="px-[18px] pt-[15px] pb-[17px]"><p className="mb-1.5 text-[10px] lg:text-[11px]"><b className="text-sm text-[#f4ac00]">★</b> {business.rating}</p><h3 className="mb-2 text-xl leading-none font-bold tracking-tight lg:text-[22px]">{business.name}</h3><p className="mb-4 text-[11px] text-[#656a6f] lg:text-xs">{business.details}</p><div className="flex gap-2"><Link className="grid flex-1 place-items-center rounded-lg bg-[#00663f] py-2.5 text-[11px] font-bold text-white lg:text-xs" href={`/feature/${business.id}`}>Contact</Link><button className="grid w-9 place-items-center rounded-lg border border-[#dfe2e4] text-[#85908e]" type="button" aria-label={`Save ${business.name}`}><Heart size={20} /></button></div></div>
          </article>)}
        </div>
      </section> */}

      <section className="bg-[#00774c] px-5 py-[57px] text-center text-white md:py-[70px]" id="join"><h2 className="text-[31px] font-bold tracking-tight md:text-4xl lg:text-[42px]">Are you a business owner?</h2><p className="mx-auto my-5 max-w-[610px] text-sm leading-relaxed text-[#b5e0cc] lg:max-w-[680px] lg:text-[16px]">Grow your local presence and connect with thousands of potential customers in your city. Join our directory today.</p><div className="flex flex-col items-center justify-center gap-4 sm:flex-row"><a className="rounded-[10px] bg-white px-6 py-3.5 text-[13px] font-bold text-[#00663f] lg:text-sm" href="#join">Add Your Business Now</a><a className="rounded-[10px] border border-[#45b18a] px-6 py-3.5 text-[13px] font-bold lg:text-sm" href="#about">Learn More</a></div></section>

      <Footer />
    </main>
  );
}
