import express from "express";
import {
  fetchAllUsers,
  fetchUserById,
  updateUser,
} from "../controller/User.js";

const userRouter = express.Router();
userRouter
  .get("/own", fetchUserById)
  .patch("/:id", updateUser)
  .get("/", fetchAllUsers);

export { userRouter };
