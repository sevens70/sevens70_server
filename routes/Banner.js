import express from "express";
import {
  createBanner,
  fetchAllBanners,
  fetchBannerById,
  updateBanner,
} from "../controller/Banner.js";

const bannerRouter = express.Router();

bannerRouter
  .post("/", createBanner)
  .get("/", fetchAllBanners)
  .get("/:id", fetchBannerById)
  .patch("/:id", updateBanner);

export { bannerRouter };
