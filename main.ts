import express, { NextFunction, query } from "express";
import { Request, Response } from "express";
import expressSession from "express-session";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";
// import http from "http";
import { checkPassword, hashPassword } from "./hash";
// import { resolveModuleName } from "typescript";
import { stepsRoutes } from "./steps";
import { searchRoutes } from "./search";
// import multer from "multer";
dotenv.config();

// import { Server as SocketIO } from "socket.io";

export const client = new Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

client.connect();

const app = express();
app.use(express.urlencoded()); // req.body
app.use(express.json()); // RESTful, method + verb, example: GET / memos

app.use(express.static("public"));
app.use(express.static("uploads"));

// const storage = multer.diskStorage({
//   destination: function (reg, file, cb) {
//     cb(null, path.resolve("./uploads"));
//   }, // storage position: ./uploads
//   filename: function (req, file, cb) {
//     cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`);
//   }, // => how to name the filename
// });

// const upload = multer({ storage });

// app.use("/post", postRoutes);

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
app.use("/", stepsRoutes);

//session req.session
app.use(
  expressSession({
    //key to be encryted and exchange with client
    secret: "You are who you are",
    //will the session be renewed every time client and server build connection?
    resave: true,
    //need to build session for the first connection
    saveUninitialized: true,
    //cookie: { maxAge: 30000 }, // login time: after 30000 ms auto logout
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
          result.user.username = loginResult.rows[0].username;
          //for session
          req.session.userId = loginResult.rows[0].user_id;
          req.session.isLogin = true;
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
  req.session.destroy((err) => {
    if (err) {
      res.json({ err });
      return;
    }
    res.json({ success: true });
  });
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

// connect to wall.html
// app.get("/post", (req: Request, res: Response) => {
//   res.sendFile(path.join(p, "wall.html"));
// });

// create memo, photo store in the ./uploads, and req.json take the file
app.post("/post", async (req: Request, res: Response) => {
  try {
    console.log(req.session);

    const content = req.body.text;
    const image = req.body.photo;
    const id = req.session.userId;
    const tags = req.body.tags;

    let postId = await client.query(
      `insert into posts (content, image, user_id) values
        ($1, $2, $3) returning post_id`,
      [content, image, id]
    );
    console.log(postId.rows[0].post_id, "265");

    for (const property in tags) {
      await client.query(
        `insert into tag (tag_content) values
        ($1)`,
        [tags[property]]
      );
      console.log(tags[property]);
    }

    const username = await client.query(
      `select username from users where user_id = $1`,
      [id]
    );
    const icon = await client.query(
      `select icon from users where user_id = $1`,
      [id]
    );
    console.log("test", icon);
    const createdDate = await client.query(
      `select created_at from posts where post_id = $1`,
      [postId.rows[0].post_id]
    );

    res.json({
      success: true,
      post: {
        content: content,
        image: image,
        username: username,
        tags: tags,
        icon: icon,
        createdDate: createdDate,
      },
    });
  } catch (ex) {
    console.log(ex);
    res.json({ success: false });
  }
});

app.get("/search", (req: Request, res: Response) => {
  res.sendFile(path.join(p, "searchResult.html"));
});

app.use("/search", searchRoutes);

const PORT = 8080;

//Socket.io
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
