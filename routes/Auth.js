import express from "express";
import {
  createUser,
  loginUser,
  checkAuth,
  logout,
} from "../controller/Auth.js";
import passport from "passport";
const authRouter = express.Router();

authRouter
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/check", passport.authenticate("jwt"), checkAuth)
  .get("/logout", logout)
export { authRouter };
