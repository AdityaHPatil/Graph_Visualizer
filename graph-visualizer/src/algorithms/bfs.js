import adjlistcreator from "./adjacencylist_creator";

export default function bfs(nodes, edges, start, directed) {
  // Build adjacency list (include all nodes so isolated nodes are present)
  // const adj = new Map();
  // for (const node of nodes) {
  //   adj.set(node.id, []);
  // }

  // for (const edge of edges) {
  //   if (!adj.has(edge.source)) adj.set(edge.source, []);
  //   if (!adj.has(edge.target)) adj.set(edge.target, []);

  //   adj.get(edge.source).push(edge.target);
  //   if (!directed) {
  //     adj.get(edge.target).push(edge.source);
  //   }
  // }

  const adj=adjlistcreator(nodes,edges,directed);



  // Validate start
  if (!start || !adj.has(start)) {
    return { error: `Start node '${start}' not found`, distances: {}, order: [] };
  }

  // Initialize distances map with -1 for unreachable
  const distances = {};
  for (const nodeId of adj.keys()) {
    distances[nodeId] = -1;
  }

  const order = [];
  const queue = [];

  distances[start] = 0;
  queue.push(start);

  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);

    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      if (distances[v] === -1) {
        distances[v] = distances[u] + 1;
        queue.push(v);
      }
    }
  }

  return { distances, order };
}