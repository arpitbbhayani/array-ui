import React from "react";
import { cn } from "../../utils/cn";

export interface TakeawaysBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  items?: React.ReactNode[];
}

export const TakeawaysBox = React.forwardRef<HTMLDivElement, TakeawaysBoxProps>(
  (
    {
      title = "Key Takeaways",
      items,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("aui-takeaways", className)} {...props}>
        {title && <div className="aui-takeaways-title">{title}</div>}
        {items && items.length > 0 ? (
          <ul>
            {items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          children
        )}
      </div>
    );
  }
);

TakeawaysBox.displayName = "TakeawaysBox";
