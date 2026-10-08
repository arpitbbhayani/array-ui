import React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button/Button";
import { Badge } from "../Badge/Badge";
import { Kbd } from "../Kbd/Kbd";

export interface StepNavProps extends React.HTMLAttributes<HTMLElement> {
  current: number;
  total: number;
  onPrev?: () => void;
  onNext?: () => void;
  prevLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
  lastLabel?: React.ReactNode;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  badge?: React.ReactNode;
  showKeyboardHints?: boolean;
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
        className={cn("aui-step-nav", className)}
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

        <div className="aui-step-nav-center">
          <Badge>
            Step {current + 1} of {total}
          </Badge>
          {badge}
          {showKeyboardHints && (
            <span className="aui-step-nav-kbd">
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
