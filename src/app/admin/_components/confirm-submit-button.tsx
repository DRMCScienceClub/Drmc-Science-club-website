"use client";

export function ConfirmSubmitButton({
  children,
  message,
  className,
  disabled,
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      className={className}
      disabled={disabled}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
