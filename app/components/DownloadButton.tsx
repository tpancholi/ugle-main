import Image from "next/image";
import Link from "next/link";
import React from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Platform = "windows" | "macos";
type Variant = "filled" | "outline" | "ghost" | "minimal";
type Size = "sm" | "md" | "lg";

interface DownloadButtonProps {
  /** Target platform — controls icon and default label */
  platform?: Platform;
  /** Visual style variant */
  variant?: Variant;
  /** Button size */
  size?: Size;
  /** Override the top sub-label (e.g. "Get Early Access for") */
  subLabel?: string;
  /** Override the main label (e.g. "Windows") */
  label?: string;
  /** Destination URL */
  href?: string;
  /** Render as a <button> element instead of a <Link> */
  asButton?: boolean;
  /** onClick handler — only used when asButton=true */
  onClick?: () => void;
  /** Extra Tailwind class overrides */
  className?: string;
  /** Disabled / coming-soon state */
  disabled?: boolean;
}

// ─── Per-platform config ─────────────────────────────────────────────────────

const PLATFORM_CONFIG: Record<
  Platform,
  {
    defaultLabel: string;
    lightIcon: string; // white icon — for filled/dark backgrounds
    darkIcon: string; // dark icon — for light backgrounds
    defaultHref: string;
  }
> = {
  windows: {
    defaultLabel: "Windows",
    lightIcon: "/Button Logos/windows-logo-light.svg",
    darkIcon: "/Button Logos/windows-logo-dark.svg",
    defaultHref: "/download?platform=windows",
  },
  macos: {
    defaultLabel: "macOS",
    lightIcon: "/Button Logos/apple-logo-light.svg",
    darkIcon: "/Button Logos/apple-logo-dark.svg",
    defaultHref: "/download?platform=macos",
  },
};

// ─── Size tokens ─────────────────────────────────────────────────────────────

const SIZE_STYLES: Record<
  Size,
  {
    wrapper: string;
    iconBox: string;
    iconSize: number;
    subLabelText: string;
    labelText: string;
  }
> = {
  sm: {
    wrapper: "gap-2.5 px-4 py-2.5 rounded-xl",
    iconBox: "w-7 h-7",
    iconSize: 20,
    subLabelText: "text-[9px] leading-tight tracking-widest",
    labelText: "text-base font-bold leading-tight",
  },
  md: {
    wrapper: "gap-3.5 px-6 py-3.5 rounded-2xl",
    iconBox: "w-9 h-9",
    iconSize: 26,
    subLabelText: "text-[10px] leading-tight tracking-widest",
    labelText: "text-xl font-bold leading-tight",
  },
  lg: {
    wrapper: "gap-5 px-8 py-4 rounded-2xl",
    iconBox: "w-11 h-11",
    iconSize: 32,
    subLabelText: "text-xs leading-tight tracking-widest",
    labelText: "text-2xl font-bold leading-tight",
  },
};

// ─── Variant tokens ──────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<
  Variant,
  {
    wrapper: string;
    subLabelColor: string;
    labelColor: string;
    iconScheme: "light" | "dark";
  }
> = {
  /**
   * Solid green — matches reference image 1.
   * White icon + white text on ugle-green background.
   */
  filled: {
    wrapper:
      "bg-ugle-green hover:bg-[#86d950] active:bg-[#68b03a] transition-all duration-200",
    subLabelColor: "text-white/85",
    labelColor: "text-white",
    iconScheme: "light",
  },
  /**
   * White card with border — matches reference image 2.
   * Dark icon + dark text, border glows green on hover.
   */
  outline: {
    wrapper:
      "bg-white border border-[#d4d4d4] hover:border-ugle-green transition-all duration-200",
    subLabelColor: "text-ugle-gray",
    labelColor: "text-ugle-slate",
    iconScheme: "dark",
  },
  /**
   * Transparent background — border appears on hover.
   * Subtle, versatile for use over any surface.
   */
  ghost: {
    wrapper:
      "bg-transparent border border-transparent hover:border-ugle-green/50 hover:bg-[#75c043]/5 transition-all duration-200",
    subLabelColor: "text-ugle-gray",
    labelColor: "text-ugle-slate",
    iconScheme: "dark",
  },
  /**
   * No box at all — icon + text only.
   * Ideal for inline or footer contexts.
   */
  minimal: {
    wrapper: "bg-transparent transition-colors duration-200",
    subLabelColor: "text-ugle-gray group-hover:text-[#75c043]/70",
    labelColor: "text-ugle-slate group-hover:text-ugle-green",
    iconScheme: "dark",
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function DownloadButton({
  platform = "windows",
  variant = "filled",
  size = "md",
  subLabel,
  label,
  href,
  asButton = false,
  onClick,
  className = "",
  disabled = false,
}: DownloadButtonProps) {
  const config = PLATFORM_CONFIG[platform];
  const s = SIZE_STYLES[size];
  const v = VARIANT_STYLES[variant];

  const resolvedHref = href ?? config.defaultHref;
  const resolvedLabel = label ?? config.defaultLabel;
  const resolvedSubLabel = subLabel ?? "Get Early Access for";

  const iconSrc = v.iconScheme === "light" ? config.lightIcon : config.darkIcon;

  const baseClasses = [
    "group inline-flex items-center cursor-pointer select-none",
    s.wrapper,
    v.wrapper,
    disabled ? "opacity-50 pointer-events-none" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {/* Platform icon */}
      <span className={`${s.iconBox} relative shrink-0`} aria-hidden="true">
        <Image
          src={iconSrc}
          alt={`${resolvedLabel} logo`}
          fill
          className="object-contain"
        />
      </span>

      {/* Text block */}
      <span className="flex flex-col items-start">
        <span
          className={`${s.subLabelText} ${v.subLabelColor} uppercase font-medium`}
        >
          {resolvedSubLabel}
        </span>
        <span className={`${s.labelText} ${v.labelColor}`}>
          {resolvedLabel}
        </span>
      </span>
    </>
  );

  if (asButton) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={baseClasses}
        aria-label={`${resolvedSubLabel} ${resolvedLabel}`}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link
      href={resolvedHref}
      className={baseClasses}
      aria-label={`${resolvedSubLabel} ${resolvedLabel}`}
    >
      {inner}
    </Link>
  );
}
