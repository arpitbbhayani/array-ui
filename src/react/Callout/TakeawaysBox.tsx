import React from "react";

export interface TakeawaysBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  items?: React.ReactNode[];
}

export const TakeawaysBox: React.FC<TakeawaysBoxProps> = ({
  title = "Key Takeaways",
  items,
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`aui-takeaways ${className}`} {...props}>
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
};
