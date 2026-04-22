import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

type Props = {
  label: ReactNode;
  value: ReactNode;
  className?: string;
};

export function RightAlignedMeta({ label, value, className }: Props) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 font-sans text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
        className,
      )}
    >
      <span className="truncate">{label}</span>
      <span aria-hidden="true" className="flex-1 border-b border-dotted border-border" />
      <span className="tabular-nums text-foreground">{value}</span>
    </div>
  );
}
