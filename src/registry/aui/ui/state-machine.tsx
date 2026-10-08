"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface StateNodeItem {
  id: string;
  label: string;
  description?: string;
  type?: "initial" | "normal" | "terminal";
}

export interface StateTransitionItem {
  from: string;
  to: string;
  trigger: string;
  description?: string;
}

export interface StateMachineProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  initialState: string;
  states: StateNodeItem[];
  transitions: StateTransitionItem[];
  onTransition?: (from: string, to: string, trigger: string) => void;
}

export function StateMachine({
  title = "Finite State Machine",
  initialState,
  states,
  transitions,
  onTransition,
  className,
  ...props
}: StateMachineProps) {
  const [currentState, setCurrentState] = React.useState<string>(initialState);
  const [history, setHistory] = React.useState<Array<{ from: string; to: string; trigger: string }>>([
    { from: "—", to: initialState, trigger: "BOOTSTRAP" },
  ]);

  const activeNode = states.find((s) => s.id === currentState);
  const availableTransitions = transitions.filter((t) => t.from === currentState);

  const handleTrigger = (trans: StateTransitionItem) => {
    setHistory((prev) => [
      { from: currentState, to: trans.to, trigger: trans.trigger },
      ...prev.slice(0, 4),
    ]);
    setCurrentState(trans.to);
    onTransition?.(currentState, trans.to, trans.trigger);
  };

  const handleReset = () => {
    setCurrentState(initialState);
    setHistory((prev) => [
      { from: currentState, to: initialState, trigger: "RESET" },
      ...prev.slice(0, 4),
    ]);
  };

  return (
    <div
      className={cn(
        "flex flex-col border border-border rounded-lg bg-card overflow-hidden shadow-xs my-6",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between p-3.5 bg-background border-b border-border flex-wrap gap-2">
        <span className="font-heading font-bold text-base text-foreground">{title}</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-medium px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
            Active: {activeNode?.label || currentState}
          </span>
          <button
            type="button"
            className="font-mono text-xs px-2 py-0.5 rounded border border-border bg-card text-muted-foreground hover:text-foreground"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {states.map((state) => {
            const isActive = state.id === currentState;
            return (
              <div
                key={state.id}
                className={cn(
                  "p-3.5 rounded-md border border-border bg-background cursor-pointer transition-all hover:border-foreground/40",
                  isActive && "border-primary ring-2 ring-primary bg-primary/5"
                )}
                onClick={() => {
                  const validTrans = transitions.find((t) => t.from === currentState && t.to === state.id);
                  if (validTrans) handleTrigger(validTrans);
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm font-medium text-foreground">
                    {state.label}
                  </span>
                  <span className="font-mono text-[11px] uppercase font-medium text-muted-foreground">
                    {state.type || "state"}
                  </span>
                </div>
                {state.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {state.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-background border border-border rounded-md">
          <div className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Available Triggers for {activeNode?.label || currentState}:
          </div>
          {availableTransitions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableTransitions.map((trans, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="font-mono text-xs px-2.5 py-1 rounded border border-border bg-card hover:border-primary text-foreground transition-colors"
                  onClick={() => handleTrigger(trans)}
                >
                  ⚡ {trans.trigger} → <span className="font-bold">{trans.to}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground m-0">
              Terminal state reached. Click &quot;Reset&quot; to restart lifecycle.
            </p>
          )}
        </div>

        {history.length > 1 && (
          <div className="pt-2 border-t border-border flex flex-wrap gap-2 items-center">
            <span className="font-mono text-xs uppercase font-medium text-muted-foreground">
              Trail:
            </span>
            {history.map((h, i) => (
              <span
                key={i}
                className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
              >
                {h.from} → {h.trigger} → {h.to}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
