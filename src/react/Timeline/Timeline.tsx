import React from "react";

export interface TimelineEvent {
  date: string;
  title: string;
  body?: React.ReactNode;
}

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ events, className = "" }) => {
  return (
    <div className={`aui-timeline ${className}`}>
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
};
