"use client";

import React, { useState } from "react";
import { cn } from "../../utils/cn";

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

export const StateMachine = React.forwardRef<HTMLDivElement, StateMachineProps>(
  (
    {
      title = "Finite State Machine",
      initialState,
      states,
      transitions,
      onTransition,
      className,
      ...props
    },
    ref
  ) => {
    const [currentState, setCurrentState] = useState<string>(initialState);
    const [history, setHistory] = useState<Array<{ from: string; to: string; trigger: string; timestamp: string }>>([
      { from: "—", to: initialState, trigger: "BOOTSTRAP", timestamp: "00:00:00" },
    ]);

    const activeNode = states.find((s) => s.id === currentState);
    const availableTransitions = transitions.filter((t) => t.from === currentState);

    const handleTrigger = (trans: StateTransitionItem) => {
      const now = new Date().toTimeString().split(" ")[0];
      setHistory((prev) => [
        { from: currentState, to: trans.to, trigger: trans.trigger, timestamp: now },
        ...prev.slice(0, 4),
      ]);
      setCurrentState(trans.to);
      onTransition?.(currentState, trans.to, trans.trigger);
    };

    const handleReset = () => {
      setCurrentState(initialState);
      const now = new Date().toTimeString().split(" ")[0];
      setHistory((prev) => [
        { from: currentState, to: initialState, trigger: "RESET", timestamp: now },
        ...prev.slice(0, 4),
      ]);
    };

    return (
      <div ref={ref} className={cn("aui-state-machine", className)} {...props}>
        <div className="aui-fsm-header">
          <span className="aui-fsm-title">{title}</span>
          <div className="flex items-center gap-2">
            <span className="aui-fsm-active-badge">Active: {activeNode?.label || currentState}</span>
            <button
              type="button"
              className="aui-api-btn"
              onClick={handleReset}
              title="Reset state machine"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="aui-fsm-body">
          <div className="aui-fsm-nodes-grid">
            {states.map((state) => {
              const isActive = state.id === currentState;
              return (
                <div
                  key={state.id}
                  className={cn("aui-fsm-node-card", isActive && "is-active")}
                  onClick={() => {
                    const validTrans = transitions.find((t) => t.from === currentState && t.to === state.id);
                    if (validTrans) handleTrigger(validTrans);
                  }}
                >
                  <div className="aui-fsm-node-header">
                    <span className="aui-fsm-node-label">{state.label}</span>
                    <span className="aui-fsm-node-type">{state.type || "state"}</span>
                  </div>
                  {state.description && <p className="aui-fsm-node-desc">{state.description}</p>}
                </div>
              );
            })}
          </div>

          <div className="aui-fsm-triggers-panel">
            <div className="aui-fsm-triggers-title">
              Available Triggers for {activeNode?.label || currentState}:
            </div>
            {availableTransitions.length > 0 ? (
              <div className="aui-fsm-triggers-btns">
                {availableTransitions.map((trans, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="aui-api-btn hover:border-primary text-foreground"
                    onClick={() => handleTrigger(trans)}
                  >
                    ⚡ {trans.trigger} → <span className="font-bold">{trans.to}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground m-0">
                Terminal state reached. Click &quot;Reset&quot; to restart lifecycle.
              </p>
            )}
          </div>

          {history.length > 1 && (
            <div className="pt-2 border-t border-border flex flex-wrap gap-2 items-center">
              <span className="font-mono text-xs uppercase font-medium text-muted-foreground">
                Transition Trail:
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
);

StateMachine.displayName = "StateMachine";
