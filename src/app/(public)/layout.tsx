import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ScheduledNotificationBar } from "@/components/layout/scheduled-notification-bar";
import { MotionController } from "@/components/ui/motion-controller";
import { getActiveNotification, getNotifications } from "@/lib/content";

export const revalidate = 300;
// Published CMS records are read at request time. This keeps public pages live
// while avoiding a build-time dependency on the external Supabase API.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const notices = await getNotifications();
  const initialNotice = getActiveNotification(notices);

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
