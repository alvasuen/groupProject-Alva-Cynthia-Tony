import express from "express";
import {formidable_promise} from "./main";
// import { Client } from "pg";

// export const client = new Client({
//     database: process.env.DB_NAME,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//   });
  
//   client.connect();

export const searchRoutes = express.Router();

searchRoutes.get("/search", getSearchResult);

export async function getSearchResult(req: express.Request, res: express.Response) {
    let formidable_result:any = await formidable_promise(req);
    console.log(formidable_result);
}

