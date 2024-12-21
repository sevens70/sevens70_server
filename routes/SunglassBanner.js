import express from "express";
import {
  createSunglassBanner,
  deleteSunglassBanner,
  fetchSunglassBanner,
  updateSunglassBanner,
} from "../controller/SunglassBanner.js";

const sunglassBannerRouter = express.Router();
sunglassBannerRouter
  .get("/", fetchSunglassBanner)
  .post("/", createSunglassBanner)
  .patch("/:id", updateSunglassBanner)
  .delete("/:id", deleteSunglassBanner);

export { sunglassBannerRouter };
