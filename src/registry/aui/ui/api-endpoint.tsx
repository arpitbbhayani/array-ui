"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ApiParam {
  name: string;
  type: string;
  required?: boolean;
  description: string;
}

export interface ApiResponseTab {
  status: number | string;
  label?: string;
  body: string;
}

export interface ApiEndpointProps extends React.HTMLAttributes<HTMLDivElement> {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | string;
  path: string;
  description?: string;
  badge?: React.ReactNode;
  curl?: string;
  params?: ApiParam[];
  responses?: ApiResponseTab[];
}

export function ApiEndpoint({
  method,
  path,
  description,
  badge,
  curl,
  params,
  responses,
  className,
  children,
  ...props
}: ApiEndpointProps) {
  const [copiedPath, setCopiedPath] = React.useState(false);
  const [copiedCurl, setCopiedCurl] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  const methodUpper = method.toUpperCase();
  const getMethodStyle = () => {
    switch (methodUpper) {
      case "GET":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "POST":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "PUT":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "PATCH":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "DELETE":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(path);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 1600);
  };

  const handleCopyCurl = () => {
    const curlCmd = curl || `curl -X ${methodUpper} "https://api.example.com${path}"`;
    navigator.clipboard.writeText(curlCmd);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 1600);
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground overflow-hidden my-4 shadow-xs",
        className
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          <span
            className={cn(
              "font-mono text-[11px] font-medium tracking-wider px-2 py-0.5 rounded border uppercase",
              getMethodStyle()
            )}
          >
            {methodUpper}
          </span>
          <span className="font-mono text-sm font-medium text-foreground break-all">
            {path}
          </span>
          {badge && <span>{badge}</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyPath}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-border bg-card hover:bg-muted font-mono text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {copiedPath ? (
              <span className="text-emerald-500 font-semibold">Copied</span>
            ) : (
              <span>Path</span>
            )}
          </button>
          <button
            type="button"
            onClick={handleCopyCurl}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-border bg-card hover:bg-muted font-mono text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {copiedCurl ? (
              <span className="text-emerald-500 font-semibold">Copied</span>
            ) : (
              <span>cURL</span>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}

        {params && params.length > 0 && (
          <div>
            <div className="font-mono text-xs uppercase tracking-wider font-medium text-muted-foreground mb-2">
              Parameters
            </div>
            <div className="rounded border border-border overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-muted/40 font-mono text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="px-3 py-2">Option</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {params.map((p, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="px-3 py-2 font-mono font-medium text-foreground">
                        {p.name}
                      </td>
                      <td className="px-3 py-2 font-mono text-muted-foreground">
                        {p.type}
                      </td>
                      <td className="px-3 py-2">
                        {p.required ? (
                          <span className="font-mono text-[10px] uppercase font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            req
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            opt
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {p.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {responses && responses.length > 0 && (
          <div>
            <div className="font-mono text-xs uppercase tracking-wider font-medium text-muted-foreground mb-2">
              Responses
            </div>
            <div className="flex border-b border-border gap-1 mb-2">
              {responses.map((res, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "px-3 py-1 font-mono text-xs border-b-2 font-medium cursor-pointer transition-colors",
                    activeTab === i
                      ? "border-primary text-foreground font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {res.status} {res.label ? `· ${res.label}` : ""}
                </button>
              ))}
            </div>
            <pre className="p-3 bg-muted/50 rounded border border-border font-mono text-xs text-foreground overflow-x-auto">
              <code>{responses[activeTab]?.body}</code>
            </pre>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
