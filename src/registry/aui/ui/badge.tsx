import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium font-mono transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-primary text-primary-foreground shadow-xs",
        default:
          "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-muted",
        outline: "text-foreground border-border",
        green:
          "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        amber:
          "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        red:
          "border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-400",
        destructive:
          "border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-400",
        blue:
          "border-sky-500/25 bg-sky-500/10 text-sky-600 dark:text-sky-400",
        violet:
          "border-purple-500/25 bg-purple-500/10 text-purple-600 dark:text-purple-400",
        cyan:
          "border-cyan-500/25 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
        pink:
          "border-pink-500/25 bg-pink-500/10 text-pink-600 dark:text-pink-400",
        dark:
          "border-transparent bg-foreground text-background",
        light:
          "border-transparent bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof badgeVariants> {
  href?: string;
  interactive?: boolean;
  target?: string;
  rel?: string;
}

const Badge = React.forwardRef<HTMLElement, BadgeProps>(
  ({ className, variant, href, interactive = false, target, rel, children, ...props }, ref) => {
    const isInteractive = interactive || Boolean(href);
    const classes = cn(
      badgeVariants({ variant }),
      isInteractive && "cursor-pointer hover:opacity-80 transition-opacity",
      className
    );

    if (href) {
      return (
        <a
          ref={ref as unknown as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={target === "_blank" && !rel ? "noopener noreferrer" : rel}
          className={classes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <span
        ref={ref as unknown as React.Ref<HTMLSpanElement>}
        className={classes}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
