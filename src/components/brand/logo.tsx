import Image from "next/image";
import Link from "next/link";
import clubLogoArtwork from "../../../public/images/brand/drmc-science-club-logo.png";
import { cn } from "@/lib/utils";

type LogoProps = {
  compact?: boolean;
  href?: string;
  inverse?: boolean;
  className?: string;
};

export function LogoMark({
  className,
  hero = false,
  prominent = false,
}: {
  className?: string;
  hero?: boolean;
  prominent?: boolean;
}) {
  const isPriorityArtwork = hero || prominent;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative block shrink-0",
        hero
          ? "aspect-[7/5] w-full"
          : prominent
            ? "h-28 w-40 sm:h-32 sm:w-48"
            : "h-11 w-[4.5rem]",
        className,
      )}
    >
      <Image
        src={clubLogoArtwork}
        alt=""
        fill
        preload={isPriorityArtwork}
        quality={100}
        sizes={hero ? "(min-width: 1280px) 560px, (min-width: 1024px) 42vw, 88vw" : prominent ? "192px" : "72px"}
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
        <span className="min-w-0 leading-none">
          <span className={cn("block whitespace-nowrap font-display text-[0.96rem] font-extrabold tracking-[-0.02em] sm:text-base", inverse ? "text-white" : "text-navy-950")}>DRMC Science Club</span>
          <span className={cn("mt-1.5 block whitespace-nowrap text-[0.55rem] font-extrabold uppercase tracking-[0.105em]", inverse ? "text-teal-200" : "text-teal-700")}>Explore · Experiment · Excel</span>
        </span>
      )}
    </Link>
  );
}
