import express from 'express'
import path from "path";

import { p } from '../resources'
export const loginRoutes = express.Router();

loginRoutes.get("/login", (req: express.Request, res: express.Response) => {
  if (!req.session.isLogin) {
    res.sendFile(path.join(p, "login.html"));
  } else {
    res.sendFile(path.join(p, "index.html"));
  }
});

