import React from "react";
import {
  YoutubeIcon,
  TwitterIcon,
  LinkedinIcon,
  GithubIcon,
  RssIcon,
} from "../Icons";
import { cn } from "../../utils/cn";

export type SocialPlatform = "youtube" | "twitter" | "x" | "linkedin" | "github" | "rss" | "custom";

export interface SocialPillProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  platform?: SocialPlatform;
  label?: string;
  count?: string | number;
  icon?: React.ReactNode;
}

const getPlatformIcon = (platform: SocialPlatform): React.ReactNode => {
  switch (platform) {
    case "youtube":
      return <YoutubeIcon size={15} />;
    case "twitter":
    case "x":
      return <TwitterIcon size={15} />;
    case "linkedin":
      return <LinkedinIcon size={15} />;
    case "github":
      return <GithubIcon size={15} />;
    case "rss":
      return <RssIcon size={15} />;
    default:
      return null;
  }
};

const getPlatformDefaultLabel = (platform: SocialPlatform): string => {
  switch (platform) {
    case "youtube":
      return "YouTube";
    case "twitter":
      return "Twitter";
    case "x":
      return "X";
    case "linkedin":
      return "LinkedIn";
    case "github":
      return "GitHub";
    case "rss":
      return "RSS Feed";
    default:
      return "";
  }
};

export const SocialPill = React.forwardRef<HTMLAnchorElement, SocialPillProps>(
  (
    {
      platform = "custom",
      label,
      count,
      icon,
      href,
      className,
      children,
      target = "_blank",
      rel = "noopener noreferrer",
      ...props
    },
    ref
  ) => {
    const renderedIcon = icon || (platform !== "custom" ? getPlatformIcon(platform) : null);
    const displayLabel = label || (platform !== "custom" ? getPlatformDefaultLabel(platform) : "");

    return (
      <a
        ref={ref}
        href={href}
        target={target}
        rel={rel}
        className={cn("aui-social-pill", className)}
        {...props}
      >
        {renderedIcon && <span className="icon">{renderedIcon}</span>}
        <span>{displayLabel}</span>
        {count && (
          <span className="aui-text-muted" style={{ fontSize: "0.75rem" }}>
            ({count})
          </span>
        )}
        {children}
      </a>
    );
  }
);
SocialPill.displayName = "SocialPill";

export interface SocialPillGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SocialPillGroup = React.forwardRef<HTMLDivElement, SocialPillGroupProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("aui-social-pill-group", className)} {...props}>
        {children}
      </div>
    );
  }
);
SocialPillGroup.displayName = "SocialPillGroup";
