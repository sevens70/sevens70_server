import express from "express";
import { addToFavourite, deleteFromFavourite, fetchFavouriteByUser, updateFavourite } from "../controller/Favourite.js";

const favouriteRouter = express.Router();
favouriteRouter
  .post("/", addToFavourite)
  .get("/", fetchFavouriteByUser)
  .delete("/:id", deleteFromFavourite)
  .patch("/:id", updateFavourite);

export { favouriteRouter };
