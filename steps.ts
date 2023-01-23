import { Router } from "express";

export let stepsRoutes = Router();

interface Steps {
  step_number: number;
  step_description: string;
  image: string;
  recipe_id: number;
}

stepsRoutes.get("/recipe/:id", (req, res) => {});
