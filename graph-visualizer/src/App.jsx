import "./App.css";
import GraphControls from "./components/GraphControls";
import useGraph from "./hooks/useGraph";
import useAuth from "./hooks/useAuth"; // Importing our custom hook
import Header from "./components/Header";
import AuthForm from "./components/AuthForm";
import Graph from "./components/Graph";
import { useState } from "react";
import {API_URL} from "./constants/config";

export default function App() {
  const graph = useGraph();
  const auth = useAuth(); // All state variables & auth methods matching your style
  const [darkMode, setDarkMode] = useState(false);
  const [graphId,setGraphId] = useState("");
  const [graphMessage,setGraphMessage]=useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [selectedSubgraph, setSelectedSubgraph] = useState({
    nodes: [],
    edges: [],
  });
  const { nodes, edges, ...controls } = graph;
  const selectedNodeIds = new Set(selectedSubgraph.nodes.map((node) => node.id));
  const currentSelection = {
    nodes: nodes.filter((node) => selectedNodeIds.has(node.id)),
    edges: edges.filter(
      (edge) =>
        selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target),
    ),
  };

  if (auth.loading) return <p>Checking authentication...</p>;

  if (!auth.user) {
    return <AuthForm auth={auth} />;
  }

  async function saveGraph(){
    try{
      const isUpdate = Boolean(graphId.trim());
      const response = await fetch(
        isUpdate
          ? `${API_URL}/api/graphs/${encodeURIComponent(graphId.trim())}`
          : `${API_URL}/api/graphs`,
        {
          method: isUpdate ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            nodes: graph.nodes,
            edges: graph.edges,
            directed: graph.directed,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not save graph");
      }

      setGraphId(data.id);
      setGraphMessage(`Saved. Graph ID: ${data.id}`);
    } catch (error) {
      setGraphMessage(error.message);
    }
  }

  async function loadGraph() {
    if (!graphId.trim()) {
      setGraphMessage("Enter a graph ID to load");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/graphs/${encodeURIComponent(graphId.trim())}`,
        { credentials: "include" },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not load graph");
      }

      graph.replaceGraph(data);
      setGraphMessage("Graph loaded");
    } catch (error) {
      setGraphMessage(error.message);
    }
  }

  async function shareGraph() {
    if (!graphId.trim()) {
      setGraphMessage("Save or load a graph before sharing it");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/graphs/${encodeURIComponent(graphId.trim())}/owners`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: shareEmail }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not share graph");
      }

      setGraphMessage(data.message);
      setShareEmail("");
    } catch (error) {
      setGraphMessage(error.message);
    }
  }

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Header
        user={auth.user}
        handleLogout={auth.handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="app-main">
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

        <section className="control-panel save-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Your work</p>
              <h2>Save and share</h2>
              <p className="panel-description">
                Keep a graph in your workspace or share it with a collaborator.
              </p>
            </div>
          </div>

          <div className="save-actions">
            <button type="button" onClick={saveGraph}>Save graph</button>
            <input
              value={graphId}
              onChange={(event) => setGraphId(event.target.value)}
              placeholder="Graph ID"
              aria-label="Graph ID to load or update"
            />
            <button type="button" className="button-secondary" onClick={loadGraph}>
              Load graph
            </button>
            <span className="save-divider" aria-hidden="true" />
            <input
              type="email"
              value={shareEmail}
              onChange={(event) => setShareEmail(event.target.value)}
              placeholder="Collaborator email"
              aria-label="Email of registered collaborator"
            />
            <button type="button" className="button-secondary" onClick={shareGraph}>
              Share
            </button>
          </div>
          {graphMessage && (
            <p className="save-message" role="status" aria-live="polite">
              {graphMessage}
            </p>
          )}
        </section>

        {graph.mstResult && (
          <div className="algorithm-result">
            <div>
              <p className="eyebrow">Algorithm result</p>
              <h2>Minimum spanning tree</h2>
            </div>
            <div className="result-stat">
              <span>Total weight</span>
              <strong>{graph.mstResult.totalWeight}</strong>
            </div>
            <div className="result-stat">
              <span>Edges selected</span>
              <strong>{graph.mstResult.edges.length}</strong>
            </div>
            {graph.mstResult.edges.length < nodes.length - 1 && (
              <p className="result-warning">
                Graph is disconnected. A complete MST could not be created.
              </p>
            )}
          </div>
        )}

        <section className="workspace-panel">
          <div className="graph-status">
            <div>
              <p className="eyebrow">Live workspace</p>
              <h2>Graph canvas</h2>
            </div>
            <div className="graph-metrics">
              <div className="metric-chip">
                <strong>{nodes.length}</strong>
                <span>Vertices</span>
              </div>
              <div className="metric-chip">
                <strong>{edges.length}</strong>
                <span>Edges</span>
              </div>
              <div className="metric-chip">
                <strong>{currentSelection.nodes.length}</strong>
                <span>Selected</span>
              </div>
              <span className="graph-type-badge">
                {graph.directed ? "Directed" : "Undirected"}
              </span>
            </div>
          </div>
          <p className="selection-count" role="status" aria-live="polite">
            Lasso selection: {currentSelection.nodes.length} vertices,{" "}
            {currentSelection.edges.length} internal edges
          </p>

          <Graph
            onSelectionChange={setSelectedSubgraph}
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
        </section>
      </main>
    </div>
  );
}
