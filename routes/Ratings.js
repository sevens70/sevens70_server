import express from "express";
import {
  addToRating,
  deleteFromRatings,
  fetchAllRating,
} from "../controller/Ratings.js";
import { isAuth } from "../services/common.js";

const ratingsRouter = express.Router();
ratingsRouter.post("/", isAuth(), addToRating)
  .get("/", fetchAllRating)
  .delete("/:id", isAuth(), deleteFromRatings);

export { ratingsRouter };
