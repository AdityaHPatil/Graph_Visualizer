import { randomUUID } from "node:crypto";
import driver from "../../db/neo4j.js";
import pool from "../../db/index.js";

function isValidGraph({ nodes, edges, directed }) {
  //checking if nodes and edges are arrays and directed is a boolean
  if (
    !Array.isArray(nodes) ||
    !Array.isArray(edges) ||
    typeof directed !== "boolean"
  ) {
    return false;
  }

  //checking if nodes have unique ids and valid labels, and edges have valid source, target, and weight
  const nodeIds = new Set();


  for (const node of nodes) {
    if (
      !node ||
      typeof node.id !== "string" ||
      typeof node.label !== "string" ||
      nodeIds.has(node.id)
    ) {
      return false;
    }

    nodeIds.add(node.id);
  }

  return edges.every(
    (edge) =>
      edge &&
      typeof edge.id === "string" &&      //if the edge has a valid id
      typeof edge.source === "string" &&    //if the edge has a valid source
      typeof edge.target === "string" &&     //if the edge has a valid target
      Number.isFinite(edge.weight) &&      //if the edge has a valid weight
      nodeIds.has(edge.source) &&     //if the edge source is in the node ids
      nodeIds.has(edge.target),     //if the edge target is in the node ids
  );
}

export async function saveGraph(req, res) {
  const { nodes, edges, directed } = req.body ?? {};

  if (!isValidGraph({ nodes, edges, directed })) {
    return res.status(400).json({ message: "Invalid graph data" });
  }

  //Checks whether the URL includes a graph ID. If yes, this request is treated as an update; if not, it’s a new graph.
  //if graph ID is present, it will be used; otherwise, a new random UUID will be generated for the graph.
  const isUpdate = Boolean(req.params.id);
  //Uses the provided ID for an update, or generates a new unique ID for a graph being created.
  const id = req.params.id || randomUUID();
  //Gets the ID of the signed-in user from the authenticated request. It’s converted to a string because the graph records store it as a string.
  //If req.user.id happens to be missing or undefined because of an authentication hiccup, trying to call a method like .toString() directly on it will instantly crash your server:
  const ownerId = String(req.user.id);
  //Opens a Neo4j session targeting the database named in NEO4J_DATABASE. If that setting isn’t provided, it uses Neo4j’s default database, neo4j. The session is used by later queries and should be closed when they finish.
  const session = driver.session({
    database: process.env.NEO4J_DATABASE || "neo4j",
  });

  try {
    await session.executeWrite(async (tx) => {
      //if it is an update and  not a new graph being stored into neo4j
      if (isUpdate) {
        const existing = await tx.run(
          `MATCH (u:GraphUser {id: $ownerId})-[:OWNS]->(g:SavedGraph {id: $id})
           RETURN g.id AS id`,
          { id, ownerId },
        );

        if (existing.records.length === 0) {
          const error = new Error("Graph not found");
          error.statusCode = 404;
          throw error;
        }

        await tx.run(
          `MATCH (u:GraphUser {id: $ownerId})-[:OWNS]->(g:SavedGraph {id: $id})
           OPTIONAL MATCH (g)-[:HAS_VERTEX]->(v:GraphVertex)
           DETACH DELETE v
           WITH g
           SET g.directed = $directed, g.updatedAt = datetime()`,
          { id, ownerId, directed },
        );
      } //if it a new graph being stored into neo4j
      else {
        await tx.run(
           `MERGE (u:GraphUser {id: $ownerId})
           CREATE (g:SavedGraph {
             id: $id,
             directed: $directed,
             createdAt: datetime(),
             updatedAt: datetime()
           })
           CREATE (u)-[:OWNS]->(g)`,
          { id, ownerId, directed },
        );
      }


      //add the nodes
      await tx.run(
        `MATCH (u:GraphUser {id: $ownerId})-[:OWNS]->(g:SavedGraph {id: $id})
         UNWIND $nodes AS node
         CREATE (g)-[:HAS_VERTEX]->(:GraphVertex {
           id: node.id,
           label: node.label
         })`,
        { id, ownerId, nodes },
      );

      //add the edges
      await tx.run(
        `UNWIND $edges AS edge
         MATCH (u:GraphUser {id: $ownerId})-[:OWNS]->(g:SavedGraph {id: $id})
               -[:HAS_VERTEX]->(source:GraphVertex {id: edge.source})
         MATCH (g)-[:HAS_VERTEX]->(target:GraphVertex {id: edge.target})
         CREATE (source)-[:CONNECTED_TO {
           id: edge.id,
           weight: edge.weight
         }]->(target)`,
        { id, ownerId, edges },
      );
    });

    return res.status(isUpdate ? 200 : 201).json({ id });
  } catch (error) {
    console.error("Could not save graph:", error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.statusCode ? error.message : "Could not save graph" });
  } finally {
    await session.close();
  }
}

