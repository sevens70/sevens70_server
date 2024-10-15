import express from "express";
import {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
} from "../controller/Product.js";

const productRouter = express.Router();

productRouter.post("/", createProduct).get("/", fetchAllProducts);

export { productRouter };
