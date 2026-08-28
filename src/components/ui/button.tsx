import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "light";
  icon?: IconName;
  iconPosition?: "left" | "right";
  className?: string;
  external?: boolean;
};

const variants = {
  primary: "bg-navy-950 text-white shadow-lg shadow-black/15 hover:bg-teal-700",
  secondary: "bg-gold-300 text-navy-950 shadow-lg shadow-gold-500/10 hover:bg-gold-200",
  outline: "border border-slate-300 bg-paper-50 text-navy-900 hover:border-teal-300 hover:bg-teal-50",
  ghost: "text-teal-700 hover:bg-teal-50",
  light: "bg-paper-50 text-navy-950 shadow-lg shadow-black/10 hover:bg-gold-50",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  icon = "arrow-right",
  iconPosition = "right",
  className,
  external = false,
}: ButtonLinkProps) {
  const externalProps = external ? { target: "_blank", rel: "noreferrer" } : {};
  return (
    <Link
      href={href}
      {...externalProps}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors duration-200",
        variants[variant],
        className,
      )}
    >
      {iconPosition === "left" && <Icon name={icon} className="size-4" />}
      {children}
      {iconPosition === "right" && <Icon name={icon} className="size-4" />}
    </Link>
  );
}
