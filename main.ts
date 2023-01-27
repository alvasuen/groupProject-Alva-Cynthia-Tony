import express, { NextFunction, query } from "express";
import { Request, Response } from "express";
import expressSession from "express-session";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";
import http from "http";
import { checkPassword, hashPassword } from "./hash";
import { resolveModuleName } from "typescript";
// import { stepsRoutes } from "./steps";
// import { searchRoutes } from "./search";
import { nextTick } from "process";
// import { Server as SocketIO } from "socket.io";

const app = express();

dotenv.config();

export const client = new Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

client.connect();

app.use(express.json());

//formidable's default setting
const uploadDir = "uploads";
fs.mkdirSync(uploadDir, { recursive: true });

export const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFiles: 1,
  maxFileSize: 200 * 1024 ** 2, // the default limit is 200KB
  filter: (part) => part.mimetype?.startsWith("image/") || false,
});

export function formidable_promise(req: express.Request) {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if ({ err }.err !== null) {
        reject({ err });
      }
      if (
        JSON.stringify({ fields }.fields) !== "{}" &&
        JSON.stringify({ files }.files) !== "{}"
      ) {
        // exist files and fields
        resolve({ files, fields });
      }
      if (JSON.stringify({ files }.files) !== "{}") {
        // exist files but not exist fields
        resolve({ files });
      }
      if (JSON.stringify({ fields }.fields) !== "{}") {
        // exist fields but not exist files
        resolve({ fields });
      }
    });
  });
}

//main page
let p = path.join(__dirname, "public");
app.use(express.static(p));


//session req.session
app.use(
  expressSession({
    //key to be encryted and exchange with client
    secret: "You are who you are",
    //will the session be renewed every time client and server build connection?
    resave: true,
    //need to build session for the first connection
    saveUninitialized: true,
  })
);

declare module "express-session" {
  interface SessionData {
    userId?: number;
    // count?: number;
    isLogin?: boolean;
  }
}

//login
app.get("/login", (req: Request, res: Response) => {
  res.sendFile(path.join(p, "login.html"));
});

//Local login
app.post("/login", async (req: Request, res: Response) => {
  let result = {
    isLogin: false,
    errMess: "",
    isError: false,
    user: { username: "" },
  };

  try {
    let formidable_result: any = await formidable_promise(req);
    const loginResult = await client.query(
      `SELECT * FROM "users" WHERE login_email = $1`,
      [formidable_result.fields.email]
    );

    if (loginResult.rowCount === 0) {
      result.isLogin = false;
      result.isError = true;
      result.errMess = "Oops! User not found!";
      res.json(result);
      return;
    } else {
      try {
        const match = await checkPassword(
          formidable_result.fields.password,
          loginResult.rows[0].password
        );
        if (match) {
          // if (loginResult.rows[0].password === formidable_result.fields.password) {
          //for js
          result.isLogin = true;
          result.isError = false;
          // console.log(loginResult.rows[0],'132')
          result.user.username = loginResult.rows[0].username;
          //for session
          req.session.userId = loginResult.rows[0].user_id;
          req.session.isLogin = true;
          // console.log(req.session,'136')
          //for response
          res.json(result);
          return;
        } else {
          result.isLogin = false;
          result.isError = true;
          result.errMess = "Incorrect Password";
          res.json(result);
          return;
        }
      } catch (err) {
        result.isLogin = false;
        result.isError = true;
        result.errMess = "Server error 500";
        res.json(result);
      }
    }
  } catch {
    result.isLogin = false;
    result.isError = true;
    result.errMess = "Unexpected error! Please create an account first!";
    res.json(result);
  }
});

//logout
app.post("/logout", (req, res) => {
  delete req.session.isLogin
  delete req.session.userId
  res.json({ success: true });
  });

//signup
app.get("/signup", (req: Request, res: Response) => {
  res.sendFile(path.join(p, "signup.html"));
});

app.post("/signup", async (req: Request, res: Response) => {
  let result = {
    errMess: "",
    isSignUp: false,
  };

  let formidable_result: any = await formidable_promise(req);
  try {
    const signUpCheck = await client.query(
      `SELECT * FROM "users" WHERE login_email = $1`,
      [formidable_result.fields.email]
    );
    if (signUpCheck.rowCount > 0) {
      result.errMess = "Sign Up rejected!";
      result.isSignUp = false;
      res.json(result);
    } else {
      try {
        const login_email = formidable_result.fields.email;
        const password = formidable_result.fields.password;
        const username = formidable_result.fields.username;
        const repeatPassword = formidable_result.fields.psw_repeat;
        const hash = await hashPassword(formidable_result.fields.password);
        if (password == repeatPassword) {
          await client.query(
            //check row count
            `INSERT INTO "users" (login_email, password, username) 
        VALUES ($1, $2, $3)`,
            [login_email, hash, username]
          );
          result.isSignUp = true;
          res.json(result);
        } else {
          result.isSignUp = false;
          result.errMess = "Password not match!";
          res.json(result);
        }
      } catch (err) {
        console.log(err);
        result.isSignUp = false;
        result.errMess = "Unexpected error, please try again!";
        res.json(result);
      }
    }
  } catch (err) {
    console.log(err);
    result.isSignUp = false;
    result.errMess = "Unexpected error!";
    res.json(result);
  }
});

//user來到recipe是看這個page的
app.get("/recipes", async (req: Request, res: Response) => {
  // res.sendFile(path.join(p, "recipe.html"));
  const recipes = await client.query(`SELECT * FROM recipes`);
  res.json(recipes.rows);
});
// app.use("/recipe", stepsRoutes);
//這個只是用來拿data的
app.get("/recipe", async (req: Request, res: Response) => {
  // res.sendFile(path.join(p, "recipe.html"));
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
});

