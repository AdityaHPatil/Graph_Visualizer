import adjlistcreator from "./adjacencylist_creator"

export default function tarjan(nodes, edges, directed){
    if (directed){
        return{
            error:"Tarjan bridge/ articulation works only for undirected graphs",
            bridges:[],
            aritculationPoints:[],
            order:[],
        }
    }

    const adj=adjlistcreator(nodes,edges,directed);


    const visited=new Set();
    const disc={};
    const low={};
    const parent={};
    const articulationPoints=new Set();
    const bridges=[];

    let time=0;

    function dfs(u){
        visited.add(u);
        disc[u]=time;
        low[u]=time;

        time+=1;

        let childCount=0;

        const neighbours=adj.get(u)||[];
        for (const v of neighbours){
            if (!visited.has(v)){
                childCount+=1;
                parent[v]=u;
                dfs(v);

                low[u]=Math.min(low[u],low[v]);

                if (low[v]>disc[u]){
                    bridges.push(edges.id);
                }

                if (parent[u]==undefined && childCount>1){
                    articulationPoints.add(u);
                }

                if (parent[u] !==undefined && low[v]>=disc[u]){
                    articulationPoints.add(u);
                }
            }else if (v!==parent[u]){
                low[u]=Math.min(low[u],disc[v]);
            }
        }

    }

    for (const node of nodes){
        if (!visited.has(node.id)){
            parent[node.id]=undefined;
            dfs(node.id);
        }
    }

    return{
        error:null,
        bridges:[...bridges],
        articulationPoints:[...articulationPoints],
        order:[...articulationPoints],
    }
}