import express from "express";
import {
  createTopBanner,
  deleteTopBanner,
  fetchAllTopBanners,
} from "../controller/TopBanner.js";

const topBannerRouter = express.Router();

topBannerRouter
  .post("/", createTopBanner)
  .get("/", fetchAllTopBanners)
  .delete("/:id", deleteTopBanner);

export { topBannerRouter };
