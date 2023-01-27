import express from "express";
// import { Router } from "express";
// import { client } from "./db";
// import { Client } from "pg";
import { client } from "./main";
import dotenv from "dotenv";

dotenv.config();
// export const client = new Client({
//   database: process.env.DB_NAME,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
// });
// client.connect();

//產生 router object，存入變數
export const stepsRoutes = express.Router();

interface Steps {
  step_number: number;
  step_description: string;
  image: string;
  // recipe_id: number;
}

async function stepsMain() {
  // await client.connect();
}

// stepsRoutes.get("/recipe/:id", (req, res) => {
//   let { recipeId } = req.query;
//   console.log({ recipeId });
// });

//是 /recipe 的路徑
stepsRoutes.get("/steps", getRecipe);

export async function getRecipe(req: express.Request, res: express.Response) {
  try {
    const rec_id = req.query.id;

    const steps_number = await client.query(
      `SELECT step_number FROM steps WHERE recipe_id = $1`,
      [rec_id]
    );

    const step_description = await client.query(
      `SELECT step_description FROM steps WHERE recipe_id= $1`,
      [rec_id]
    );

    const image = await client.query(
      `SELECT image FROM steps WHERE recipe_id = $1`,
      [rec_id]
    );

    res.json({
      steps_number: steps_number.rows,
      step_description: step_description.rows,
      image: image.rows,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
}
