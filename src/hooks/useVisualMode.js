import { useState } from "react";

function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(nextMode, replace = false) {
    setMode(nextMode);
    
    if (replace) {
      setHistory((prev) => [...prev.slice(0, -1), nextMode]);
      return;
    }
    setHistory((prev) => [...prev, nextMode]);
  }

  function back() {
    if (history.length <= 1) {
      setHistory((prev) => prev);
      return;
    }
    setHistory((prev) => prev.slice(0, -1));
  }


  return {
    mode: history[history.length - 1],
    transition,
    back
  };
}

export default useVisualMode;