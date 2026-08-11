import { useState } from "react";
import bfs from "../algorithms/bfs.js";

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
      weight:5,
    },
  ]);

  const [vertex, setVertex] = useState("");

  const [weight,setWeight]=useState("");

  const [source, setSource] = useState("");

  const [target, setTarget] = useState("");

  const [deleteNode, setDeleteNode] = useState("");

  const [deleteSource, setDeleteSource] = useState("");

  const [deleteTarget, setDeleteTarget] = useState("");

  const [deleteWeight,setDeleteWeight]=useState("");

  const [directed, setDirected] = useState(true);

  const [start,setStart]=useState("");

  const [BfsResult,setBfsResult]=useState(null);

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
    setNodes((prevNodes) =>
      prevNodes.filter((node) => node.id !== deleteNode)
    );

    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) =>
          edge.source !== deleteNode &&
          edge.target !== deleteNode
      )
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
            edge.target === deleteTarget && edge.weight === parsedDeleteWeight) ||
          (edge.source === deleteTarget &&
            edge.target === deleteSource && edge.weight === parsedDeleteWeight)
        );
      })
    );

    setDeleteSource("");
    setDeleteTarget("");
    setDeleteWeight("");
  }

  function clearGraph() {
    setNodes([]);
    setEdges([]);
  }

  function runBFS(){
    const result = bfs(nodes, edges, start, directed);
    console.log('BFS result (computed):', result);
    setBfsResult(result);

    setStart("");
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

    start,
    setStart,
    runBFS,
    bfsResult: BfsResult
  };
}