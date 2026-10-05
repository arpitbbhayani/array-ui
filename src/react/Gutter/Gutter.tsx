import React from "react";
import { cn } from "../../utils/cn";

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
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Spacing preset size ("none" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl")
   * or a custom number (pixels) / CSS dimension string ("2rem", "40px").
   * @default "md"
   */
  size?: GutterSize;
  /**
   * Spacing orientation. Defaults to "vertical" (height).
   * @default "vertical"
   */
  orientation?: "vertical" | "horizontal";
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
      size = "md",
      orientation = "vertical",
      axis,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const effectiveOrientation =
      axis === "x" ? "horizontal" : axis === "y" ? "vertical" : orientation;
    const isHorizontal = effectiveOrientation === "horizontal";

    const isNamed =
      typeof size === "string" && NAMED_SIZES.includes(size);

    const customDim =
      typeof size === "number"
        ? `${size}px`
        : !isNamed && size
        ? String(size)
        : undefined;

    const baseClass = isHorizontal ? "aui-gutter-horizontal" : "aui-gutter";
    const sizeClass = isNamed ? `aui-gutter-${size}` : undefined;

    const dynamicStyle: React.CSSProperties = {
      ...(customDim
        ? isHorizontal
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
        className={cn(baseClass, sizeClass, className)}
        style={dynamicStyle}
        {...props}
      />
    );
  }
);

Gutter.displayName = "Gutter";

/**
 * Spacer alias for Gutter
 */
export const Spacer = Gutter;
