import express from "express";
import {formidable_promise} from "./main";

export const searchRoutes = express.Router();


searchRoutes.post("/search", getSearchResult);

export async function getSearchResult(req: express.Request, res: express.Response) {
    console.log(req.body.content);

}

// app.post("/search", async (req:Request, res:Response)=>{
    //   let searchContent = req.body.content
    //   // console.log(searchContent);
    //   try{
    //      const searchResult = await client.query(
    //     `SELECT * FROM "users" WHERE login_email = $1`,
    //     [searchContent]
    //   );
    //   }
     
      
    // })

    // app.get("/search_data",async(req:Request, res:Response)=>{
    //     try{
    //       //get data from database
    //       let rawDataRep = await client.query(`SELECT * FROM "recipes"`);
    //       let rawDataPo = await client.query(`SELECT * FROM "posts"`);
    //       if (rawDataRep.rowCount === 0) {
    //         res.json({
    //           message:"Oops!No record!",
    //           success: false
    //       });
    //         return;
    //       }
    //       if (rawDataPo.rowCount === 0) {
    //         res.json({
    //           message:"Oops!No record!",
    //           success: false
    //         });
    //         return;
    //       }
    //       //send to client
    //       let rawData1=rawDataRep
      
    //       let rawData2=rawDataPo
      
    //       res.json({
    //         content:{Recipes:rawData1, Posts:rawData2},
    //         success: true
    //       })
      
    //     }catch (err){
    //       console.log(err);
    //       res.status(500).json({
    //         message:"unexpected error",
    //         success:false
    //       });
    //     }})