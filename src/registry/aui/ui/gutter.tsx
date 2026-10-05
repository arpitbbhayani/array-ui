import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gutterVariants = cva("shrink-0 select-none pointer-events-none", {
  variants: {
    orientation: {
      vertical: "w-full block",
      horizontal: "h-full inline-block",
    },
    size: {
      none: "",
      "2xs": "",
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: "",
      "2xl": "",
      "3xl": "",
      "4xl": "",
    },
  },
  compoundVariants: [
    { orientation: "vertical", size: "none", className: "h-0" },
    { orientation: "vertical", size: "2xs", className: "h-1" },
    { orientation: "vertical", size: "xs", className: "h-2" },
    { orientation: "vertical", size: "sm", className: "h-3" },
    { orientation: "vertical", size: "md", className: "h-6" },
    { orientation: "vertical", size: "lg", className: "h-9" },
    { orientation: "vertical", size: "xl", className: "h-12" },
    { orientation: "vertical", size: "2xl", className: "h-18" },
    { orientation: "vertical", size: "3xl", className: "h-24" },
    { orientation: "vertical", size: "4xl", className: "h-32" },

    { orientation: "horizontal", size: "none", className: "w-0" },
    { orientation: "horizontal", size: "2xs", className: "w-1" },
    { orientation: "horizontal", size: "xs", className: "w-2" },
    { orientation: "horizontal", size: "sm", className: "w-3" },
    { orientation: "horizontal", size: "md", className: "w-6" },
    { orientation: "horizontal", size: "lg", className: "w-9" },
    { orientation: "horizontal", size: "xl", className: "w-12" },
    { orientation: "horizontal", size: "2xl", className: "w-18" },
    { orientation: "horizontal", size: "3xl", className: "w-24" },
    { orientation: "horizontal", size: "4xl", className: "w-32" },
  ],
  defaultVariants: {
    orientation: "vertical",
    size: "md",
  },
});

export type GutterNamedSize =
  | "none"
  | "2xs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

export type GutterSize = GutterNamedSize | number | string;

export interface GutterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    Omit<VariantProps<typeof gutterVariants>, "size"> {
  /**
   * Spacing size preset or custom number (px) / string dimension.
   * @default "md"
   */
  size?: GutterSize;
  /**
   * Axis shorthand: "y" sets orientation="vertical", "x" sets orientation="horizontal".
   */
  axis?: "x" | "y";
}

const NAMED_SIZES: readonly string[] = [
  "none",
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
];

export const Gutter = React.forwardRef<HTMLDivElement, GutterProps>(
  (
    {
      className,
      orientation = "vertical",
      axis,
      size = "md",
      style,
      ...props
    },
    ref
  ) => {
    const effectiveOrientation =
      axis === "x" ? "horizontal" : axis === "y" ? "vertical" : orientation;
    const isNamed =
      typeof size === "string" && NAMED_SIZES.includes(size);

    const customDim =
      typeof size === "number"
        ? `${size}px`
        : !isNamed && size
        ? String(size)
        : undefined;

    const dynamicStyle: React.CSSProperties = {
      ...(customDim
        ? effectiveOrientation === "horizontal"
          ? { width: customDim }
          : { height: customDim }
        : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        role="presentation"
        aria-hidden="true"
        className={cn(
          gutterVariants({
            orientation: effectiveOrientation,
            size: isNamed ? (size as GutterNamedSize) : undefined,
          }),
          className
        )}
        style={dynamicStyle}
        {...props}
      />
    );
  }
);

Gutter.displayName = "Gutter";

export const Spacer = Gutter;
