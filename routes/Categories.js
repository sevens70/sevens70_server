import express from "express";
import { createCategory, fetchCategories } from "../controller/Category.js";

const categoriesRouter = express.Router();
categoriesRouter.get("/", fetchCategories).post("/", createCategory);

export { categoriesRouter };