export async function loadGraph(req, res) {
  const id = req.params.id;   //The graph ID is extracted from the request parameters, which is used to identify which graph to load from the database.
  const ownerId = String(req.user.id);   //The owner ID is obtained from the authenticated request, ensuring that only the user who owns the graph can access it. It’s converted to a string for consistency with how it’s stored in the database.
  const session = driver.session({
    database: process.env.NEO4J_DATABASE || "neo4j",
  });

  try {
    const graphResult = await session.run(
      `MATCH (u:GraphUser {id: $ownerId})-[:OWNS]->(g:SavedGraph {id: $id})
       RETURN g.directed AS directed`,
      { id, ownerId },
    );

    if (graphResult.records.length === 0) {
      return res.status(404).json({ message: "Graph not found" });
    }

    const nodeResult = await session.run(
      `MATCH (u:GraphUser {id: $ownerId})-[:OWNS]->(g:SavedGraph {id: $id})
             -[:HAS_VERTEX]->(v:GraphVertex)
       RETURN v.id AS id, v.label AS label
       ORDER BY v.id`,
      { id, ownerId },
    );

    const edgeResult = await session.run(
      `MATCH (u:GraphUser {id: $ownerId})-[:OWNS]->(g:SavedGraph {id: $id})
             -[:HAS_VERTEX]->(source:GraphVertex)
             -[r:CONNECTED_TO]->(target:GraphVertex)
       MATCH (g)-[:HAS_VERTEX]->(target)
       RETURN r.id AS id, source.id AS source,
              target.id AS target, r.weight AS weight`,
      { id, ownerId },
    );

    return res.json({
      id,
      directed: graphResult.records[0].get("directed"),
      nodes: nodeResult.records.map((record) => ({
        id: record.get("id"),
        label: record.get("label"),
      })),
      edges: edgeResult.records.map((record) => ({
        id: record.get("id"),
        source: record.get("source"),
        target: record.get("target"),
        weight: record.get("weight").toNumber?.() ?? record.get("weight"),
      })),
    });
  } catch (error) {
    console.error("Could not load graph:", error);
    return res.status(500).json({ message: "Could not load graph" });
  } finally {
    await session.close();
  }
}

export async function shareGraph(req, res) {
  const email = req.body?.email;

  if (typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ message: "A valid email is required" });
  }

  const ownerId = String(req.user.id);
  const graphId = req.params.id;
  const session = driver.session({
    database: process.env.NEO4J_DATABASE || "neo4j",
  });

  try {
    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email.trim().toLowerCase()],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    const inviteeId = String(userResult.rows[0].id);
    const result = await session.executeWrite((tx) =>
      tx.run(
        `MATCH (owner:GraphUser {id: $ownerId})-[:OWNS]->(g:SavedGraph {id: $graphId})
         MERGE (invitee:GraphUser {id: $inviteeId})
         MERGE (invitee)-[:OWNS]->(g)
         RETURN g.id AS id`,
        { ownerId, inviteeId, graphId },
      ),
    );

    if (result.records.length === 0) {
      return res.status(404).json({ message: "Graph not found or not yours" });
    }

    return res.json({ message: "Graph shared successfully" });
  } catch (error) {
    console.error("Could not share graph:", error);
    return res.status(500).json({ message: "Could not share graph" });
  } finally {
    await session.close();
  }
}