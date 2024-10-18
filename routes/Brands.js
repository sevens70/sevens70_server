import express from "express";
import { createBrand, fetchBrands } from "../controller/Brand.js";

const brandsRouter = express.Router();
brandsRouter.get("/", fetchBrands).post("/", createBrand);

export { brandsRouter };
