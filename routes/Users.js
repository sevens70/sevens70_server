import express from "express";
import { fetchUserById, updateUser } from "../controller/User.js";

const userRouter = express.Router();
userRouter.get("/own", fetchUserById).patch("/:id", updateUser);

export { userRouter };
