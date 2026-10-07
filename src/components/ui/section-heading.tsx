import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  inverse = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverse?: boolean;
  className?: string;
}) {
  return (
    <div data-reveal="up" className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <span className={cn("eyebrow", inverse && "!text-teal-200 before:!bg-gold-300")}>{eyebrow}</span>}
      <h2 className={cn("mt-3 text-balance font-display text-[1.7rem] leading-[1.16] font-extrabold tracking-[-0.035em] sm:mt-4 sm:text-4xl sm:leading-[1.111] lg:text-[2.75rem] lg:leading-[1.1]", inverse ? "text-white" : "text-navy-950")}>{title}</h2>
      {description && <p className={cn("mt-3 text-sm leading-6 sm:mt-4 sm:text-lg sm:leading-7", inverse ? "text-slate-300" : "text-slate-600")}>{description}</p>}
    </div>
  );
}