//load profile post
app.get("/profile", (req: Request, res: Response) => {
  try {
    const user_id = req.query.id;
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
    });
  }
});


//send all recipes and posts to client
app.get("/search_data", async (req: Request, res: Response) => {
  try {
    //get data from database
    let rawDataRep = await client.query(`SELECT * FROM "recipes"`);
    let rawDataPo = await client.query(`SELECT * FROM "posts"`);
    if (rawDataRep.rowCount === 0) {
      res.json({
        message: "Oops!No record!",
        success: false,
      });
      return;
    }
    if (rawDataPo.rowCount === 0) {
      res.json({
        message: "Oops!No record!",
        success: false,
      });
      return;
    }
    //send to client
    let rawData1 = rawDataRep;

    let rawData2 = rawDataPo;

    res.json({
      content: { recipes: rawData1, posts: rawData2 },
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "unexpected error",
      success: false,
    });
  }
});

app.post("/tag1", async (req: Request, res: Response) => {
  let tagContent = req.body.content;
  console.log(tagContent);
  try {
    const tagResult = await client.query(
      `SELECT * FROM tag WHERE tag_content = $1`,
      [tagContent]
    );
    // console.log(tagResult.rows,'279')
    const tagId = tagResult.rows[0].tag_id;
    const recipeData = await client.query(
      `SELECT * FROM recipes INNER JOIN tag_relate ON tag_relate.rep_id = recipes.recipe_id WHERE tag_id = $1`,
      [tagId]
    );
    // console.log(recipeData.rows);
    res.json({
      content: recipeData.rows,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Error! Please try again!",
    });
  }
});

app.post("/tag3", async (req: Request, res: Response) => {
  let tagContent = req.body.content;
  console.log(tagContent);
  try {
    const recipeData = await client.query(
      `SELECT * FROM recipes WHERE cooking_level = $1`,
      [tagContent]
    );
    res.json({
      content: recipeData.rows,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Error! Please try again!",
    });
  }
});

app.post("/search", async (req: Request, res: Response) => {
  let searchContent = req.body.content;
  console.log(searchContent);
  try {
    //steps
    let resultFromSteps = await client.query(
      `SELECT DISTINCT recipe_id FROM steps WHERE step_description ~* $1`,
      [searchContent]
    );


    //recipe name
    let resultFromName = await client.query(
      `SELECT * FROM recipes WHERE recipe_name ~* $1`,
      [searchContent]
    );
  
    //cooking level
    let resultFromLevel = await client.query(
      `SELECT * FROM recipes WHERE cooking_level ~* $1`,
      [searchContent]
    );
  
    //tag
    let sub_sql = 'SELECT tag_id FROM tag WHERE tag_content ~* $1'
    let resultFromTag = await client.query(
      `SELECT * FROM recipes INNER JOIN tag_relate ON tag_relate.rep_id = recipes.recipe_id WHERE tag_id IN (${sub_sql})`,
      [searchContent]
    );


    //ingredient
    let ingredientResult = await client.query(
      `SELECT ingredient_id FROM ingredient WHERE ingredient ~* $1`,
      [searchContent]
    );
    
    //Extract the ingredient id
    let ingredientId = []
    for (let i=0; i<ingredientResult.rowCount; i++){
      let a = ingredientResult.rows[i].ingredient_id
      ingredientId.push(a);
    }

    let resultFromIngre0 = []
    for (let i=0; i<ingredientId.length;i++){
      let b = await client.query(
          `SELECT * FROM recipes INNER JOIN rep_ingredients ON rep_ingredients.recipe_id = recipes.recipe_id WHERE ingredient_id = $1`,
          [ingredientId[i]]
        );
      resultFromIngre0.push(b);
    }

    let resultFromIngre= [];
    for (let i=0; i<resultFromIngre0.length;i++){
      let c = resultFromIngre0[i].rows
      resultFromIngre.push(c)
    }

    let summaryData = [];
  
    //search from step description in step TABLE
    if(resultFromSteps.rowCount > 0){
      let data = resultFromSteps.rows;
            
      let recipeData1 = []
      for (let i =0; i< data.length;i++){
       let searchMatch = await client.query(
         `SELECT * FROM recipes WHERE recipe_id = $1`,
         [data[i].recipe_id]
       );
       recipeData1.push(...searchMatch.rows);
      }
      summaryData.push(...recipeData1)
  }

  
  //search from recipe name
  // console.log(resultFromName,'434') 
  if(resultFromName.rowCount > 0){
     summaryData.push(...resultFromName.rows)
    }
    
   
  //search from cooking level
 
  if(resultFromLevel.rowCount > 0){
     summaryData.push(...resultFromLevel.rows)
    }

  // console.log(resultFromLevel)

  //search from tag
  if(resultFromTag.rowCount > 0){
     summaryData.push(...resultFromTag.rows)
    }


  //search from ingredients
  if(resultFromIngre.length > 0){
    let resultFromIngre1= resultFromIngre.flat();
     summaryData.push(...resultFromIngre1)
     console.log(...resultFromIngre1)
    }
    

  const summaryData0 = [...new Map (summaryData.map((m)=> [m.recipe_id, m])).values()];
  // console.log(summaryData);
  
  // console.log(summaryData0)

  res.json({
    success: true,
    content: summaryData0
  })

}catch(err:any) {
  console.log(err)
  res.json({
    success: false,
    message: "Can't find the recipe? Join our community and create your own!"
  })
  }
});

// app.use("/search", searchRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).end("404 Error");
});

const PORT = 8080;


app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
