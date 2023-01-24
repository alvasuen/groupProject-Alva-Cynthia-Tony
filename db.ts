import pg from "pg";
import { env } from "./env";

export let client = new pg.Client({
  database: env.DB_NAME,
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD,
});

client.connect().catch((err) => {
  console.error("Filed to connect to database:", err);
  //If error, stop the node.js
  process.exit(1);
});
