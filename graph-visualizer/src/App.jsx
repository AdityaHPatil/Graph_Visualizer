import "./App.css";
import GraphControls from "./components/GraphControls";
import useGraph from "./hooks/useGraph";
import Graph from "./components/Graph";
import { useState } from "react";

export default function App() {
  const graph = useGraph();

  const [darkMode, setDarkMode] = useState(false);

  const { nodes, edges, ...controls } = graph;

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="header">
        <h1>Graph Visualizer</h1>

        <button
          onClick={() => {
            setDarkMode(!darkMode);
          }}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <GraphControls {...controls} />

      <Graph
        nodes={nodes}
        edges={edges}
        directed={graph.directed}
        bfsResult={graph.bfsResult}
      />
    </div>
  );
}
