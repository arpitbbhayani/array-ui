"use client";

import React, { useState } from "react";
import { CopyIcon, CheckIcon } from "../Icons";
import { cn } from "../../utils/cn";

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

export const ApiEndpoint = React.forwardRef<HTMLDivElement, ApiEndpointProps>(
  (
    {
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
    },
    ref
  ) => {
    const [copiedPath, setCopiedPath] = useState(false);
    const [copiedCurl, setCopiedCurl] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const methodLower = method.toLowerCase();
    const methodClass =
      methodLower === "get"
        ? "aui-api-method-get"
        : methodLower === "post"
        ? "aui-api-method-post"
        : methodLower === "put"
        ? "aui-api-method-put"
        : methodLower === "patch"
        ? "aui-api-method-patch"
        : methodLower === "delete"
        ? "aui-api-method-delete"
        : "";

    const handleCopyPath = () => {
      navigator.clipboard.writeText(path);
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 1600);
    };

    const handleCopyCurl = () => {
      const curlCmd = curl || `curl -X ${method.toUpperCase()} "https://api.example.com${path}"`;
      navigator.clipboard.writeText(curlCmd);
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 1600);
    };

    // Highlight {param} in path
    const renderPath = () => {
      const parts = path.split(/(\{.*?\})/);
      return parts.map((part, i) => {
        if (part.startsWith("{") && part.endsWith("}")) {
          return (
            <span key={i} className="aui-api-path-param">
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      });
    };

    return (
      <div ref={ref} className={cn("aui-api-endpoint", className)} {...props}>
        <div className="aui-api-header">
          <div className="aui-api-identity">
            <span className={cn("aui-api-method", methodClass)}>{method}</span>
            <span className="aui-api-path">{renderPath()}</span>
            {badge && <span>{badge}</span>}
          </div>
          <div className="aui-api-actions">
            <button
              type="button"
              className="aui-api-btn"
              onClick={handleCopyPath}
              title="Copy path"
            >
              {copiedPath ? <CheckIcon size={12} strokeWidth={3} /> : <CopyIcon size={12} />}
              <span>{copiedPath ? "Copied" : "Path"}</span>
            </button>
            <button
              type="button"
              className="aui-api-btn"
              onClick={handleCopyCurl}
              title="Copy cURL command"
            >
              {copiedCurl ? <CheckIcon size={12} strokeWidth={3} /> : <CopyIcon size={12} />}
              <span>{copiedCurl ? "Copied" : "cURL"}</span>
            </button>
          </div>
        </div>

        <div className="aui-api-body">
          {description && <div className="aui-api-desc">{description}</div>}

          {params && params.length > 0 && (
            <div className="aui-api-section">
              <div className="aui-api-section-title">Parameters</div>
              <div className="aui-param-table-wrapper">
                <table className="aui-param-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Type</th>
                      <th>Requirement</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {params.map((p, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className="aui-param-name">{p.name}</span>
                        </td>
                        <td>
                          <span className="aui-param-type">{p.type}</span>
                        </td>
                        <td>
                          {p.required ? (
                            <span className="aui-param-badge-req">required</span>
                          ) : (
                            <span className="aui-param-badge-opt">optional</span>
                          )}
                        </td>
                        <td>{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {responses && responses.length > 0 && (
            <div className="aui-api-section">
              <div className="aui-api-section-title">Responses</div>
              <div className="aui-api-tabs-nav">
                {responses.map((res, i) => (
                  <button
                    key={i}
                    type="button"
                    className={cn(
                      "aui-api-tab-btn",
                      activeTab === i && "is-active"
                    )}
                    onClick={() => setActiveTab(i)}
                  >
                    <span>{res.status}</span>
                    {res.label && <span>· {res.label}</span>}
                  </button>
                ))}
              </div>
              <pre className="aui-api-code-block">
                <code>{responses[activeTab]?.body}</code>
              </pre>
            </div>
          )}

          {children}
        </div>
      </div>
    );
  }
);

ApiEndpoint.displayName = "ApiEndpoint";
