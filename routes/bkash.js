import express from "express";
const bkashRouter = express.Router();
import { execBkash, initBkash } from "../controller/bkash.js";

bkashRouter.post("/init", initBkash).post("/exec", execBkash);

export { bkashRouter };
