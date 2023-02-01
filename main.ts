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
// import fetch from "cross-fetch";
// import grant from "grant";
// import { resolveModuleName } from "typescript";
// import { stepsRoutes } from "./steps";
// import { searchRoutes } from "./search";
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
app.use(express.json({limit: '50mb'})); // RESTful, method + verb, example: GET / memos

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
    username?: string;
    icon?: string;
    // count?: number;
    isLogin?: boolean;
    grant?: any;
  }
}

//login
app.get("/login", (req: Request, res: Response) => {
  if (!req.session.isLogin) {
    res.sendFile(path.join(p, "login.html"));
  } else {
    res.sendFile(path.join(p, "index.html"));
  }
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
          req.session.username = loginResult.rows[0].username;
          req.session.icon = loginResult.rows[0].icon;
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

// //Google Login
// const grantExpress = grant.express({
//   defaults: {
//     origin: "http://localhost:8080",
//     transport: "session",
//     state: true,
//   },
//   google: {
//     key: process.env.GOOGLE_CLIENT_ID || "",
//     secret: process.env.GOOGLE_CLIENT_SECRET || "",
//     scope: ["profile", "email"],
//     callback: "/login/google",
//   },
// });

// app.get('/login/google', loginGoogle);

// async function loginGoogle (req:express.Request, res:express.Response){
//   const accessToken = req.session?.grant.response.access_token;
//   const fetchRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo',{
//       method:"get",
//       headers:{
//           "Authorization":`Bearer ${accessToken}`
//       }
//   });

//   const result = await fetchRes.json();
//   const users = (await client.query(`SELECT * FROM users WHERE users.username = $1`, [result.email])).rows;

//   let user = users[0];

//   if(!user){
//       // Create the user when the user does not exist
//       user = ( await client.query(
//               `INSERT INTO users (login_email,password)
//               VALUES ($1,$2) RETURNING *`,
//               [result.email, "abc"])
//           ).rows[0]
//   }

//   if(req.session){
//       req.session.userId =user.id;
//   }

//   return res.redirect('/')
// }

// app.use(grantExpress as express.RequestHandler);

app.get("/currentUser", (req, res) => {
  // console.log(req.session);
  res.json(req.session);
});

//logout
app.get("/logout", (req, res) => {
  delete req.session.isLogin;
  delete req.session.userId;
  res.json({ success: true });
});

//signup
app.get("/signup", (req: Request, res: Response) => {
  if (!req.session.isLogin) {
    res.sendFile(path.join(p, "signup.html"));
  } else {
    res.sendFile(path.join(p, "index.html"));
  }
});

app.post("/signup", async (req: Request, res: Response) => {
  let result = {
    errMess: "",
    isSignUp: false,
  };

  let formidable_result: any = await formidable_promise(req);
  try {
    if (
      formidable_result.fields.password.length < 8 ||
      formidable_result.fields.psw_repeat.length < 8
    ) {
      result.errMess = "Your password must have a minimum of 8 characters!";
      result.isSignUp = false;
      res.json(result);
    } else {
      const signUpCheck = await client.query(
        `SELECT * FROM "users" WHERE login_email = $1`,
        [formidable_result.fields.email]
      );
      if (signUpCheck.rowCount > 0) {
        result.errMess = "This email has been registered already!";
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
    }
  } catch (err) {
    console.log(err);
    result.isSignUp = false;
    result.errMess = "Unexpected error!";
    res.json(result);
  }
});

//Recipe Step
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

    const rec_name = await client.query(
      `SELECT recipe_name FROM recipes WHERE recipe_id = $1`,
      [rec_id]
    );

    const rec_cover_page = await client.query(
      `SELECT image FROM recipes WHERE recipe_id = $1`,
      [rec_id]
    );

    res.json({
      steps_number: steps_number.rows,
      step_description: step_description.rows,
      image: image.rows,
      rec_name: rec_name.rows,
      rec_cover_page: rec_cover_page.rows,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

// connect to wall.html
app.get("/post", async (req: Request, res: Response) => {
  res.sendFile(path.join(p, "wall.html"));
});

// create memo, photo store in the ./uploads, and req.json take the file
app.post("/post", async (req: Request, res: Response) => {
  try {
    // console.log(req.session);

    const content = req.body.text;
    const image = req.body.photo;
    const id = req.session.userId;
    const tags = req.body.tags;

    let postId = await client.query(
      `insert into posts (content, image, user_id) values
        ($1, $2, $3) returning post_id`,
      [content, image, id]
    );
    // console.log(postId.rows[0].post_id, "265");

    for (const property in tags) {
      let tagId = await client.query(
        `insert into tag (tag_content) values
        ($1) returning tag_id`,
        [tags[property]]
      );
      // console.log(tagId.rows[0].tag_id);

      await client.query(
        `insert into tag_relate (tag_id, post_id) values ($1, $2)`,
        [tagId.rows[0].tag_id, postId.rows[0].post_id]
      );
    }

    const username = await client.query(
      `select username from users where user_id = $1`,
      [id]
    );
    const icon = await client.query(
      `select icon from users where user_id = $1`,
      [id]
    );
    const createdPost = await client.query(
      `select * from posts where post_id = $1`,
      [postId.rows[0].post_id]
    );

    res.json({
      success: true,
      post: {
        postId: postId.rows[0].post_id,
        username: username,
        tags: tags,
        icon: icon,
        createdPost: createdPost,
      },
    });
  } catch (ex) {
    console.log(ex);
    res.json({ success: false });
  }
});

// load all posts from the json
app.get("/posts", async (req: Request, res: Response) => {
  const posts = await client.query(
    `select * from posts inner join users on posts.user_id = users.user_id ORDER BY post_id ASC`
  );
  const tags = await client.query(
    `select * from tag_relate inner join tag on tag_relate.tag_id = tag.tag_id`
  );
  const checkLiked = await client.query(
    `select * from liked_posts where user_id = $1 ORDER BY post_id ASC`,
    [req.session.userId]
  );
  const checkSaved = await client.query(
    `select * from saved_posts where user_id = $1 ORDER BY post_id ASC`,
    [req.session.userId]
  );

  res.json({
    success: true,
    posts: posts.rows,
    tags: tags.rows,
    checkLiked: checkLiked.rows,
    checkSaved: checkSaved.rows,
    isLogin: req.session.isLogin,
  });
});

// update liked count
app.put("/post/likePost/:id", async (req: Request, res: Response) => {
  console.log(req.body.id);
  console.log(req.body.liked);
  try {
    const userId = req.session.userId;
    if (!req.body.liked) {
      const checkLiked = await client.query(
        `select * from liked_posts where user_id =$1 and post_id=$2`,
        [userId, req.body.id]
      );

      if (checkLiked.rowCount == 0) {
        const liked = await client.query(
          `update posts set liked_count = liked_count+1 where post_id = $1`,
          [req.body.id]
        );
        const updateLikePost = await client.query(
          `insert into liked_posts (user_id, post_id, liked) values ($1,$2, true)`,
          [userId, req.body.id]
        );
      } else {
        const liked = await client.query(
          `update posts set liked_count = liked_count + 1 where post_id = $1`,
          [req.body.id]
        );
        const updateLiked = await client.query(
          `update liked_posts set liked = true where post_id = $1 and user_id = $2`,
          [req.body.id, userId]
        );
      }
    } else {
      const unliked = await client.query(
        `update posts set liked_count = liked_count -1 where post_id = $1`,
        [req.body.id]
      );
      const updateLiked = await client.query(
        `update liked_posts set liked = false where post_id = $1 and user_id =$2`,
        [req.body.id, userId]
      );
    }
    const likedCount = await client.query(
      `select liked_count from posts where post_id = $1`,
      [req.body.id]
    );
    // const liked = await client.query(
    //   `select * from liked_posts where post_id = $1`,[req.body.id]
    // );
    res.status(200).json({ success: true, likedCount: likedCount.rows });
  } catch (err) {
    res.status(500).json({ err: "Error Message:" + err });
  }
});

app.put("/post/savePost/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    if (!req.body.saved) {
      const checkSaved = await client.query(
        `select * from saved_posts where user_id =$1 and post_id=$2`,
        [userId, req.body.id]
      );

      if (checkSaved.rowCount == 0) {
        const saved = await client.query(
          `update posts set saved_count = saved_count + 1 where post_id = $1`,
          [req.body.id]
        );
        const updateSavePost = await client.query(
          `insert into saved_posts (user_id, post_id, saved) values ($1,$2, true)`,
          [userId, req.body.id]
        );
      } else {
        const saved = await client.query(
          `update posts set saved_count=saved_count + 1 where post_id = $1`,
          [req.body.id]
        );
        const updateSaved = await client.query(
          `update saved_posts set saved = true where post_id = $1 and user_id = $2`,
          [req.body.id, userId]
        );
      }
    } else {
      const unsaved = await client.query(
        `update posts set saved_count=saved_count-1 where post_id = $1`,
        [req.body.id]
      );
      const updateSaved = await client.query(
        `update saved_posts set saved = false where post_id = $1 and user_id =$2`,
        [req.body.id, userId]
      );
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ err: "Error Message:" });
  }
});

app.get("/search", (req: Request, res: Response) => {
  res.sendFile(path.join(p, "searchResult.html"));
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
    let sub_sql = "SELECT tag_id FROM tag WHERE tag_content ~* $1";
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
    let ingredientId = [];
    for (let i = 0; i < ingredientResult.rowCount; i++) {
      let a = ingredientResult.rows[i].ingredient_id;
      ingredientId.push(a);
    }

    let resultFromIngre0 = [];
    for (let i = 0; i < ingredientId.length; i++) {
      let b = await client.query(
        `SELECT * FROM recipes INNER JOIN rep_ingredients ON rep_ingredients.recipe_id = recipes.recipe_id WHERE ingredient_id = $1`,
        [ingredientId[i]]
      );
      resultFromIngre0.push(b);
    }

    let resultFromIngre = [];
    for (let i = 0; i < resultFromIngre0.length; i++) {
      let c = resultFromIngre0[i].rows;
      resultFromIngre.push(c);
    }

    let summaryData = [];

    //search from step description in step TABLE
    if (resultFromSteps.rowCount > 0) {
      let data = resultFromSteps.rows;

      let recipeData1 = [];
      for (let i = 0; i < data.length; i++) {
        let searchMatch = await client.query(
          `SELECT * FROM recipes WHERE recipe_id = $1`,
          [data[i].recipe_id]
        );
        recipeData1.push(...searchMatch.rows);
      }
      summaryData.push(...recipeData1);
    }

    //search from recipe name
    if (resultFromName.rowCount > 0) {
      summaryData.push(...resultFromName.rows);
    }

    //search from cooking level

    if (resultFromLevel.rowCount > 0) {
      summaryData.push(...resultFromLevel.rows);
    }

    //search from tag
    if (resultFromTag.rowCount > 0) {
      summaryData.push(...resultFromTag.rows);
    }

    //search from ingredients
    if (resultFromIngre.length > 0) {
      let resultFromIngre1 = resultFromIngre.flat();
      summaryData.push(...resultFromIngre1);
      console.log(...resultFromIngre1);
    }

    const summaryData0 = [
      ...new Map(summaryData.map((m) => [m.recipe_id, m])).values(),
    ];

    res.json({
      success: true,
      content: summaryData0,
      message: "Can't find the recipe? Join our community and create your own!",
    });
  } catch (err: any) {
    console.log(err);
    res.json({
      success: false,
      message: "Can't find the recipe? Join our community and create your own!",
    });
  }
});

