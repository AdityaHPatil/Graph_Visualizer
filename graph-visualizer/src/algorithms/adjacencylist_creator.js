export default function adjlistcreator(nodes, edges,directed){
    const adj=new Map();

    for (const node of nodes) {
    adj.set(node.id, []);
  }

  for (const edge of edges) {
    if (!adj.has(edge.source)) adj.set(edge.source, []);
    if (!adj.has(edge.target)) adj.set(edge.target, []);

    adj.get(edge.source).push(edge.target);
    if (!directed) {
      adj.get(edge.target).push(edge.source);
    }
  }



    return adj;
}