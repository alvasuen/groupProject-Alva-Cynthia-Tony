import express, { NextFunction, query } from "express";
import { Request, Response } from "express";
import expressSession from "express-session";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";
import http from "http";
import * as bcrypt from "bcryptjs";
import { checkPassword, hashPassword } from "./hash";
import {Server as SocketIO} from "socket.io";

const app = express();
dotenv.config();

export const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

client.connect();

//Socket.io
const server = new http.Server(app);
const io = new SocketIO(server);


//formidable's default setting
const uploadDir = "uploads";
fs.mkdirSync(uploadDir, { recursive: true });

const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFiles: 1,
  maxFileSize: 200 * 1024 ** 2, // the default limit is 200KB
  filter: (part) => part.mimetype?.startsWith("image/") || false,
});

function formidable_promise(req:express.Request){
  return new Promise((resolve,reject)=>{
    form.parse(req, (err, fields, files) => {
      if({err}.err !== null){
        reject({err})
      }
      if(JSON.stringify({fields}.fields) !== '{}' && JSON.stringify({files}.files) !== '{}'){
        // exist files and fields
        resolve({files,fields})
      }
      if(JSON.stringify({files}.files) !== '{}'){
        // exist files but not exist fields
        resolve({files})
      }
      if(JSON.stringify({fields}.fields) !== '{}'){
        // exist fields but not exist files
        resolve({fields})
      }
      
    })
  })
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
    cookie: { maxAge: 30000 },
  })
);

declare module "express-session" {
  interface SessionData {
    userId?: number;
    count?: number;
    isLogin?: boolean;
  }
}


//login
app.get ("/login", (req: Request, res: Response)=>{
  res.sendFile(path.join(p,"login.html"));
})


//Local login
app.post("/login", async(req:Request, res:Response)=>{
  let result = {
    isLogin:false,
    errMess:'',
    isError:false,
    user:{username:''}
  }

  let formidable_result:any = await formidable_promise(req)
  console.log(formidable_result);
  const loginResult = await client.query(
    `SELECT * FROM users WHERE username = $1`,
      [formidable_result.fields.email]
  );

  if (loginResult.rowCount === 0) {
    result.isLogin = false;
    result.isError = true;
    result.errMess = "Oops! User not found!";
    res.json(result);
  } else {
    try{
      // const match = await checkPassword (formidable_result.fields.password, loginResult.rows[0].password)
      // if (match) {
      if (loginResult.rows[0].password === formidable_result.fields.password) {
        //for js
        result.isLogin = true;
        result.isError = false;
        result.user.username = formidable_result.fields.username;
        //for session
        req.session.userId = loginResult.rows[0].id
        req.session.isLogin = true;
        //for response
        res.json(result);
      } else {
        result.isLogin = false;
        result.isError = true;
        result.errMess = "Incorrect Password";
        res.json(result);
      }
    } catch (err) {
      console.log(err);
      result.isLogin = false;
      result.isError = true;
      result.errMess = "Server error 500";
      res.json(result);
    }
    }
  });


//logout


//signup
app.get ("/signup", (req: Request, res: Response)=>{
  res.sendFile(path.join(p,"signup.html"));
})


app.post("/signup", async (req:Request, res:Response)=>{
  let formidable_result:any = await formidable_promise(req)
  console.log(formidable_result);
  try {
    const username = formidable_result.fields.email
    const password = formidable_result.fields.password
    const repeatPassword = formidable_result.fields.psw_repeat
    console.log(username);
    if (password == repeatPassword){
      await client.query(
        //check row count
        `INSERT INTO users (username, password) 
        VALUES ($1, $2)`,
        [username, bcrypt.hash(password, 10)]
      );
      res.json({ success: true });
    }else{
      res.json({ success: false });
    }} catch {
    res.json({ success: false });
  }
})

// app.get("/currentUser",(req,res)=>{
//   res.json(req.session)
// })

// const isLoginGuard = (req:Request,res:Response,next:NextFunction)=>{
//   if (req.session.userId){
//     next();
//   }else{
//     res.redirect("/login.html");
//   }
// };

// app.use(
//   isLoginGuard,
//   express.static("protected")
// );

const PORT = 8080;


//Socket.io
server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`);
  });