//savedRecipes
app.post("/saveRecipe", async (req: Request, res: Response) => {
  console.log(req.body.id);
  try {
    if (!req.session.isLogin) {
      res.json({
        message: "Please login first!",
        success: false,
      });
    } else {
      let user_id = req.session.userId;
      let recipe_id = req.body.id;
      await client.query(
        `INSERT INTO saved_recipe (user_id, recipe_id) 
        VALUES ($1, $2)`,
        [user_id, recipe_id]
      );
      await client.query(
        `UPDATE recipes SET saved_count = saved_count+1 WHERE recipe_id = $1 ;`,
        [recipe_id]
      );
      res.json({ success: true });
    }
  } catch (err) {
    console.log(err);
    res.json({
      message: "Unexpected error! Please try again!",
      success: false,
    });
  }
});

//load profile post
app.get("/profile", async (req: Request, res: Response) => {
  res.sendFile(path.join(p, "profile.html"));
});

app.get("/profile/:id", async (req: Request, res: Response) => {
  try {
    let user_id = req.session.userId;

    if (req.session.isLogin) {
      const getAllPostId = await client.query(
        `SELECT post_id FROM posts WHERE user_id = $1`,
        [user_id]
      );
      if (getAllPostId.rowCount > 0) {
        // console.log("getAllPostId: ", getAllPostId);
        let imgArray = [];
        if (getAllPostId.rowCount > 0) {
          for (let index = 0; index < getAllPostId.rowCount; index++) {
            let getPostImg = await client.query(
              `SELECT image FROM posts WHERE post_id = $1`,
              [getAllPostId.rows[index].post_id]
            );
            imgArray.push(...getPostImg.rows);
          }
        }

        res.status(200).json({
          postId: getAllPostId.rows,
          image: imgArray,
          success: true,
        });
      } else {
        res.status(200).json({ err: "Haven't posted any posts" });
      }
    } else {
      res.status(301).json({ err: "Please login first." });
    }
  } catch (error) {
    res.status(500).json({ err: "Can't load the post." });
  }
});

