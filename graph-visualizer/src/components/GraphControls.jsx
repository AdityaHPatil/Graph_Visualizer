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

  runBFS,
  start,
  setStart,
}) {
  return (
    <div className="graph-controls">
      <div className="graphcontrol">
        <label>
          <input
            type="radio"
            checked={directed}
            onChange={() => setDirected(true)}
          />
          Directed
        </label>

        <label>
          <input
            type="radio"
            checked={!directed}
            onChange={() => setDirected(false)}
          />
          Undirected
        </label>
      </div>

      <div className="graphcontrol">
        <input
          type="text"
          value={vertex}
          onChange={(e) => setVertex(e.target.value)}
          placeholder="Vertex"
        />

        <button onClick={addNode}>Add Vertex</button>
      </div>

      <div className="graphcontrol">
        <input
          type="text"
          value={deleteNode}
          onChange={(e) => setDeleteNode(e.target.value)}
          placeholder="Delete Node"
        />

        <button onClick={removeNode}>Remove Node</button>
      </div>

      <div className="graphcontrol">
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder={directed ? "Source" : "Vertex 1"}
        />

        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder={directed ? "Target" : "Vertex 2"}
        />

        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight"
        />

        <button onClick={addEdge}>Add Edge</button>
      </div>

      <div className="graphcontrol">
        <input
          type="text"
          value={deleteSource}
          onChange={(e) => setDeleteSource(e.target.value)}
          placeholder={directed ? "Delete Source" : "Delete Vertex 1"}
        />

        <input
          type="text"
          value={deleteTarget}
          onChange={(e) => setDeleteTarget(e.target.value)}
          placeholder={directed ? "Delete Target" : "Delete Vertex 2"}
        />

        <input
          type="number"
          value={deleteWeight}
          onChange={(e) => setDeleteWeight(e.target.value)}
          placeholder="Delete weight"
        />

        <button onClick={removeEdge}>Remove Edge</button>
      </div>

      <div className="graphcontrol">
        <input
          type="text"
          value={start}
          onChange={(e) => {
            setStart(e.target.value);
          }}
          placeholder="Enter Start Vertex"
        />

        <button onClick={runBFS}>Run BFS</button>
      </div>

      <div className="graphcontrol">
        <button onClick={clearGraph}>Clear Graph</button>
      </div>
    </div>
  );
}
