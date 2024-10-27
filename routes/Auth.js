import express from "express";
import {
  createUser,
  loginUser,
  checkAuth,
  logout,
} from "../controller/Auth.js";
import passport from "passport";
import { isAuth } from "../services/common.js";
const authRouter = express.Router();

authRouter
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  // .get("/check", passport.authenticate("jwt"), checkAuth)
  .get("/check", isAuth(), checkAuth)
  .get("/logout", logout);
export { authRouter };
