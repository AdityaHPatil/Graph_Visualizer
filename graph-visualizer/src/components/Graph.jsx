import { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";


//Ray-casting algorithm to check if a point is inside a polygon
function pointInPolygon(point, polygon) {
  let inside=false;

  for (let i=0,j=polygon.length-1;i<polygon.length;j=i++){
    const current=polygon[i];
    const previous=polygon[j];

    const verticalCheck= (current.y > point.y) !== (previous.y > point.y);

    const ratio= (point.y - current.y) / (previous.y - current.y);
    const intersectX= ratio * (previous.x - current.x) + current.x;
    const horizontalCheck= point.x < intersectX;

    const crosses= verticalCheck && horizontalCheck;

    if (crosses) {
      inside=!inside;
    }

  }

  return inside;
}

export default function Graph({
  nodes,
  edges,
  directed,
  bfsResult,
  bfsStep,
  dfsResult,
  dfsStep,
  dijkstraResult,
  dijkstraStep,
  mstResult,
  tarjanResult,
  onSelectionChange,
}) {
  // Ref to hold the container div for Cytoscape
  const containerRef = useRef(null);

  // Ref to hold the Cytoscape instance
  const cyRef = useRef(null);

  // State to track whether the lasso selection tool is enabled
  const [lassoEnabled, setLassoEnabled] = useState(false);

  // State to hold the lasso path as an SVG path string
  const [lassoPath, setLassoPath] = useState("");

  //an array of points that represent the lasso path. Each point is an object with x and y properties.
  const lassoPointsRef = useRef([]);

  // Ref to track whether the lasso is currently being drawn
  const isLassoDrawingRef = useRef(false);

  function getLassoPoint(event) {
    const overlayRect = event.currentTarget.getBoundingClientRect();
    const graph = containerRef.current;

    return {
      x: ((event.clientX - overlayRect.left) * graph.clientWidth) / overlayRect.width,
      y: ((event.clientY - overlayRect.top) * graph.clientHeight) / overlayRect.height,
    };
  }

  function startLasso(event){
    //basically if the lasso is not enabled or the mouse button is not the left button, we return and do nothing
    if (!lassoEnabled || event.button!==0) return;

    event.preventDefault();
      // Why event.pointerId Matters
    // Unlike older mouse events (where there is only one mouse cursor), Pointer Events support multi-touch and styluses. Every finger touching the screen or pen hovering over it gets a unique pointerId number. Passing event.pointerId tells the browser which specific finger or mouse click to lock onto.
    event.currentTarget.setPointerCapture(event.pointerId);

    const point = getLassoPoint(event);

    isLassoDrawingRef.current=true;
    lassoPointsRef.current=[point];

    // This is the starting point of the lasso path, and we set it in the state so that the lasso can be drawn on the screen. The "M" command in SVG path data means "move to", which sets the starting point of the path without drawing a line.
    setLassoPath(`M ${point.x} ${point.y}`);
  }

  function moveLasso(event){
    if (!isLassoDrawingRef.current) return;

    lassoPointsRef.current.push(getLassoPoint(event));

    const pathData=lassoPointsRef.current.map((point,index)=>{
      //for the first point, we use "M" to move to that point without drawing a line. For subsequent points, we use "L" to draw a line to that point.
      const command=index===0 ? "M" : "L";

      return `${command} ${point.x} ${point.y}`;
    }).join(" ");


    setLassoPath(pathData);
  }



  function finishLasso(){
    if (!isLassoDrawingRef.current) return;

    isLassoDrawingRef.current=false;
    setLassoPath("");


    const points = lassoPointsRef.current;
    lassoPointsRef.current = [];

    // If the lasso path has fewer than 3 points, it cannot form a closed shape, so we return early without selecting any nodes.
    if (points.length<3) return;

    const cy=cyRef.current;
    if (!cy) return;

    // Filter nodes that are inside the lasso polygon
    const selectedNodes=cy.nodes().filter((node)=>{
      const position=node.renderedPosition();
      return pointInPolygon(position, points);
    });


    // Select the nodes that are inside the lasso polygon
    cy.nodes().unselect();
    selectedNodes.select();

    const selectedIds = new Set(selectedNodes.map((node) => node.id()));

    onSelectionChange?.({
    nodes: selectedNodes.map((node) => ({
      id: node.id(),
      label: node.data("label"),
    })),
    edges: cy.edges()
      .filter(
        (edge) =>
          selectedIds.has(edge.source().id()) &&
          selectedIds.has(edge.target().id()),
      )
      .map((edge) => ({
        id: edge.id(),
        source: edge.source().id(),
        target: edge.target().id(),
        weight: edge.data("weight"),
      })),
    });


  }

  function cancelLasso(){
    isLassoDrawingRef.current=false;
    lassoPointsRef.current=[];
    setLassoPath("");
  }


  function recenterGraph() {
    cyRef.current?.fit(undefined, 32);
  }

  useEffect(() => {
    const cy = cytoscape({
      boxSelectionEnabled: false,
      container: containerRef.current,
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "background-color": "#2563eb",
            color: "white",
            "text-valign": "center",
            "text-halign": "center",
            width: 50,
            height: 50,
          },
        },
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#64748b",
            "target-arrow-color": "#64748b",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(weight)",
            "font-size": 12,
            "text-background-color": "rgba(255,255,255,0.8)",
            "text-background-opacity": 1,
            "text-background-padding": 2,
            "text-rotation": "autorotate",
            color: "#0f172a",
          },
        },
        {
          selector:"node:selected",
          style:{
            "border-width":4,
            "border-color": "#f59e0b",
          },
        }
      ],
      layout: {
        name: "grid",
      },
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, []);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) {
      return;
    }

    cy.elements().remove();

    cy.add([
      ...nodes.map((node) => ({
        group: "nodes",
        data: {
          id: node.id,
          label: node.label,
        },
      })),

      ...edges.map((edge) => ({
        group: "edges",
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          weight: edge.weight,
        },
      })),
    ]);

    cy.style()
      .selector("edge")
      .style("target-arrow-shape", directed ? "triangle" : "none");

    cy.layout({ name: "grid" }).run();

    cy.nodes().style("background-color", "#2563eb");

    if (bfsResult && bfsStep >= 0) {
      const visitedNodes = bfsResult.order.slice(0, bfsStep + 1);

      visitedNodes.forEach((nodeId, index) => {
        const node = cy.getElementById(nodeId);

        if (index === visitedNodes.length - 1) {
          node.style("background-color", "#f59e0b");
          node.style("border-width", 5);
          node.style("border-color", "#fbbf24");
        } else {
          node.style("background-color", "#22c55e");
        }
      });
    }

    if (dfsResult && dfsStep >= 0) {
      const visitedNodes = dfsResult.order.slice(0, dfsStep + 1);

      visitedNodes.forEach((nodeId, index) => {
        const node = cy.getElementById(nodeId);

        if (index === visitedNodes.length - 1) {
          node.style("background-color", "#f59e0b");
          node.style("border-width", 5);
          node.style("border-color", "#fbbf24");
        } else {
          node.style("background-color", "#22c55e");
        }
      });
    }

    if (dijkstraResult && dijkstraStep >= 0) {
      const visitedNodes = dijkstraResult.order.slice(
        0,
        dijkstraStep + 1,
      );

      visitedNodes.forEach((nodeId, index) => {
        const node = cy.getElementById(nodeId);

        if (index === visitedNodes.length - 1) {
          node.style("background-color", "#f59e0b");
          node.style("border-width", 5);
          node.style("border-color", "#fbbf24");
        } else {
          node.style("background-color", "#22c55e");
        }
      });
    }

    if (mstResult) {
      mstResult.edges.forEach((edge) => {
        cy.getElementById(edge.id).style("line-color", "#22c55e");
        cy.getElementById(edge.id).style("width", 5);
      });
    }

    if (tarjanResult) {
      tarjanResult.articulationPoints.forEach((nodeId) => {
        cy.getElementById(nodeId).style("background-color", "#f59e0b");
      });

      tarjanResult.bridges.forEach((edgeId) => {
        cy.getElementById(edgeId).style("line-color", "#22c55e");
        cy.getElementById(edgeId).style("width", 5);
      });
    }

    // const layout=cy.layout({name:"grid"});      //returns the layout
    // layout.run();       //exceuting that layout
  }, [
    nodes,
    edges,
    directed,
    bfsResult,
    bfsStep,
    dfsResult,
    dfsStep,
    dijkstraResult,
    dijkstraStep,
    mstResult,
    tarjanResult,

  ]);

  return (
    <div className="graph-viewport">
      <div ref={containerRef} className="graph" />

      <div className="graph-toolbar">
        <button
          type="button"
          className="button-secondary"
          onClick={recenterGraph}
        >
          Recenter graph
        </button>

        <button
          type="button"
          className={lassoEnabled ? "button-secondary lasso-active" : "button-secondary"}
          aria-pressed={lassoEnabled}
          onClick={() => setLassoEnabled((prev) => !prev)}
        >
          {lassoEnabled ? "Disable Lasso" : "Enable Lasso"}
        </button>
      </div>

      <svg
        className={lassoEnabled ? "graph-lasso-overlay active" : "graph-lasso-overlay"}
        onPointerDown={startLasso}
        onPointerMove={moveLasso}
        onPointerUp={finishLasso}
        onPointerCancel={cancelLasso}
        aria-hidden="true"
      >
        <path className="lasso-path" d={lassoPath} />
      </svg>
    </div>
  );
}
