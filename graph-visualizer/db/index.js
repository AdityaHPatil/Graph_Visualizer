import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: import.meta.env.DB_USER,
  host: import.meta.env.DB_HOST,
  database: import.meta.env.DB_NAME,
  password: import.meta.env.DB_PASSWORD,
  port: Number(import.meta.env.DB_PORT || 5432),
});

export default pool;