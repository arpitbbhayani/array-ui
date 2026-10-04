import React from "react";
import { Button } from "../Button/Button";
import { CheckIcon } from "../Icons";

export interface PricingCardProps {
  title: string;
  duration?: string;
  cohortDate?: string;
  cohortTimings?: string;
  benefits?: string[];
  valueProposition?: string[];
  priceInr: string;
  priceUsd?: string;
  taxNote?: string;
  note?: string;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  duration,
  cohortDate,
  cohortTimings,
  benefits = [],
  valueProposition = [],
  priceInr,
  priceUsd,
  taxNote = "inclusive of all the taxes",
  note,
  ctaText = "Enroll Now",
  ctaHref,
  className = "",
}) => {
  return (
    <div className={`aui-pricing-card ${className}`}>
      <h3 className="aui-pricing-title">{title}</h3>

      {(duration || cohortDate) && (
        <div className="aui-pricing-meta">
          {duration && <span>{duration}</span>}
          {duration && cohortDate && <span> • </span>}
          {cohortDate && <span>{cohortDate}</span>}
        </div>
      )}

      {cohortTimings && (
        <div className="aui-pricing-meta" style={{ marginTop: "-0.75rem" }}>
          <span>{cohortTimings}</span>
        </div>
      )}

      <hr className="aui-pricing-divider" />

      {benefits.length > 0 && (
        <div className="aui-pricing-benefits">
          <ul>
            {benefits.map((b, i) => (
              <li key={i}>
                <span className="aui-text-primary-color" style={{ marginTop: "2px" }}>
                  <CheckIcon size={16} />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="aui-pricing-price">
        <span>{priceInr}</span>
        {priceUsd && <span className="aui-pricing-price-usd">{priceUsd}</span>}
        {taxNote && <div className="aui-pricing-tax-note">{taxNote}</div>}
      </div>

      {note && (
        <p className="aui-text-muted" style={{ fontSize: "0.85rem", margin: "0.75rem 0" }}>
          {note}
        </p>
      )}

      {valueProposition.length > 0 && (
        <div style={{ margin: "1.25rem 0" }}>
          <div style={{ fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
            YOU'LL GET
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {valueProposition.map((vp, idx) => (
              <li key={idx} style={{ display: "flex", gap: "0.4rem", alignItems: "center", marginBottom: "0.4rem", fontSize: "0.9rem" }}>
                <span className="aui-text-primary-color">•</span>
                <span>{vp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {ctaHref && (
        <div style={{ marginTop: "1.5rem" }}>
          <Button href={ctaHref} size="lg" fullWidth>
            {ctaText}
          </Button>
        </div>
      )}
    </div>
  );
};
