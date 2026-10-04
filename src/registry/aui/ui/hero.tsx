import * as React from "react";
import { cn } from "@/lib/utils";

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  bio?: React.ReactNode;
  avatarUrl?: string;
  avatarAlt?: string;
  actions?: React.ReactNode;
  socialLinks?: React.ReactNode;
}

export function Hero({
  title = "Hey, I am Arpit",
  subtitle = "engineering, databases, and systems. always building.",
  bio,
  avatarUrl,
  avatarAlt = "Portrait",
  actions,
  socialLinks,
  className,
  ...props
}: HeroProps) {
  return (
    <section
      className={cn("py-12 md:py-16 border-b border-border", className)}
      {...props}
    >
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12">
        <div className="flex-1 space-y-4 text-left">
          {title && (
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-foreground">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="font-serif italic text-lg md:text-xl text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
          {bio && <div className="text-base text-foreground/80 leading-relaxed pt-2">{bio}</div>}
          {actions && <div className="pt-2 flex items-center gap-3">{actions}</div>}
          {socialLinks && <div className="pt-3">{socialLinks}</div>}
        </div>
        {avatarUrl && (
          <div className="relative flex-shrink-0">
            <img
              src={avatarUrl}
              alt={avatarAlt}
              className="w-32 h-32 md:w-44 md:h-44 rounded-xl object-cover border-2 border-border shadow-lg"
              loading="eager"
            />
          </div>
        )}
      </div>
    </section>
  );
}
