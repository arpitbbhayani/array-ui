import React from "react";
import { cn } from "../../utils/cn";

export interface VideoEmbedProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  title?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | string;
  allowFullScreen?: boolean;
}

export const VideoEmbed = React.forwardRef<HTMLDivElement, VideoEmbedProps>(
  (
    {
      src,
      title = "Video player",
      aspectRatio = "16 / 9",
      allowFullScreen = true,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("aui-video-embed", className)}
        style={{ aspectRatio, ...style }}
        {...props}
      >
        {src ? (
          <iframe
            src={src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={allowFullScreen}
          />
        ) : (
          children
        )}
      </div>
    );
  }
);
VideoEmbed.displayName = "VideoEmbed";
