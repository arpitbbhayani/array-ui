import React from "react";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  fallback,
  size = "md",
  className = "",
}) => {
  return (
    <div className={`aui-avatar aui-avatar-${size} ${className}`}>
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <span>{fallback || alt.slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
};

export interface AvatarGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  className = "",
}) => {
  return <div className={`aui-avatar-group ${className}`}>{children}</div>;
};
