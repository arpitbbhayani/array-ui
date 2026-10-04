import React from "react";
import { cn } from "../../utils/cn";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = "Avatar",
      fallback,
      size = "md",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("aui-avatar", `aui-avatar-${size}`, className)}
        {...props}
      >
        {children ? (
          children
        ) : src ? (
          <img src={src} alt={alt} />
        ) : (
          <span>{fallback || alt.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, alt = "Avatar", ...props }, ref) => (
  <img
    ref={ref}
    alt={alt}
    className={cn("aui-avatar-image", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

export const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("aui-avatar-fallback", className)}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("aui-avatar-group", className)} {...props}>
        {children}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";
