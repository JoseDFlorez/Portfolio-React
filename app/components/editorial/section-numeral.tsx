import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

type Props = {
  numeral: string;
  label: string;
  suffix?: ReactNode;
  className?: string;
};

export function SectionNumeral({ numeral, label, suffix, className }: Props) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden="true" className="text-foreground/60">
        §
      </span>
      <span className="tabular-nums">{numeral}</span>
      <span aria-hidden="true" className="text-muted-foreground/50">
        ·
      </span>
      <span className="text-foreground">{label}</span>
      {suffix ? (
        <>
          <span aria-hidden="true" className="text-muted-foreground/50">
            ·
          </span>
          <span className="text-muted-foreground">{suffix}</span>
        </>
      ) : null}
    </p>
  );
}
