import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps<T = string> {
  options?: SelectOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  name?: string;
  className?: string;
  id?: string;
  children?: React.ReactNode;
}

export function Select<T = string>({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = "Select an option...",
  label,
  error,
  helperText,
  disabled = false,
  name,
  className,
  id,
  children,
}: SelectProps<T>) {
  const generatedId = React.useId();
  const selectId = id || (label ? `aui-select-${generatedId}` : undefined);

  // Native fallback if children passed
  if (!options && children) {
    const nativeSelect = (
      <select
        id={selectId}
        name={name}
        defaultValue={defaultValue as any}
        value={controlledValue as any}
        onChange={(e) => onChange?.(e.target.value as any)}
        disabled={disabled}
        className={cn(
          "flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive",
          className
        )}
      >
        {children}
      </select>
    );

    if (!label && !error && !helperText) return nativeSelect;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-foreground">
            {label}
          </label>
        )}
        {nativeSelect}
        {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  // Custom Dropdown Single Select
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState<T | undefined>(defaultValue);
  const selectedValue = isControlled ? controlledValue : uncontrolledValue;
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const safeOptions = React.useMemo(() => options || [], [options]);

  const selectedOption = React.useMemo(
    () => safeOptions.find((opt) => opt.value === selectedValue),
    [safeOptions, selectedValue]
  );

  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (option: SelectOption<T>) => {
    if (option.disabled) return;
    if (!isControlled) {
      setUncontrolledValue(option.value);
    }
    onChange?.(option.value);
    setIsOpen(false);
  };

  const selectTrigger = (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {name && (
        <input
          type="hidden"
          name={name}
          value={selectedValue !== undefined ? String(selectedValue) : ""}
        />
      )}
      <button
        type="button"
        id={selectId}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors hover:border-accent focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary",
          isOpen && "ring-1 ring-primary border-primary",
          disabled && "cursor-not-allowed opacity-50",
          error && "border-destructive"
        )}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : <span className="text-muted-foreground">{placeholder}</span>}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("text-muted-foreground transition-transform duration-150", isOpen && "rotate-180")}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 rounded-md border border-border bg-popover shadow-md overflow-hidden p-1">
          <ul className="max-h-60 overflow-y-auto list-none m-0 p-0" role="listbox">
            {safeOptions.length === 0 ? (
              <li className="p-2 text-center text-xs text-muted-foreground">No options available</li>
            ) : (
              safeOptions.map((opt, idx) => {
                const isSelected = opt.value === selectedValue;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <li
                    key={String(opt.value)}
                    className={cn(
                      "flex items-center justify-between px-3 py-1.5 text-sm rounded-sm cursor-pointer transition-colors",
                      isHighlighted && "bg-accent/50",
                      isSelected && "font-semibold text-foreground bg-accent",
                      opt.disabled && "cursor-not-allowed opacity-40"
                    )}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary ml-2 shrink-0"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );

  if (!label && !error && !helperText) return selectTrigger;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-foreground">
          {label}
        </label>
      )}
      {selectTrigger}
      {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

Select.displayName = "Select";
