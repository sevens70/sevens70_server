import express from "express";
import {
  fetchSettingsWebsiteInfo,
  settingsWebsiteInfoCreate,
  //   settingsWebsiteInfoUpdate,
} from "../controller/Settings.js";

const settingsRouter = express.Router();

settingsRouter
  .post("/", settingsWebsiteInfoCreate)
  .get("/", fetchSettingsWebsiteInfo);
//   .put("/", settingsWebsiteInfoUpdate);

export { settingsRouter };