app.get("/savedPosts", async (req: Request, res: Response) => {
  try {
    let user_id = req.session.userId;
    if (req.session.isLogin) {
      let allSavedPost = await client.query(
        `SELECT post_id FROM saved_posts WHERE user_id = $1 AND saved = true`,
        [user_id]
      );

      if (allSavedPost.rowCount > 0) {
        let allSavedPostImage = [];
        for (let index = 0; index < allSavedPost.rowCount; index++) {
          let allImages = await client.query(
            `SELECT image FROM posts WHERE post_id = $1`,
            [allSavedPost.rows[index].post_id]
          );
          allSavedPostImage.push(...allImages.rows);
        }
        // console.log("allSavedPost:", allSavedPost.rows);
        // console.log("allSavedPostImage:", allSavedPostImage);
        res.status(200).json({
          allSavedPost: allSavedPost.rows,
          allSavedPostImage: allSavedPostImage,
          success: true,
        });
      } else {
        res.status(200).json({ message: "Haven't saved any posts" });
      }
    }
  } catch (err) {
    res.status(500).json({ err: "Sorry! Can't load any saved posts." });
  }
});

app.get("/postedPost", async (req: Request, res: Response) => {
  try {
    let user_id = req.session.userId;
    if (req.session.isLogin) {
      const getAllPostId = await client.query(
        `SELECT post_id FROM posts WHERE user_id = $1`,
        [user_id]
      );
      const userName = await client.query(
        `SELECT username FROM users WHERE user_id = $1`,
        [user_id]
      );
      let hasPost = getAllPostId.rowCount > 0 ? true : false;
      if (hasPost) {
        // console.log("getAllPostId: ", getAllPostId);
        let imgArray = [];
        if (getAllPostId.rowCount > 0) {
          for (let index = 0; index < getAllPostId.rowCount; index++) {
            let getPostImg = await client.query(
              `SELECT image FROM posts WHERE post_id = $1`,
              [getAllPostId.rows[index].post_id]
            );
            imgArray.push(...getPostImg.rows);
          }
        }
        // else {
        //   res.sendFile(path.join(p, "profile.html"));
        // }
        // console.log(imgArray);

        res.status(200).json({
          postId: getAllPostId.rows,
          image: imgArray,
          userName: userName.rows,
          hasPost,
          success: true,
        });
      } else {
        res.status(200).json({ hasPost });
      }
    } else {
      res.status(301).json({ err: "Please login first." });
    }
  } catch (error) {
    res.status(500).json({ err: "Can't load the post." });
  }
});

