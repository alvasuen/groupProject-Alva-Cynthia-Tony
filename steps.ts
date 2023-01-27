import express from "express";
// import { Router } from "express";
// import { client } from "./db";
import { Client } from "pg";
import dotenv from "dotenv";

// export const client = new Client({
//   database: process.env.DB_NAME,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
// });

export let stepsRoutes = express.Router();

interface Steps {
  step_number: number;
  step_description: string;
  image: string;
  // recipe_id: number;
}

// client.connect();
async function stepsMain() {
  // await client.connect();
}

// stepsRoutes.get("/recipe/:id", (req, res) => {
//   let { recipeId } = req.query;
//   console.log({ recipeId });
// });

stepsRoutes.get("/recipe", getRecipe);

export function getRecipe(req: express.Request, res: express.Response) {}
