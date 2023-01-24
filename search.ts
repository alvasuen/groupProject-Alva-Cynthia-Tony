import express from "express";
import {formidable_promise} from "./main";

export const searchRoutes = express.Router();

searchRoutes.get("/search", getSearchResult);

export async function getSearchResult(req: express.Request, res: express.Response) {
    let formidable_result:any = await formidable_promise(req);
    console.log(formidable_result);
}