//Read Saved Recipes
app.get("/saveRecipe", async (req: Request, res: Response) => {
  try {
    if (req.session.isLogin) {
      let user_id = req.session.userId;
      let saveRecipesId = await client.query(
        `SELECT recipe_id FROM saved_recipe WHERE user_id = $1 AND saved = true`,
        [user_id]
      );

      if (saveRecipesId.rowCount > 0) {
        let saveRecipeArray = [];
        console.log("saveRecipes.rowCount:", saveRecipesId.rowCount);
        for (let index = 0; index < saveRecipesId.rowCount; index++) {
          // saveRecipeArray.push(saveRecipes.rows[index].recipe_id);
          let recipeImage = await client.query(
            `SELECT image, recipe_id FROM recipes WHERE recipe_id = $1`,
            [saveRecipesId.rows[index].recipe_id]
          );
          console.log(saveRecipesId.rows[index].recipe_id);

          saveRecipeArray.push(...recipeImage.rows);
        }

        res.status(200).json({
          saveRecipeArray,
          saveRecipesId: saveRecipesId.rows,
          success: true,
        });
      } else {
        res.sendStatus(200).json({ err: "Haven't saved any recipes" });
      }
    } else {
      res.status(301).json({ err: "Please login First." });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/checkRepLike", async (req: Request, res: Response) => {
  if (req.session.isLogin) {
    let recipeData = await client.query(
      `SELECT recipe_id FROM saved_recipe WHERE user_id = $1 AND saved = true`,
      [req.session.userId]
    );
    let arr = [];
    for (let i = 0; i < recipeData.rowCount; i++) {
      arr.push(recipeData.rows[i].recipe_id);
    }
    res.json({
      success: true,
      content: arr,
    });
  } else {
    res.json({
      message: "Please login first!",
    });
  }
});

app.put("/change_icon", async (req: Request, res: Response) => {
  // console.log(req.body);
  try {
    await client.query(`UPDATE users SET icon = $1 WHERE user_id = $2 ;`, [
      req.body.icon,
      req.session.userId,
    ]);
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Sever error, please try again later!",
    });
  }
});

