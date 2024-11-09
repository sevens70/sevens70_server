import express from "express";
import {
  createBrand,
  deleteBrand,
  fetchBrands,
  updateBrand,
} from "../controller/Brand.js";

const brandsRouter = express.Router();
brandsRouter
  .get("/", fetchBrands)
  .post("/", createBrand)
  .patch("/:id", updateBrand)
  .delete("/:id", deleteBrand);

export { brandsRouter };
