import express from "express";

import {
  createsunglassProduct,
  deletesunglassProduct,
  fetchsunglassProduct,
  updatesunglassProduct,
} from "../controller/SunglassProduct.js";

const sunglassProductRouter = express.Router();
sunglassProductRouter
  .get("/", fetchsunglassProduct)
  .post("/", createsunglassProduct)
  .patch("/:id", updatesunglassProduct)
  .delete("/:id", deletesunglassProduct);

export { sunglassProductRouter };