app.put("/deleteSavedRecipe", async (req: Request, res: Response) => {
  try {
    await client.query(
      `UPDATE saved_recipe SET saved=false WHERE recipe_id=$1 AND user_id=$2;`,
      [req.body.id, req.session.userId]
    );
    await client.query(
      `UPDATE recipes SET saved_count = saved_count-1 WHERE recipe_id = $1 ;`,
      [req.body.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

app.get("/popularRecipe", async (req: Request, res: Response) => {
  try {
    let data = await client.query(
      `SELECT recipe_id, recipe_name, image FROM recipes ORDER BY saved_count DESC LIMIT 5`
    );
    res.json({
      success: true,
      content: data,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

app.get("/popularLikePost", async (req: Request, res: Response) => {
  try {
    let data = await client.query(
      `SELECT post_id, image, content FROM posts ORDER BY liked_count DESC LIMIT 5`
    );
    res.json({
      success: true,
      content: data,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

app.post("/getTagPosts", async (req: Request, res: Response) => {
  try {
    console.log(req.body.content, "getTagPosts");
    let data = await client.query(
      `SELECT * FROM posts INNER JOIN tag_relate ON posts.post_id = tag_relate.post_id WHERE tag_id IN (SELECT tag_id FROM tag WHERE tag_content=$1);`,
      [req.body.content]
    );

    let userData = await client.query(
      `select * from users where user_id in (SELECT user_id FROM posts INNER JOIN tag_relate ON posts.post_id = tag_relate.post_id WHERE tag_id in(SELECT tag_id FROM tag where tag_content= $1));`,
      [req.body.content]
    );

    const tags = await client.query(
      `select * from tag_relate inner join tag on tag_relate.tag_id = tag.tag_id`
    );

    const checkLiked = await client.query(
      `select * from liked_posts where user_id = $1`,
      [req.session.userId]
    );
    const checkSaved = await client.query(
      `select * from saved_posts where user_id = $1`,
      [req.session.userId]
    );

    res.json({
      success: true,
      content: data,
      checkLiked,
      checkSaved,
      tags,
      userData,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
    });
  }
});

app.get("/getUserIcon",async (req:Request, res:Response)=>{
  let data = await client.query(
    `SELECT icon FROM users WHERE user_id=$1;`,
    [req.session.userId]);
    res.json({
      content: data
    })
})

app.use((req: Request, res: Response) => {
  res.status(404).sendFile(path.join(p, "index.html"));
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
