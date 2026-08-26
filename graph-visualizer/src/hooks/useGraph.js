import { useEffect,useState } from "react";
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

  const [bfsStep,setBfsStep] = useState(-1);
  const [isBfsPlaying,setIsBfsPlaying]=useState(false);

  const [dfsStep, setDfsStep] = useState(-1);
  const [isDfsPlaying, setIsDfsPlaying] = useState(false);

  const [BfsResult, setBfsResult] = useState(null);
  const [DfsResult, setDfsResult] = useState(null);

  const [startDijkstra, setStartDijkstra] = useState("");
  const [DijkstraResult, setDijkstraResult] = useState("");

  
  const [dijkstraStep,setDijkstraStep]=useState(-1);
  const [isDijkstraPlaying, setIsDijkstraPlaying]=useState(false);


  const [MSTResult, setMSTResult]=useState(null);

  const [tarjanResult, setTarjanResult]=useState(null);

  function resetAlgorithmState(){
    setBfsResult(null);
    setDfsResult(null);
    setDijkstraResult(null);
    setMSTResult(null);
    setTarjanResult(null);

    setBfsStep(-1);
    setDfsStep(-1);
    setDijkstraStep(-1);

    setIsBfsPlaying(false);
    setIsDfsPlaying(false);
    setIsDijkstraPlaying(false);
  }

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
    resetAlgorithmState();
    setVertex("");
  }

  function addEdge() {
    const parsedWeight = Number(weight);
    if (Number.isNaN(parsedWeight)) {
      alert("Enter a valid weight");
      return;
    }

    if (!nodes.some((node)=>{return node.id===source})){
        alert("Source node does not exist");
        return;
    }

    if (!nodes.some((node) => node.id === target)) {
        alert("Target node does not exist");
        return;
    }

    const newEdge = {
      id: `E${edges.length + 1}`,
      source: source,
      target: target,
      weight: parsedWeight,
    };

    setEdges((prevEdges) => [...prevEdges, newEdge]);
    resetAlgorithmState();
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

    resetAlgorithmState();

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

    resetAlgorithmState();

    setDeleteSource("");
    setDeleteTarget("");
    setDeleteWeight("");
  }

  function clearGraph() {
    setNodes([]);
    setEdges([]);
    resetAlgorithmState();
  }

  function clearTraversal(){
    resetAlgorithmState();
  }

  //bfs

  function runBFS() {
    if (!startBFS) {
      alert("Please enter a start node for BFS");
      return;
    }
    const result = bfs(nodes, edges, startBFS, directed);
    console.log("BFS result (computed):", result);

    if (result.error){
      alert(result.error);
      return;
    }

    setBfsResult(result);
    setBfsStep(-1);
    setIsBfsPlaying(false);
    setStartBFS("");
  }

  function nextBfsStep(){
    if (!BfsResult || bfsStep >= BfsResult.order.length-1){
      setIsBfsPlaying(false);
      return;
    }
    setBfsStep((step)=>step+1);

  }

  function playBfs(){
    if (!BfsResult){
      alert("Run BFS first");
      return;
    }

    if (isDfsPlaying){
      const shouldSwitch=window.confirm("DFS is currently playing. Stop DFS and start BFS?",);
      if (!shouldSwitch){
        return;
      }
      setIsDfsPlaying(false);
    }

    if (bfsStep>=BfsResult.order.length-1){
        setBfsStep(-1);
    }

    setIsBfsPlaying(true);
  }

  function pauseBfs(){
    setIsBfsPlaying(false);
  }

  function resetBfs(){
    setIsBfsPlaying(false);
    setBfsStep(-1);
  }


  //dfs 

  function runDFS() {
    if (!startDFS) {
      alert("Please enter a start node for DFS");
      return;
    }
    const result = dfs(edges, nodes, startDFS, directed);
    console.log("DFS result (computed):", result);

    if (result.error) {
      alert(result.error);
      return;
    }

    setDfsResult(result);
    setDfsStep(-1);
    setIsDfsPlaying(false);

    setStartDFS("");
  }

  function nextDfsStep() {
    if (!DfsResult || dfsStep >= DfsResult.order.length - 1) {
      setIsDfsPlaying(false);
      return;
    }

    setDfsStep((step) => step + 1);
  }

  function playDfs() {
    if (!DfsResult) {
      alert("Run DFS first");
      return;
    }

    if (isBfsPlaying){
      const shouldSwitch=window.confirm("BFS is currently. Stop BFS and starts DFS?",);

      if (!shouldSwitch){
        return;
      }

      setIsBfsPlaying(false);
    }

    if (dfsStep >= DfsResult.order.length - 1) {
      setDfsStep(-1);
    }

    setIsDfsPlaying(true);
  }

  function pauseDfs() {
    setIsDfsPlaying(false);
  }

  function resetDfs() {
    setIsDfsPlaying(false);
    setDfsStep(-1);
  }


  //dijkstra  

  function runDijkstra() {
    if (!startDijkstra) {
      alert("Please enter a start node for Dijkstra");
      return;
    }

    const negativeEdges=edges.some((edge)=>{return edge.weight<0});
    if (negativeEdges){
          alert("Dijkstra cannot run with negative edge weights");
          return;
    }

    const result=dijkstra(nodes,edges,startDijkstra,directed);
    console.log('Dijkstra Result: ', result);

    if (result.error){
      alert(result.error);
      return;
    }

    setDijkstraResult(result);
    setDijkstraStep(-1);
    setIsDijkstraPlaying(false);

    setStartDijkstra("");

//     Store the new complete Dijkstra result, reset the animation position, and make sure playback starts fresh.

// Without resetting the step, running Dijkstra again could begin halfway through the previous animation or immediately appear finished.
  }

  function nextDijkstraStep(){
    if (!DijkstraResult || dijkstraStep>= DijkstraResult.order.length-1){
      setIsDijkstraPlaying(false);
      return;
    }
    setDijkstraStep((step)=>step+1);
  }

  function playDijkstra(){
    if (!DijkstraResult){
      alert("Run dijkstra first");
      return;
    }
    if (dijkstraStep>=DijkstraResult.order.length-1){
      setDijkstraStep(-1);
    }

    setIsDijkstraPlaying(true);
  }

  function pauseDijkstra(){
    setIsDijkstraPlaying(false);
  }

  function resetDijkstra(){
    setIsDijkstraPlaying(false);
    setDijkstraStep(-1);
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

  useEffect(()=>{
    if (!isBfsPlaying){
      return;
    }

    const timer=setInterval(() => { 
      setBfsStep((step) => { 
        if (!BfsResult || step>=BfsResult.order.length-1){
          setIsBfsPlaying(false);
          return step;
        }

        return step+1;
       })
     },800);
    
    
     return ()=>clearInterval(timer);


     /*
      Purpose:

          setInterval() repeatedly advances the animation every 800 milliseconds.
          
          clearInterval(timer) stops that repeating process.

          React runs the returned cleanup function when:

              The component unmounts, such as after logout.

              The effect runs again because its dependencies change.

              Playback is paused and the effect is cleaned up.

      Without it, old timers could keep running in the background, causing unnecessary updates or multiple animation timers after restarting playback.
      
    */
  },[isBfsPlaying,BfsResult])

  useEffect(() => {
    if (!isDfsPlaying) {
      return;
    }

    const timer = setInterval(() => {
      setDfsStep((step) => {
        if (!DfsResult || step >= DfsResult.order.length - 1) {
          setIsDfsPlaying(false);
          return step;
        }

        return step + 1;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [isDfsPlaying, DfsResult]);

  useEffect(()=>{
    if (!isDijkstraPlaying){
      return;
    }

    const timer=setInterval(()=>{
      setDijkstraStep((step)=>{
        if (!DijkstraResult || step >= DijkstraResult.order.length-1){
          setIsDijkstraPlaying(false);
          return step;
        }
        return step+1;
      });
    },800)

    return ()=> clearInterval(timer);
  },[isDijkstraPlaying,DijkstraResult]);
  

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
    resetDijkstra
  };
}
