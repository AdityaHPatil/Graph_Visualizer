export default function Kruskal(nodes, edges, directed) {
  if (directed) {
    return {
      error: "MST works only for undirected graphs",
      edges: [],
      totalWeight: 0,
      order: [],
    };
  }

  const parent = {};
  const rank = {};

  function find(x) {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  }

  function union(a, b) {
    const ra = find(a);
    const rb = find(b);

    if (ra === rb) return false;

    if (rank[ra] < rank[rb]) {
      parent[ra] = rb;
    } else if (rank[ra] > rank[rb]) {
      parent[rb] = ra;
    } else {
      parent[rb] = ra;
      rank[ra] += 1;
    }

    return true;
  }

  nodes.forEach((node) => {
    parent[node.id] = node.id;
    rank[node.id] = 0;
  });

  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

  const mstEdges = [];

  let totalWeight = 0;

  for (const edge of sortedEdges) {
    if (union(edge.source, edge.target)) {
      totalWeight += edge.weight;
      mstEdges.push(edge);
      if (mstEdges.length === nodes.length - 1) break;
    }
  }

  return {
    error: null,
    edges: mstEdges,
    totalWeight,
    order: mstEdges.map((e) => e.id),
  };
}
