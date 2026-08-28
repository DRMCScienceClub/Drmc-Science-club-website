import Image from "next/image";
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
    <span
      aria-hidden="true"
      className={cn(
        "relative size-11 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-navy-900/10",
        className,
      )}
    >
      <Image
        src="/images/brand/drmc-science-club-logo.jpeg"
        alt=""
        fill
        sizes="112px"
        className="object-contain"
      />
    </span>
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
