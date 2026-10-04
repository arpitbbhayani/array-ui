import React from "react";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Render several keys joined as a combo, e.g. keys={["⌘", "K"]} */
  keys?: string[];
}

export const Kbd: React.FC<KbdProps> = ({ keys, children, className = "", ...props }) => {
  if (keys && keys.length > 0) {
    return (
      <span className={`aui-kbd-group ${className}`}>
        {keys.map((key, i) => (
          <kbd key={`${key}-${i}`} className="aui-kbd" {...props}>
            {key}
          </kbd>
        ))}
      </span>
    );
  }
  return (
    <kbd className={`aui-kbd ${className}`} {...props}>
      {children}
    </kbd>
  );
};
