import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  as: Element = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "nav";
}) {
  return <Element className={cn("mx-auto w-full max-w-[1240px] px-5 sm:px-7 lg:px-10", className)}>{children}</Element>;
}
