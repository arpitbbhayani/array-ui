import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-xs hover:opacity-95 active:scale-[0.99]",
        default:
          "bg-primary text-primary-foreground shadow-xs hover:opacity-95 active:scale-[0.99]",
        secondary:
          "bg-secondary text-secondary-foreground border border-border shadow-2xs hover:bg-muted active:scale-[0.99]",
        outline:
          "border border-border bg-transparent shadow-2xs hover:bg-secondary hover:text-secondary-foreground active:scale-[0.99]",
        ghost:
          "hover:bg-secondary hover:text-secondary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:opacity-95 active:scale-[0.99]",
        link: "text-primary underline-offset-4 hover:underline",
        amber:
          "bg-amber-500 text-stone-950 font-semibold border border-amber-600/30 shadow-xs hover:bg-amber-600 hover:text-stone-950 active:scale-[0.99]",
        yellow:
          "bg-amber-500 text-stone-950 font-semibold border border-amber-600/30 shadow-xs hover:bg-amber-600 hover:text-stone-950 active:scale-[0.99]",
        warning:
          "bg-amber-500 text-stone-950 font-semibold border border-amber-600/30 shadow-xs hover:bg-amber-600 hover:text-stone-950 active:scale-[0.99]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  isLoading?: boolean;
  loadingText?: React.ReactNode;
  spinner?: React.ReactNode;
}

const DefaultSpinner = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      iconPosition = "left",
      leftIcon,
      rightIcon,
      loading = false,
      isLoading = false,
      loadingText,
      spinner,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    const loadingActive = Boolean(loading || isLoading);
    const isDisabled = Boolean(disabled || loadingActive);
    const spinnerElement = spinner || <DefaultSpinner className="size-4" />;

    const effectiveLeftIcon = loadingActive
      ? (iconPosition === "right" && !leftIcon ? undefined : spinnerElement)
      : leftIcon || (iconPosition === "left" ? icon : undefined);

    const effectiveRightIcon = loadingActive
      ? (iconPosition === "right" && !leftIcon ? spinnerElement : undefined)
      : rightIcon || (iconPosition === "right" ? icon : undefined);

    const effectiveChildren = loadingActive && loadingText ? loadingText : children;
    const isIconOnly =
      (effectiveChildren === undefined ||
        effectiveChildren === null ||
        effectiveChildren === "") &&
      Boolean(effectiveLeftIcon || effectiveRightIcon);

    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          loadingActive && "cursor-wait"
        )}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loadingActive ? "true" : undefined}
        {...props}
      >
        {isIconOnly ? (
          effectiveLeftIcon || effectiveRightIcon
        ) : (
          <>
            {effectiveLeftIcon}
            {effectiveChildren}
            {effectiveRightIcon}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
