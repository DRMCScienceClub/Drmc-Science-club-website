import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  compact?: boolean;
  href?: string;
  inverse?: boolean;
  className?: string;
};

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-11 shrink-0", className)}
      viewBox="0 0 64 64"
      fill="none"
    >
      <rect width="64" height="64" rx="18" fill="#0A2038" />
      <circle cx="32" cy="32" r="5" fill="#70DECF" />
      <ellipse cx="32" cy="32" rx="22" ry="9" stroke="#84C8FF" strokeWidth="2.4" />
      <ellipse cx="32" cy="32" rx="22" ry="9" stroke="#35C4B5" strokeWidth="2.4" transform="rotate(60 32 32)" />
      <ellipse cx="32" cy="32" rx="22" ry="9" stroke="#49A7FF" strokeWidth="2.4" transform="rotate(120 32 32)" />
      <circle cx="12" cy="32" r="2.6" fill="white" />
      <circle cx="43" cy="14" r="2.6" fill="white" />
      <circle cx="44" cy="48" r="2.6" fill="white" />
    </svg>
  );
}

export function Logo({ compact = false, href = "/", inverse = false, className }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="DRMC Science Club home"
      className={cn("group inline-flex items-center gap-3 rounded-sm", className)}
    >
      <LogoMark className="transition-transform duration-300 group-hover:rotate-6" />
      {!compact && (
        <span className="leading-none">
          <span className={cn("block font-display text-[0.96rem] font-extrabold tracking-[-0.02em] sm:text-base", inverse ? "text-white" : "text-navy-950")}>DRMC Science Club</span>
          <span className={cn("mt-1 block text-[0.62rem] font-bold uppercase tracking-[0.18em]", inverse ? "text-science-200" : "text-slate-500")}>Explore · Experiment · Excel</span>
        </span>
      )}
    </Link>
  );
}
