import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, className, checked, defaultChecked, disabled, ...props }, ref) => {
    return (
      <label
        className={cn(
          "inline-flex items-center gap-2.5 cursor-pointer text-sm select-none",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <span className="relative inline-flex items-center">
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            disabled={disabled}
            checked={checked}
            defaultChecked={defaultChecked}
            className="peer sr-only"
            {...props}
          />
          <span className="w-9 h-5 bg-muted peer-checked:bg-primary border border-border rounded-full transition-colors duration-200" />
          <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-xs transition-transform duration-200 peer-checked:translate-x-4" />
        </span>
        {label && <span className="text-foreground">{label}</span>}
      </label>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
