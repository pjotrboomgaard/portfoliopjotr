import React from "react";
import { useDevMode } from "../context/DevContext";

const DevToolbar: React.FC = () => {
  const { devMode, toggleDev, clearAll } = useDevMode();

  if (!devMode) return null;

  return (
    <div className="dev-toolbar">
      <span className="dev-toolbar-indicator">✎ Bewerkmodus</span>
      <span className="dev-toolbar-hint">
        Slepen = verplaatsen &nbsp;·&nbsp; ⤡ = formaat &nbsp;·&nbsp; A±
        = lettergrootte &nbsp;·&nbsp; ↺ = element resetten
      </span>
      <div className="dev-toolbar-actions">
        <button
          onClick={() => {
            if (confirm("Alle opgeslagen posities en formaten wissen?"))
              clearAll();
          }}
        >
          Layout wissen
        </button>
        <button onClick={toggleDev}>Bewerkmodus verlaten</button>
      </div>
    </div>
  );
};

export default DevToolbar;
