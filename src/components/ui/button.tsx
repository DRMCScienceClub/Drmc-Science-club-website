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
  primary: "bg-science-600 text-white shadow-lg shadow-science-700/15 hover:bg-science-700",
  secondary: "bg-teal-500 text-navy-950 shadow-lg shadow-teal-700/10 hover:bg-teal-400",
  outline: "border border-slate-300 bg-white text-navy-900 hover:border-science-300 hover:bg-science-50",
  ghost: "text-science-700 hover:bg-science-50",
  light: "bg-white text-navy-950 shadow-lg shadow-black/10 hover:bg-science-50",
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
