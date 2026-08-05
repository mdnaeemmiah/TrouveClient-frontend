import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#181a1b] text-white">
      <div className="mx-auto grid  grid-cols-1 gap-8 px-6 py-11 sm:grid-cols-2 lg:grid-cols-[1.65fr_1fr_1.35fr_1.5fr] lg:gap-12 lg:px-[max(30px,calc((100vw-1400px)/2))]">
        <div>
          <a className="mb-5 inline-block text-xl font-extrabold tracking-tight" href="#top">TrouveClients.fr</a>
          <p className="text-xs leading-relaxed text-[#a2a7ab]">Find. Choose. Contact. Your local business directory in France.</p>
          <div className="mt-5 flex gap-3">
            <a className="grid h-7 w-7 place-items-center rounded-full bg-[#363a3b] text-[11px] font-extrabold" href="#linkedin" aria-label="LinkedIn">in</a>
            <a className="grid h-7 w-7 place-items-center rounded-full bg-[#363a3b] text-[11px] font-extrabold" href="#x" aria-label="X">X</a>
            <a className="grid h-7 w-7 place-items-center rounded-full bg-[#363a3b] text-[11px] font-extrabold" href="#instagram" aria-label="Instagram">◎</a>
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-[13px] font-bold">For Customers</h2>
          <a className="mb-4 block text-[11px] text-[#bcc1c4]" href="#how">How it works</a>
          <a className="mb-4 block text-[11px] text-[#bcc1c4]" href="#blog">Blog</a>
          <a className="block text-[11px] text-[#bcc1c4]" href="#contact">Contact</a>
        </div>
        <div>
          <h2 className="mb-5 text-[13px] font-bold">For Businesses</h2>
          <a className="mb-4 block text-[11px] text-[#bcc1c4]" href="#join">Add your business</a>
          <a className="mb-4 block text-[11px] text-[#bcc1c4]" href="#dashboard">Business Dashboard</a>
          <a className="block text-[11px] text-[#bcc1c4]" href="#plans">Plans & pricing</a>
        </div>
        <div>
          <h2 className="mb-5 text-[13px] font-bold">Newsletter</h2>
          <p className="text-xs leading-relaxed text-[#a2a7ab]">Get tips and news for local businesses</p>
          <form className="mt-3 flex h-[38px] rounded-lg border border-[#4d5151] py-[3px] pr-[3px] pl-3">
            <input className="min-w-0 flex-1 bg-transparent text-[11px] text-white outline-0" aria-label="Your email address" placeholder="Your email" type="email" />
            <button className="grid w-9 place-items-center rounded-md bg-[#00663f]" aria-label="Subscribe" type="submit"><ArrowRight size={18} /></button>
          </form>
        </div>
      </div>
      <div className="flex min-h-[66px] flex-col items-start justify-center gap-4 border-t border-[#282c2d] px-6 py-5 text-[10px] text-[#8b9292] sm:flex-row sm:items-center sm:justify-between lg:px-[max(30px,calc((100vw-1400px)/2))]">
        <span>© 2024 TrouveClients.fr. All rights reserved.</span>
        <div className="flex gap-5 sm:gap-8">
          <a href="#terms">Terms of service</a>
          <a href="#privacy">Privacy policy</a>
        </div>
      </div>
    </footer>
  );
}
