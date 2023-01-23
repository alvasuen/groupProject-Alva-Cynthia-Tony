import { Router } from "express";
import { client } from "./db";

export let stepsRoutes = Router();

interface Steps {
  step_number: number;
  step_description: string;
  image: string;
  // recipe_id: number;
}

async function stepsMain() {
  await client.connect();
}

stepsRoutes.get("/recipe/:id", (req, res) => {
  let recipeId = req.params.id;
});
