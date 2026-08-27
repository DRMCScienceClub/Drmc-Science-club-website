"use client";

import { useCallback, useSyncExternalStore } from "react";
import { NotificationBar } from "@/components/layout/notification-bar";
import type { Notice } from "@/types/content";

function activeNoticeId(notices: readonly Notice[]) {
  const now = Date.now();
  return notices.find((notice) => {
    const startsAt = new Date(notice.startsAt).getTime();
    const endsAt = new Date(notice.endsAt).getTime();
    return now >= startsAt && now <= endsAt;
  })?.id ?? "";
}

export function ScheduledNotificationBar({
  notices,
  initialNoticeId,
}: {
  notices: readonly Notice[];
  initialNoticeId: string;
}) {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const interval = window.setInterval(onStoreChange, 30_000);
    return () => window.clearInterval(interval);
  }, []);
  const getSnapshot = useCallback(() => activeNoticeId(notices), [notices]);
  const getServerSnapshot = useCallback(() => initialNoticeId, [initialNoticeId]);
  const currentId = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const notice = notices.find((item) => item.id === currentId);

  if (!notice) {
    return null;
  }

  return (
    <NotificationBar
      notice={{
        label: notice.title,
        message: notice.message,
        href: notice.link?.href ?? "/activities",
        action: notice.link?.label ?? "Learn more",
      }}
    />
  );
}
