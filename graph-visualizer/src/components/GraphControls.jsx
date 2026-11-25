export default function GraphControls({
  directed,
  setDirected,

  vertex,
  setVertex,

  source,
  setSource,

  target,
  setTarget,

  weight,
  setWeight,

  deleteNode,
  setDeleteNode,

  deleteSource,
  setDeleteSource,

  deleteTarget,
  setDeleteTarget,

  deleteWeight,
  setDeleteWeight,

  addNode,
  addEdge,
  removeNode,
  removeEdge,
  clearGraph,
  clearTraversal,

  runBFS,
  startBFS,
  setStartBFS,
  runDFS,
  startDFS,
  setStartDFS,
  runDijkstra,
  startDijkstra,
  setStartDijkstra,
  runKruskal,
  runTarjan,

  bfsStep,
  isBfsPlaying,
  nextBfsStep,
  playBfs,
  pauseBfs,
  resetBfs,

  dfsStep,
  isDfsPlaying,
  nextDfsStep,
  playDfs,
  pauseDfs,
  resetDfs,

  dijkstraStep,
  isDijkstraPlaying,
  nextDijkstraStep,
  playDijkstra,
  pauseDijkstra,
  resetDijkstra,
}) {
  return (
    <div className="graph-controls">
      <section className="control-panel">
        <div className="panel-heading graph-editor-heading">
          <div>
            <p className="eyebrow">Workspace</p>
            <h2>Build your graph</h2>
            <p className="panel-description">
              Add vertices and connect them with weighted edges.
            </p>
          </div>

          <div className="graph-mode-control">
            <span className="field-label">Graph type</span>
            <div className="segmented-control">
              <label className={directed ? "mode-option selected" : "mode-option"}>
                <input
                  type="radio"
                  name="graph-mode"
                  checked={directed}
                  onChange={() => setDirected(true)}
                />
                Directed
              </label>
              <label className={!directed ? "mode-option selected" : "mode-option"}>
                <input
                  type="radio"
                  name="graph-mode"
                  checked={!directed}
                  onChange={() => setDirected(false)}
                />
                Undirected
              </label>
            </div>
          </div>
        </div>

        <div className="control-grid">
          <div className="control-card">
            <div className="control-card-heading">
              <span className="control-number">01</span>
              <div>
                <h3>Add vertex</h3>
                <p>Create a node in your graph.</p>
              </div>
            </div>
            <div className="control-input-row">
              <input
                type="text"
                value={vertex}
                onChange={(event) => setVertex(event.target.value)}
                placeholder="Vertex name"
                aria-label="Vertex name"
              />
              <button type="button" onClick={addNode}>Add vertex</button>
            </div>
          </div>

          <div className="control-card">
            <div className="control-card-heading">
              <span className="control-number">02</span>
              <div>
                <h3>Remove vertex</h3>
                <p>Remove a node and its connections.</p>
              </div>
            </div>
            <div className="control-input-row">
              <input
                type="text"
                value={deleteNode}
                onChange={(event) => setDeleteNode(event.target.value)}
                placeholder="Vertex name"
                aria-label="Vertex to remove"
              />
              <button type="button" className="button-secondary" onClick={removeNode}>
                Remove
              </button>
            </div>
          </div>

          <div className="control-card">
            <div className="control-card-heading">
              <span className="control-number">03</span>
              <div>
                <h3>Add edge</h3>
                <p>Connect two existing vertices.</p>
              </div>
            </div>
            <div className="control-input-row edge-input-row">
              <input
                type="text"
                value={source}
                onChange={(event) => setSource(event.target.value)}
                placeholder={directed ? "Source" : "Vertex 1"}
                aria-label={directed ? "Edge source" : "First edge vertex"}
              />
              <input
                type="text"
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                placeholder={directed ? "Target" : "Vertex 2"}
                aria-label={directed ? "Edge target" : "Second edge vertex"}
              />
              <input
                type="number"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                placeholder="Weight"
                aria-label="Edge weight"
              />
              <button type="button" onClick={addEdge}>Connect</button>
            </div>
          </div>

          <div className="control-card">
            <div className="control-card-heading">
              <span className="control-number">04</span>
              <div>
                <h3>Remove edge</h3>
                <p>Match both endpoints and the edge weight.</p>
              </div>
            </div>
            <div className="control-input-row edge-input-row">
              <input
                type="text"
                value={deleteSource}
                onChange={(event) => setDeleteSource(event.target.value)}
                placeholder={directed ? "Source" : "Vertex 1"}
                aria-label="Source of edge to remove"
              />
              <input
                type="text"
                value={deleteTarget}
                onChange={(event) => setDeleteTarget(event.target.value)}
                placeholder={directed ? "Target" : "Vertex 2"}
                aria-label="Target of edge to remove"
              />
              <input
                type="number"
                value={deleteWeight}
                onChange={(event) => setDeleteWeight(event.target.value)}
                placeholder="Weight"
                aria-label="Weight of edge to remove"
              />
              <button type="button" className="button-secondary" onClick={removeEdge}>
                Remove edge
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="control-panel algorithm-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Explore</p>
            <h2>Algorithms</h2>
            <p className="panel-description">
              Run a traversal or inspect important graph structure.
            </p>
          </div>
        </div>

        <div className="algorithm-grid">
          <article className="algorithm-card">
            <div className="control-card-heading">
              <span className="algorithm-icon">B</span>
              <div>
                <h3>Breadth-first search</h3>
                <p>Visit neighbors level by level.</p>
              </div>
            </div>
            <div className="algorithm-run-row">
              <input
                type="text"
                value={startBFS}
                onChange={(event) => setStartBFS(event.target.value)}
                placeholder="Start vertex"
                aria-label="BFS start vertex"
              />
              <button type="button" onClick={runBFS}>Run BFS</button>
            </div>
            <div className="playback-row">
              <button type="button" className="button-secondary" onClick={playBfs} disabled={isBfsPlaying}>Play</button>
              <button type="button" className="button-secondary" onClick={pauseBfs} disabled={!isBfsPlaying}>Pause</button>
              <button type="button" className="button-secondary" onClick={nextBfsStep}>Next</button>
              <button type="button" className="button-quiet" onClick={resetBfs}>Reset</button>
              {bfsStep >= 0 && <span className="step-indicator">Step {bfsStep + 1}</span>}
            </div>
          </article>

          <article className="algorithm-card">
            <div className="control-card-heading">
              <span className="algorithm-icon">D</span>
              <div>
                <h3>Depth-first search</h3>
                <p>Explore a path before backtracking.</p>
              </div>
            </div>
            <div className="algorithm-run-row">
              <input
                type="text"
                value={startDFS}
                onChange={(event) => setStartDFS(event.target.value)}
                placeholder="Start vertex"
                aria-label="DFS start vertex"
              />
              <button type="button" onClick={runDFS}>Run DFS</button>
            </div>
            <div className="playback-row">
              <button type="button" className="button-secondary" onClick={playDfs} disabled={isDfsPlaying}>Play</button>
              <button type="button" className="button-secondary" onClick={pauseDfs} disabled={!isDfsPlaying}>Pause</button>
              <button type="button" className="button-secondary" onClick={nextDfsStep}>Next</button>
              <button type="button" className="button-quiet" onClick={resetDfs}>Reset</button>
              {dfsStep >= 0 && <span className="step-indicator">Step {dfsStep + 1}</span>}
            </div>
          </article>

          <article className="algorithm-card">
            <div className="control-card-heading">
              <span className="algorithm-icon">D</span>
              <div>
                <h3>Dijkstra</h3>
                <p>Find shortest paths from a start vertex.</p>
              </div>
            </div>
            <div className="algorithm-run-row">
              <input
                type="text"
                value={startDijkstra}
                onChange={(event) => setStartDijkstra(event.target.value)}
                placeholder="Start vertex"
                aria-label="Dijkstra start vertex"
              />
              <button type="button" onClick={runDijkstra}>Run Dijkstra</button>
            </div>
            <div className="playback-row">
              <button type="button" className="button-secondary" onClick={playDijkstra} disabled={isDijkstraPlaying}>Play</button>
              <button type="button" className="button-secondary" onClick={pauseDijkstra} disabled={!isDijkstraPlaying}>Pause</button>
              <button type="button" className="button-secondary" onClick={nextDijkstraStep}>Next</button>
              <button type="button" className="button-quiet" onClick={resetDijkstra}>Reset</button>
              {dijkstraStep >= 0 && <span className="step-indicator">Step {dijkstraStep + 1}</span>}
            </div>
          </article>

          <article className="algorithm-card tools-card">
            <div className="control-card-heading">
              <span className="algorithm-icon">+</span>
              <div>
                <h3>Graph tools</h3>
                <p>Analyze or clear the current graph.</p>
              </div>
            </div>
            <div className="tool-button-row">
              <button type="button" onClick={runKruskal}>Find minimum spanning tree</button>
              <button type="button" className="button-secondary" onClick={runTarjan}>Run Tarjan</button>
              <button type="button" className="button-quiet" onClick={clearTraversal}>Clear traversal</button>
              <button type="button" className="button-danger" onClick={clearGraph}>Clear graph</button>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
