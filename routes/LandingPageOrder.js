import express from "express";
import { createOrder } from "../controller/LandingPageOrder.js";

const landingPageOrderRouter = express.Router();
//  /orders is already added in base path
landingPageOrderRouter.post("/", createOrder);

export { landingPageOrderRouter };
