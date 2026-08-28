import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  compact?: boolean;
  href?: string;
  inverse?: boolean;
  className?: string;
};

export function LogoMark({
  className,
  prominent = false,
}: {
  className?: string;
  prominent?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative block shrink-0",
        prominent ? "h-28 w-40 sm:h-32 sm:w-48" : "h-11 w-[4.5rem]",
        className,
      )}
    >
      <Image
        src="/images/brand/drmc-science-club-logo.png"
        alt=""
        fill
        preload={prominent}
        sizes={prominent ? "192px" : "72px"}
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
      <LogoMark className="transition-transform duration-300 group-hover:scale-[1.03]" />
      {!compact && (
        <span className="leading-none">
          <span className={cn("block font-display text-[0.96rem] font-extrabold tracking-[-0.02em] sm:text-base", inverse ? "text-white" : "text-navy-950")}>DRMC Science Club</span>
          <span className={cn("mt-1 block text-[0.62rem] font-bold uppercase tracking-[0.18em]", inverse ? "text-teal-200" : "text-teal-700")}>Explore · Experiment · Excel</span>
        </span>
      )}
    </Link>
  );
}
