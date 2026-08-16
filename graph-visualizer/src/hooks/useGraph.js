import { useState } from "react";
import bfs from "../algorithms/bfs.js";
import dfs from "../algorithms/dfs.js";
import dijkstra from "../algorithms/dijkstra.js";
import Kruskal from "../algorithms/kruskal.js";
import tarjan from "../algorithms/tarjan.js";

export default function useGraph() {
  const [nodes, setNodes] = useState([
    { id: "A", label: "A" },
    { id: "B", label: "B" },
  ]);

  const [edges, setEdges] = useState([
    {
      id: "AB",
      source: "A",
      target: "B",
      weight: 5,
    },
  ]);

  const [vertex, setVertex] = useState("");

  const [weight, setWeight] = useState("");

  const [source, setSource] = useState("");

  const [target, setTarget] = useState("");

  const [deleteNode, setDeleteNode] = useState("");

  const [deleteSource, setDeleteSource] = useState("");

  const [deleteTarget, setDeleteTarget] = useState("");

  const [deleteWeight, setDeleteWeight] = useState("");

  const [directed, setDirected] = useState(true);

  const [startBFS, setStartBFS] = useState("");
  const [startDFS, setStartDFS] = useState("");

  const [BfsResult, setBfsResult] = useState(null);
  const [DfsResult, setDfsResult] = useState(null);

  const [startDijkstra, setStartDijkstra] = useState("");
  const [DijkstraResult, setDijkstraResult] = useState("");

  const [MSTResult, setMSTResult]=useState(null);

  const [tarjanResult, setTarjanResult]=useState(null);

  function addNode() {
    const newNode = {
      id: vertex,
      label: vertex,
    };

    if (nodes.some((node) => node.id === vertex)) {
      alert("Node already exists");
      return;
    }

    setNodes((prevNodes) => [...prevNodes, newNode]);

    setVertex("");
  }

  function addEdge() {
    const parsedWeight = Number(weight);
    if (Number.isNaN(parsedWeight)) {
      alert("Enter a valid weight");
      return;
    }

    const newEdge = {
      id: `E${edges.length + 1}`,
      source: source,
      target: target,
      weight: parsedWeight,
    };

    setEdges((prevEdges) => [...prevEdges, newEdge]);

    setSource("");
    setTarget("");
    setWeight("");
  }

  function removeNode() {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== deleteNode));

    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => edge.source !== deleteNode && edge.target !== deleteNode,
      ),
    );

    setDeleteNode("");
  }

  function removeEdge() {
    const parsedDeleteWeight = Number(deleteWeight);

    if (deleteWeight === "" || Number.isNaN(parsedDeleteWeight)) {
      alert("Enter a valid weight to remove");
      return;
    }

    setEdges((prevEdges) =>
      prevEdges.filter((edge) => {
        if (directed) {
          return !(
            edge.source === deleteSource &&
            edge.target === deleteTarget &&
            edge.weight === parsedDeleteWeight
          );
        }

        return !(
          (edge.source === deleteSource &&
            edge.target === deleteTarget &&
            edge.weight === parsedDeleteWeight) ||
          (edge.source === deleteTarget &&
            edge.target === deleteSource &&
            edge.weight === parsedDeleteWeight)
        );
      }),
    );

    setDeleteSource("");
    setDeleteTarget("");
    setDeleteWeight("");
  }

  function clearGraph() {
    setNodes([]);
    setEdges([]);
    setBfsResult(null);
    setDfsResult(null);
    setDijkstraResult(null);
  }

  function clearTraversal(){
    setBfsResult(null);
    setDfsResult(null);
    setDijkstraResult(null);
  }

  function runBFS() {
    if (!startBFS) {
      alert("Please enter a start node for BFS");
      return;
    }
    const result = bfs(nodes, edges, startBFS, directed);
    console.log("BFS result (computed):", result);
    setBfsResult(result);

    setStartBFS("");
  }

  function runDFS() {
    if (!startDFS) {
      alert("Please enter a start node for DFS");
      return;
    }
    const result = dfs(edges, nodes, startDFS, directed);
    console.log("DFS result (computed):", result);
    setDfsResult(result);

    setStartDFS("");
  }

  function runDijkstra() {
    if (!startDijkstra) {
      alert("Please enter a start node for Dijkstra");
      return;
    }

    const result=dijkstra(nodes,edges,startDijkstra,directed);
    console.log('Dijkstra Result: ', result);
    setDijkstraResult(result);

    setStartDijkstra("");
  }

  function runKruskal(){
    if (directed){
      alert("For MST we don't consider directed graphs");
      return;
    }
    const result=Kruskal(nodes,edges,directed);
    console.log(result);
    setMSTResult(result);
    
  }

  function runTarjan() {
    if (directed) {
      alert("Tarjan works only for undirected graphs");
      return;
    }

    const result = tarjan(nodes, edges, directed);
    console.log(result);
    setTarjanResult(result);
  }

  return {
    nodes,
    edges,

    vertex,
    setVertex,

    source,
    setSource,

    weight,
    setWeight,

    target,
    setTarget,

    deleteNode,
    setDeleteNode,

    deleteSource,
    setDeleteSource,

    deleteTarget,
    setDeleteTarget,

    deleteWeight,
    setDeleteWeight,

    directed,
    setDirected,

    addNode,
    addEdge,
    removeNode,
    removeEdge,
    clearGraph,
    clearTraversal,

    startBFS,
    setStartBFS,
    runBFS,
    bfsResult: BfsResult,

    startDFS,
    setStartDFS,
    runDFS,
    dfsResult: DfsResult,

    startDijkstra,
    setStartDijkstra,
    runDijkstra,
    dijkstraResult: DijkstraResult,

    runKruskal,
    mstResult: MSTResult,
    setMSTResult,


    runTarjan,
    tarjanResult:tarjanResult,
    setTarjanResult,
  };
}
