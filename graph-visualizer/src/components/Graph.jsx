import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

export default function Graph({
  nodes,
  edges,
  directed,
  bfsResult,
  dfsResult,
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
            backgroundColor: "#2563eb",
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
            content: "data(weight)",
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

    // const layout=cy.layout({name:"grid"});      //returns the layout
    // layout.run();       //exceuting that layout
  }, [nodes, edges, directed, bfsResult, dfsResult]);

  return <div ref={containerRef} className="graph" />;
}
