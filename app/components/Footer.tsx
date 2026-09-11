import Link from "next/link";
import Image from "next/image";
import FooterNewsletter from "./forms/FooterNewsletter";
import RegionSwitcher from "./RegionSwitcher";
import FooterCookieButton from "./cookie/FooterCookieButton";

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-white pt-10 md:pt-16 overflow-hidden border-t border-ugle-slate/20 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-4 md:mb-6 relative">
          <div className="md:col-span-6 lg:col-span-5 flex flex-col">
            <Image
              src="/Ugle Logo White.png"
              alt="Ugle Logo"
              width={110}
              height={40}
            />
            {/* <Logo dark /> */}
            <p className="mt-6 text-gray-400 font-medium leading-relaxed mb-8">
              The local-first search application for media professionals. Find
              the soundbite. Pull the clip. Hit the deadline.
            </p>
            <div className="w-full flex flex-col relative min-h-24">
              <label className="block font-mono text-xs text-[#75C043] mb-3 tracking-widest uppercase font-semibold">
                Become an Ugler Now
              </label>
              <FooterNewsletter />
            </div>
          </div>

          <div className="md:col-span-3 lg:col-start-8 lg:col-span-2 flex flex-col gap-4 text-sm font-semibold text-gray-400 mt-4 md:mt-0">
            <Link
              href="/how-it-works"
              className="hover:text-white transition-colors"
            >
              How it works
            </Link>
            <Link
              href="/use-cases"
              className="hover:text-white transition-colors"
            >
              Use cases
            </Link>
            <Link
              href="/pricing"
              className="hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/request-demo"
              className="hover:text-white transition-colors"
            >
              Request Demo
            </Link>
            <Link
              href="/download"
              className="hover:text-white transition-colors text-[#75C043]"
            >
              Get Early Access
            </Link>
          </div>

          <div className="md:col-span-3 lg:col-span-2 flex flex-col gap-4 text-sm font-semibold text-gray-400 mt-4 md:mt-0">
            {/* <Link
              href="/get-early-access"
              className="hover:text-white transition-colors"
            >
              Get Early Access
            </Link> */}
            <Link
              href="/security"
              className="hover:text-white transition-colors"
            >
              Security
            </Link>
            <Link
              href="/changelog"
              className="hover:text-white transition-colors"
            >
              Changelog
            </Link>
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About Us
            </Link>
          </div>

          <div className="absolute bottom-0 right-0 z-0 pointer-events-none group">
            <Image
              src="/Ugle Mark White.png"
              alt="Ugle Mark"
              width={80}
              height={80}
            />
          </div>
        </div>

        <div className="py-3 md:py-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href="/privacy-policy"
              className="text-gray-400 hover:text-white transition-colors font-mono text-xs"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors font-mono text-xs"
            >
              Terms of Service
            </Link>
            <Link
              href="/eula"
              className="text-gray-400 hover:text-white transition-colors font-mono text-xs"
            >
              EULA
            </Link>
            <FooterCookieButton />
          </div>
          <div className="text-gray-400 font-mono text-xs text-center sm:text-left">
            © 2026 Ugle. All rights reserved.
          </div>

          <RegionSwitcher />
        </div>
      </div>
    </footer>
  );
}
