// import express from "express";
// import { createCategory, fetchCategories } from "../controller/Category.js";

// const categoriesRouter = express.Router();
// categoriesRouter.get("/", fetchCategories).post("/", createCategory);

// export { categoriesRouter };
import express from "express";
import { addSubCategory, fetchCategories, getSubCategory } from "../controller/Category.js";

const categoriesRouter = express.Router();
categoriesRouter
  .post("/add-subcategory", addSubCategory)
  .get("/get-subcategories/:categoryName", getSubCategory)
  .get("/", fetchCategories);

export { categoriesRouter };
