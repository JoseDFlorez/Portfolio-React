import { cn } from "~/lib/utils";

const romanMap: Array<[number, string]> = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function toRoman(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "";
  let remaining = Math.floor(n);
  let out = "";
  for (const [value, symbol] of romanMap) {
    while (remaining >= value) {
      out += symbol;
      remaining -= value;
    }
  }
  return out;
}

export function YearNumeral({ year, className }: { year: number; className?: string }) {
  return (
    <span
      className={cn(
        "font-heading text-3xl font-light leading-none tracking-wide text-muted-foreground md:text-4xl",
        className,
      )}
      aria-label={String(year)}
    >
      {toRoman(year)}
    </span>
  );
}
