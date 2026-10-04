import React from "react";
import { Card } from "../Card/Card";
import { Button } from "../Button/Button";
import { Badge } from "../Badge/Badge";

export interface CourseCardProps {
  title: string;
  description: string;
  href: string;
  badge?: string;
  tags?: string[];
  ctaText?: string;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  href,
  badge,
  tags = [],
  ctaText = "Details →",
  className = "",
}) => {
  return (
    <Card hoverable className={`aui-project-card ${className}`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
        <h3 className="aui-project-card-title">
          <a href={href}>{title}</a>
        </h3>
        {badge && <Badge variant="primary">{badge}</Badge>}
      </div>

      <p className="aui-project-card-desc">{description}</p>

      {tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1rem" }}>
          {tags.map((t) => (
            <Badge key={t} variant="default">
              {t}
            </Badge>
          ))}
        </div>
      )}

      <div className="aui-project-card-footer">
        <span />
        <Button href={href} variant="primary" size="sm">
          {ctaText}
        </Button>
      </div>
    </Card>
  );
};
