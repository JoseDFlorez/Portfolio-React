import { cn } from "~/lib/utils";
import { useInView } from "~/hooks/use-in-view";

export function Hairline({
  className,
  variant = "solid",
  reveal = false,
}: {
  className?: string;
  variant?: "solid" | "dashed";
  reveal?: boolean;
}) {
  const { ref, inView } = useInView<HTMLHRElement>();

  return (
    <hr
      ref={reveal ? ref : undefined}
      data-hairline={reveal ? "reveal" : undefined}
      data-in-view={reveal ? (inView ? "true" : "false") : undefined}
      className={cn(
        "my-0 h-px w-full border-0 bg-border",
        variant === "dashed" &&
          "h-0 bg-transparent border-t border-dashed border-border",
        className,
      )}
      role="presentation"
    />
  );
}
