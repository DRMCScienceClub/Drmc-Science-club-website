import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ScheduledNotificationBar } from "@/components/layout/scheduled-notification-bar";
import { MotionController } from "@/components/ui/motion-controller";
import { getActiveNotices, notices } from "@/data";

export const revalidate = 3600;

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const initialNotice = getActiveNotices()[0];

  return (
    <MotionController>
      <div className="site-canvas flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ScheduledNotificationBar notices={notices} initialNoticeId={initialNotice?.id ?? ""} />
        <SiteHeader />
        <div id="main-content" tabIndex={-1} className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </MotionController>
  );
}
