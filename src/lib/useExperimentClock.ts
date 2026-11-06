import { useEffect, useReducer, useState } from "react";

type ClockState = { time: number; running: boolean };
type ClockAction =
  | { type: "start"; max: number }
  | { type: "pause" }
  | { type: "reset" }
  | { type: "tick"; seconds: number; max: number };

export function clockReducer(
  state: ClockState,
  action: ClockAction,
): ClockState {
  if (action.type === "reset") return { time: 0, running: false };
  if (action.type === "pause") return { ...state, running: false };
  if (action.type === "start")
    return { time: state.time >= action.max ? 0 : state.time, running: true };
  if (!state.running) return state;
  const time = Math.min(
    action.max,
    Math.round((state.time + action.seconds) * 1e6) / 1e6,
  );
  return { time, running: time < action.max };
}

export function useExperimentClock(max = 18) {
  const [state, dispatch] = useReducer(clockReducer, {
    time: 0,
    running: false,
  });
  const [visible, setVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  // Activity boundaries clean this effect up while a lesson panel is hidden.
  // Pausing decorative particle motion must never disable an explicitly started experiment.
  useEffect(() => {
    if (!state.running || !visible) return;
    const timer = window.setInterval(
      () => dispatch({ type: "tick", seconds: 0.1, max }),
      100,
    );
    return () => window.clearInterval(timer);
  }, [state.running, visible, max]);
  return {
    ...state,
    complete: state.time >= max,
    toggle: () =>
      dispatch(state.running ? { type: "pause" } : { type: "start", max }),
    reset: () => dispatch({ type: "reset" }),
  };
}
