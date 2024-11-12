import express from "express";
import {
  addToRating,
  deleteFromRatings,
  fetchAllRating,
  fetchRatingsByUserId,
} from "../controller/Ratings.js";
import { isAuth } from "../services/common.js";

const ratingsRouter = express.Router();
ratingsRouter
  .post("/", isAuth(), addToRating)
  .get("/", fetchAllRating)
  .get("/:id", fetchRatingsByUserId)
  .delete("/:id", isAuth(), deleteFromRatings);

export { ratingsRouter };
