import { cn } from "@/lib/utils";

export type IconName =
  | "arrow-left"
  | "arrow-right"
  | "atom"
  | "book"
  | "calendar"
  | "check"
  | "chevron-down"
  | "chevron-right"
  | "clock"
  | "close"
  | "download"
  | "external"
  | "facebook"
  | "flask"
  | "globe"
  | "instagram"
  | "lightbulb"
  | "location"
  | "mail"
  | "menu"
  | "microscope"
  | "phone"
  | "rocket"
  | "shield"
  | "sparkles"
  | "target"
  | "trophy"
  | "users";

type IconProps = {
  name: IconName;
  className?: string;
  strokeWidth?: number;
};

function IconPaths({ name }: { name: IconName }) {
  switch (name) {
    case "arrow-left":
      return <><path d="m15 18-6-6 6-6"/><path d="M9 12h11"/></>;
    case "arrow-right":
      return <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>;
    case "atom":
      return <><circle cx="12" cy="12" r="1.7"/><path d="M19.4 7.1c1.8 3.1-1.7 8.2-6.3 10.9s-9.8 2.4-11.6-.7 1.7-8.2 6.3-10.9 9.8-2.4 11.6.7Z"/><path d="M4.6 7.1c-1.8 3.1 1.7 8.2 6.3 10.9s9.8 2.4 11.6-.7-1.7-8.2-6.3-10.9-9.8-2.4-11.6.7Z"/></>;
    case "book":
      return <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 7h8M8 11h6"/></>;
    case "calendar":
      return <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>;
    case "check":
      return <path d="m5 12 4 4L19 6"/>;
    case "chevron-down":
      return <path d="m6 9 6 6 6-6"/>;
    case "chevron-right":
      return <path d="m9 18 6-6-6-6"/>;
    case "clock":
      return <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>;
    case "close":
      return <><path d="m6 6 12 12M18 6 6 18"/></>;
    case "download":
      return <><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></>;
    case "external":
      return <><path d="M15 3h6v6M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>;
    case "facebook":
      return <path d="M14 8h3V4.5A13 13 0 0 0 14.4 4C11.8 4 10 5.6 10 8.6V11H7v4h3v7h4v-7h3.2l.8-4H14V8.8c0-.6.2-.8 0-.8Z"/>;
    case "flask":
      return <><path d="M9 3h6M10 3v6l-5.7 9.1A2 2 0 0 0 6 21h12a2 2 0 0 0 1.7-2.9L14 9V3"/><path d="M7.5 15h9"/></>;
    case "globe":
      return <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>;
    case "instagram":
      return <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></>;
    case "lightbulb":
      return <><path d="M9 18h6M10 22h4"/><path d="M8.2 14.5A7 7 0 1 1 15.8 14.5c-.9.7-.8 1.5-.8 1.5H9s.1-.8-.8-1.5Z"/></>;
    case "location":
      return <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>;
    case "mail":
      return <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>;
    case "menu":
      return <><path d="M4 7h16M4 12h16M4 17h16"/></>;
    case "microscope":
      return <><path d="m9 4 6 6M7 6l4-4 6 6-4 4zM8 12a5 5 0 0 0 8 4M5 21h14M12 17v4"/></>;
    case "phone":
      return <path d="M21 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.7 19.7 0 0 1 1.1 4.2 2 2 0 0 1 3.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L7.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>;
    case "rocket":
      return <><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2M9 15l-3-3s3.5-6.8 9.5-9c1.7-.6 4-.5 5.5-.1.4 1.5.5 3.8-.1 5.5-2.2 6-9 9.5-9 9.5l-3-3Z"/><circle cx="16" cy="8" r="2"/></>;
    case "shield":
      return <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></>;
    case "sparkles":
      return <><path d="m12 3-1.3 3.7L7 8l3.7 1.3L12 13l1.3-3.7L17 8l-3.7-1.3L12 3Z"/><path d="m5 14-.8 2.2L2 17l2.2.8L5 20l.8-2.2L8 17l-2.2-.8L5 14ZM19 13l-.8 2.2L16 16l2.2.8L19 19l.8-2.2L22 16l-2.2-.8L19 13Z"/></>;
    case "target":
      return <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>;
    case "trophy":
      return <><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 6H3v2a4 4 0 0 0 5 4M17 6h4v2a4 4 0 0 1-5 4"/></>;
    case "users":
      return <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></>;
  }
}

export function Icon({ name, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-5 shrink-0", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      <IconPaths name={name} />
    </svg>
  );
}
