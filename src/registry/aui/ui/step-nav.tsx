import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";
import { Kbd } from "./kbd";

export interface StepNavProps extends React.HTMLAttributes<HTMLElement> {
  /** 0-indexed current step index. */
  current: number;
  /** Total count of steps. */
  total: number;
  /** Callback fired when previous button is clicked. */
  onPrev?: () => void;
  /** Callback fired when next button is clicked. */
  onNext?: () => void;
  /** Custom label for previous button. Default "← Previous". */
  prevLabel?: React.ReactNode;
  /** Custom label for next button. Default "Next →". */
  nextLabel?: React.ReactNode;
  /** Custom label for next button when on the last step. Default "Last step". */
  lastLabel?: React.ReactNode;
  /** Explicitly disable previous button. */
  prevDisabled?: boolean;
  /** Explicitly disable next button. */
  nextDisabled?: boolean;
  /** Optional secondary badge next to the position counter (e.g. step category or kind). */
  badge?: React.ReactNode;
  /** Show keyboard arrow keycaps. Default true. */
  showKeyboardHints?: boolean;
  /** Keyboard shortcuts hint icons. Default ["←", "→"]. */
  keyboardHints?: [string, string];
}

export const StepNav = React.forwardRef<HTMLElement, StepNavProps>(
  (
    {
      current,
      total,
      onPrev,
      onNext,
      prevLabel = "← Previous",
      nextLabel = "Next →",
      lastLabel = "Last step",
      prevDisabled,
      nextDisabled,
      badge,
      showKeyboardHints = true,
      keyboardHints = ["←", "→"],
      className,
      ...props
    },
    ref
  ) => {
    const isFirst = current <= 0;
    const isLast = current >= total - 1;

    return (
      <nav
        ref={ref}
        aria-label="Step navigation"
        className={cn("flex flex-wrap items-center justify-between gap-3 my-2", className)}
        {...props}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={prevDisabled !== undefined ? prevDisabled : isFirst}
        >
          {prevLabel}
        </Button>

        <div className="flex items-center gap-2">
          <Badge>
            Step {current + 1} of {total}
          </Badge>
          {badge}
          {showKeyboardHints && (
            <span className="hidden items-center gap-1 md:flex">
              <Kbd>{keyboardHints[0]}</Kbd>
              <Kbd>{keyboardHints[1]}</Kbd>
            </span>
          )}
        </div>

        <Button
          size="sm"
          onClick={onNext}
          disabled={nextDisabled !== undefined ? nextDisabled : isLast}
        >
          {isLast ? lastLabel : nextLabel}
        </Button>
      </nav>
    );
  }
);
StepNav.displayName = "StepNav";
