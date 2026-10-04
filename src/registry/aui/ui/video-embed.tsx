import * as React from "react";
import { cn } from "@/lib/utils";

export interface VideoEmbedProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  title?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | string;
  allowFullScreen?: boolean;
}

export function VideoEmbed({
  src,
  title = "Video player",
  aspectRatio = "16 / 9",
  allowFullScreen = true,
  className,
  children,
  style,
  ...props
}: VideoEmbedProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-xl overflow-hidden border border-border bg-card my-5",
        className
      )}
      style={{ aspectRatio, ...style }}
      {...props}
    >
      {src ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen={allowFullScreen}
        />
      ) : (
        children
      )}
    </div>
  );
}
