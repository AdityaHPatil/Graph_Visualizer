import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;

if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
  throw new Error("Missing NEO4J_URI, NEO4J_USERNAME, or NEO4J_PASSWORD");
}

const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD),
);

export default driver;
