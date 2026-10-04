import React from "react";
import { cn } from "../../utils/cn";

export interface TimelineEvent {
  date: string;
  title: string;
  body?: React.ReactNode;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  events: TimelineEvent[];
}

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ events, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("aui-timeline", className)} {...props}>
        {events.map((ev, idx) => (
          <div key={idx} className="aui-timeline-item">
            <div className="aui-timeline-point" />
            <div className="aui-timeline-date">{ev.date}</div>
            <h4 className="aui-timeline-title">{ev.title}</h4>
            {ev.body && <div className="aui-timeline-body">{ev.body}</div>}
          </div>
        ))}
      </div>
    );
  }
);

Timeline.displayName = "Timeline";
