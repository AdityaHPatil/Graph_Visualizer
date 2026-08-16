import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

export default function Graph({
  nodes,
  edges,
  directed,
  bfsResult,
  dfsResult,
  dijkstraResult,
  mstResult,
  tarjanResult,
}) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  useEffect(() => {
    const cy = cytoscape({
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

    if (bfsResult) {
      bfsResult.order.forEach((nodeId) => {
        cy.getElementById(nodeId).style("background-color", "green");
      });
    }

    if (dfsResult) {
      dfsResult.order.forEach((nodeId) => {
        cy.getElementById(nodeId).style("background-color", "red");
      });
    }

    if (dijkstraResult) {
      dijkstraResult.order.forEach((nodeId) => {
        cy.getElementById(nodeId).style("background-color", "red");
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
    dfsResult,
    dijkstraResult,
    mstResult,
    tarjanResult,
  ]);

  return <div ref={containerRef} className="graph" />;
}
