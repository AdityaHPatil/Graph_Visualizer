import adjlistcreator from "./adjacencylist_creator";

export default function dfs(edges, nodes, start, directed) {
  const adj = adjlistcreator(nodes, edges, directed);

  // Validate start
  if (!start || !adj.has(start)) {
    return {
      error: `Start node '${start}' not found`,
      distances: {},
      order: [],
    };
  }

  let order = [];
  let distances={};
  const globalVisited=new Set();

  function rec(src,currentDistance=0) {
    globalVisited.add(src);
    console.log(src);
    order.push(src)
    distances[src]=currentDistance;

    const neighbors = adj.get(src) || [];

    for (const item of neighbors) {
      const v=typeof item==="string" ? item: item.node;
      if (!globalVisited.has(v)) {
        rec(v,currentDistance+1);
      }
    }
  }

  rec(start);

  return {
        error: null,
        distances: distances,
        order: order
    }; 
}
