"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ScrollProgress from "./ScrollProgress";

const menuItems = [
  { id: 1, title: "How It Works", slug: "/how-it-works", subItems: [] },
  {
    id: 2,
    title: "Use Cases",
    slug: "/use-cases",
    subItems: [
      { id: 1, title: "Newsrooms", slug: "newsrooms" },
      { id: 2, title: "Podcasts", slug: "podcasts" },
      { id: 3, title: "Journalists", slug: "journalists" },
    ],
  },
  { id: 3, title: "Pricing", slug: "/pricing", subItems: [] },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="w-full border-b border-ugle-light/60 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="w-full px-6 py-4 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-1 flex justify-start">
            <Link
              href="/"
              className="flex items-center gap-3 transition-transform hover:scale-[1.02]"
            >
              <Image
                src="/Ugle Logo.png"
                alt="Ugle Logo"
                width={110}
                height={40}
                priority
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-ugle-slate">
            {menuItems.map((item) => (
              <div key={item.id} className="relative group">
                <Link
                  href={item.slug}
                  className={`${
                    item.subItems.length > 0 ? "flex items-center gap-1" : ""
                  } hover:text-[#75C043] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#75C043] after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100`}
                >
                  {item.title}
                  {item.subItems.length > 0 && (
                    <ChevronDown className="size-3 opacity-60 group-hover:rotate-180 transition-transform duration-300" />
                  )}
                </Link>

                {/* Desktop submenu */}
                {item.subItems.length > 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white border border-ugle-light/60 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 mt-3 translate-y-1 group-hover:translate-y-0">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.id}
                        href={`${item.slug}/${subItem.slug}`}
                        className="block px-4 py-2.5 hover:bg-[#F8FAF9] hover:text-[#75C043] text-sm transition-colors"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="flex-1 hidden md:flex justify-end items-center gap-6">
            <Link
              href="/request-demo"
              className="text-sm font-semibold text-ugle-slate hover:text-[#75C043] transition-colors"
            >
              Request Demo
            </Link>
            <Link
              href="/download"
              className="flex items-center justify-center bg-[#1C1C1C] hover:bg-[#75C043] text-white hover:text-[#1C1C1C] font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all text-sm"
            >
              Get Early Access
            </Link>
          </div>

          {/* Mobile: CTA pill + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            {/* not needed */}
            {/* <Link
              href="/download"
              className="flex items-center justify-center bg-[#1C1C1C] hover:bg-[#75C043] text-white hover:text-[#1C1C1C] font-semibold px-4 py-2 rounded-lg shadow-sm transition-all text-xs"
            >
              Get Early Access
            </Link> */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="p-2 rounded-lg text-ugle-slate hover:bg-ugle-light/60 transition-colors"
            >
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>
        <ScrollProgress />
      </header>

      {/* Mobile drawer overlay */}
      <div
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile drawer panel */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 z-60 h-full w-[min(320px,85vw)] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ugle-light/60">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <Image
              src="/Ugle Logo.png"
              alt="Ugle Logo"
              width={90}
              height={33}
            />
          </Link>
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg text-ugle-slate hover:bg-ugle-light/60 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.subItems.length === 0 ? (
                <Link
                  href={item.slug}
                  className="flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium text-ugle-slate hover:bg-[#F8FAF9] hover:text-[#75C043] transition-colors"
                >
                  {item.title}
                </Link>
              ) : (
                <>
                  {/* Accordion trigger */}
                  <button
                    aria-expanded={openAccordion === item.id}
                    onClick={() =>
                      setOpenAccordion(
                        openAccordion === item.id ? null : item.id,
                      )
                    }
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium text-ugle-slate hover:bg-[#F8FAF9] hover:text-[#75C043] transition-colors"
                  >
                    {item.title}
                    <ChevronDown
                      className={`size-4 opacity-60 transition-transform duration-300 ${
                        openAccordion === item.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Accordion body */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openAccordion === item.id
                        ? "max-h-60 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-ugle-light pl-4">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.id}
                          href={`${item.slug}/${subItem.slug}`}
                          className="block py-2 text-sm text-ugle-gray hover:text-[#75C043] transition-colors"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Drawer footer CTAs */}
        <div className="px-6 py-6 border-t border-ugle-light/60 space-y-3">
          <Link
            href="/request-demo"
            className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold text-ugle-slate border border-ugle-light hover:border-[#75C043] hover:text-[#75C043] transition-all"
          >
            Request Demo
          </Link>
          <Link
            href="/download"
            className="flex items-center justify-center w-full py-3 rounded-xl bg-[#1C1C1C] hover:bg-[#75C043] text-white hover:text-[#1C1C1C] font-semibold text-sm shadow-sm transition-all"
          >
            Get Early Access
          </Link>
        </div>
      </div>
    </>
  );
}
