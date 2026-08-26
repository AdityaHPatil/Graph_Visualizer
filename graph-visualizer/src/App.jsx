import "./App.css";
import GraphControls from "./components/GraphControls";
import useGraph from "./hooks/useGraph";
import useAuth from "./hooks/useAuth"; // Importing our custom hook
import Header from "./components/Header";
import AuthForm from "./components/AuthForm";
import Graph from "./components/Graph";
import { useState } from "react";

export default function App() {
  const graph = useGraph();
  const auth = useAuth(); // All state variables & auth methods matching your style
  const [darkMode, setDarkMode] = useState(false);

  if (auth.loading) return <p>Checking authentication...</p>;

  if (!auth.user) {
    return <AuthForm auth={auth} />;
  }

  const { nodes, edges, ...controls } = graph;

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Header
        user={auth.user}
        handleLogout={auth.handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <GraphControls 
        {...controls} 
        bfsStep={graph.bfsStep} 
        isBfsPlaying={graph.isBfsPlaying}
        nextBfsStep={graph.nextBfsStep}
        playBfs={graph.playBfs}
        pauseBfs={graph.pauseBfs}
        resetBfs={graph.resetBfs}
        dfsStep={graph.dfsStep}
        isDfsPlaying={graph.isDfsPlaying}
        nextDfsStep={graph.nextDfsStep}
        playDfs={graph.playDfs}
        pauseDfs={graph.pauseDfs}
        resetDfs={graph.resetDfs}
        dijkstraStep={graph.dijkstraStep}
        isDijkstraPlaying={graph.isDijkstraPlaying}
        nextDijkstraStep={graph.nextDijkstraStep}
        playDijkstra={graph.playDijkstra}
        pauseDijkstra={graph.pauseDijkstra}
        resetDijkstra={graph.resetDijkstra}

      />

      <Graph
        nodes={nodes}
        edges={edges}
        directed={graph.directed}
        bfsResult={graph.bfsResult}
        bfsStep={graph.bfsStep}
        dfsResult={graph.dfsResult}
        dfsStep={graph.dfsStep}
        dijkstraResult={graph.dijkstraResult}
        mstResult={graph.mstResult}
        tarjanResult={graph.tarjanResult}
        dijkstraStep={graph.dijkstraStep}
      />
    </div>
  );
}
