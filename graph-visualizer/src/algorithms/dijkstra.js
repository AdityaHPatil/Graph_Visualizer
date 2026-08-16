import adjlistcreator from "./adjacencylist_creator";



export default function dijkstra(nodes, edges, start, directed) {
  const adj = adjlistcreator(nodes, edges, directed);

  if (!start || !adj.has(start)) {
    return {
      error: `Start node '${start}' not found`,
      distances: {},
      order: [],
    };
  }

  const distances = {};
  const order = [];
  const pq = [];

  for (const node of nodes) {
    distances[node.id] = Infinity;
  }

  distances[start] = 0;
  pq.push([0, start]);

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [currentDist, currentNode] = pq.shift();

    if (currentDist > distances[currentNode]) continue;

    order.push(currentNode);

     const neighbors = adj.get(currentNode) || [];
    for (const item of neighbors) {
      const neighborNode = item.node;   // FIXED: Extract node ID from item
      const edgeWeight = item.weight;    // FIXED: Extract weight from item
      const nextDist = currentDist + edgeWeight;

      // FIXED: Use neighborNode consistently instead of neighbor.neighbor
      if (nextDist < distances[neighborNode]) {
        distances[neighborNode] = nextDist;
        pq.push([nextDist, neighborNode]);
      }
    }
  }

  return { error: null, distances, order };
}