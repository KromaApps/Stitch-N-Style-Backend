import express from "express";
import { searchEntities } from "../controllers/searchController.js";

const searchRouter = express.Router();

searchRouter.post("/", searchEntities);

export default searchRouter;
