export default function adjlistcreator(nodes, edges,directed){
    const adj=new Map();

    for (const node of nodes) {
    adj.set(node.id, []);
  }

  for (const edge of edges) {
    if (!adj.has(edge.source)) adj.set(edge.source, []);
    if (!adj.has(edge.target)) adj.set(edge.target, []);

    adj.get(edge.source).push({node:edge.target,weight:edge.weight});
    if (!directed) {
      adj.get(edge.target).push({node:edge.source,weight:edge.weight});
    }
  }



    return adj;
}