import { useState } from "react";
import { cn } from "@/lib/utils";

interface TeamLogoProps {
  src: string;
  name: string;
  className?: string;
}

// Club logo from HRS; falls back to the team's initial when HRS has no logo.
export default function TeamLogo({ src, name, className }: TeamLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-semibold shrink-0",
          className,
        )}
        aria-hidden="true"
      >
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      className={cn("object-contain shrink-0", className)}
      onError={() => setFailed(true)}
    />
  );
}
