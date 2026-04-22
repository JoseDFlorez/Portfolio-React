import { cn } from "~/lib/utils";

export function MonogramJF({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="24"
      height="24"
      role="img"
      aria-label="José Flórez monogram"
      className={cn("text-foreground", className)}
    >
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <g
        fontFamily="Fraunces, Georgia, serif"
        fill="currentColor"
        fontSize="20"
        fontWeight="400"
        fontStyle="italic"
      >
        <text x="6.5" y="23">
          J
        </text>
        <text x="16" y="23">
          F
        </text>
      </g>
    </svg>
  );
}
