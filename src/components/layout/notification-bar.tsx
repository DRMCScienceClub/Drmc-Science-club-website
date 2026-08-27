import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";

export type SiteNotice = {
  label: string;
  message: string;
  href: string;
  action: string;
};

export function NotificationBar({ notice }: { notice: SiteNotice }) {
  return (
    <div className="border-b border-white/10 bg-navy-950 text-white">
      <Container className="flex min-h-10 items-center justify-center gap-2 py-2 text-center text-xs sm:text-sm">
        <span className="hidden rounded-full bg-teal-400 px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-wider text-navy-950 sm:inline">{notice.label}</span>
        <span className="text-slate-200">{notice.message}</span>
        <Link href={notice.href} className="inline-flex shrink-0 items-center gap-1 rounded-sm font-bold text-science-200 underline decoration-science-400/50 underline-offset-4 hover:text-white">
          {notice.action}
          <Icon name="arrow-right" className="size-3.5" />
        </Link>
      </Container>
    </div>
  );
}
