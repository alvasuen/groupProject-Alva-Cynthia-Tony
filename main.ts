import express, { NextFunction, query } from "express";
import { Request, Response } from "express";
import expressSession from "express-session";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";
import http from "http";
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

let p = path.join(__dirname, "public");
app.use(express.static(p));


//login


//logout


//signup





const PORT = 8080;


//Socket.io
server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`);
  });